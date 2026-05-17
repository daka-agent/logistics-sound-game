import { defineStore } from 'pinia';
import { ref } from 'vue';
import leaderboardApi from '@/api/leaderboard';

const USER_ID_KEY = 'logistics_game_user_id';
const NICKNAME_KEY = 'logistics_game_nickname';
const HIGHEST_KEY = 'logistics_game_highest';

export const useUserStore = defineStore('user', () => {
  const userId = ref(localStorage.getItem(USER_ID_KEY) || '');
  const nickname = ref(localStorage.getItem(NICKNAME_KEY) || '');
  const highestScore = ref(parseInt(localStorage.getItem(HIGHEST_KEY) || '0'));
  const isFirstVisit = ref(!localStorage.getItem(USER_ID_KEY));
  
  function generateUserId() {
    const id = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    userId.value = id;
    localStorage.setItem(USER_ID_KEY, id);
    isFirstVisit.value = false;
    return id;
  }
  
  function setNickname(name) {
    nickname.value = name;
    localStorage.setItem(NICKNAME_KEY, name);
  }
  
  async function updateHighestScore(newScore) {
    if (newScore > highestScore.value) {
      highestScore.value = newScore;
      localStorage.setItem(HIGHEST_KEY, newScore.toString());
      return true;
    }
    return false;
  }
  
  async function loadHighestScore() {
    if (!userId.value) return;
    try {
      const res = await leaderboardApi.getUserHighestScore(userId.value);
      if (res.data.highestScore > highestScore.value) {
        highestScore.value = res.data.highestScore;
        localStorage.setItem(HIGHEST_KEY, res.data.highestScore.toString());
      }
    } catch (error) {
      console.error('加载最高分失败:', error);
    }
  }
  
  return {
    userId,
    nickname,
    highestScore,
    isFirstVisit,
    generateUserId,
    setNickname,
    updateHighestScore,
    loadHighestScore
  };
});
