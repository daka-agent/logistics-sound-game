const questionService = require('../services/questionService');

class QuestionController {
  async getQuestions(req, res) {
    try {
      const { count = 10, difficulty } = req.query;
      const questions = questionService.getRandomQuestions(
        parseInt(count),
        difficulty ? parseInt(difficulty) : null
      );
      
      res.json({
        success: true,
        data: { questions }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: { code: 'GET_QUESTIONS_ERROR', message: error.message }
      });
    }
  }
  
  async getQuestionById(req, res) {
    try {
      const { id } = req.params;
      const question = questionService.getQuestionById(id);
      
      if (!question) {
        return res.status(404).json({
          success: false,
          error: { code: 'QUESTION_NOT_FOUND', message: '题目不存在' }
        });
      }
      
      res.json({
        success: true,
        data: question
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: { code: 'GET_QUESTION_ERROR', message: error.message }
      });
    }
  }
}

module.exports = new QuestionController();
