import api from './index';

export default {
  getQuestions(count = 10, difficulty = null) {
    const params = { count };
    if (difficulty) params.difficulty = difficulty;
    return api.get('/questions', { params });
  },
  
  getQuestionById(id) {
    return api.get(`/questions/${id}`);
  }
};
