const securityService = require('../services/securityService');

/**
 * POST /api/quiz/attempts/:attemptId/terminate
 * Participant security termination endpoint (e.g. TAB_SWITCH violation).
 */
const terminateAttemptController = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    const { reason, metadata } = req.body;
    const participantId = req.participant.id;

    const result = await securityService.terminateAttempt(
      attemptId,
      participantId,
      reason || 'TAB_SWITCH',
      metadata
    );

    return res.status(result.statusCode || 200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/security/events
 * Admin-only endpoint to view security violation event log.
 */
const getAdminSecurityEvents = async (req, res, next) => {
  try {
    const { eventType, participantId, roundId } = req.query;

    const events = await securityService.getSecurityEvents({
      eventType,
      participantId,
      roundId
    });

    return res.json({
      success: true,
      events
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  terminateAttemptController,
  getAdminSecurityEvents
};
