const express = require('express');
const router = express.Router();
const { sequelize, testDatabaseConnection } = require('../config/database');

// GET /api/health
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "Engineers’ Day Quiz API is running",
    timestamp: new Date().toISOString()
  });
});

// GET /api/health/database
router.get('/database', async (req, res, next) => {
  try {
    await testDatabaseConnection();
    res.status(200).json({
      success: true,
      message: "Database connection successful"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
