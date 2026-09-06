import { useEffect, useRef } from 'react';
import { EXAM_SECURITY } from '../config/examSecurity';
import { getSocket } from '../services/socket';

/**
 * Custom React Hook for monitoring live exam security and tab visibility transitions.
 * @param {Object} options
 * @param {string} options.attemptId - Current attempt UUID
 * @param {string} options.status - Current attempt status ('IN_PROGRESS', 'SUBMITTED', etc.)
 * @param {Function} options.onTerminate - Callback executed when security violation is triggered
 */
export const useExamSecurity = ({ attemptId, status, onTerminate }) => {
  const terminationTriggeredRef = useRef(false);

  useEffect(() => {
    // Security tracking only active when attempt is IN_PROGRESS
    if (!attemptId || status !== 'IN_PROGRESS') {
      return;
    }

    const socket = getSocket();

    // 1. Join socket room for real-time security events
    if (socket) {
      socket.emit('join:attempt', attemptId);

      const handleSocketTerminated = (data) => {
        if (data && data.attemptId === attemptId && !terminationTriggeredRef.current) {
          terminationTriggeredRef.current = true;
          if (onTerminate) {
            onTerminate(data.reason || 'TAB_SWITCH', data);
          }
        }
      };

      socket.on('quiz:terminated', handleSocketTerminated);
    }

    // 2. Primary Tab Switch / Visibility Change Detector
    const handleVisibilityChange = () => {
      if (
        EXAM_SECURITY.terminateOnTabSwitch &&
        document.visibilityState === 'hidden' &&
        !terminationTriggeredRef.current
      ) {
        terminationTriggeredRef.current = true;
        console.warn('[Exam Security]: Tab switch detected (visibilityState = hidden). Triggering termination.');
        
        if (onTerminate) {
          onTerminate('TAB_SWITCH', {
            visibilityState: 'hidden',
            detectionSource: 'visibilitychange',
            timestamp: new Date().toISOString()
          });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup event listeners and socket rooms on unmount
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (socket) {
        socket.off('quiz:terminated');
        socket.emit('leave:attempt', attemptId);
      }
    };
  }, [attemptId, status, onTerminate]);
};

export default useExamSecurity;
