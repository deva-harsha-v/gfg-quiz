const { verifyToken } = require('../utils/auth');
const Participant = require('../models/Participant');

// Middleware to authenticate JWT token
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Authorization token missing or malformed.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token.'
      });
    }

    const participant = await Participant.findByPk(decoded.id, {
      attributes: { exclude: ['passwordHash'] }
    });

    if (!participant) {
      return res.status(401).json({
        success: false,
        message: 'Authenticated participant account no longer exists.'
      });
    }

    if (!participant.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact the administrator.'
      });
    }

    req.participant = participant;
    next();
  } catch (error) {
    console.error('[Auth Middleware Error]:', error);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed.'
    });
  }
};

// Reusable middleware for role authorization (e.g. PARTICIPANT vs ADMIN)
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.participant || !roles.includes(req.participant.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to access this resource.'
      });
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorizeRoles
};
