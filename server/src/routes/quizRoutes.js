const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');
const {
  getAvailableQuizzes,
  startQuiz,
  getAttempt,
  getAttemptQuestions,
  saveAnswer,
  submitQuiz,
  getQuizResult
} = require('../controllers/quizController');
const { terminateAttemptController } = require('../controllers/securityController');

// All participant quiz routes require authentication and PARTICIPANT role
router.use(authenticate, authorizeRoles('PARTICIPANT'));

// List available active quizzes
router.get('/available', getAvailableQuizzes);

// Start or resume quiz attempt for a round
router.post('/rounds/:roundId/start', startQuiz);

// Get attempt status, metadata, and sanitized questions
router.get('/attempts/:attemptId', getAttempt);

// Get sanitized questions for an attempt
router.get('/attempts/:attemptId/questions', getAttemptQuestions);

// Save or update participant answer for a question
router.put('/attempts/:attemptId/questions/:questionId/answer', saveAnswer);

// Submit quiz attempt
router.post('/attempts/:attemptId/submit', submitQuiz);

// Security termination endpoint
router.post('/attempts/:attemptId/terminate', terminateAttemptController);

// Get quiz completion results
router.get('/attempts/:attemptId/result', getQuizResult);

module.exports = router;
