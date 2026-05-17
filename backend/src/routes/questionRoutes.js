const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

router.get('/', (req, res) => questionController.getQuestions(req, res));
router.get('/:id', (req, res) => questionController.getQuestionById(req, res));

module.exports = router;
