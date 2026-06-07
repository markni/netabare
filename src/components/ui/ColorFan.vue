<template>
  <figure class="h-full w-full">
    <svg
      class="h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      role="img"
      aria-label="Ten color fan"
    >
      <g
        v-for="(slice, index) in slices"
        :key="`${slice.color}-${index}`"
        class="color-fan__blade"
        :class="{ 'color-fan__blade--animated': animated }"
        :style="{
          '--fan-delay': `${slice.delay}ms`
        }"
      >
        <polygon :points="slice.points" :fill="slice.color" stroke="none" />
      </g>
    </svg>
  </figure>
</template>

<script setup>
import { computed } from 'vue';
import { COLORS10_VIVID } from '@/constants/colors';

const props = defineProps({
  colors: {
    type: Array,
    default: () => COLORS10_VIVID
  },
  animated: {
    type: Boolean,
    default: false
  }
});

const apex = { x: 50, y: 2 };
const startX = -18;
const endX = 118;
const seamOverlap = 0.4;
const sliceWeights = [1.28, 0.82, 1.12, 0.74, 0.92, 1.36, 0.7, 1.08, 1.22, 0.76];

const slices = computed(() => {
  const totalWidth = endX - startX;
  const totalWeight = sliceWeights.reduce((sum, weight) => sum + weight, 0);
  let cursor = startX;
  const centerIndex = (props.colors.length - 1) / 2;

  return props.colors.map((color, index) => {
    const sliceWidth = (sliceWeights[index] / totalWeight) * totalWidth;
    const left = cursor - seamOverlap;
    const right = cursor + sliceWidth + seamOverlap;
    cursor += sliceWidth;

    return {
      color,
      points: `${apex.x} ${apex.y} ${left} 100 ${right} 100`,
      delay: Math.abs(index - centerIndex) * 22
    };
  });
});
</script>

<style scoped>
.color-fan__blade {
  transform-box: view-box;
  transform-origin: 50px 2px;
  will-change: transform;
}

.color-fan__blade--animated {
  animation: fan-unfold 880ms cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: var(--fan-delay);
}

@keyframes fan-unfold {
  from {
    transform: scaleX(0.012);
  }

  to {
    transform: scaleX(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .color-fan__blade--animated {
    animation: none;
  }
}
</style>
