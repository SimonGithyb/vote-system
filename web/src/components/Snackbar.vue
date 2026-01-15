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
  border-radius: 6px;
  color: white;
  cursor: pointer;
  z-index: 9999;
  min-width: 200px;
  text-align: center;
}

.info { background: #2196f3; }
.success { background: #4caf50; }
.error { background: #f44336; }
.warning { background: #ff9800; }

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
