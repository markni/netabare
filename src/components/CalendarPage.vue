<script setup>
import { computed } from 'vue';
import MiniCalendar from '@/components/MiniCalendar.vue';

const props = defineProps({
  year: {
    type: [Number, String],
    required: true
  },
  years: {
    type: Array,
    default: () => []
  },
  selectedMonth: {
    type: Number,
    required: true
  },
  availableSeasons: {
    type: Array,
    default: () => []
  },
  monthLabels: {
    type: Object,
    required: true
  },
  glyphClass: {
    type: String,
    default: ''
  },
  glyphStyle: {
    type: Object,
    required: true
  },
  interactive: {
    type: Boolean,
    default: false
  }
});

defineEmits(['year-change', 'season-change']);

const seasonMonths = computed(() =>
  Array.from({ length: 3 }, (_, index) => ((props.selectedMonth + index - 1) % 12) + 1)
);

const tracingPaperStyle = {
  '--tracing-paper-alpha': 0.32,
  '--tracing-paper-noise': 2.5,
  '--tracing-paper-fiber': 2.5,
  '--tracing-paper-scale': '200px',
  '--tracing-paper-contrast': '3000%',
  '--tracing-paper-blend-mode': 'lighten',
  '--tracing-paper-noise-blend-mode': 'normal'
};
</script>

<template>
  <div
    data-testid="calendar-page"
    class="@container relative flex h-full w-full flex-col items-center justify-center gap-2 overflow-hidden bg-background opacity-95"
    :style="tracingPaperStyle"
  >
    <div class="tracing-paper-texture" aria-hidden="true"></div>

    <div data-testid="calendar-year">
      <select
        v-if="interactive"
        data-testid="calendar-year-select"
        class="mr-2 cursor-pointer appearance-none bg-gold text-4xl font-bold sm:text-6xl"
        :value="year"
        @change="$emit('year-change', $event)"
        aria-label="选择年份"
      >
        <option
          v-for="yearOption in years"
          :key="yearOption"
          :value="yearOption"
          class="bg-background"
        >
          {{ yearOption }}
        </option>
      </select>
      <span
        v-else
        data-testid="calendar-year-display"
        class="mr-2 bg-gold text-4xl font-bold sm:text-6xl"
      >
        {{ year }}
      </span>
    </div>

    <div
      data-testid="calendar-glyph-section"
      class="relative flex min-h-0 w-full flex-1 items-center justify-center py-6"
    >
      <div data-testid="calendar-glyph-frame" class="relative aspect-square w-[min(68cqw,38rem)]">
        <div class="absolute inset-0 h-full w-full" aria-hidden="true">
          <div
            data-testid="calendar-glyph"
            class="h-full w-full bg-center bg-no-repeat"
            :class="glyphClass"
            :style="glyphStyle"
          ></div>
        </div>
      </div>
      <select
        v-if="interactive"
        data-testid="calendar-season-select"
        class="absolute inset-0 cursor-pointer appearance-none bg-transparent text-transparent"
        :value="selectedMonth"
        @change="$emit('season-change', $event)"
        aria-label="选择季度"
      >
        <option
          v-for="season in availableSeasons"
          :key="season.month"
          :value="season.month"
          class="bg-background text-base text-foreground transition-[background-color] duration-300"
        >
          {{ monthLabels[season.month] }}
        </option>
      </select>
    </div>

    <div
      data-testid="calendar-mini-calendars"
      class="mt-8 flex w-full max-w-lg items-start justify-center gap-8 pb-8"
    >
      <MiniCalendar
        v-for="month in seasonMonths"
        :key="`${year}-${month}`"
        :year="year"
        :month="month"
      />
    </div>
  </div>
</template>

<style scoped>
.tracing-paper-texture {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
  opacity: var(--tracing-paper-alpha);
  background-image:
    linear-gradient(
      88deg,
      rgb(255 255 255 / 0.52),
      rgb(248 246 235 / 0.3) 54%,
      rgb(255 255 255 / 0.45)
    ),
    radial-gradient(ellipse at 24% 18%, rgb(255 255 255 / 0.5), transparent 34%),
    radial-gradient(ellipse at 76% 82%, rgb(230 222 190 / 0.2), transparent 38%);
  background-size:
    100% 100%,
    120% 90%,
    100% 100%;
  mix-blend-mode: var(--tracing-paper-blend-mode);
}

.tracing-paper-texture::after {
  position: absolute;
  inset: 0;
  content: '';
  opacity: var(--tracing-paper-noise);
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85 0.42' numOctaves='4' seed='11' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23paper)' opacity='0.9'/%3E%3C/svg%3E");
  background-size: var(--tracing-paper-scale) var(--tracing-paper-scale);
  filter: grayscale(1) contrast(var(--tracing-paper-contrast));
  mix-blend-mode: var(--tracing-paper-noise-blend-mode);
}

.tracing-paper-texture::before {
  position: absolute;
  inset: -8%;
  content: '';
  background-image: repeating-linear-gradient(
    96deg,
    transparent 0,
    transparent 18px,
    rgb(255 255 255 / 0.1) 19px,
    transparent 24px
  );
  filter: blur(6px) grayscale(1) contrast(var(--tracing-paper-contrast));
  opacity: var(--tracing-paper-fiber);
  transform: rotate(-2deg);
}
</style>
