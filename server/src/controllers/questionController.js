const Question = require('../models/Question');
const QuizRound = require('../models/QuizRound');
const { sequelize } = require('../config/database');

// GET /api/rounds/:roundId/questions — Get all questions for a round
const getQuestionsForRound = async (req, res, next) => {
  try {
    const { roundId } = req.params;

    const round = await QuizRound.findByPk(roundId);
    if (!round) {
      return res.status(404).json({ success: false, message: 'Quiz round not found.' });
    }

    const questions = await Question.findAll({
      where: { roundId },
      order: [
        ['questionOrder', 'ASC'],
        ['createdAt', 'ASC']
      ]
    });

    const totalQuestions = questions.length;
    const activeQuestions = questions.filter((q) => q.isActive).length;

    return res.status(200).json({
      success: true,
      round: {
        id: round.id,
        title: round.title,
        roundNumber: round.roundNumber,
        status: round.status
      },
      totalQuestions,
      activeQuestions,
      questions
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/questions/:id — Get single question details
const getQuestionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const question = await Question.findByPk(id, {
      include: [{ model: QuizRound, as: 'round', attributes: ['id', 'title', 'roundNumber', 'status'] }]
    });

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }

    return res.status(200).json({
      success: true,
      question
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/rounds/:roundId/questions — Create a question
const createQuestion = async (req, res, next) => {
  try {
    const { roundId } = req.params;
    const {
      questionText,
      optionA,
      optionB,
      optionC,
      optionD,
      correctOption,
      marks,
      negativeMarks,
      explanation,
      imageUrl,
      questionOrder,
      isActive
    } = req.body;

    // 1. Verify Quiz Round exists
    const round = await QuizRound.findByPk(roundId);
    if (!round) {
      return res.status(404).json({ success: false, message: 'Quiz round not found.' });
    }

    // 2. Strict Live Round Rule: Allow creation ONLY if round status is DRAFT
    if (round.status !== 'DRAFT') {
      return res.status(409).json({
        success: false,
        message: `Questions cannot be added to a round in '${round.status}' status. Round must be in DRAFT state.`
      });
    }

    // 3. Validation
    if (!questionText || typeof questionText !== 'string' || !questionText.trim()) {
      return res.status(400).json({ success: false, message: 'Question text is required.' });
    }

    if (!optionA || !optionA.trim() || !optionB || !optionB.trim() || !optionC || !optionC.trim() || !optionD || !optionD.trim()) {
      return res.status(400).json({ success: false, message: 'All four options (A, B, C, D) are required.' });
    }

    const upperCorrect = correctOption ? String(correctOption).trim().toUpperCase() : '';
    if (!['A', 'B', 'C', 'D'].includes(upperCorrect)) {
      return res.status(400).json({ success: false, message: 'Correct option must be one of A, B, C, or D.' });
    }

    const parsedMarks = parseFloat(marks);
    if (isNaN(parsedMarks) || parsedMarks <= 0) {
      return res.status(400).json({ success: false, message: 'Marks must be greater than zero.' });
    }

    const parsedNegMarks = negativeMarks !== undefined ? parseFloat(negativeMarks) : 0.0;
    if (isNaN(parsedNegMarks) || parsedNegMarks < 0) {
      return res.status(400).json({ success: false, message: 'Negative marks cannot be negative.' });
    }

    // Determine questionOrder
    let finalOrder = parseInt(questionOrder, 10);
    if (isNaN(finalOrder) || finalOrder < 1) {
      const maxOrderQuestion = await Question.findOne({
        where: { roundId },
        order: [['questionOrder', 'DESC']]
      });
      finalOrder = maxOrderQuestion ? maxOrderQuestion.questionOrder + 1 : 1;
    }

    // Check duplicate order
    const existingOrder = await Question.findOne({
      where: { roundId, questionOrder: finalOrder }
    });

    if (existingOrder) {
      // Auto increment max order if conflict occurs
      const maxQ = await Question.findOne({
        where: { roundId },
        order: [['questionOrder', 'DESC']]
      });
      finalOrder = maxQ ? maxQ.questionOrder + 1 : 1;
    }

    const question = await Question.create({
      roundId,
      questionText: questionText.trim(),
      optionA: optionA.trim(),
      optionB: optionB.trim(),
      optionC: optionC.trim(),
      optionD: optionD.trim(),
      correctOption: upperCorrect,
      marks: parsedMarks,
      negativeMarks: parsedNegMarks,
      explanation: explanation ? explanation.trim() : null,
      imageUrl: imageUrl ? imageUrl.trim() : null,
      questionOrder: finalOrder,
      isActive: isActive !== undefined ? Boolean(isActive) : true
    });

    return res.status(201).json({
      success: true,
      message: 'Question created successfully',
      question
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'A question with this order number already exists in this round.'
      });
    }
    next(error);
  }
};

// PUT /api/questions/:id — Update question
const updateQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      questionText,
      optionA,
      optionB,
      optionC,
      optionD,
      correctOption,
      marks,
      negativeMarks,
      explanation,
      imageUrl,
      questionOrder,
      isActive
    } = req.body;

    const question = await Question.findByPk(id, {
      include: [{ model: QuizRound, as: 'round' }]
    });

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }

    // 1. Strict Live Round Rule: Allow modifications ONLY if round status is DRAFT
    if (question.round && question.round.status !== 'DRAFT') {
      return res.status(409).json({
        success: false,
        message: `Questions cannot be modified after the quiz round has started. Round status: ${question.round.status}`
      });
    }

    if (questionText && typeof questionText === 'string' && questionText.trim()) {
      question.questionText = questionText.trim();
    }

    if (optionA !== undefined) question.optionA = optionA.trim();
    if (optionB !== undefined) question.optionB = optionB.trim();
    if (optionC !== undefined) question.optionC = optionC.trim();
    if (optionD !== undefined) question.optionD = optionD.trim();

    if (correctOption !== undefined) {
      const upperCorrect = String(correctOption).trim().toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(upperCorrect)) {
        question.correctOption = upperCorrect;
      }
    }

    if (marks !== undefined) {
      const parsedMarks = parseFloat(marks);
      if (!isNaN(parsedMarks) && parsedMarks > 0) {
        question.marks = parsedMarks;
      }
    }

    if (negativeMarks !== undefined) {
      const parsedNeg = parseFloat(negativeMarks);
      if (!isNaN(parsedNeg) && parsedNeg >= 0) {
        question.negativeMarks = parsedNeg;
      }
    }

    if (explanation !== undefined) question.explanation = explanation ? explanation.trim() : null;
    if (imageUrl !== undefined) question.imageUrl = imageUrl ? imageUrl.trim() : null;
    if (isActive !== undefined) question.isActive = Boolean(isActive);

    if (questionOrder !== undefined) {
      const parsedOrder = parseInt(questionOrder, 10);
      if (!isNaN(parsedOrder) && parsedOrder > 0) {
        question.questionOrder = parsedOrder;
      }
    }

    await question.save();

    return res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      question
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/questions/:id — Delete question
const deleteQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const question = await Question.findByPk(id, {
      include: [{ model: QuizRound, as: 'round' }]
    });

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }

    // 1. Strict Live Round Rule: Allow deletion ONLY if round status is DRAFT
    if (question.round && question.round.status !== 'DRAFT') {
      return res.status(409).json({
        success: false,
        message: `Questions cannot be deleted after the quiz round has started. Round status: ${question.round.status}`
      });
    }

    await question.destroy();

    return res.status(200).json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/questions/:id/status — Toggle isActive status
const toggleQuestionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const question = await Question.findByPk(id, {
      include: [{ model: QuizRound, as: 'round' }]
    });

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }

    if (question.round && question.round.status !== 'DRAFT') {
      return res.status(409).json({
        success: false,
        message: `Question active status cannot be toggled because the round is in '${question.round.status}' status.`
      });
    }

    question.isActive = isActive !== undefined ? Boolean(isActive) : !question.isActive;
    await question.save();

    return res.status(200).json({
      success: true,
      message: `Question status set to ${question.isActive ? 'ACTIVE' : 'INACTIVE'}`,
      question
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/rounds/:roundId/questions/reorder — Bulk reorder questions
const reorderQuestions = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { roundId } = req.params;
    const { orders } = req.body; // Array of { id, questionOrder }

    if (!Array.isArray(orders) || orders.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Reorder payload must be a non-empty array.' });
    }

    const round = await QuizRound.findByPk(roundId, { transaction });
    if (!round) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Quiz round not found.' });
    }

    if (round.status !== 'DRAFT') {
      await transaction.rollback();
      return res.status(409).json({
        success: false,
        message: `Questions cannot be reordered because the round is in '${round.status}' status.`
      });
    }

    // Step A: Temporarily clear order numbers to avoid unique constraint collisions during batch update
    const questionIds = orders.map((o) => o.id);
    await Question.update(
      { questionOrder: sequelize.literal('questionOrder + 10000') },
      { where: { roundId, id: questionIds }, transaction }
    );

    // Step B: Apply new order numbers
    for (const item of orders) {
      if (item.id && typeof item.questionOrder === 'number') {
        await Question.update(
          { questionOrder: item.questionOrder },
          { where: { id: item.id, roundId }, transaction }
        );
      }
    }

    await transaction.commit();

    const updatedQuestions = await Question.findAll({
      where: { roundId },
      order: [['questionOrder', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      message: 'Questions reordered successfully',
      questions: updatedQuestions
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

module.exports = {
  getQuestionsForRound,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  toggleQuestionStatus,
  reorderQuestions
};
