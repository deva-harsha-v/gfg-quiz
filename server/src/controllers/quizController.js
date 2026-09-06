const { QuizRound, Question, QuizAttempt, QuizAnswer } = require('../models');
const { sequelize } = require('../config/database');
const { calculateQuestionScore, calculateAttemptScore } = require('../services/scoringService');

/**
 * Sanitizes a question object for participant delivery by strictly removing correctOption and explanation.
 */
const sanitizeQuestionForParticipant = (q, selectedOption = null) => {
  const plain = q.get ? q.get({ plain: true }) : { ...q };
  delete plain.correctOption;
  delete plain.explanation;
  if (selectedOption !== undefined && selectedOption !== null) {
    plain.selectedOption = selectedOption;
  } else {
    plain.selectedOption = null;
  }
  return plain;
};

/**
 * Reusable helper to check and enforce attempt expiration.
 * If currentTime > expiresAt and attempt is IN_PROGRESS, updates status to EXPIRED and finalizes score.
 */
const checkAttemptExpiry = async (attempt, transaction = null) => {
  if (!attempt) return false;
  if (attempt.status !== 'IN_PROGRESS') {
    return attempt.status === 'EXPIRED';
  }

  const now = new Date();
  const expiresAt = new Date(attempt.expiresAt);

  if (now > expiresAt) {
    const activeQuestions = await Question.findAll({
      where: { roundId: attempt.roundId, isActive: true },
      transaction
    });

    const savedAnswers = await QuizAnswer.findAll({
      where: { attemptId: attempt.id },
      transaction
    });

    const scoring = calculateAttemptScore(activeQuestions, savedAnswers);

    attempt.status = 'EXPIRED';
    attempt.score = scoring.score;
    attempt.totalMarks = scoring.totalMarks;
    attempt.answeredCount = scoring.answeredCount;
    attempt.submittedAt = expiresAt;

    await attempt.save({ transaction });
    return true;
  }

  return false;
};

const { Op } = require('sequelize');

/**
 * GET /api/quiz/available
 * Returns competition quiz sets available to the authenticated participant.
 */
