const fs = require('fs');
const path = require('path');
const fisherYatesShuffle = require('../utils/fisherYatesShuffle');

class QuestionService {
  constructor() {
    this.questionsPath = path.join(__dirname, '../../data/questions.json');
    this.questions = this.loadQuestions();
  }
  
  loadQuestions() {
    try {
      const data = fs.readFileSync(this.questionsPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('加载题目数据失败:', error);
      return [];
    }
  }
  
  getRandomQuestions(count = 10, difficulty = null) {
    let filtered = this.questions;
    
    if (difficulty) {
      filtered = this.questions.filter(q => q.difficulty === difficulty);
    }
    
    const shuffled = fisherYatesShuffle(filtered);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));
    
    return selected.map(q => ({
      id: q.id,
      audioUrl: q.audio_url,
      options: fisherYatesShuffle(q.options),
      difficulty: q.difficulty,
      category: q.category
    }));
  }
  
  getQuestionById(id) {
    const question = this.questions.find(q => q.id === id);
    if (!question) {
      return null;
    }
    
    return {
      id: question.id,
      audioUrl: question.audio_url,
      correctAnswer: question.correct_answer,
      options: question.options,
      description: question.description,
      scene: question.scene,
      difficulty: question.difficulty,
      category: question.category
    };
  }
}

module.exports = new QuestionService();
