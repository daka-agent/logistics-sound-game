import { defineStore } from 'pinia';
import { ref } from 'vue';

const VOLUME_KEY = 'logistics_game_volume';

export const useAudioStore = defineStore('audio', () => {
  const audio = ref(null);
  const isPlaying = ref(false);
  const isLoading = ref(false);
  const volume = ref(parseFloat(localStorage.getItem(VOLUME_KEY) || '0.8'));
  let playLock = false;
  
  function initAudio() {
    if (!audio.value) {
      audio.value = new Audio();
      audio.value.volume = volume.value;
      
      audio.value.addEventListener('play', () => {
        isPlaying.value = true;
      });
      
      audio.value.addEventListener('pause', () => {
        isPlaying.value = false;
      });
      
      audio.value.addEventListener('ended', () => {
        isPlaying.value = false;
        playLock = false;
      });
      
      audio.value.addEventListener('loadstart', () => {
        isLoading.value = true;
      });
      
      audio.value.addEventListener('canplaythrough', () => {
        isLoading.value = false;
      });
    }
    return audio.value;
  }
  
  async function play(url) {
    if (playLock) {
      return;
    }
    
    playLock = true;
    const audioEl = initAudio();
    
    try {
      audioEl.pause();
      audioEl.currentTime = 0;
      isLoading.value = true;
      audioEl.src = url;
      audioEl.load();
      await audioEl.play();
    } catch (error) {
      console.error('音频播放失败:', error);
      isLoading.value = false;
      playLock = false;
      throw error;
    }
  }
  
  function pause() {
    if (audio.value) {
      audio.value.pause();
      playLock = false;
    }
  }
  
  async function replay() {
    if (audio.value) {
      audio.value.currentTime = 0;
      try {
        await audio.value.play();
      } catch (error) {
        console.error('重播失败:', error);
      }
    }
  }
  
  function setVolume(value) {
    volume.value = value;
    if (audio.value) {
      audio.value.volume = value;
    }
    localStorage.setItem(VOLUME_KEY, value.toString());
  }
  
  function preload(url) {
    const preloadAudio = new Audio();
    preloadAudio.src = url;
    preloadAudio.load();
  }
  
  function unlock() {
    playLock = false;
  }
  
  return {
    audio,
    isPlaying,
    isLoading,
    volume,
    initAudio,
    play,
    pause,
    replay,
    setVolume,
    preload,
    unlock
  };
});
