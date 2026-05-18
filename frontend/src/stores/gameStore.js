import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import questionApi from '@/api/question';
import leaderboardApi from '@/api/leaderboard';
import statsApi from '@/api/stats';
import questionsData from '@/data/questions.json';

const GAME_STATE_KEY = 'logistics_game_state';

export const useGameStore = defineStore('game', () => {
  const questions = ref([]);
  const currentIndex = ref(0);
  const score = ref(0);
  const correctCount = ref(0);
  const answers = ref([]);
  const startTime = ref(null);
  const status = ref('waiting');
  const consecutiveCorrect = ref(0);
  
  function saveGameState() {
    if (status.value === 'playing') {
      const state = {
        questions: questions.value,
        currentIndex: currentIndex.value,
        score: score.value,
        correctCount: correctCount.value,
        answers: answers.value,
        startTime: startTime.value,
        consecutiveCorrect: consecutiveCorrect.value,
        timestamp: Date.now()
      };
      localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
    }
  }
  
  function loadGameState() {
    const saved = localStorage.getItem(GAME_STATE_KEY);
    if (saved) {
      try {
        const state = JSON.parse(saved);
        if (state.timestamp && Date.now() - state.timestamp < 3600000) {
          questions.value = state.questions;
          currentIndex.value = state.currentIndex;
          score.value = state.score;
          correctCount.value = state.correctCount;
          answers.value = state.answers;
          startTime.value = state.startTime;
          consecutiveCorrect.value = state.consecutiveCorrect;
          status.value = 'playing';
          return true;
        }
      } catch (error) {
        console.error('加载游戏状态失败:', error);
      }
    }
    return false;
  }
  
  function clearGameState() {
    localStorage.removeItem(GAME_STATE_KEY);
  }
  
  watch([currentIndex, score, correctCount, answers], () => {
    saveGameState();
  }, { deep: true });
  
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
    const answeredCount = answers.value.length;
    if (answeredCount === 0) return 0;
    return correctCount.value / answeredCount;
  });
  
  const timeUsed = computed(() => {
    if (!startTime.value) return 0;
    return Math.floor((Date.now() - startTime.value) / 1000);
  });
  
  async function startGame() {
    try {
      status.value = 'loading';
      const shuffled = [...questionsData].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 10);
      questions.value = selected.map(q => ({
        id: q.id,
        audioUrl: q.audio_url,
        correctAnswer: q.correct_answer,
        options: q.options,
        description: q.description,
        scene: q.scene
      }));
      currentIndex.value = 0;
      score.value = 0;
      correctCount.value = 0;
      answers.value = [];
      consecutiveCorrect.value = 0;
      startTime.value = Date.now();
      status.value = 'playing';
      saveGameState();
    } catch (error) {
      console.error('开始游戏失败:', error);
      status.value = 'error';
      throw error;
    }
  }
  
  async function answerQuestion(selectedOption) {
    if (!currentQuestion.value) return;
    
    const questionId = currentQuestion.value.id;
    const correctAnswer = currentQuestion.value.correctAnswer;
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
      description: currentQuestion.value.description,
      scene: currentQuestion.value.scene
    });
    
    return {
      isCorrect,
      correctAnswer,
      description: currentQuestion.value.description,
      scene: currentQuestion.value.scene
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
    clearGameState();
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
    clearGameState();
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
    resetGame,
    loadGameState,
    clearGameState
  };
});
