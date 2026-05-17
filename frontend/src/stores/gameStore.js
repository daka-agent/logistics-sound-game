import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import questionApi from '@/api/question';
import leaderboardApi from '@/api/leaderboard';
import statsApi from '@/api/stats';

export const useGameStore = defineStore('game', () => {
  const questions = ref([]);
  const currentIndex = ref(0);
  const score = ref(0);
  const correctCount = ref(0);
  const answers = ref([]);
  const startTime = ref(null);
  const status = ref('waiting');
  const consecutiveCorrect = ref(0);
  
  const currentQuestion = computed(() => {
    if (questions.value.length === 0 || currentIndex.value >= questions.value.length) {
      return null;
    }
    return questions.value[currentIndex.value];
  });
  
  const progress = computed(() => {
    if (questions.value.length === 0) return 0;
    return Math.round((currentIndex.value / questions.value.length) * 100);
  });
  
  const correctRate = computed(() => {
    if (currentIndex.value === 0) return 0;
    return correctCount.value / currentIndex.value;
  });
  
  const timeUsed = computed(() => {
    if (!startTime.value) return 0;
    return Math.floor((Date.now() - startTime.value) / 1000);
  });
  
  async function startGame() {
    try {
      status.value = 'loading';
      const res = await questionApi.getQuestions(10);
      questions.value = res.data.questions;
      currentIndex.value = 0;
      score.value = 0;
      correctCount.value = 0;
      answers.value = [];
      consecutiveCorrect.value = 0;
      startTime.value = Date.now();
      status.value = 'playing';
    } catch (error) {
      console.error('开始游戏失败:', error);
      status.value = 'error';
    }
  }
  
  async function answerQuestion(selectedOption) {
    if (!currentQuestion.value) return;
    
    const questionId = currentQuestion.value.id;
    const res = await questionApi.getQuestionById(questionId);
    const correctAnswer = res.data.correctAnswer;
    const isCorrect = selectedOption === correctAnswer;
    
    if (isCorrect) {
      correctCount.value++;
      consecutiveCorrect.value++;
      const bonus = consecutiveCorrect.value > 1 ? 5 : 0;
      score.value += 10 + bonus;
    } else {
      consecutiveCorrect.value = 0;
    }
    
    answers.value.push({
      questionId,
      selectedOption,
      correctAnswer,
      isCorrect,
      description: res.data.description,
      scene: res.data.scene
    });
    
    return {
      isCorrect,
      correctAnswer,
      description: res.data.description,
      scene: res.data.scene
    };
  }
  
  function nextQuestion() {
    if (currentIndex.value < questions.value.length - 1) {
      currentIndex.value++;
    } else {
      endGame();
    }
  }
  
  async function endGame() {
    status.value = 'finished';
  }
  
  function resetGame() {
    questions.value = [];
    currentIndex.value = 0;
    score.value = 0;
    correctCount.value = 0;
    answers.value = [];
    startTime.value = null;
    status.value = 'waiting';
    consecutiveCorrect.value = 0;
  }
  
  return {
    questions,
    currentIndex,
    score,
    correctCount,
    answers,
    startTime,
    status,
    consecutiveCorrect,
    currentQuestion,
    progress,
    correctRate,
    timeUsed,
    startGame,
    answerQuestion,
    nextQuestion,
    endGame,
    resetGame
  };
});
