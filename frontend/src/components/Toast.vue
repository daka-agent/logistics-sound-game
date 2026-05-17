<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="visible" class="toast-container" :class="type">
        <div class="toast-content">
          <span class="toast-icon" v-if="type === 'success'">✓</span>
          <span class="toast-icon" v-else-if="type === 'error'">✗</span>
          <span class="toast-icon" v-else-if="type === 'warning'">⚠</span>
          <span class="toast-message">{{ message }}</span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';

const visible = ref(false);
const message = ref('');
const type = ref('info');

function show(msg, duration = 3000, toastType = 'info') {
  message.value = msg;
  type.value = toastType;
  visible.value = true;
  
  setTimeout(() => {
    visible.value = false;
  }, duration);
}

function success(msg, duration = 3000) {
  show(msg, duration, 'success');
}

function error(msg, duration = 3000) {
  show(msg, duration, 'error');
}

function warning(msg, duration = 3000) {
  show(msg, duration, 'warning');
}

defineExpose({ show, success, error, warning });
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideDown 0.3s ease;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toast-icon {
  font-weight: bold;
}

.toast-message {
  color: white;
  font-size: 14px;
}

.toast-container.success {
  background: #52c41a;
}

.toast-container.error {
  background: #f5222d;
}

.toast-container.warning {
  background: #faad14;
}

.toast-container.info {
  background: #1890ff;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}
</style>
