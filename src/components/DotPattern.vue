<template>
  <div ref="containerElement" class="dot-pattern" aria-hidden="true">
    <span
      v-for="dot in dots"
      :key="dot.id"
      class="dot-pattern__dot"
      :style="{
        width: `${dot.size}px`,
        height: `${dot.size}px`,
        background: dot.background,
        opacity: dot.opacity,
        transform: `translate(${dot.x}px, ${dot.y}px)`
      }"
    ></span>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const DOT_COUNT = 3;
const DOT_SIZES = [10, 25, 180];
const BIG_DOT_SIZE = Math.max(...DOT_SIZES);
const MIN_DOT_OPACITY = 0.2;
const MAX_DOT_OPACITY = 0.5;
const MAX_PLACEMENT_ATTEMPTS = 300;
const DOT_COLORS = ['#ef4444', '#3b82f6'];

const containerElement = ref(null);
const dots = ref([]);
let resizeObserver = null;

const getRandomNumber = (min, max) => Math.random() * (max - min) + min;

const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

const getDotColors = () =>
  shuffle([...DOT_COLORS, DOT_COLORS[Math.floor(Math.random() * DOT_COLORS.length)]]);

const getRandomDotStyle = (color) => ({
  background: color,
  opacity: getRandomNumber(MIN_DOT_OPACITY, MAX_DOT_OPACITY).toFixed(2)
});

const getBigDotStyle = (color) => ({
  background: `linear-gradient(to bottom, ${color}00, ${color}33)`,
  opacity: 1
});

const getDotStyle = (color, size) =>
  size === BIG_DOT_SIZE ? getBigDotStyle(color) : getRandomDotStyle(color);

const getDotSizes = (width, height) => {
  const maxSize = Math.min(width, height);

  return shuffle(DOT_SIZES).map((size) => Math.min(size, maxSize));
};

const createCandidateDot = (id, width, height, color, size) => {
  return {
    id,
    size,
    ...getDotStyle(color, size),
    x: getRandomNumber(0, Math.max(0, width - size)),
    y: getRandomNumber(0, Math.max(0, height - size))
  };
};

const dotsOverlap = (firstDot, secondDot) => {
  const firstRadius = firstDot.size / 2;
  const secondRadius = secondDot.size / 2;
  const firstCenterX = firstDot.x + firstRadius;
  const firstCenterY = firstDot.y + firstRadius;
  const secondCenterX = secondDot.x + secondRadius;
  const secondCenterY = secondDot.y + secondRadius;
  const distance = Math.hypot(firstCenterX - secondCenterX, firstCenterY - secondCenterY);

  return distance < firstRadius + secondRadius;
};

const createFallbackDot = (id, width, height, placedDots, color, size) => {
  for (let y = 0; y <= height - size; y += size) {
    for (let x = 0; x <= width - size; x += size) {
      const candidateDot = { id, size, ...getDotStyle(color, size), x, y };

      if (!placedDots.some((dot) => dotsOverlap(dot, candidateDot))) {
        return candidateDot;
      }
    }
  }

  return null;
};

const generateDots = () => {
  const element = containerElement.value;

  if (!element) {
    return;
  }

  const { width, height } = element.getBoundingClientRect();

  if (width <= 0 || height <= 0) {
    dots.value = [];
    return;
  }

  const nextDots = [];
  const dotColors = getDotColors();
  const dotSizes = getDotSizes(width, height);

  for (let id = 0; id < DOT_COUNT; id += 1) {
    const color = dotColors[id];
    const size = dotSizes[id];
    let placedDot = null;

    for (let attempt = 0; attempt < MAX_PLACEMENT_ATTEMPTS; attempt += 1) {
      const candidateDot = createCandidateDot(id, width, height, color, size);

      if (!nextDots.some((dot) => dotsOverlap(dot, candidateDot))) {
        placedDot = candidateDot;
        break;
      }
    }

    const fallbackDot = placedDot || createFallbackDot(id, width, height, nextDots, color, size);

    if (fallbackDot) {
      nextDots.push(fallbackDot);
    }
  }

  dots.value = nextDots;
};

onMounted(() => {
  generateDots();

  resizeObserver = new ResizeObserver(generateDots);

  if (containerElement.value) {
    resizeObserver.observe(containerElement.value);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});
</script>

<style scoped>
.dot-pattern {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 40px;
  overflow: hidden;
  pointer-events: none;
}

.dot-pattern__dot {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  border-radius: 50%;
}
</style>
