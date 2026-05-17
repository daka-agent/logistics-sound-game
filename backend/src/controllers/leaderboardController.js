const leaderboardService = require('../services/leaderboardService');
const { sanitizeString } = require('../middleware/sanitize');

class LeaderboardController {
  async submitScore(req, res) {
    try {
      let { userId, nickname, score, correctRate, timeUsed } = req.body;
      
      nickname = sanitizeString(nickname);
      
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
      
      if (typeof score !== 'number' || score < 0 || score > 200) {
        return res.status(400).json({
          success: false,
          error: { code: 'INVALID_SCORE', message: '分数无效(0-200)' }
        });
      }
      
      if (typeof correctRate !== 'number' || correctRate < 0 || correctRate > 100) {
        return res.status(400).json({
          success: false,
          error: { code: 'INVALID_CORRECT_RATE', message: '正确率无效(0-100)' }
        });
      }
      
      if (typeof timeUsed !== 'number' || timeUsed < 0 || timeUsed > 3600) {
        return res.status(400).json({
          success: false,
          error: { code: 'INVALID_TIME', message: '用时无效(0-3600秒)' }
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
