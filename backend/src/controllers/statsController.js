const statsService = require('../services/statsService');

class StatsController {
  async recordGame(req, res) {
    try {
      const { userId, score, correctRate, timeUsed, completed = true } = req.body;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          error: { code: 'INVALID_PARAMS', message: '用户ID不能为空' }
        });
      }
      
      await statsService.recordGame(userId, score, correctRate, timeUsed, completed);
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: { code: 'RECORD_GAME_ERROR', message: error.message }
      });
    }
  }
  
  async getOverview(req, res) {
    try {
      const overview = await statsService.getOverview();
      
      res.json({
        success: true,
        data: overview
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: { code: 'GET_OVERVIEW_ERROR', message: error.message }
      });
    }
  }
}

module.exports = new StatsController();
