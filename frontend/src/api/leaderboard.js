import api from './index';

export default {
  submitScore(userId, nickname, score, correctRate, timeUsed) {
    return api.post('/leaderboard', {
      userId,
      nickname,
      score,
      correctRate,
      timeUsed
    });
  },
  
  getLeaderboard(type = 'weekly', limit = 10) {
    return api.get('/leaderboard', { params: { type, limit } });
  },
  
  getUserHighestScore(userId) {
    return api.get(`/leaderboard/highest/${userId}`);
  }
};
