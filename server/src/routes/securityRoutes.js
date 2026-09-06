const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');
const { getAdminSecurityEvents } = require('../controllers/securityController');

// Require ADMIN authentication and role
router.use(authenticate, authorizeRoles('ADMIN'));

// GET /api/admin/security/events
router.get('/events', getAdminSecurityEvents);

module.exports = router;
