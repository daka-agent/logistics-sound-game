import api from './index';

export default {
  recordGame(userId, score, correctRate, timeUsed, completed = true) {
    return api.post('/stats', {
      userId,
      score,
      correctRate,
      timeUsed,
      completed
    });
  },
  
  getOverview() {
    return api.get('/stats/overview');
  }
};
