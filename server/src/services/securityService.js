const { QuizAttempt, QuizAnswer, Question, SecurityEvent, Participant, QuizRound } = require('../models');
const { sequelize } = require('../config/database');
const { calculateAttemptScore } = require('./scoringService');
const { emitTerminationEvent } = require('../sockets');

const VALID_SECURITY_REASONS = [
  'TAB_SWITCH',
  'WINDOW_BLUR',
  'FULLSCREEN_EXIT',
  'MULTIPLE_FOCUS_LOSS',
  'MANUAL_TERMINATION',
  'TIME_EXPIRED'
];

/**
 * Validates attempt state machine transitions.
 * Terminal states (SUBMITTED, EXPIRED, TERMINATED) cannot be transitioned out of.
 */
const canTransitionAttemptStatus = (fromStatus, toStatus) => {
  const terminalStates = ['SUBMITTED', 'EXPIRED', 'TERMINATED'];
  if (terminalStates.includes(fromStatus)) {
    return false;
  }
  return fromStatus === 'IN_PROGRESS' && terminalStates.includes(toStatus);
};

/**
 * Executes server-authoritative attempt termination for security violations inside a transaction.
 */
const terminateAttempt = async (attemptId, participantId, eventType = 'TAB_SWITCH', metadata = null) => {
  const t = await sequelize.transaction();
  try {
    const reason = VALID_SECURITY_REASONS.includes(eventType) ? eventType : 'TAB_SWITCH';

    const attempt = await QuizAttempt.findByPk(attemptId, { transaction: t });
    if (!attempt) {
      await t.rollback();
      return {
        success: false,
        statusCode: 404,
        message: 'Quiz attempt not found.'
      };
    }

    // Ownership check
    if (attempt.participantId !== participantId) {
      await t.rollback();
      return {
        success: false,
        statusCode: 403,
        message: 'Access denied. Attempt does not belong to this participant.'
      };
    }

    // Idempotency: if already terminated, return existing state
    if (attempt.status === 'TERMINATED') {
      await t.commit();
      return {
        success: true,
        statusCode: 200,
        message: 'Attempt is already terminated.',
        attempt: {
          id: attempt.id,
          status: attempt.status,
          terminationReason: attempt.terminationReason,
          score: parseFloat(attempt.score),
          totalMarks: parseFloat(attempt.totalMarks),
          answeredCount: attempt.answeredCount,
          submittedAt: attempt.submittedAt
        },
        isAlreadyTerminated: true
      };
    }

    // If attempt is already SUBMITTED or EXPIRED, do not overwrite terminal state
    if (!canTransitionAttemptStatus(attempt.status, 'TERMINATED')) {
      await t.rollback();
      return {
        success: false,
        statusCode: 409,
        message: `Attempt cannot be terminated. Current status is ${attempt.status}.`,
        status: attempt.status
      };
    }

    // Load questions and saved answers to compute final score up to termination point
    const activeQuestions = await Question.findAll({
      where: { roundId: attempt.roundId, isActive: true },
      transaction: t
    });

    const savedAnswers = await QuizAnswer.findAll({
      where: { attemptId: attempt.id },
      transaction: t
    });

    const scoring = calculateAttemptScore(activeQuestions, savedAnswers);

    // Update attempt
    attempt.status = 'TERMINATED';
    attempt.terminationReason = reason;
    attempt.score = scoring.score;
    attempt.totalMarks = scoring.totalMarks;
    attempt.answeredCount = scoring.answeredCount;
    attempt.submittedAt = new Date();

    await attempt.save({ transaction: t });

    // Create SecurityEvent record
    const securityEvent = await SecurityEvent.create(
      {
        attemptId: attempt.id,
        participantId,
        eventType: reason,
        eventTime: new Date(),
        metadata: metadata ? metadata : { visibilityState: 'hidden', detectionSource: 'visibilitychange' }
      },
      { transaction: t }
    );

    await t.commit();

    // Broadcast Socket.IO event to attempt room
    emitTerminationEvent(attempt.id, {
      reason,
      eventTime: securityEvent.eventTime
    });

    return {
      success: true,
      statusCode: 200,
      message: 'Quiz attempt terminated due to security violation.',
      attempt: {
        id: attempt.id,
        status: attempt.status,
        terminationReason: attempt.terminationReason,
        score: parseFloat(attempt.score),
        totalMarks: parseFloat(attempt.totalMarks),
        answeredCount: attempt.answeredCount,
        submittedAt: attempt.submittedAt
      },
      securityEvent
    };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

/**
 * Admin service to fetch security events with filters.
 */
const getSecurityEvents = async (filters = {}) => {
  const { eventType, participantId, roundId } = filters;

  const where = {};
  if (eventType) where.eventType = eventType;
  if (participantId) where.participantId = participantId;

  const attemptWhere = {};
  if (roundId) attemptWhere.roundId = roundId;

  const events = await SecurityEvent.findAll({
    where,
    include: [
      {
        model: Participant,
        as: 'participant',
        attributes: ['id', 'name', 'rollNumber', 'department', 'email']
      },
      {
        model: QuizAttempt,
        as: 'attempt',
        where: Object.keys(attemptWhere).length > 0 ? attemptWhere : undefined,
        attributes: ['id', 'roundId', 'status', 'terminationReason', 'score', 'submittedAt'],
        include: [
          {
            model: QuizRound,
            as: 'round',
            attributes: ['id', 'title', 'roundNumber']
          }
        ]
      }
    ],
    order: [['eventTime', 'DESC']]
  });

  return events;
};

module.exports = {
  canTransitionAttemptStatus,
  terminateAttempt,
  getSecurityEvents,
  VALID_SECURITY_REASONS
};
