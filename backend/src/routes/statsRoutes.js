const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

router.post('/', (req, res) => statsController.recordGame(req, res));
router.get('/overview', (req, res) => statsController.getOverview(req, res));

module.exports = router;
