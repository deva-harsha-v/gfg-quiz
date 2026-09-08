const { QuizRound, Question, QuizAttempt, QuizAnswer, Participant } = require('../models');
const { sequelize } = require('../config/database');
const { calculateQuestionScore, calculateAttemptScore } = require('../services/scoringService');
const { emitSubmissionEvent } = require('../sockets');

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
    attempt.terminationReason = 'TIME_EXPIRED';
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
          message: 'You have already completed this examination.'
        });
      }

      if (attempt.status === 'EXPIRED') {
        await t.rollback();
        return res.status(409).json({
          success: false,
          message: 'You have already completed this examination.'
        });
      }

      if (attempt.status === 'TERMINATED') {
        await t.rollback();
        return res.status(409).json({
          success: false,
          message: 'You have already completed this examination.'
        });
      }
    }

    // Verify accessCode before creating a new attempt
    const submittedAccessCode = req.body?.accessCode ? String(req.body.accessCode).trim() : '';
    if (!submittedAccessCode) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Please enter the exam access code.'
      });
    }

    if (round.accessCode && round.accessCode.trim().toUpperCase() !== submittedAccessCode.toUpperCase()) {
      await t.rollback();
      return res.status(401).json({
        success: false,
        message: 'Invalid access code. Please enter the correct code for this set.'
      });
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
/**
 * Formats timeTaken in seconds to human readable string (e.g. '23 min 32 sec' or '45 sec')
 */
const formatTimeTaken = (seconds) => {
  const s = Math.max(0, Math.floor(seconds || 0));
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  if (mins === 0) {
    return `${secs} sec`;
  }
  return `${mins} min ${secs} sec`;
};

/**
 * Calculates rank of a student's attempt within its set/round.
 * Primary sort: Score DESC. Tie-breaker: timeTaken ASC.
 * Equal score and time receive equal ranks.
 */
const calculateStudentRank = async (attempt, transaction = null) => {
  if (!attempt || !attempt.roundId) return 1;

  const currentScore = parseFloat(attempt.score || 0);
  const currentTimeTaken = parseInt(attempt.timeTaken || 0, 10);

  const higherAttemptsCount = await QuizAttempt.count({
    where: {
      roundId: attempt.roundId,
      status: { [Op.in]: ['SUBMITTED', 'EXPIRED', 'TERMINATED'] },
      id: { [Op.ne]: attempt.id },
      [Op.or]: [
        { score: { [Op.gt]: currentScore } },
        {
          score: currentScore,
          timeTaken: { [Op.lt]: currentTimeTaken }
        }
      ]
    },
    transaction
  });

  return higherAttemptsCount + 1;
};

/**
 * POST /api/quiz/attempts/:attemptId/submit
 * Submits the quiz attempt, performs server-side score evaluation, records server timestamps & timeTaken, and locks attempt.
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

    const activeQuestions = await Question.findAll({
      where: { roundId: attempt.roundId, isActive: true },
      transaction: t
    });

    const savedAnswers = await QuizAnswer.findAll({
      where: { attemptId: attempt.id },
      transaction: t
    });

    const round = await QuizRound.findByPk(attempt.roundId, { transaction: t });
    const participant = await Participant.findByPk(attempt.participantId, {
      attributes: ['name', 'rollNumber', 'department', 'section'],
      transaction: t
    });

    // Idempotency check: if already submitted, expired, or terminated, return existing result without modifying timestamps
    if (attempt.status === 'SUBMITTED' || attempt.status === 'EXPIRED' || attempt.status === 'TERMINATED') {
      const scoring = calculateAttemptScore(activeQuestions, savedAnswers);
      const calculatedRank = await calculateStudentRank(attempt, t);

      await t.commit();

      const timeTakenSec = parseInt(attempt.timeTaken || 0, 10);
      const totalM = parseFloat(attempt.totalMarks || scoring.totalMarks || 100);
      const scoreVal = parseFloat(attempt.score || scoring.score);
      const pctVal = attempt.percentage ? parseFloat(attempt.percentage) : (totalM > 0 ? Math.round((scoreVal / totalM) * 10000) / 100 : 0);

      return res.json({
        success: true,
        message: 'Quiz submitted successfully.',
        result: {
          id: attempt.id,
          status: attempt.status,
          score: scoreVal,
          totalMarks: totalM,
          percentage: pctVal,
          answeredCount: attempt.answeredCount || scoring.answeredCount,
          totalQuestions: scoring.totalQuestions,
          correctCount: attempt.correctCount || scoring.correctCount,
          incorrectCount: attempt.incorrectCount || scoring.incorrectCount,
          unansweredCount: attempt.unansweredCount || scoring.unansweredCount,
          startedAt: attempt.startedAt,
          submittedAt: attempt.submittedAt,
          timeTakenSeconds: timeTakenSec,
          timeTakenFormatted: formatTimeTaken(timeTakenSec),
          rank: calculatedRank,
          participant: participant ? {
            name: participant.name,
            rollNumber: participant.rollNumber,
            department: participant.department,
            section: participant.section
          } : null,
          round: round ? {
            title: round.title,
            category: round.category,
            course: round.course,
            year: round.year,
            setNumber: round.setNumber
          } : null
        }
      });
    }

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

    const submittedAtDate = new Date();
    const startedAtDate = new Date(attempt.startedAt || submittedAtDate);
    const timeTakenSec = Math.max(0, Math.floor((submittedAtDate.getTime() - startedAtDate.getTime()) / 1000));
    const pctVal = scoring.totalMarks > 0 ? Math.round((scoring.score / scoring.totalMarks) * 10000) / 100 : 0.0;

    attempt.score = scoring.score;
    attempt.totalMarks = scoring.totalMarks;
    attempt.answeredCount = scoring.answeredCount;
    attempt.correctCount = scoring.correctCount;
    attempt.incorrectCount = scoring.incorrectCount;
    attempt.unansweredCount = scoring.unansweredCount;
    attempt.percentage = pctVal;
    attempt.timeTaken = timeTakenSec;
    attempt.submittedAt = submittedAtDate;
    attempt.status = 'SUBMITTED';
    if (!attempt.terminationReason) {
      attempt.terminationReason = 'NORMAL_SUBMISSION';
    }

    await attempt.save({ transaction: t });

    const calculatedRank = await calculateStudentRank(attempt, t);

    await t.commit();

    try {
      emitSubmissionEvent({
        attemptId: attempt.id,
        participantId: participant ? participant.id : attempt.participantId,
        studentName: participant ? participant.name : 'Unknown',
        rollNumber: participant ? participant.rollNumber : '—',
        roundId: attempt.roundId,
        score: scoring.score,
        totalMarks: scoring.totalMarks,
        submittedAt: attempt.submittedAt
      });
    } catch (sockErr) {
      console.warn('[Socket Emission Warning]:', sockErr.message);
    }

    return res.json({
      success: true,
      message: 'Quiz submitted successfully.',
      result: {
        id: attempt.id,
        status: attempt.status,
        score: scoring.score,
        totalMarks: scoring.totalMarks,
        percentage: pctVal,
        answeredCount: scoring.answeredCount,
        totalQuestions: scoring.totalQuestions,
        correctCount: scoring.correctCount,
        incorrectCount: scoring.incorrectCount,
        unansweredCount: scoring.unansweredCount,
        startedAt: attempt.startedAt,
        submittedAt: attempt.submittedAt,
        timeTakenSeconds: timeTakenSec,
        timeTakenFormatted: formatTimeTaken(timeTakenSec),
        rank: calculatedRank,
        participant: participant ? {
          name: participant.name,
          rollNumber: participant.rollNumber,
          department: participant.department,
          section: participant.section
        } : null,
        round: round ? {
          title: round.title,
          category: round.category,
          course: round.course,
          year: round.year,
          setNumber: round.setNumber
        } : null
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

    const participant = await Participant.findByPk(attempt.participantId, {
      attributes: ['name', 'rollNumber', 'department', 'section']
    });
    const round = await QuizRound.findByPk(attempt.roundId, {
      attributes: ['title', 'category', 'course', 'year', 'setNumber']
    });

    const calculatedRank = await calculateStudentRank(attempt);
    const timeTakenSec = parseInt(attempt.timeTaken || 0, 10);
    const totalM = parseFloat(attempt.totalMarks || scoring.totalMarks || 100);
    const scoreVal = parseFloat(attempt.score || scoring.score);
    const pctVal = attempt.percentage ? parseFloat(attempt.percentage) : (totalM > 0 ? Math.round((scoreVal / totalM) * 10000) / 100 : 0);

    return res.json({
      success: true,
      result: {
        id: attempt.id,
        status: attempt.status,
        submissionReason: attempt.terminationReason || (attempt.status === 'SUBMITTED' ? 'NORMAL_SUBMISSION' : attempt.status),
        terminationReason: attempt.terminationReason,
        score: scoreVal,
        totalMarks: totalM,
        percentage: pctVal,
        answeredCount: attempt.answeredCount || scoring.answeredCount,
        totalQuestions: scoring.totalQuestions,
        correctCount: attempt.correctCount || scoring.correctCount,
        incorrectCount: attempt.incorrectCount || scoring.incorrectCount,
        unansweredCount: attempt.unansweredCount || scoring.unansweredCount,
        startedAt: attempt.startedAt,
        submittedAt: attempt.submittedAt,
        timeTakenSeconds: timeTakenSec,
        timeTakenFormatted: formatTimeTaken(timeTakenSec),
        rank: calculatedRank,
        participant: participant ? {
          name: participant.name,
          rollNumber: participant.rollNumber,
          department: participant.department,
          section: participant.section
        } : null,
        round: round ? {
          title: round.title,
          category: round.category,
          course: round.course,
          year: round.year,
          setNumber: round.setNumber
        } : null
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/quiz/rankings
 * Retrieves set-scoped leaderboard rankings sorted by Score DESC, Time Taken ASC.
 */
const getRankings = async (req, res, next) => {
  try {
    const { roundId, category, course, year, setNumber } = req.query;

    let targetRoundId = roundId;
    let roundInfo = null;

    if (!targetRoundId && (category || course || year || setNumber)) {
      const whereClause = {};
      if (category) whereClause.category = category;
      if (course) whereClause.course = course;
      if (year) whereClause.year = year;
      if (setNumber) whereClause.setNumber = parseInt(setNumber, 10);

      const foundRound = await QuizRound.findOne({ where: whereClause });
      if (foundRound) {
        targetRoundId = foundRound.id;
        roundInfo = foundRound;
      }
    } else if (targetRoundId) {
      roundInfo = await QuizRound.findByPk(targetRoundId);
    }

    if (!targetRoundId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid roundId or set parameters.'
      });
    }

    const attempts = await QuizAttempt.findAll({
      where: {
        roundId: targetRoundId,
        status: 'SUBMITTED'
      },
      include: [
        {
          model: Participant,
          as: 'participant',
          where: { role: 'PARTICIPANT' },
          attributes: ['name', 'rollNumber', 'department', 'section']
        }
      ],
      order: [
        ['score', 'DESC'],
        ['timeTaken', 'ASC'],
        ['submittedAt', 'ASC']
      ]
    });

    let currentRank = 0;
    let prevScore = null;
    let prevTime = null;

    const rankings = attempts.map((att, idx) => {
      const scoreNum = parseFloat(att.score || 0);
      const timeNum = parseInt(att.timeTaken || 0, 10);

      if (prevScore === null || prevScore !== scoreNum || prevTime !== timeNum) {
        currentRank = idx + 1;
      }
      prevScore = scoreNum;
      prevTime = timeNum;

      const totalM = parseFloat(att.totalMarks || 100);
      const pct = att.percentage ? parseFloat(att.percentage) : (totalM > 0 ? Math.round((scoreNum / totalM) * 10000) / 100 : 0);

      return {
        rank: currentRank,
        id: att.id,
        participant: att.participant ? {
          name: att.participant.name,
          rollNumber: att.participant.rollNumber,
          department: att.participant.department,
          section: att.participant.section
        } : null,
        score: scoreNum,
        totalMarks: totalM,
        percentage: pct,
        correctCount: att.correctCount,
        incorrectCount: att.incorrectCount,
        unansweredCount: att.unansweredCount,
        timeTakenSeconds: timeNum,
        timeTakenFormatted: formatTimeTaken(timeNum),
        submittedAt: att.submittedAt
      };
    });

    return res.json({
      success: true,
      round: roundInfo ? {
        id: roundInfo.id,
        title: roundInfo.title,
        category: roundInfo.category,
        course: roundInfo.course,
        year: roundInfo.year,
        setNumber: roundInfo.setNumber
      } : null,
      totalParticipants: rankings.length,
      rankings
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/quiz/admin/results
 * Returns submitted student results across rounds/sets with filtering, search, sorting, summary metrics & competition ranking.
 * Protected: ADMIN only.
 */
const getAdminResults = async (req, res, next) => {
  try {
    const {
      search,
      year,
      department,
      section,
      category,
      course,
      setNumber,
      roundId,
      status,
      sortBy
    } = req.query;

    const participantWhere = {
      role: 'PARTICIPANT'
    };
    if (search && search.trim()) {
      const searchStr = `%${search.trim()}%`;
      participantWhere[Op.or] = [
        { name: { [Op.like]: searchStr } },
        { rollNumber: { [Op.like]: searchStr } }
      ];
    }
    if (department && department.trim() && department !== 'ALL') {
      participantWhere.department = department.trim();
    }
    if (section && section.trim() && section !== 'ALL') {
      participantWhere.section = section.trim().toUpperCase();
    }

    const roundWhere = {};
    if (roundId) roundWhere.id = roundId;
    if (category && category !== 'ALL') roundWhere.category = category;
    if (course && course !== 'ALL') roundWhere.course = course;
    if (year && year !== 'ALL') roundWhere.year = year;
    if (setNumber && setNumber !== 'ALL') {
      const setNum = parseInt(setNumber.toString().replace(/\D/g, ''), 10);
      if (!isNaN(setNum)) roundWhere.setNumber = setNum;
    }

    const attemptWhere = {};
    if (status && status !== 'ALL') {
      attemptWhere.status = status;
    } else {
      attemptWhere.status = 'SUBMITTED';
    }

    const attempts = await QuizAttempt.findAll({
      where: attemptWhere,
      include: [
        {
          model: Participant,
          as: 'participant',
          where: participantWhere,
          attributes: ['id', 'name', 'rollNumber', 'department', 'section']
        },
        {
          model: QuizRound,
          as: 'round',
          where: Object.keys(roundWhere).length > 0 ? roundWhere : undefined,
          attributes: ['id', 'title', 'category', 'course', 'year', 'setNumber', 'accessCode', 'duration', 'totalMarks']
        }
      ]
    });

    const totalSubmittedAttempts = attempts.filter((att) => att.status === 'SUBMITTED').length;
    let scoreSum = 0;
    let maxScore = 0;
    let timeSum = 0;

    attempts.forEach((att) => {
      const s = parseFloat(att.score || 0);
      const tSec = parseInt(att.timeTaken || 0, 10);
      scoreSum += s;
      if (s > maxScore) maxScore = s;
      timeSum += tSec;
    });

    const avgScore = totalSubmittedAttempts > 0 ? Math.round((scoreSum / totalSubmittedAttempts) * 100) / 100 : 0;
    const avgTimeSec = totalSubmittedAttempts > 0 ? Math.round(timeSum / totalSubmittedAttempts) : 0;

    const minsAvg = Math.floor(avgTimeSec / 60);
    const secsAvg = avgTimeSec % 60;
    const avgTimeFormatted = minsAvg === 0 ? `${secsAvg} sec` : `${minsAvg} min ${secsAvg} sec`;

    const sortedAttempts = [...attempts].sort((a, b) => {
      const scoreA = parseFloat(a.score || 0);
      const scoreB = parseFloat(b.score || 0);
      const timeA = parseInt(a.timeTaken || 0, 10);
      const timeB = parseInt(b.timeTaken || 0, 10);
      const subA = new Date(a.submittedAt || a.updatedAt).getTime();
      const subB = new Date(b.submittedAt || b.updatedAt).getTime();

      if (sortBy === 'lowest_marks') {
        if (scoreA !== scoreB) return scoreA - scoreB;
        if (timeA !== timeB) return timeA - timeB;
        return subA - subB;
      } else if (sortBy === 'fastest_time') {
        if (timeA !== timeB) return timeA - timeB;
        if (scoreA !== scoreB) return scoreB - scoreA;
        return subA - subB;
      } else if (sortBy === 'latest_submission') {
        return subB - subA;
      } else if (sortBy === 'earliest_submission') {
        return subA - subB;
      } else {
        if (scoreA !== scoreB) return scoreB - scoreA;
        if (timeA !== timeB) return timeA - timeB;
        return subA - subB;
      }
    });

    let currentRank = 0;
    let prevScore = null;
    let prevTime = null;

    const formattedResults = sortedAttempts.map((att, idx) => {
      const scoreNum = parseFloat(att.score || 0);
      const timeNum = parseInt(att.timeTaken || 0, 10);

      if (prevScore === null || prevScore !== scoreNum || prevTime !== timeNum) {
        currentRank = idx + 1;
      }
      prevScore = scoreNum;
      prevTime = timeNum;

      const totalM = parseFloat(att.totalMarks || (att.round ? att.round.totalMarks : 100));
      const pct = att.percentage ? parseFloat(att.percentage) : (totalM > 0 ? Math.round((scoreNum / totalM) * 10000) / 100 : 0);

      const mins = Math.floor(timeNum / 60);
      const secs = timeNum % 60;
      const timeTakenFormatted = mins === 0 ? `${secs} sec` : `${mins} min ${secs} sec`;

      const setDisplay = att.round ? (att.round.setNumber ? `SET ${att.round.setNumber}` : att.round.title) : '—';
      const setNameFull = att.round ? `${att.round.category} - ${att.round.course} ${att.round.year} ${setDisplay}` : '—';

      const totalQ = (att.correctCount || 0) + (att.incorrectCount || 0) + (att.unansweredCount || 0) || 30;
      const speedSecPerQ = totalQ > 0 ? Math.round((timeNum / totalQ) * 10) / 10 : 0;

      return {
        rank: currentRank,
        id: att.id,
        attemptId: att.id,
        participantId: att.participantId,
        roundId: att.roundId,
        studentName: att.participant ? att.participant.name : 'Unknown',
        rollNumber: att.participant ? att.participant.rollNumber : '—',
        department: att.participant ? att.participant.department : '—',
        section: att.participant ? att.participant.section : '—',
        year: att.round ? att.round.year : '—',
        category: att.round ? att.round.category : '—',
        course: att.round ? att.round.course : '—',
        setName: setNameFull,
        setNumber: setDisplay,
        examCode: att.round ? att.round.accessCode : '—',
        durationMinutes: att.round ? att.round.duration : 30,
        score: scoreNum,
        obtainedMarks: scoreNum,
        totalMarks: totalM,
        percentage: pct,
        correctAnswers: att.correctCount || 0,
        correctCount: att.correctCount || 0,
        wrongAnswers: att.incorrectCount || 0,
        incorrectCount: att.incorrectCount || 0,
        unanswered: att.unansweredCount || 0,
        unansweredCount: att.unansweredCount || 0,
        startedAt: att.startedAt,
        submittedAt: att.submittedAt,
        timeTakenSeconds: timeNum,
        timeTakenMinutes: Math.round((timeNum / 60) * 10) / 10,
        timeTakenFormatted,
        speedSecPerQ,
        speedPace: `${speedSecPerQ}s / Q`,
        status: att.status
      };
    });

    return res.json({
      success: true,
      summary: {
        totalSubmissions: totalSubmittedAttempts,
        totalAttempts: attempts.length,
        averageScore: avgScore,
        highestScore: maxScore,
        averageTimeSeconds: avgTimeSec,
        averageTimeFormatted: avgTimeFormatted
      },
      results: formattedResults
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/quiz/verify-access-code
 * Verifies student-entered access code against roundId or looks up assigned round by accessCode.
 */
const verifyAccessCode = async (req, res, next) => {
  try {
    const { roundId, accessCode } = req.body;

    const submittedCode = accessCode ? String(accessCode).trim() : '';

    if (!submittedCode || !/^\d{4}$/.test(submittedCode)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Exam Code. Please enter a valid 4-digit code.'
      });
    }

    let round;
    if (roundId) {
      round = await QuizRound.findByPk(roundId);
      if (!round || !round.accessCode || round.accessCode.trim() !== submittedCode) {
        return res.status(401).json({
          success: false,
          message: 'Invalid Exam Code. Please enter a valid 4-digit code.'
        });
      }
    } else {
      round = await QuizRound.findOne({
        where: { accessCode: submittedCode }
      });
      if (!round) {
        return res.status(401).json({
          success: false,
          message: 'Invalid Exam Code. Please enter a valid 4-digit code.'
        });
      }
    }

    console.log('[EXAM CODE DEBUG]', {
      frontendEnteredCode: accessCode,
      backendReceivedCode: submittedCode,
      normalizedCode: submittedCode.toUpperCase(),
      databaseMatchingCode: round ? round.accessCode : null,
      matchedSetId: round ? round.id : null,
      matchedSetName: round ? round.title : null,
      setStatus: round ? round.status : null
    });

    if (round.status !== 'ACTIVE') {
      return res.status(409).json({
        success: false,
        message: 'This exam set is currently unavailable.'
      });
    }

    return res.json({
      success: true,
      message: 'Exam code verified successfully',
      round: {
        id: round.id,
        title: round.title,
        category: round.category,
        course: round.course,
        year: round.year,
        setNumber: round.setNumber,
        durationMinutes: round.duration,
        totalMarks: parseFloat(round.totalMarks)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/quiz/public-start
 * Public student exam entry endpoint.
 * Validates all 5 student fields & accessCode server-side.
 * Does NOT require prior participant login or registration.
 */
const publicStartExam = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { name, rollNumber, department, section, year, accessCode } = req.body;

    // 1. Mandatory Fields Validation
    const trimmedName = name && typeof name === 'string' ? name.trim() : '';
    const trimmedRoll = rollNumber && typeof rollNumber === 'string' ? rollNumber.trim().toUpperCase() : '';
    const trimmedDept = department && typeof department === 'string' ? department.trim() : '';
    const trimmedSec = section && typeof section === 'string' ? section.trim().toUpperCase() : '';
    const trimmedYear = year && typeof year === 'string' ? year.trim() : '';
    const trimmedCode = accessCode && typeof accessCode === 'string' ? accessCode.trim() : '';

    if (!trimmedName || trimmedName.length < 2) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid Student Name.'
      });
    }

    if (!trimmedRoll) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Please enter your Roll No.'
      });
    }

    if (!/^[A-Z0-9\-]+$/.test(trimmedRoll)) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Roll No contains invalid characters. Only letters, numbers, and hyphens are allowed.'
      });
    }

    if (!trimmedDept) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Please select your Department.'
      });
    }

    if (!trimmedSec) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Please select your Section.'
      });
    }

    if (!trimmedYear) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Please select your Year.'
      });
    }

    if (!trimmedCode || !/^\d{4}$/.test(trimmedCode)) {
      await t.rollback();
      return res.status(401).json({
        success: false,
        message: 'Invalid Exam Code. Please enter a valid 4-digit code.'
      });
    }

    // 2. SERVER-SIDE EXAM CODE VERIFICATION
    const round = await QuizRound.findOne({
      where: { accessCode: trimmedCode },
      transaction: t
    });

    console.log('[EXAM CODE DEBUG - PUBLIC START]', {
      frontendEnteredCode: accessCode,
      backendReceivedCode: trimmedCode,
      databaseMatchingCode: round ? round.accessCode : null,
      matchedSetId: round ? round.id : null,
      matchedSetName: round ? round.title : null,
      setStatus: round ? round.status : null
    });

    if (!round) {
      await t.rollback();
      return res.status(401).json({
        success: false,
        message: 'Invalid Exam Code. Please enter a valid 4-digit code.'
      });
    }

    if (round.status !== 'ACTIVE') {
      await t.rollback();
      return res.status(409).json({
        success: false,
        message: 'This exam set is currently unavailable.'
      });
    }

    // 3. PARTICIPANT REGISTRATION & PROFILE LOOKUP (Pre-registration NOT required)
    let participant = await Participant.findOne({
      where: {
        role: 'PARTICIPANT',
        [Op.and]: [
          sequelize.where(
            sequelize.fn('UPPER', sequelize.fn('TRIM', sequelize.col('rollNumber'))),
            trimmedRoll
          )
        ]
      },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!participant) {
      participant = await Participant.create({
        name: trimmedName || `Student ${trimmedRoll}`,
        rollNumber: trimmedRoll,
        department: trimmedDept || 'GENERAL',
        section: trimmedSec || 'A',
        year: trimmedYear || '1st Year',
        role: 'PARTICIPANT',
        isActive: true
      }, { transaction: t });
    } else {
      // Sync student details if updated on entry
      let detailsUpdated = false;
      if (trimmedName && participant.name !== trimmedName) {
        participant.name = trimmedName;
        detailsUpdated = true;
      }
      if (trimmedDept && participant.department !== trimmedDept) {
        participant.department = trimmedDept;
        detailsUpdated = true;
      }
      if (trimmedSec && participant.section !== trimmedSec) {
        participant.section = trimmedSec;
        detailsUpdated = true;
      }
      if (trimmedYear && participant.year !== trimmedYear) {
        participant.year = trimmedYear;
        detailsUpdated = true;
      }
      if (detailsUpdated) {
        await participant.save({ transaction: t });
      }
    }

    if (!participant.isActive) {
      await t.rollback();
      return res.status(403).json({
        success: false,
        message: 'Your account is currently inactive. Please contact the administrator.'
      });
    }

    const { generateToken } = require('../utils/auth');
    const token = generateToken({
      id: participant.id,
      role: 'PARTICIPANT'
    });

    // Derive event identification key for event-scoped one-attempt constraint
    const examEventKey = `${(round.category || '').trim()}::${(round.course || '').trim()}::${(round.year || '').trim()}`.toUpperCase();

    // 4. CHECK PREVIOUS ATTEMPTS FOR THIS EXAMINATION EVENT
    const existingAttempts = await QuizAttempt.findAll({
      where: { participantId: participant.id },
      include: [
        {
          model: QuizRound,
          as: 'round',
          attributes: ['id', 'category', 'course', 'year', 'setNumber', 'title']
        }
      ],
      transaction: t
    });

    // Filter attempts belonging to the SAME examination event
    const sameEventAttempts = existingAttempts.filter((att) => {
      if (att.examEventKey && att.examEventKey === examEventKey) return true;
      if (att.round) {
        const attKey = `${(att.round.category || '').trim()}::${(att.round.course || '').trim()}::${(att.round.year || '').trim()}`.toUpperCase();
        return attKey === examEventKey;
      }
      return false;
    });

    const sameRoundAttempt = sameEventAttempts.find((att) => att.roundId === round.id);

    if (sameRoundAttempt) {
      await checkAttemptExpiry(sameRoundAttempt, t);

      if (
        sameRoundAttempt.status === 'SUBMITTED' ||
        sameRoundAttempt.status === 'EXPIRED' ||
        sameRoundAttempt.status === 'TERMINATED'
      ) {
        await t.rollback();
        return res.status(409).json({
          success: false,
          message: 'An examination has already been attempted using this Roll Number. You cannot retake the exam.'
        });
      }

      if (sameRoundAttempt.status === 'IN_PROGRESS') {
        const activeQuestions = await Question.findAll({
          where: { roundId: round.id, isActive: true },
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

        const savedAnswers = await QuizAnswer.findAll({
          where: { attemptId: sameRoundAttempt.id },
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
          token,
          participant: {
            id: participant.id,
            name: participant.name,
            rollNumber: participant.rollNumber,
            department: participant.department,
            section: participant.section,
            role: participant.role
          },
          attempt: {
            id: sameRoundAttempt.id,
            roundId: sameRoundAttempt.roundId,
            startedAt: sameRoundAttempt.startedAt,
            expiresAt: sameRoundAttempt.expiresAt,
            status: sameRoundAttempt.status
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
    }

    // Reject if student already has an attempt in another set/round for the SAME examination event
    const otherRoundAttemptInSameEvent = sameEventAttempts.find((att) => att.roundId !== round.id);
    if (otherRoundAttemptInSameEvent) {
      await t.rollback();
      return res.status(409).json({
        success: false,
        message: 'An examination has already been attempted using this Roll Number. You cannot retake the exam.'
      });
    }

    // 5. CREATE NEW ATTEMPT (Only if NO previous attempt exists for this event)
    const activeQuestions = await Question.findAll({
      where: { roundId: round.id, isActive: true },
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

    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + round.duration * 60 * 1000);

    let totalMarksSum = 0;
    activeQuestions.forEach((q) => (totalMarksSum += parseFloat(q.marks)));

    attempt = await QuizAttempt.create(
      {
        participantId: participant.id,
        roundId: round.id,
        examEventKey,
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
      token,
      participant: {
        id: participant.id,
        name: participant.name,
        rollNumber: participant.rollNumber,
        department: participant.department,
        section: participant.section,
        role: participant.role
      },
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
        totalQuestions: sanitizedQuestions.length,
        totalMarks: parseFloat(totalMarksSum)
      },
      questions: sanitizedQuestions
    });
  } catch (error) {
    if (t && !t.finished) {
      try {
        await t.rollback();
      } catch (rbErr) {
        console.error('[Rollback Error]:', rbErr);
      }
    }
    console.error('[Public Start Exam Error]:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'An examination has already been attempted using this Roll Number. You cannot retake the exam.'
      });
    }

    next(error);
/**
 * DELETE /api/quiz/admin/attempts/:id
 * Deletes a quiz attempt record by ID.
 * Protected: ADMIN only.
 */
const deleteQuizAttemptAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const attempt = await QuizAttempt.findByPk(id);

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Quiz attempt not found.'
      });
    }

    // Try deleting associated QuestionResponse records if model exists
    try {
      const QuestionResponse = require('../models/QuestionResponse');
      if (QuestionResponse) {
        await QuestionResponse.destroy({ where: { attemptId: id } });
      }
    } catch (e) {
      console.warn('[Delete Attempt Warning]: QuestionResponse cleanup skipped:', e.message);
    }

    await attempt.destroy();

    return res.status(200).json({
      success: true,
      message: 'Quiz attempt deleted successfully.'
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
  getQuizResult,
  verifyAccessCode,
  publicStartExam,
  getRankings,
  getAdminResults,
  deleteQuizAttemptAdmin
};
