<template>
  <div
    class="px-1 py-2 opacity-5 transition-opacity duration-[10000ms] hover:opacity-100 hover:duration-500 sm:px-8 sm:py-4"
  >
    <button
      @click="themeStore.toggleDarkMode"
      class="narrow-long-shadow relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-paper"
    >
      <!-- Adjusted round div clipped inside the button -->
      <div
        class="absolute inset-0 translate-x-[37px] rounded-full bg-paper-dark transition-transform duration-300 dark:translate-x-[1px]"
      ></div>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useThemeStore } from '../stores/theme';

const themeStore = useThemeStore();

const shadowConfig = {
  layers: 25,
  step: 8.3,
  brightStep: 1.2,
  opacity: 0.2,
  brightLayers: 1,
  brightOpacity: 1,
  tightness: 4,
  blurFactor: 1.16,
  color: '255, 255, 255'
};

function generateShadow(config) {
  let shadow = [];
  for (let i = 1; i <= config.layers; i++) {
    let spread, blur;
    if (i <= config.brightLayers) {
      spread = i * config.brightStep;
    } else {
      spread = config.brightLayers * config.brightStep + (i - config.brightLayers) * config.step;
    }
    blur = spread * config.blurFactor;

    let alpha;
    if (i <= config.brightLayers) {
      alpha =
        config.brightOpacity *
        Math.pow((config.brightLayers - i + 1) / config.brightLayers, config.tightness);
    } else {
      alpha =
        config.opacity *
        Math.pow((config.layers - i + 1) / (config.layers - config.brightLayers), config.tightness);
    }

    shadow.push(`-${spread}px ${spread}px ${blur}px rgba(${config.color}, ${alpha.toFixed(3)})`);
  }
  return shadow.join(', ');
}

const narrowLongShadow = ref(generateShadow(shadowConfig));
</script>

<style scoped>
.narrow-long-shadow {
  box-shadow: v-bind(narrowLongShadow);
}

.theme-toggle-transition {
  transition: opacity 10s;
}

.theme-toggle-transition:hover {
  transition: opacity 0.1s;
}
</style>
