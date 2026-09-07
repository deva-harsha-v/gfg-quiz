const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/quizRoundController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

// All Quiz Round Management routes require ADMIN authorization
router.use(authenticate);
router.use(authorizeRoles('ADMIN'));

router.get('/', getRounds);
router.post('/seed-default', seedDefaultDatasets);
router.get('/:id', getRoundById);
router.get('/:id/results', getRoundResults);
router.post('/', createRound);
router.put('/:id', updateRound);
router.delete('/:id', deleteRound);

router.post('/:id/activate', activateRound);
router.post('/:id/pause', pauseRound);
router.post('/:id/resume', resumeRound);
router.post('/:id/complete', completeRound);

module.exports = router;
