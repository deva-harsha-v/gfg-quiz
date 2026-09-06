/**
 * Centralized Exam Security Configuration
 */
export const EXAM_SECURITY = {
  // Primary security requirement: Terminate active quiz when participant switches browser tabs / hides page
  terminateOnTabSwitch: true,

  // Optional security setting: Terminate active quiz when participant exits fullscreen
  terminateOnFullscreenExit: false
};