const getAvailableQuizzes = async (req, res, next) => {
  try {
    const competitionRounds = await QuizRound.findAll({
      order: [['course', 'ASC'], ['setNumber', 'ASC'], ['roundNumber', 'ASC']]
    });

    const participantId = req.participant.id;
    const quizzes = [];

    for (const round of competitionRounds) {
      const activeQuestionsCount = await Question.count({
        where: { roundId: round.id, isActive: true }
      });

      const totalMarksSum = (await Question.sum('marks', {
        where: { roundId: round.id, isActive: true }
      })) || 0;

      const attempt = await QuizAttempt.findOne({
        where: { participantId, roundId: round.id }
      });

      if (attempt) {
        try {
          await checkAttemptExpiry(attempt);
        } catch (expiryErr) {
          console.warn(`[getAvailableQuizzes] Expiry check failed for attempt ${attempt.id}:`, expiryErr.message);
        }
      }

      quizzes.push({
        id: round.id,
        title: round.title,
        category: round.category,
        course: round.course,
        year: round.year,
        setNumber: round.setNumber,
        description: round.description,
        roundNumber: round.roundNumber,
        durationMinutes: round.duration,
        totalQuestions: activeQuestionsCount,
        totalMarks: parseFloat(totalMarksSum),
        status: round.status,
        attemptStatus: attempt ? attempt.status : null,
        terminationReason: attempt ? attempt.terminationReason : null,
        attemptId: attempt ? attempt.id : null
      });
    }

    return res.json({
      success: true,
      quizzes
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/quiz/rounds/:roundId/start
 * Starts a new quiz attempt or resumes an existing IN_PROGRESS attempt.
 */
const startQuiz = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { roundId } = req.params;
    const participantId = req.participant.id;

    const round = await QuizRound.findByPk(roundId, { transaction: t });
    if (!round) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Quiz round not found.'
      });
    }

    if (round.status !== 'ACTIVE') {
      await t.rollback();
      return res.status(409).json({
        success: false,
        message: `Quiz round is not currently active (Status: ${round.status}).`
      });
    }

    const activeQuestions = await Question.findAll({
      where: { roundId, isActive: true },
      order: [['questionOrder', 'ASC']],
      transaction: t
    });

    if (activeQuestions.length === 0) {
      await t.rollback();
      return res.status(409).json({
        success: false,
        message: 'This quiz is not ready yet. No active questions are available.'
      });
    }

    let attempt = await QuizAttempt.findOne({
      where: { participantId, roundId },
      transaction: t
    });

    if (attempt) {
      await checkAttemptExpiry(attempt, t);

      if (attempt.status === 'IN_PROGRESS') {
        const savedAnswers = await QuizAnswer.findAll({
          where: { attemptId: attempt.id },
          transaction: t
        });

        const answerMap = new Map();
        savedAnswers.forEach((ans) => answerMap.set(ans.questionId, ans.selectedOption));

        const sanitizedQuestions = activeQuestions.map((q) =>
          sanitizeQuestionForParticipant(q, answerMap.get(q.id))
        );

        let totalMarksSum = 0;
        activeQuestions.forEach((q) => (totalMarksSum += parseFloat(q.marks)));

        await t.commit();
        return res.json({
          success: true,
          message: 'Resuming existing attempt',
          attempt: {
            id: attempt.id,
            roundId: attempt.roundId,
            startedAt: attempt.startedAt,
            expiresAt: attempt.expiresAt,
            status: attempt.status
          },
          quiz: {
            title: round.title,
            durationMinutes: round.duration,
            totalQuestions: activeQuestions.length,
            totalMarks: parseFloat(totalMarksSum)
          },
          questions: sanitizedQuestions
        });
      }

      if (attempt.status === 'SUBMITTED') {
        await t.rollback();
        return res.status(409).json({
          success: false,
          message: 'You have already completed this quiz.'
        });
      }

      if (attempt.status === 'EXPIRED') {
        await t.rollback();
        return res.status(409).json({
          success: false,
          message: 'Your attempt for this quiz has expired.'
        });
      }

      if (attempt.status === 'TERMINATED') {
        await t.rollback();
        return res.status(409).json({
          success: false,
          message: 'Your attempt for this quiz was terminated.'
        });
      }
    }

    // Create new attempt
    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + round.duration * 60 * 1000);

    let totalMarksSum = 0;
    activeQuestions.forEach((q) => (totalMarksSum += parseFloat(q.marks)));

    attempt = await QuizAttempt.create(
      {
        participantId,
        roundId,
        startedAt,
        expiresAt,
        status: 'IN_PROGRESS',
        score: 0,
        totalMarks: parseFloat(totalMarksSum),
        answeredCount: 0
      },
      { transaction: t }
    );

    const sanitizedQuestions = activeQuestions.map((q) =>
      sanitizeQuestionForParticipant(q, null)
    );

    await t.commit();

    return res.status(201).json({
      success: true,
      attempt: {
        id: attempt.id,
        roundId: attempt.roundId,
        startedAt: attempt.startedAt,
        expiresAt: attempt.expiresAt,
        status: attempt.status
      },
      quiz: {
        title: round.title,
        durationMinutes: round.duration,
        totalQuestions: activeQuestions.length,
        totalMarks: parseFloat(totalMarksSum)
      },
      questions: sanitizedQuestions
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

/**
 * GET /api/quiz/attempts/:attemptId
 * Retrieves current attempt status, remaining time, and sanitized questions.
 */
const getAttempt = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    const participantId = req.participant.id;

    const attempt = await QuizAttempt.findByPk(attemptId);
    if (!attempt || attempt.participantId !== participantId) {
      return res.status(404).json({
        success: false,
        message: 'Quiz attempt not found.'
      });
    }

    await checkAttemptExpiry(attempt);

    const round = await QuizRound.findByPk(attempt.roundId);
    const activeQuestions = await Question.findAll({
      where: { roundId: attempt.roundId, isActive: true },
      order: [['questionOrder', 'ASC']]
    });

    const savedAnswers = await QuizAnswer.findAll({
      where: { attemptId: attempt.id }
    });

    const answerMap = new Map();
    savedAnswers.forEach((ans) => answerMap.set(ans.questionId, ans.selectedOption));

    const sanitizedQuestions = activeQuestions.map((q) =>
      sanitizeQuestionForParticipant(q, answerMap.get(q.id))
    );

    return res.json({
      success: true,
      attempt: {
        id: attempt.id,
        roundId: attempt.roundId,
        startedAt: attempt.startedAt,
        expiresAt: attempt.expiresAt,
        status: attempt.status,
        terminationReason: attempt.terminationReason,
        score: parseFloat(attempt.score),
        totalMarks: parseFloat(attempt.totalMarks),
        answeredCount: attempt.answeredCount
      },
      quiz: {
        title: round ? round.title : '',
        durationMinutes: round ? round.duration : 0,
        totalQuestions: activeQuestions.length,
        totalMarks: parseFloat(attempt.totalMarks)
      },
      questions: sanitizedQuestions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/quiz/attempts/:attemptId/questions
 * Returns sanitized questions with previously selected options for current attempt.
 */
const getAttemptQuestions = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    const participantId = req.participant.id;

    const attempt = await QuizAttempt.findByPk(attemptId);
    if (!attempt || attempt.participantId !== participantId) {
      return res.status(404).json({
        success: false,
        message: 'Quiz attempt not found.'
      });
    }

    await checkAttemptExpiry(attempt);

    const activeQuestions = await Question.findAll({
      where: { roundId: attempt.roundId, isActive: true },
      order: [['questionOrder', 'ASC']]
    });

    const savedAnswers = await QuizAnswer.findAll({
      where: { attemptId: attempt.id }
    });

    const answerMap = new Map();
    savedAnswers.forEach((ans) => answerMap.set(ans.questionId, ans.selectedOption));

    const sanitizedQuestions = activeQuestions.map((q) =>
      sanitizeQuestionForParticipant(q, answerMap.get(q.id))
    );

    return res.json({
      success: true,
      questions: sanitizedQuestions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/quiz/attempts/:attemptId/questions/:questionId/answer
 * Saves or updates a participant's selected answer for a question.
 */
const saveAnswer = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { attemptId, questionId } = req.params;
    const { selectedOption } = req.body;
    const participantId = req.participant.id;

    if (!selectedOption || !['A', 'B', 'C', 'D'].includes(selectedOption)) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Selected option must be one of A, B, C, or D.'
      });
    }

    const attempt = await QuizAttempt.findByPk(attemptId, { transaction: t });
    if (!attempt || attempt.participantId !== participantId) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Quiz attempt not found.'
      });
    }

    const isExpired = await checkAttemptExpiry(attempt, t);
    if (isExpired || attempt.status === 'EXPIRED') {
      await t.rollback();
      return res.status(409).json({
        success: false,
        message: 'The quiz time has expired.'
      });
    }

    if (attempt.status !== 'IN_PROGRESS') {
      await t.rollback();
      return res.status(409).json({
        success: false,
        message: `Cannot save answer. Quiz attempt status is ${attempt.status}.`
      });
    }

    const question = await Question.findByPk(questionId, { transaction: t });
    if (!question || question.roundId !== attempt.roundId || !question.isActive) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Question not found or does not belong to this active quiz round.'
      });
    }

    const { isCorrect, marksAwarded } = calculateQuestionScore(question, selectedOption);

    let answer = await QuizAnswer.findOne({
      where: { attemptId: attempt.id, questionId: question.id },
      transaction: t
    });

    if (answer) {
      answer.selectedOption = selectedOption;
      answer.isCorrect = isCorrect;
      answer.marksAwarded = marksAwarded;
      answer.answeredAt = new Date();
      await answer.save({ transaction: t });
    } else {
      answer = await QuizAnswer.create(
        {
          attemptId: attempt.id,
          questionId: question.id,
          selectedOption,
          isCorrect,
          marksAwarded,
          answeredAt: new Date()
        },
        { transaction: t }
      );
    }

    const answeredCount = await QuizAnswer.count({
      where: { attemptId: attempt.id },
      transaction: t
    });

    attempt.answeredCount = answeredCount;
    await attempt.save({ transaction: t });

    await t.commit();

    return res.json({
      success: true,
      answer: {
        questionId: answer.questionId,
        selectedOption: answer.selectedOption,
        answeredAt: answer.answeredAt
      }
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

/**
 * POST /api/quiz/attempts/:attemptId/submit
 * Submits the quiz attempt, performs server-side score evaluation, and locks the attempt.
 */
const submitQuiz = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { attemptId } = req.params;
    const participantId = req.participant.id;

    const attempt = await QuizAttempt.findByPk(attemptId, { transaction: t });
    if (!attempt) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Quiz attempt not found.'
      });
    }

    if (attempt.participantId !== participantId) {
      await t.rollback();
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to submit this quiz attempt.'
      });
    }

    // Idempotency check: if already submitted or expired, return calculated result
    if (attempt.status === 'SUBMITTED' || attempt.status === 'EXPIRED') {
      const activeQuestions = await Question.findAll({
        where: { roundId: attempt.roundId, isActive: true },
        transaction: t
      });

      const savedAnswers = await QuizAnswer.findAll({
        where: { attemptId: attempt.id },
        transaction: t
      });

      const scoring = calculateAttemptScore(activeQuestions, savedAnswers);

      if (attempt.status === 'EXPIRED') {
        attempt.status = 'SUBMITTED';
        attempt.score = scoring.score;
        attempt.totalMarks = scoring.totalMarks;
        attempt.answeredCount = scoring.answeredCount;
        if (!attempt.submittedAt) attempt.submittedAt = new Date();
        await attempt.save({ transaction: t });
      }

      await t.commit();

      return res.json({
        success: true,
        message: 'Quiz submitted successfully.',
        result: {
          status: 'SUBMITTED',
          score: parseFloat(attempt.score),
          totalMarks: parseFloat(attempt.totalMarks),
          answeredCount: attempt.answeredCount,
          totalQuestions: scoring.totalQuestions,
          correctCount: scoring.correctCount,
          incorrectCount: scoring.incorrectCount,
          unansweredCount: scoring.unansweredCount,
          submittedAt: attempt.submittedAt
        }
      });
    }

    if (attempt.status === 'TERMINATED') {
      await t.rollback();
      return res.status(409).json({
        success: false,
        message: 'Quiz attempt was terminated.'
      });
    }

    const activeQuestions = await Question.findAll({
      where: { roundId: attempt.roundId, isActive: true },
      transaction: t
    });

    const savedAnswers = await QuizAnswer.findAll({
      where: { attemptId: attempt.id },
      transaction: t
    });

    const scoring = calculateAttemptScore(activeQuestions, savedAnswers);

    // Update answer isCorrect and marksAwarded if needed during final evaluation
    for (const ans of savedAnswers) {
      const q = activeQuestions.find((item) => item.id === ans.questionId);
      if (q) {
        const { isCorrect, marksAwarded } = calculateQuestionScore(q, ans.selectedOption);
        if (ans.isCorrect !== isCorrect || parseFloat(ans.marksAwarded) !== marksAwarded) {
          ans.isCorrect = isCorrect;
          ans.marksAwarded = marksAwarded;
          await ans.save({ transaction: t });
        }
      }
    }

    attempt.score = scoring.score;
    attempt.totalMarks = scoring.totalMarks;
    attempt.answeredCount = scoring.answeredCount;
    attempt.submittedAt = new Date();
    attempt.status = 'SUBMITTED';

    await attempt.save({ transaction: t });
    await t.commit();

    return res.json({
      success: true,
      message: 'Quiz submitted successfully.',
      result: {
        status: 'SUBMITTED',
        score: scoring.score,
        totalMarks: scoring.totalMarks,
        answeredCount: scoring.answeredCount,
        totalQuestions: scoring.totalQuestions,
        correctCount: scoring.correctCount,
        incorrectCount: scoring.incorrectCount,
        unansweredCount: scoring.unansweredCount,
        submittedAt: attempt.submittedAt
      }
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

/**
 * GET /api/quiz/attempts/:attemptId/result
 * Retrieves completion results for a submitted or expired attempt.
 */
const getQuizResult = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    const participantId = req.participant.id;

    const attempt = await QuizAttempt.findByPk(attemptId);
    if (!attempt || attempt.participantId !== participantId) {
      return res.status(404).json({
        success: false,
        message: 'Quiz attempt not found.'
      });
    }

    await checkAttemptExpiry(attempt);

    if (attempt.status === 'IN_PROGRESS') {
      return res.status(400).json({
        success: false,
        message: 'Quiz is still in progress. Submit the quiz to view completion results.'
      });
    }

    const activeQuestions = await Question.findAll({
      where: { roundId: attempt.roundId, isActive: true }
    });

    const savedAnswers = await QuizAnswer.findAll({
      where: { attemptId: attempt.id }
    });

    const scoring = calculateAttemptScore(activeQuestions, savedAnswers);

    return res.json({
      success: true,
      result: {
        status: attempt.status,
        terminationReason: attempt.terminationReason,
        score: parseFloat(attempt.score),
        totalMarks: parseFloat(attempt.totalMarks),
        answeredCount: attempt.answeredCount,
        totalQuestions: scoring.totalQuestions,
        correctCount: scoring.correctCount,
        incorrectCount: scoring.incorrectCount,
        unansweredCount: scoring.unansweredCount,
        submittedAt: attempt.submittedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAvailableQuizzes,
  startQuiz,
  getAttempt,
  getAttemptQuestions,
  saveAnswer,
  submitQuiz,
  getQuizResult
};
