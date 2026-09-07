const { Op } = require('sequelize');
const QuizRound = require('../models/QuizRound');
const Question = require('../models/Question');
const Participant = require('../models/Participant');
const { sequelize } = require('../config/database');
const { emitRoundEvent } = require('../sockets');
const seedAllQuizRounds = require('../seeders/seedAllQuizRounds');

// GET /api/rounds — Get all rounds & summary stats
const getRounds = async (req, res, next) => {
  try {
    let rounds = await QuizRound.findAll({
      order: [['course', 'ASC'], ['setNumber', 'ASC'], ['roundNumber', 'ASC']]
    });

    const totalQuestionsInDB = await Question.count();

    if (rounds.length < 40 || totalQuestionsInDB < 100) {
      console.log(`[getRounds] Question datasets incomplete (Rounds: ${rounds.length}, Questions: ${totalQuestionsInDB}). Auto-importing full 1080 questions dataset...`);
      await seedAllQuizRounds(true);
      rounds = await QuizRound.findAll({
        order: [['course', 'ASC'], ['setNumber', 'ASC'], ['roundNumber', 'ASC']]
      });
    }

    const totalParticipants = await Participant.count({ where: { role: 'PARTICIPANT' } });
    const totalRounds = rounds.length;
    const activeRound = rounds.find((r) => r.status === 'ACTIVE') || null;
    const draftRoundsCount = rounds.filter((r) => r.status === 'DRAFT').length;
    const completedRoundsCount = rounds.filter((r) => r.status === 'COMPLETED').length;
    const pausedRoundsCount = rounds.filter((r) => r.status === 'PAUSED').length;
    const logicalRoundsCount = rounds.filter((r) => r.category === 'Logical Reasoning').length;
    const creativeRiddlesCount = rounds.filter((r) => r.category === 'Creative Riddles').length;

    return res.status(200).json({
      success: true,
      stats: {
        totalParticipants,
        totalRounds,
        activeRound,
        draftRoundsCount,
        completedRoundsCount,
        pausedRoundsCount,
        logicalRoundsCount,
        creativeRiddlesCount
      },
      rounds
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/rounds/seed-default — Manually trigger dataset import
const seedDefaultDatasets = async (req, res, next) => {
  try {
    const result = await seedAllQuizRounds(true);
    return res.status(200).json({
      success: true,
      message: result.message || 'Default datasets imported successfully',
      result
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/rounds/:id — Get round by ID
const getRoundById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const round = await QuizRound.findByPk(id);

    if (!round) {
      return res.status(404).json({
        success: false,
        message: 'Quiz round not found.'
      });
    }

    return res.status(200).json({
      success: true,
      round
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/rounds — Create a new quiz round
const createRound = async (req, res, next) => {
  try {
    const { title, description, roundNumber, setNumber, category, course, year, duration, totalMarks } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Round title is required.' });
    }

    const parsedRoundNum = parseInt(roundNumber, 10);
    if (isNaN(parsedRoundNum) || parsedRoundNum < 1) {
      return res.status(400).json({ success: false, message: 'Round number must be a positive integer.' });
    }

    const reqCategory = category && typeof category === 'string' && category.trim() ? category.trim() : 'Logical Reasoning';
    const reqCourse = course && typeof course === 'string' && course.trim() ? course.trim() : 'Diploma';
    const reqYear = year && typeof year === 'string' && year.trim() ? year.trim() : '1st Year';
    const reqSetNum = setNumber ? parseInt(setNumber, 10) : parsedRoundNum;

    const parsedDuration = parseInt(duration, 10);
    if (isNaN(parsedDuration) || parsedDuration < 1) {
      return res.status(400).json({ success: false, message: 'Duration must be at least 1 minute.' });
    }

    const parsedMarks = parseFloat(totalMarks);
    if (isNaN(parsedMarks) || parsedMarks < 0) {
      return res.status(400).json({ success: false, message: 'Total marks must be zero or greater.' });
    }

    // Check scoped duplicate: category + course + year + setNumber
    const existing = await QuizRound.findOne({
      where: {
        category: reqCategory,
        course: reqCourse,
        year: reqYear,
        setNumber: reqSetNum
      }
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: `A quiz round for "${reqCategory} - ${reqCourse} ${reqYear} — SET ${reqSetNum}" already exists.`
      });
    }

    const { generateUnique4DigitAccessCode } = require('../utils/codeGenerator');
    let accessCode = req.body.accessCode && /^\d{4}$/.test(String(req.body.accessCode).trim()) ? String(req.body.accessCode).trim() : null;
    if (!accessCode) {
      accessCode = await generateUnique4DigitAccessCode();
    }

    const round = await QuizRound.create({
      title: title.trim(),
      category: reqCategory,
      course: reqCourse,
      year: reqYear,
      setNumber: reqSetNum,
      roundNumber: parsedRoundNum,
      description: description ? description.trim() : null,
      duration: parsedDuration,
      totalMarks: parsedMarks,
      accessCode,
      status: 'DRAFT'
    });

    return res.status(201).json({
      success: true,
      message: 'Quiz round created successfully',
      round
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'A quiz round with this category, year group, and set number already exists.'
      });
    }
    next(error);
  }
};

// PUT /api/rounds/:id — Update quiz round
const updateRound = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, roundNumber, setNumber, category, course, year, duration, totalMarks } = req.body;

    const round = await QuizRound.findByPk(id);
    if (!round) {
      return res.status(404).json({ success: false, message: 'Quiz round not found.' });
    }

    if (round.status === 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'Completed quiz rounds cannot be modified.'
      });
    }

    if (title && typeof title === 'string' && title.trim()) {
      round.title = title.trim();
    }

    if (description !== undefined) {
      round.description = description ? description.trim() : null;
    }

    if (totalMarks !== undefined) {
      const parsedMarks = parseFloat(totalMarks);
      if (!isNaN(parsedMarks) && parsedMarks >= 0) {
        round.totalMarks = parsedMarks;
      }
    }

    // Restrict modifying duration or setNumber/category/course/year if round is live (ACTIVE/PAUSED)
    if (round.status === 'DRAFT') {
      const targetCategory = category !== undefined ? category.trim() : round.category;
      const targetCourse = course !== undefined ? course.trim() : round.course;
      const targetYear = year !== undefined ? year.trim() : round.year;
      const targetSetNum = setNumber !== undefined ? parseInt(setNumber, 10) : (roundNumber !== undefined ? parseInt(roundNumber, 10) : round.setNumber);
      const targetRoundNum = roundNumber !== undefined ? parseInt(roundNumber, 10) : round.roundNumber;

      if (setNumber !== undefined || roundNumber !== undefined || category !== undefined || course !== undefined || year !== undefined) {
        const dup = await QuizRound.findOne({
          where: {
            id: { [Op.ne]: round.id },
            category: targetCategory,
            course: targetCourse,
            year: targetYear,
            setNumber: targetSetNum
          }
        });
        if (dup) {
          return res.status(409).json({
            success: false,
            message: `A quiz round for "${targetCategory} - ${targetCourse} ${targetYear} — SET ${targetSetNum}" already exists.`
          });
        }
        round.category = targetCategory;
        round.course = targetCourse;
        round.year = targetYear;
        round.setNumber = targetSetNum;
        round.roundNumber = targetRoundNum;
      }

      if (duration !== undefined) {
        const parsedDuration = parseInt(duration, 10);
        if (!isNaN(parsedDuration) && parsedDuration > 0) {
          round.duration = parsedDuration;
        }
      }
    }

    await round.save();

    return res.status(200).json({
      success: true,
      message: 'Quiz round updated successfully',
      round
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'A quiz round with this category, year group, and set number already exists.'
      });
    }
    next(error);
  }
};

// DELETE /api/rounds/:id — Delete quiz round (ONLY if status === DRAFT)
const deleteRound = async (req, res, next) => {
  try {
    const { id } = req.params;
    const round = await QuizRound.findByPk(id);

    if (!round) {
      return res.status(404).json({ success: false, message: 'Quiz round not found.' });
    }

    if (round.status !== 'DRAFT') {
      return res.status(400).json({
        success: false,
        message: `Cannot delete round in '${round.status}' status. Only DRAFT rounds can be deleted.`
      });
    }

    await round.destroy();

    return res.status(200).json({
      success: true,
      message: 'Draft quiz round deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/rounds/:id/activate — Activate round
const activateRound = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const round = await QuizRound.findByPk(id, { transaction });

    if (!round) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Quiz round not found.' });
    }

    round.status = 'ACTIVE';
    if (!round.startTime) {
      round.startTime = new Date();
    }
    await round.save({ transaction });

    await transaction.commit();

    emitRoundEvent('round:activated', round);

    return res.status(200).json({
      success: true,
      message: `Round #${round.roundNumber} (${round.title}) activated successfully`,
      round
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

// POST /api/rounds/:id/pause — Pause an active round
const pauseRound = async (req, res, next) => {
  try {
    const { id } = req.params;
    const round = await QuizRound.findByPk(id);

    if (!round) {
      return res.status(404).json({ success: false, message: 'Quiz round not found.' });
    }

    if (round.status !== 'ACTIVE') {
      return res.status(400).json({
        success: false,
        message: `Only ACTIVE rounds can be paused. Current status: ${round.status}`
      });
    }

    round.status = 'PAUSED';
    await round.save();

    emitRoundEvent('round:paused', round);

    return res.status(200).json({
      success: true,
      message: `Round #${round.roundNumber} paused successfully`,
      round
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/rounds/:id/resume — Resume a paused round
const resumeRound = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const round = await QuizRound.findByPk(id, { transaction });

    if (!round) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Quiz round not found.' });
    }

    if (round.status !== 'PAUSED') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `Only PAUSED rounds can be resumed. Current status: ${round.status}`
      });
    }

    // Pause any other active round
    await QuizRound.update(
      { status: 'PAUSED' },
      { where: { status: 'ACTIVE' }, transaction }
    );

    round.status = 'ACTIVE';
    await round.save({ transaction });

    await transaction.commit();

    emitRoundEvent('round:resumed', round);

    return res.status(200).json({
      success: true,
      message: `Round #${round.roundNumber} resumed successfully`,
      round
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

// POST /api/rounds/:id/complete — Complete a round
const completeRound = async (req, res, next) => {
  try {
    const { id } = req.params;
    const round = await QuizRound.findByPk(id);

    if (!round) {
      return res.status(404).json({ success: false, message: 'Quiz round not found.' });
    }

    if (round.status === 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'Round is already completed.'
      });
    }

    round.status = 'COMPLETED';
    round.endTime = new Date();
    await round.save();

    emitRoundEvent('round:completed', round);

    return res.status(200).json({
      success: true,
      message: `Round #${round.roundNumber} completed successfully`,
      round
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/rounds/:id/results — Get admin results leaderboard for a quiz round
const getRoundResults = async (req, res, next) => {
  try {
    const { id } = req.params;
    const QuizAttempt = require('../models/QuizAttempt');
    const round = await QuizRound.findByPk(id);

    if (!round) {
      return res.status(404).json({ success: false, message: 'Quiz round not found.' });
    }

    const attempts = await QuizAttempt.findAll({
      where: {
        roundId: id,
        status: 'SUBMITTED'
      },
      include: [
        {
          model: Participant,
          as: 'participant',
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

    const results = attempts.map((att, idx) => {
      const scoreNum = parseFloat(att.score || 0);
      const timeNum = parseInt(att.timeTaken || 0, 10);

      if (prevScore === null || prevScore !== scoreNum || prevTime !== timeNum) {
        currentRank = idx + 1;
      }
      prevScore = scoreNum;
      prevTime = timeNum;

      const totalM = parseFloat(att.totalMarks || 100);
      const pct = att.percentage ? parseFloat(att.percentage) : (totalM > 0 ? Math.round((scoreNum / totalM) * 10000) / 100 : 0);

      const mins = Math.floor(timeNum / 60);
      const secs = timeNum % 60;
      const formattedTime = mins === 0 ? `${secs} sec` : `${mins} min ${secs} sec`;

      return {
        rank: currentRank,
        id: att.id,
        studentName: att.participant ? att.participant.name : 'Unknown',
        rollNumber: att.participant ? att.participant.rollNumber : '—',
        department: att.participant ? att.participant.department : '—',
        section: att.participant ? att.participant.section : '—',
        year: round.year,
        category: round.category,
        course: round.course,
        setNumber: round.setNumber ? `SET ${round.setNumber}` : `SET ${round.roundNumber}`,
        score: scoreNum,
        totalMarks: totalM,
        percentage: pct,
        correctCount: att.correctCount,
        incorrectCount: att.incorrectCount,
        unansweredCount: att.unansweredCount,
        startedAt: att.startedAt,
        submittedAt: att.submittedAt,
        timeTakenSeconds: timeNum,
        timeTakenFormatted: formattedTime,
        status: att.status
      };
    });

    return res.status(200).json({
      success: true,
      round: {
        id: round.id,
        title: round.title,
        category: round.category,
        course: round.course,
        year: round.year,
        setNumber: round.setNumber
      },
      totalParticipants: results.length,
      results
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRounds,
  getRoundById,
  createRound,
  updateRound,
  deleteRound,
  activateRound,
  pauseRound,
  resumeRound,
  completeRound,
  getRoundResults,
  seedDefaultDatasets
};
