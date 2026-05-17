<template>
  <div class="game-container">
    <div class="game-header">
      <div class="progress-info">
        <span class="question-num">第 {{ gameStore.currentIndex + 1 }} 题 / 共 {{ gameStore.questions.length }} 题</span>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: gameStore.progress + '%' }"></div>
        </div>
      </div>
      <div class="score-display">
        积分: <span class="score">{{ gameStore.score }}</span>
      </div>
    </div>
    
    <div class="game-main" v-if="gameStore.status === 'playing'">
      <div class="audio-section">
        <div class="audio-visualizer">
          <div class="wave" :class="{ active: audioStore.isPlaying }">
            <span v-for="i in 20" :key="i"></span>
          </div>
        </div>
        
        <button class="play-btn" @click="playCurrentAudio" :disabled="audioStore.isLoading">
          <span v-if="audioStore.isLoading">加载中...</span>
          <span v-else-if="audioStore.isPlaying">播放中</span>
          <span v-else>🔊 播放声音</span>
        </button>
        
        <button class="replay-btn" @click="audioStore.replay" :disabled="!audioStore.isPlaying && !hasPlayed">
          🔄 重播
        </button>
      </div>
      
      <div class="options-section">
        <p class="options-hint">请选择这是什么声音：</p>
        <div class="options-grid">
          <button 
            v-for="(option, index) in gameStore.currentQuestion?.options" 
            :key="index"
            class="option-btn"
            :disabled="isAnswered"
            @click="selectOption(option)"
          >
            <span class="option-key">{{ index + 1 }}</span>
            <span class="option-text">{{ option }}</span>
          </button>
        </div>
        <p class="keyboard-hint">提示: 可使用键盘 1/2/3/4 快速选择</p>
      </div>
    </div>
    
    <div class="loading-state" v-else-if="gameStore.status === 'loading'">
      <div class="spinner"></div>
      <p>加载题目中...</p>
    </div>
    
    <div class="feedback-overlay" v-if="showFeedback">
      <div class="feedback-card" :class="{ correct: feedback.isCorrect, wrong: !feedback.isCorrect }">
        <div class="feedback-icon">
          {{ feedback.isCorrect ? '✅' : '❌' }}
        </div>
        <div class="feedback-text">
          {{ feedback.isCorrect ? '回答正确！' : '回答错误' }}
        </div>
        <div class="feedback-detail" v-if="!feedback.isCorrect">
          正确答案: {{ feedback.correctAnswer }}
        </div>
        <div class="feedback-desc">
          <p><strong>声音描述:</strong> {{ feedback.description }}</p>
          <p><strong>场景:</strong> {{ feedback.scene }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/stores/gameStore';
import { useAudioStore } from '@/stores/audioStore';
import { useUserStore } from '@/stores/userStore';
import statsApi from '@/api/stats';

const router = useRouter();
const gameStore = useGameStore();
const audioStore = useAudioStore();
const userStore = useUserStore();

const isAnswered = ref(false);
const hasPlayed = ref(false);
const showFeedback = ref(false);
const feedback = ref({});

async function playCurrentAudio() {
  if (!gameStore.currentQuestion) return;
  
  try {
    await audioStore.play(gameStore.currentQuestion.audioUrl);
    hasPlayed.value = true;
  } catch (error) {
    alert('音频加载失败，请检查网络连接');
  }
}

async function selectOption(option) {
  if (isAnswered.value) return;
  
  isAnswered.value = true;
  audioStore.pause();
  
  const result = await gameStore.answerQuestion(option);
  feedback.value = result;
  showFeedback.value = true;
  
  setTimeout(() => {
    showFeedback.value = false;
    isAnswered.value = false;
    hasPlayed.value = false;
    
    gameStore.nextQuestion();
    
    if (gameStore.status === 'finished') {
      finishGame();
    } else {
      playCurrentAudio();
    }
  }, 2500);
}

async function finishGame() {
  try {
    await statsApi.recordGame(
      userStore.userId,
      gameStore.score,
      gameStore.correctRate,
      gameStore.timeUsed,
      true
    );
  } catch (error) {
    console.error('记录统计失败:', error);
  }
  
  router.push('/result');
}

function handleKeydown(e) {
  if (isAnswered.value) return;
  
  const key = parseInt(e.key);
  if (key >= 1 && key <= 4) {
    const options = gameStore.currentQuestion?.options;
    if (options && options[key - 1]) {
      selectOption(options[key - 1]);
    }
  }
}

onMounted(async () => {
  window.addEventListener('keydown', handleKeydown);
  
  if (gameStore.status === 'waiting' || gameStore.questions.length === 0) {
    await gameStore.startGame();
  }
  
  if (gameStore.status === 'playing') {
    setTimeout(() => {
      playCurrentAudio();
    }, 500);
  }
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  audioStore.pause();
});
</script>

<style scoped>
.game-container {
  min-height: 100vh;
  padding: 20px;
  position: relative;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}

.progress-info {
  flex: 1;
  margin-right: 20px;
}

.question-num {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

.progress-bar {
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary-color);
  transition: width 0.3s;
}

.score-display {
  font-size: 18px;
  color: #333;
}

.score {
  font-size: 24px;
  font-weight: bold;
  color: var(--primary-color);
}

.game-main {
  max-width: 800px;
  margin: 0 auto;
}

.audio-section {
  text-align: center;
  margin-bottom: 40px;
}

.audio-visualizer {
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.wave {
  display: flex;
  align-items: center;
  gap: 3px;
}

.wave span {
  width: 6px;
  height: 30px;
  background: #ccc;
  border-radius: 3px;
  transition: all 0.2s;
}

.wave.active span {
  background: var(--primary-color);
  animation: audioWave 0.5s ease-in-out infinite alternate;
}

.wave.active span:nth-child(odd) { animation-delay: 0.1s; }
.wave.active span:nth-child(3n) { animation-delay: 0.2s; }

@keyframes audioWave {
  from { height: 20px; }
  to { height: 60px; }
}

.play-btn, .replay-btn {
  padding: 12px 30px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin: 0 10px;
  transition: all 0.3s;
}

.play-btn {
  background: var(--primary-color);
  color: white;
}

.play-btn:hover:not(:disabled) {
  background: #0052a3;
}

.replay-btn {
  background: #f5f7fa;
  color: #666;
}

.replay-btn:hover:not(:disabled) {
  background: #e0e0e0;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.options-section {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.options-hint {
  font-size: 18px;
  margin-bottom: 20px;
  text-align: center;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 15px;
}

.option-btn {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background: #f5f7fa;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: left;
}

.option-btn:hover:not(:disabled) {
  border-color: var(--primary-color);
  background: white;
}

.option-key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: var(--primary-color);
  color: white;
  border-radius: 4px;
  font-weight: bold;
  margin-right: 12px;
  flex-shrink: 0;
}

.option-text {
  font-size: 16px;
  color: #333;
}

.keyboard-hint {
  text-align: center;
  color: #999;
  font-size: 14px;
}

.loading-state {
  text-align: center;
  padding: 100px 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.feedback-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.feedback-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  text-align: center;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

.feedback-card.correct {
  border-top: 4px solid var(--success-color);
}

.feedback-card.wrong {
  border-top: 4px solid var(--error-color);
}

.feedback-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.feedback-text {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.feedback-card.correct .feedback-text {
  color: var(--success-color);
}

.feedback-card.wrong .feedback-text {
  color: var(--error-color);
}

.feedback-detail {
  color: var(--error-color);
  margin-bottom: 15px;
}

.feedback-desc {
  text-align: left;
  background: #f5f7fa;
  padding: 15px;
  border-radius: 8px;
  margin-top: 15px;
}

.feedback-desc p {
  margin: 8px 0;
  font-size: 14px;
  color: #666;
}

@media (max-width: 600px) {
  .options-grid {
    grid-template-columns: 1fr;
  }
  
  .game-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .progress-info {
    margin-right: 0;
  }
}
</style>
