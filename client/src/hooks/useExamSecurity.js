import { useEffect, useRef } from 'react';
import { getSocket } from '../services/socket';

/**
 * Custom React Hook for monitoring live exam security, tab visibility, full-screen exits, and window blur events.
 * @param {Object} options
 * @param {string} options.attemptId - Current attempt UUID
 * @param {string} options.status - Current attempt status ('IN_PROGRESS', 'SUBMITTED', etc.)
 * @param {boolean} [options.enabled=true] - Whether anti-cheat monitoring is actively enabled
 * @param {Function} options.onTerminate - Callback executed when security violation is triggered
 */
export const useExamSecurity = ({ attemptId, status, enabled = true, onTerminate }) => {
  const terminationTriggeredRef = useRef(false);
  const mountTimeRef = useRef(Date.now());
  const blurTimeoutRef = useRef(null);

  useEffect(() => {
    // Security tracking only active when attempt is IN_PROGRESS and enabled is true
    if (!attemptId || status !== 'IN_PROGRESS' || !enabled) {
      return;
    }

    // Reset mount time reference on enablement
    mountTimeRef.current = Date.now();

    const socket = getSocket();

    // 1. Join socket room for real-time security events
    if (socket) {
      socket.emit('join:attempt', attemptId);

      const handleSocketTerminated = (data) => {
        if (data && data.attemptId === attemptId && !terminationTriggeredRef.current) {
          terminationTriggeredRef.current = true;
          if (onTerminate) {
            onTerminate(data.reason || 'AUTO_SUBMITTED_CHEATING', data);
          }
        }
      };

      socket.on('quiz:terminated', handleSocketTerminated);
    }

    const triggerTermination = (detectionSource, extraData = {}) => {
      if (terminationTriggeredRef.current) return;

      // 5-second initial grace period after entering the exam interface
      const timeSinceMount = Date.now() - mountTimeRef.current;
      if (timeSinceMount < 5000) {
        console.info(`[Exam Security Grace Period]: Ignored violation '${detectionSource}' during initial 5s setup.`);
        return;
      }

      terminationTriggeredRef.current = true;
      console.warn(`[Exam Security Violation]: Triggered via ${detectionSource}`);

      if (onTerminate) {
        onTerminate('AUTO_SUBMITTED_CHEATING', {
          detectionSource,
          timestamp: new Date().toISOString(),
          ...extraData
        });
      }
    };

    // 2. Tab Switch / Visibility Change Detector (Instant Trigger when tab becomes hidden)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        triggerTermination('visibilitychange', { visibilityState: 'hidden' });
      }
    };

    // 3. Full-Screen Exit Detector
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        triggerTermination('fullscreenchange', { fullScreenActive: false });
      }
    };

    // 4. Window Blur / Focus Loss Detector with 1.5s Debounce for Transient Popups
    const handleWindowBlur = () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }

      // Check after 1500ms if focus has not returned or tab is hidden
      blurTimeoutRef.current = setTimeout(() => {
        if (document.visibilityState === 'hidden' || !document.hasFocus()) {
          triggerTermination('window_blur');
        }
      }, 1500);
    };

    const handleWindowFocus = () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
        blurTimeoutRef.current = null;
      }
    };

    // 5. Multiple Exam Tab Prevention via BroadcastChannel
    let broadcastChannel = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        broadcastChannel = new BroadcastChannel(`exam_session_${attemptId}`);
        broadcastChannel.postMessage({ type: 'NEW_TAB_OPENED', timestamp: Date.now() });

        broadcastChannel.onmessage = (event) => {
          if (event.data?.type === 'NEW_TAB_OPENED') {
            triggerTermination('multiple_tabs_detected');
          }
        };
      }
    } catch (e) {
      console.warn('[BroadcastChannel Warning]:', e);
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    // Cleanup event listeners and sockets on unmount
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      if (broadcastChannel) {
        try {
          broadcastChannel.close();
        } catch (e) {}
      }
      if (socket) {
        socket.off('quiz:terminated');
        socket.emit('leave:attempt', attemptId);
      }
    };
  }, [attemptId, status, enabled, onTerminate]);
};

export default useExamSecurity;
