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
  getQuizResult,
  verifyAccessCode,
  publicStartExam,
  getRankings,
  getAdminResults,
  deleteQuizAttemptAdmin
} = require('../controllers/quizController');
const { terminateAttemptController } = require('../controllers/securityController');

// 1. PUBLIC UNAUTHENTICATED ROUTES (For Student Exam Entry & Rankings without pre-registration)
router.post('/public-start', publicStartExam);
router.post('/verify-access-code', verifyAccessCode);
router.get('/rankings', getRankings);

// 2. PROTECTED ADMIN ROUTES
router.get('/admin/results', authenticate, authorizeRoles('ADMIN'), getAdminResults);
router.delete('/admin/attempts/:id', authenticate, authorizeRoles('ADMIN'), deleteQuizAttemptAdmin);

// 3. PROTECTED PARTICIPANT ROUTES (Require authentication token)
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
