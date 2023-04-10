<script lang="ts" setup>
import { useThemeStore } from '@/stores/theme';
import { ref } from 'vue';

const themeStore = useThemeStore();

const isAnimationRunning = ref<boolean>(false);
const audio = ref<HTMLAudioElement>();

function pullDown() {
  if (isAnimationRunning.value) return;

  playSound();
  isAnimationRunning.value = true;
  setTimeout(function () {
    isAnimationRunning.value = false;
    themeStore.toggleTheme();
  }, 600);
}

function playSound() {
  audio.value?.play();
}
</script>

<template>
  <div class="light-switch fixed top-0 right-[10%] flex flex-col justify-center items-center z-50">
    <div
      :class="{ 'pull-down': isAnimationRunning }"
      class="light-switch-string h-[400px] w-0.5 bg-gray-900 dark:bg-gray-50 shadow"
    ></div>
    <button
      :aria-label="`Toggle light/dark Mode (Current mode: ${themeStore.theme})`"
      class="rounded-full w-10 h-10 border-gray-900 dark:border-gray-50 border-2 cursor-pointer shadow"
      type="button"
      @click="pullDown"
    ></button>
    <audio ref="audio" :src="`/switch.mp3`" class="hidden"></audio>
  </div>
</template>

<style lang="scss" scoped>
@keyframes pullDown {
  0% {
    height: 400px;
  }
  50% {
    height: 430px;
  }
  100% {
    height: 400px;
  }
}

@keyframes clockSwing {
  0% {
    transform: rotate(1deg);
  }
  50% {
    transform: rotate(-1deg);
  }
  100% {
    transform: rotate(1deg);
  }
}

.light-switch {
  transform: translate3d(0, 0, 0);
  animation-name: clockSwing;
  animation-duration: 4s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in;
  transform-origin: top center;

  &:hover {
    animation-play-state: paused;
  }

  .pull-down {
    animation-name: pullDown;
    animation-duration: 0.5s;
    animation-iteration-count: 1;
    animation-timing-function: ease-in;
    transform-origin: top center;
  }
}
</style>
