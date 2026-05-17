<template>
  <div class="result-container">
    <div class="result-content">
      <div class="result-header">
        <h1>🎉 游戏结束</h1>
      </div>
      
      <div class="score-section">
        <div class="main-score">
          <p class="label">本次积分</p>
          <p class="value">{{ gameStore.score }}</p>
        </div>
        
        <div class="stats-grid">
          <div class="stat-item">
            <p class="stat-value">{{ Math.round(gameStore.correctRate * 100) }}%</p>
            <p class="stat-label">正确率</p>
          </div>
          <div class="stat-item">
            <p class="stat-value">{{ gameStore.correctCount }}/{{ gameStore.questions.length }}</p>
            <p class="stat-label">答对题数</p>
          </div>
          <div class="stat-item">
            <p class="stat-value">{{ formatTime(gameStore.timeUsed) }}</p>
            <p class="stat-label">用时</p>
          </div>
        </div>
        
        <div class="record-notice" v-if="isNewRecord">
          🏆 恭喜！打破个人最高分记录！
        </div>
      </div>
      
      <div class="leaderboard-section">
        <h3>本周排行榜</h3>
        <div class="leaderboard-list">
          <div 
            v-for="item in leaderboard" 
            :key="item.rank" 
            class="leaderboard-item"
            :class="{ highlight: item.nickname === userStore.nickname }"
          >
            <span class="rank">{{ item.rank }}</span>
            <span class="name">{{ item.nickname }}</span>
            <span class="lb-score">{{ item.score }}</span>
          </div>
          <div class="loading" v-if="leaderboard.length === 0">
            加载中...
          </div>
        </div>
        <router-link to="/leaderboard" class="view-all">查看完整排行榜 →</router-link>
      </div>
      
      <div class="actions">
        <button class="primary-btn" @click="playAgain">
          再玩一局
        </button>
        <button class="secondary-btn" @click="shareResult">
          分享成绩
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '@/stores/gameStore';
import { useUserStore } from '@/stores/userStore';
import leaderboardApi from '@/api/leaderboard';
import statsApi from '@/api/stats';

const router = useRouter();
const gameStore = useGameStore();
const userStore = useUserStore();

const leaderboard = ref([]);
const isNewRecord = ref(false);

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

async function submitScore() {
  try {
    const res = await leaderboardApi.submitScore(
      userStore.userId,
      userStore.nickname,
      gameStore.score,
      gameStore.correctRate,
      gameStore.timeUsed
    );
    
    if (res.data.isRecord) {
      isNewRecord.value = true;
      userStore.updateHighestScore(gameStore.score);
    }
  } catch (error) {
    console.error('提交成绩失败:', error);
  }
}

async function loadLeaderboard() {
  try {
    const res = await leaderboardApi.getLeaderboard('weekly', 5);
    leaderboard.value = res.data.leaderboard;
  } catch (error) {
    console.error('加载排行榜失败:', error);
  }
}

function playAgain() {
  gameStore.resetGame();
  router.push('/game');
}

function shareResult() {
  const text = `我在物流声音猜题获得${gameStore.score}分，正确率${Math.round(gameStore.correctRate * 100)}%！快来挑战吧！`;
  
  if (navigator.share) {
    navigator.share({
      title: '物流声音猜题',
      text: text,
      url: window.location.origin
    });
  } else {
    navigator.clipboard.writeText(text).then(() => {
      alert('成绩已复制到剪贴板！');
    });
  }
}

onMounted(async () => {
  await submitScore();
  await loadLeaderboard();
});
</script>

<style scoped>
.result-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.result-content {
  max-width: 600px;
  width: 100%;
}

.result-header {
  text-align: center;
  margin-bottom: 30px;
}

.result-header h1 {
  font-size: 32px;
  color: var(--primary-color);
}

.score-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.main-score {
  text-align: center;
  margin-bottom: 30px;
}

.main-score .label {
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
}

.main-score .value {
  font-size: 48px;
  font-weight: bold;
  color: var(--primary-color);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.record-notice {
  text-align: center;
  padding: 15px;
  background: #fff3cd;
  border-radius: 8px;
  color: #856404;
  font-weight: bold;
}

.leaderboard-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.leaderboard-section h3 {
  margin-bottom: 15px;
  color: #333;
}

.leaderboard-list {
  margin-bottom: 15px;
}

.leaderboard-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border-radius: 8px;
  margin-bottom: 8px;
  background: #f5f7fa;
}

.leaderboard-item.highlight {
  background: #e3f2fd;
  border-left: 3px solid var(--primary-color);
}

.rank {
  width: 30px;
  font-weight: bold;
  color: var(--primary-color);
}

.name {
  flex: 1;
  margin: 0 15px;
  color: #333;
}

.lb-score {
  font-weight: bold;
  color: #333;
}

.loading {
  text-align: center;
  color: #666;
  padding: 20px;
}

.view-all {
  display: block;
  text-align: center;
  color: var(--primary-color);
  text-decoration: none;
}

.view-all:hover {
  text-decoration: underline;
}

.actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.primary-btn, .secondary-btn {
  padding: 15px 30px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.primary-btn {
  background: var(--primary-color);
  color: white;
}

.primary-btn:hover {
  background: #0052a3;
}

.secondary-btn {
  background: #f5f7fa;
  color: #666;
}

.secondary-btn:hover {
  background: #e0e0e0;
}

@media (max-width: 600px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .actions {
    grid-template-columns: 1fr;
  }
}
</style>
