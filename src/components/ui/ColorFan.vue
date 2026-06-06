<template>
  <figure class="h-full w-full">
    <svg
      class="h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      role="img"
      aria-label="Ten color fan"
    >
      <polygon
        v-for="(slice, index) in slices"
        :key="`${slice.color}-${index}`"
        :points="slice.points"
        :fill="slice.color"
        stroke="none"
      />
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

  return props.colors.map((color, index) => {
    const sliceWidth = (sliceWeights[index] / totalWeight) * totalWidth;
    const left = cursor - seamOverlap;
    const right = cursor + sliceWidth + seamOverlap;
    cursor += sliceWidth;

    return {
      color,
      points: `${apex.x} ${apex.y} ${left} 100 ${right} 100`
    };
  });
});
</script>
