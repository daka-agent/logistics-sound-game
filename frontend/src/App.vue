<template>
  <div id="app">
    <router-view />
    <Toast ref="toastRef" />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue';
import Toast from '@/components/Toast.vue';

const toastRef = ref(null);

provide('toast', toastRef);
</script>

<style>
#app {
  width: 100%;
  min-height: 100vh;
}
</style>
