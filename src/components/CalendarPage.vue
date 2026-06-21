<script setup>
import { computed } from 'vue';
import MiniCalendar from '@/components/MiniCalendar.vue';
import texts from '@/constants/texts';

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
const textureId = computed(() => `calendar-paper-${props.year}-${props.selectedMonth}`);
</script>

<template>
  <div
    data-testid="calendar-page"
    class="@container relative flex h-full w-full flex-col items-center justify-center gap-2 overflow-hidden bg-background opacity-95"
  >
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
      class="relative flex min-h-0 w-full flex-1 items-center justify-center"
    >
      <div
        data-testid="calendar-glyph-frame"
        class="relative aspect-square h-[min(100%,58cqw,32rem)] max-h-full"
      >
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

    <div data-testid="calendar-heading" class="flex flex-col items-center gap-1">
      <h1 data-testid="calendar-title" class="text-[clamp(2rem,11cqw,4.5rem)]">
        {{ texts._seasonBattleStatus }}
      </h1>
      <h2 data-testid="calendar-subtitle" class="text-xl text-gray-400">该季度最热门的作品对比</h2>
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

    <svg
      class="pointer-events-none absolute inset-0 z-20 h-full w-full opacity-80 mix-blend-soft-light dark:opacity-22 dark:mix-blend-screen"
      viewBox="0 0 640 640"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <filter
          :id="`${textureId}-cloud`"
          x="0"
          y="0"
          width="640"
          height="640"
          filterUnits="userSpaceOnUse"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.018"
            numOctaves="4"
            seed="11"
            result="noise"
          />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="
              0 0 0 0 0.48
              0 0 0 0 0.42
              0 0 0 0 0.31
              0.24 0.24 0.24 0 -0.1"
          />
        </filter>

        <filter
          :id="`${textureId}-grain`"
          x="0"
          y="0"
          width="640"
          height="640"
          filterUnits="userSpaceOnUse"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.72"
            numOctaves="3"
            seed="7"
            result="noise"
          />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="
              0 0 0 0 0.35
              0 0 0 0 0.31
              0 0 0 0 0.24
              0.28 0.28 0.28 0 -0.14"
          />
        </filter>
      </defs>

      <rect width="640" height="640" :filter="`url(#${textureId}-cloud)`" opacity="0.56" />
      <rect width="640" height="640" :filter="`url(#${textureId}-grain)`" opacity="0.72" />
    </svg>
  </div>
</template>
