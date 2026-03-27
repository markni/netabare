<template>
  <div :class="containerClass">
    <button
      @click="handleClick"
      :disabled="!interactive"
      class="narrow-long-shadow relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full"
      :style="{ backgroundColor: lightThemeColor }"
    >
      <div
        class="absolute inset-0 rounded-full transition-transform duration-300"
        :style="{
          backgroundColor: darkThemeColor,
          transform: `translateX(${effectiveTranslateX}px)`
        }"
      ></div>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useThemeStore } from '../stores/theme';

const themeStore = useThemeStore();

const props = defineProps({
  layers: {
    type: Number,
    default: 25
  },
  step: {
    type: Number,
    default: 8.3
  },
  layerSpacing: {
    type: Number,
    default: null
  },
  brightStep: {
    type: Number,
    default: 1.2
  },
  brightLayerSpacing: {
    type: Number,
    default: null
  },
  opacity: {
    type: Number,
    default: 0.2
  },
  brightLayers: {
    type: Number,
    default: 1
  },
  brightOpacity: {
    type: Number,
    default: 1
  },
  tightness: {
    type: Number,
    default: 4
  },
  shadowFade: {
    type: Number,
    default: null
  },
  blur: {
    type: Number,
    default: null
  },
  blurGrowth: {
    type: Number,
    default: null
  },
  blurFactor: {
    type: Number,
    default: null
  },
  color: {
    type: String,
    default: '255, 255, 255'
  },
  lightShadowHue: {
    type: Number,
    default: -1
  },
  lightThemeColor: {
    type: String,
    default: '#fafaf9'
  },
  darkThemeColor: {
    type: String,
    default: '#171717'
  },
  travelDistance: {
    type: Number,
    default: 1
  },
  openOffset: {
    type: Number,
    default: 37
  },
  mode: {
    type: String,
    default: null,
    validator: (value) => value === null || ['dark', 'light'].includes(value)
  },
  interactive: {
    type: Boolean,
    default: true
  }
});

function generateShadow(config) {
  const shadow = [];
  const shadowColor = resolveShadowColor(config);
  const layerSpacing = resolveLayerSpacing(config);
  const brightLayerSpacing = resolveBrightLayerSpacing(config);
  const shadowFade = resolveShadowFade(config);
  const blur = resolveBlur(config);
  const blurGrowth = resolveBlurGrowth(config);
  for (let i = 1; i <= config.layers; i++) {
    let layerOffset;
    if (i <= config.brightLayers) {
      layerOffset = i * brightLayerSpacing;
    } else {
      layerOffset =
        config.brightLayers * brightLayerSpacing + (i - config.brightLayers) * layerSpacing;
    }
    const layerBlur = blur + layerOffset * blurGrowth;

    let alpha;
    if (i <= config.brightLayers) {
      alpha =
        config.brightOpacity *
        Math.pow((config.brightLayers - i + 1) / config.brightLayers, shadowFade);
    } else {
      alpha =
        config.opacity *
        Math.pow((config.layers - i + 1) / (config.layers - config.brightLayers), shadowFade);
    }

    shadow.push(`-${layerOffset}px ${layerOffset}px ${layerBlur}px rgba(${shadowColor}, ${alpha})`);
  }
  return shadow.join(', ');
}

function resolveLayerSpacing(config) {
  return config.layerSpacing ?? config.step;
}

function resolveBrightLayerSpacing(config) {
  return config.brightLayerSpacing ?? config.brightStep;
}

function resolveShadowFade(config) {
  return config.shadowFade ?? config.tightness;
}

function resolveBlur(config) {
  if (config.blur !== null) {
    return config.blur;
  }
  if (config.blurFactor !== null && config.blurGrowth !== null) {
    return config.blurFactor;
  }
  return 0;
}

function resolveBlurGrowth(config) {
  if (config.blurGrowth !== null) {
    return config.blurGrowth;
  }
  if (config.blurFactor !== null) {
    return config.blurFactor;
  }
  return 1.16;
}

function resolveShadowColor(config) {
  if (config.lightShadowHue < 0) {
    return config.color;
  }
  return hslToRgb(config.lightShadowHue, 90, 95);
}

function hslToRgb(h, s, l) {
  const hue = ((h % 360) + 360) % 360;
  const sat = s / 100;
  const light = l / 100;
  const c = (1 - Math.abs(2 * light - 1)) * sat;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = light - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (hue < 60) {
    r = c;
    g = x;
  } else if (hue < 120) {
    r = x;
    g = c;
  } else if (hue < 180) {
    g = c;
    b = x;
  } else if (hue < 240) {
    g = x;
    b = c;
  } else if (hue < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  return `${Math.round((r + m) * 255)}, ${Math.round((g + m) * 255)}, ${Math.round((b + m) * 255)}`;
}

const narrowLongShadow = computed(() => generateShadow(props));
const effectiveMode = computed(() => props.mode ?? (themeStore.isDarkMode ? 'dark' : 'light'));
const effectiveTranslateX = computed(() =>
  effectiveMode.value === 'dark' ? props.travelDistance : props.openOffset
);
const containerClass = computed(() =>
  props.interactive
    ? 'px-1 py-2 opacity-5 transition-opacity duration-[10000ms] hover:opacity-100 hover:duration-500 sm:px-8 sm:py-4'
    : 'px-1 py-2 opacity-100 sm:px-8 sm:py-4'
);

function handleClick() {
  if (!props.interactive) {
    return;
  }
  themeStore.toggleDarkMode();
}
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
