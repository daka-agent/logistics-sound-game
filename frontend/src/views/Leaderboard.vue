<template>
  <div class="leaderboard-container">
    <div class="leaderboard-content">
      <div class="header">
        <h1>🏆 排行榜</h1>
        <router-link to="/" class="back-link">← 返回首页</router-link>
      </div>
      
      <div class="tabs">
        <button 
          :class="{ active: activeTab === 'weekly' }"
          @click="activeTab = 'weekly'"
        >
          本周排行
        </button>
        <button 
          :class="{ active: activeTab === 'monthly' }"
          @click="activeTab = 'monthly'"
        >
          本月排行
        </button>
      </div>
      
      <div class="leaderboard-list">
        <div 
          v-for="item in leaderboard" 
          :key="item.rank" 
          class="leaderboard-item"
          :class="{ 
            top: item.rank <= 3,
            highlight: item.nickname === userStore.nickname 
          }"
        >
          <div class="rank">
            <span v-if="item.rank === 1">🥇</span>
            <span v-else-if="item.rank === 2">🥈</span>
            <span v-else-if="item.rank === 3">🥉</span>
            <span v-else>{{ item.rank }}</span>
          </div>
          <div class="info">
            <p class="name">{{ item.nickname }}</p>
            <p class="detail">正确率 {{ item.correctRate }}% · 用时 {{ formatTime(item.timeUsed) }}</p>
          </div>
          <div class="score">{{ item.score }}</div>
        </div>
        
        <div class="empty" v-if="leaderboard.length === 0 && !loading">
          暂无排行数据
        </div>
        
        <div class="loading" v-if="loading">
          加载中...
        </div>
      </div>
      
      <div class="overview" v-if="overview">
        <h3>游戏统计</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <p class="value">{{ overview.totalGames }}</p>
            <p class="label">总游戏次数</p>
          </div>
          <div class="stat-item">
            <p class="value">{{ overview.avgScore }}</p>
            <p class="label">平均积分</p>
          </div>
          <div class="stat-item">
            <p class="value">{{ overview.avgCorrectRate }}%</p>
            <p class="label">平均正确率</p>
          </div>
          <div class="stat-item">
            <p class="value">{{ overview.activeUsers }}</p>
            <p class="label">今日活跃</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import leaderboardApi from '@/api/leaderboard';
import statsApi from '@/api/stats';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();

const activeTab = ref('weekly');
const leaderboard = ref([]);
const overview = ref(null);
const loading = ref(false);

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

async function loadLeaderboard() {
  loading.value = true;
  try {
    const res = await leaderboardApi.getLeaderboard(activeTab.value, 20);
    leaderboard.value = res.data.leaderboard;
  } catch (error) {
    console.error('加载排行榜失败:', error);
  } finally {
    loading.value = false;
  }
}

async function loadOverview() {
  try {
    const res = await statsApi.getOverview();
    overview.value = res.data;
  } catch (error) {
    console.error('加载统计失败:', error);
  }
}

watch(activeTab, () => {
  loadLeaderboard();
});

onMounted(() => {
  loadLeaderboard();
  loadOverview();
});
</script>

<style scoped>
.leaderboard-container {
  min-height: 100vh;
  padding: 20px;
}

.leaderboard-content {
  max-width: 800px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 32px;
  color: var(--primary-color);
}

.back-link {
  color: var(--primary-color);
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tabs button {
  flex: 1;
  padding: 12px 20px;
  font-size: 16px;
  border: 2px solid var(--primary-color);
  background: white;
  color: var(--primary-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.tabs button.active {
  background: var(--primary-color);
  color: white;
}

.leaderboard-list {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.leaderboard-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  background: #f5f7fa;
}

.leaderboard-item.top {
  background: linear-gradient(135deg, #f5f7fa 0%, #e3f2fd 100%);
}

.leaderboard-item.highlight {
  border: 2px solid var(--primary-color);
}

.rank {
  font-size: 24px;
  width: 50px;
  text-align: center;
}

.info {
  flex: 1;
  margin: 0 20px;
}

.name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.detail {
  font-size: 14px;
  color: #666;
}

.score {
  font-size: 24px;
  font-weight: bold;
  color: var(--primary-color);
}

.empty, .loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.overview {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.overview h3 {
  margin-bottom: 20px;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stat-item {
  text-align: center;
}

.stat-item .value {
  font-size: 24px;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 5px;
}

.stat-item .label {
  font-size: 14px;
  color: #666;
}

@media (max-width: 600px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .header {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
