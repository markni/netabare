<template>
  <div class="fixed top-16 right-32 z-45">
    <button
      @click="themeStore.toggleDarkMode"
      :class="[
        'w-12 h-12 rounded-full flex items-center justify-center overflow-hidden',
        'bg-paper',
        'narrow-long-shadow relative'
      ]"
    >
      <!-- Adjusted round div clipped inside the button -->
      <div
        class="absolute inset-0 rounded-full bg-paper-dark transition-transform duration-300 translate-x-[37px] dark:translate-x-[1px]"
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
</style>
