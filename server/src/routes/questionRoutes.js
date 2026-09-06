const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getQuestionsForRound,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  toggleQuestionStatus,
  reorderQuestions
} = require('../controllers/questionController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

// Require ADMIN authorization for all Question Management routes
router.use(authenticate);
router.use(authorizeRoles('ADMIN'));

// Round-scoped question routes
router.get('/rounds/:roundId/questions', getQuestionsForRound);
router.post('/rounds/:roundId/questions', createQuestion);
router.put('/rounds/:roundId/questions/reorder', reorderQuestions);

// Question-scoped routes
router.get('/questions/:id', getQuestionById);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);
router.patch('/questions/:id/status', toggleQuestionStatus);

module.exports = router;
