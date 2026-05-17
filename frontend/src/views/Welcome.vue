<template>
  <div class="welcome-container">
    <div class="welcome-content">
      <div class="logo">
        <div class="sound-wave">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      
      <h1 class="title">物流声音猜题</h1>
      <p class="subtitle">听声音，猜物流，涨知识</p>
      
      <div class="intro" v-if="userStore.isFirstVisit">
        <p>🎮 每局10题，听声音猜物流场景</p>
        <p>✅ 答对+10分，连续答对额外+5分</p>
        <p>🏆 挑战排行榜，成为物流声音专家</p>
      </div>
      
      <div class="user-input" v-if="!userStore.nickname">
        <input 
          v-model="inputNickname" 
          placeholder="输入昵称开始游戏"
          maxlength="20"
          @keyup.enter="startGame"
        />
      </div>
      
      <button class="start-btn" @click="startGame" :disabled="!canStart">
        开始游戏
      </button>
      
      <div class="stats" v-if="userStore.highestScore > 0">
        <p>历史最高分: <span class="score">{{ userStore.highestScore }}</span></p>
      </div>
      
      <router-link to="/leaderboard" class="leaderboard-link">
        查看排行榜 →
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { useGameStore } from '@/stores/gameStore';

const router = useRouter();
const userStore = useUserStore();
const gameStore = useGameStore();

const inputNickname = ref('');

const canStart = computed(() => {
  return userStore.nickname || inputNickname.value.trim();
});

function startGame() {
  if (!userStore.nickname && inputNickname.value.trim()) {
    userStore.setNickname(inputNickname.value.trim());
  }
  
  if (!userStore.userId) {
    userStore.generateUserId();
  }
  
  router.push('/game');
}

onMounted(() => {
  userStore.loadHighestScore();
});
</script>

<style scoped>
.welcome-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.welcome-content {
  text-align: center;
  max-width: 500px;
}

.logo {
  margin-bottom: 30px;
}

.sound-wave {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 4px;
  height: 60px;
}

.sound-wave span {
  width: 8px;
  background: var(--primary-color);
  border-radius: 4px;
  animation: wave 1s ease-in-out infinite;
}

.sound-wave span:nth-child(1) { animation-delay: 0s; height: 20px; }
.sound-wave span:nth-child(2) { animation-delay: 0.1s; height: 35px; }
.sound-wave span:nth-child(3) { animation-delay: 0.2s; height: 50px; }
.sound-wave span:nth-child(4) { animation-delay: 0.3s; height: 35px; }
.sound-wave span:nth-child(5) { animation-delay: 0.4s; height: 20px; }

@keyframes wave {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.5); }
}

.title {
  font-size: 36px;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 10px;
}

.subtitle {
  font-size: 18px;
  color: #666;
  margin-bottom: 30px;
}

.intro {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  text-align: left;
}

.intro p {
  margin: 10px 0;
  font-size: 16px;
}

.user-input {
  margin-bottom: 20px;
}

.user-input input {
  width: 100%;
  max-width: 300px;
  padding: 12px 20px;
  font-size: 16px;
  border: 2px solid var(--primary-color);
  border-radius: 8px;
  outline: none;
  transition: all 0.3s;
}

.user-input input:focus {
  box-shadow: 0 0 10px rgba(0, 102, 204, 0.3);
}

.start-btn {
  width: 100%;
  max-width: 300px;
  padding: 15px 40px;
  font-size: 18px;
  font-weight: bold;
  color: white;
  background: var(--primary-color);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 20px;
}

.start-btn:hover:not(:disabled) {
  background: #0052a3;
  transform: translateY(-2px);
}

.start-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.stats {
  margin-bottom: 20px;
  color: #666;
}

.score {
  font-size: 24px;
  font-weight: bold;
  color: var(--primary-color);
}

.leaderboard-link {
  display: inline-block;
  color: var(--primary-color);
  text-decoration: none;
  font-size: 16px;
  margin-top: 10px;
}

.leaderboard-link:hover {
  text-decoration: underline;
}
</style>
