<script setup>
import { useSnackbarStore } from '@/stores/snackbar'

const snackbar = useSnackbarStore()
</script>

<template>
  <transition name="snackbar">
    <div
      v-if="snackbar.visible"
      class="snackbar"
      :class="snackbar.type"
      @click="snackbar.hide"
    >
      {{ snackbar.message }}
    </div>
  </transition>
</template>

<style scoped>
.snackbar {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 12px;
  color: white;
  cursor: pointer;
  z-index: 9999;
  min-width: 250px;
  max-width: 90%;
  text-align: center;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
  font-weight: 600;
}

@media (max-width: 576px) {
  .snackbar {
    bottom: 12px;
    width: 95%;
    min-width: unset;
    border-radius: 8px;
    padding: 16px;
  }
}

.info { background: var(--primary-color); }
.success { background: var(--success-color); }
.error { background: var(--danger-color); }
.warning { background: var(--warning-color); }

.snackbar-enter-active,
.snackbar-leave-active {
  transition: all 0.3s ease;
}

.snackbar-enter-from,
.snackbar-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}
</style>
