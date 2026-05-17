const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');

router.post('/', (req, res) => leaderboardController.submitScore(req, res));
router.get('/', (req, res) => leaderboardController.getLeaderboard(req, res));
router.get('/highest/:userId', (req, res) => leaderboardController.getUserHighestScore(req, res));

module.exports = router;
