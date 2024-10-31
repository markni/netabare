<template>
  <div>
    <div v-if="!years.length" class="mb-5">
      <slot name="info"> </slot>
    </div>
    <div
      v-else
      class="range relative table h-[140px] w-[140px] rounded-full bg-paper dark:bg-paper-dark"
      ref="range"
      @mousedown.prevent="rangeSliderInit"
      @touchstart.prevent="rangeSliderInit"
    >
      <div class="slice left opacity-15" :style="{ backgroundColor: progressColor }">
        <div class="blocker bg-paper dark:bg-paper-dark"></div>
      </div>
      <div class="slice right opacity-15" :style="{ backgroundColor: progressColor }">
        <div class="blocker bg-paper dark:bg-paper-dark"></div>
      </div>

      <span class="info flex items-center justify-center">
        <slot name="info"> </slot>
      </span>
      <div class="dial focus:outline-none" ref="dial"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { LIGHT_GRAY } from '@/constants/colors';
const props = defineProps({
  years: {
    type: Array,
    required: true
  },
  selectedYear: {
    type: Number,
    required: true
  },
  progressColor: {
    type: String,
    default: LIGHT_GRAY // Default color for the progress
  }
});

const emit = defineEmits(['update:selectedYear']);

const canSlide = ref(false);
const range = ref(null);
const dial = ref(null);

const totalYears = computed(() => props.years.length);

// Initialize selectedYear to maxYear

function pointerEvents(e) {
  let x = 0;
  let y = 0;

  if (e.type.startsWith('touch')) {
    const touch = e.changedTouches[0];
    x = touch.pageX;
    y = touch.pageY;
  } else {
    x = e.pageX;
    y = e.pageY;
  }

  return { x, y };
}

function updateDialPosition() {
  if (!range.value || !dial.value) return;

  const index = props.years.indexOf(props.selectedYear);
  const deg = (index * 360) / (totalYears.value + 1) + 360 / (totalYears.value + 1);

  const radius = range.value.clientWidth / 2;
  const x = Math.ceil((radius - 5) * Math.sin((deg * Math.PI) / 180)) + radius;
  const y = Math.ceil((radius - 5) * -Math.cos((deg * Math.PI) / 180)) + radius;

  dial.value.style.transform = `translate(${x}px, ${y}px)`;

  const leftBlocker = range.value.querySelector('.left .blocker');
  const rightBlocker = range.value.querySelector('.right .blocker');

  if (deg <= 180) {
    rightBlocker.style.transform = `rotate(${deg}deg)`;
    leftBlocker.style.transform = 'rotate(0deg)';
  } else {
    rightBlocker.style.transform = 'rotate(180deg)';
    leftBlocker.style.transform = `rotate(${deg - 180}deg)`;
  }
}

function rangeSliderInit(e) {
  e.preventDefault();
  canSlide.value = true;

  // Add these event listeners when sliding starts
  document.addEventListener('mousemove', rangeSliderUpdate, { passive: false });
  document.addEventListener('touchmove', rangeSliderUpdate, { passive: false });
  document.addEventListener('mouseup', rangeSliderStop);
  document.addEventListener('touchend', rangeSliderStop);
}

function rangeSliderStop() {
  canSlide.value = false;

  // Remove the event listeners when sliding stops
  document.removeEventListener('mousemove', rangeSliderUpdate);
  document.removeEventListener('touchmove', rangeSliderUpdate);
  document.removeEventListener('mouseup', rangeSliderStop);
  document.removeEventListener('touchend', rangeSliderStop);
}

function rangeSliderUpdate(e) {
  if (canSlide.value) {
    e.preventDefault();

    const position = pointerEvents(e);

    const rect = range.value.getBoundingClientRect();
    const coords = {
      x: position.x - rect.left,
      y: position.y - rect.top
    };
    const radius = range.value.clientWidth / 2;
    const atan = Math.atan2(coords.x - radius, coords.y - radius);
    let deg = (-atan / (Math.PI / 180) + 180) % 360;

    const index = Math.round((deg * (totalYears.value - 1)) / 360);
    const adjustedIndex = Math.min(Math.max(index, 0), totalYears.value - 1);

    const currentIndex = props.years.indexOf(props.selectedYear);
    const nextSelectedYear = props.years[adjustedIndex];

    // Ensure the next selected year is adjacent to the current year
    if (Math.abs(adjustedIndex - currentIndex) <= 1) {
      emit('update:selectedYear', nextSelectedYear);
    }
  }
}

onMounted(() => {
  if (props.years.length) {
    updateDialPosition();
  }
});

// Watch for changes in selectedYear and emit the update
watch(
  () => props.selectedYear,
  () => {
    updateDialPosition();
  }
);

// Watch for changes in years prop
watch(
  () => props.years,
  () => {
    if (props.years.length) {
      updateDialPosition();
    }
  },
  { deep: false }
);
</script>

<style scoped>
.range .dial {
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  height: 20px;
  margin-left: -10px;
  position: absolute;
  top: -10px;
  transform: translate(47px, 10px);
  width: 20px;
  z-index: 40;
}

.range .dial:focus {
  outline: 0;
}

.range .info {
  background-color: transparent;
  border-radius: 50%;
  bottom: 10px;
  color: #333;
  cursor: default;
  left: 10px;
  position: absolute;
  right: 10px;
  text-align: center;
  top: 10px;
  user-select: none;
  text-transform: uppercase;
  z-index: 30;
}

.slice {
  border-radius: 186px 0 0 186px;
  height: 100%;
  overflow: hidden;
  position: absolute;
  user-select: none;
  width: 50%;
  z-index: 10;
}

.slice.right {
  border-radius: 0 186px 186px 0;
  right: 0;
}

.slice.right .blocker {
  left: 0;
  right: auto;
  transform-origin: 0 25%;
}

.slice .blocker {
  height: 200%;
  position: absolute;
  right: 0;
  transform-origin: 100% 25%;
  width: 200%;
}
</style>
