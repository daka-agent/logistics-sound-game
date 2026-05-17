const leaderboardService = require('../services/leaderboardService');

class LeaderboardController {
  async submitScore(req, res) {
    try {
      const { userId, nickname, score, correctRate, timeUsed } = req.body;
      
      if (!userId || !nickname || score === undefined) {
        return res.status(400).json({
          success: false,
          error: { code: 'INVALID_PARAMS', message: '参数不完整' }
        });
      }
      
      if (nickname.length > 20) {
        return res.status(400).json({
          success: false,
          error: { code: 'NICKNAME_TOO_LONG', message: '昵称过长' }
        });
      }
      
      const result = await leaderboardService.submitScore(
        userId,
        nickname,
        score,
        correctRate,
        timeUsed
      );
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: { code: 'SUBMIT_SCORE_ERROR', message: error.message }
      });
    }
  }
  
  async getLeaderboard(req, res) {
    try {
      const { type = 'weekly', limit = 10 } = req.query;
      const leaderboard = await leaderboardService.getLeaderboard(type, parseInt(limit));
      
      res.json({
        success: true,
        data: { leaderboard }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: { code: 'GET_LEADERBOARD_ERROR', message: error.message }
      });
    }
  }
  
  async getUserHighestScore(req, res) {
    try {
      const { userId } = req.params;
      const highest = await leaderboardService.getUserHighestScore(userId);
      
      res.json({
        success: true,
        data: { highestScore: highest }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: { code: 'GET_HIGHEST_ERROR', message: error.message }
      });
    }
  }
}

module.exports = new LeaderboardController();
