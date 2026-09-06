const express = require('express');
const router = express.Router();
const {
  registerParticipant,
  loginParticipant,
  examEntryParticipant,
  loginAdmin,
  getCurrentParticipant,
  getCurrentAdmin
} = require('../controllers/authController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

// Public routes
router.post('/participant/register', registerParticipant);
router.post('/participant/login', loginParticipant);
router.post('/participant/exam-entry', examEntryParticipant);
router.post('/admin/login', loginAdmin);

// Protected routes
router.get('/participant/me', authenticate, getCurrentParticipant);
router.get('/admin/me', authenticate, authorizeRoles('ADMIN'), getCurrentAdmin);

module.exports = router;
