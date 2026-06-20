<script setup>
import { computed } from 'vue';
import texts from '@/constants/texts';

const props = defineProps({
  years: {
    type: Array,
    required: true
  },
  selectedYear: {
    type: [Number, String],
    required: true
  },
  selectedMonth: {
    type: Number,
    required: true
  },
  availableSeasons: {
    type: Array,
    required: true
  }
});

defineEmits(['year-change', 'season-change']);

const monthLabels = {
  1: texts._winterGlyphLabel,
  4: texts._springGlyphLabel,
  7: texts._summerGlyphLabel,
  10: texts._autumnGlyphLabel
};

const monthGlyphs = {
  1: '/season-title-glyphs/winter.svg',
  4: '/season-title-glyphs/spring.svg',
  7: '/season-title-glyphs/summer.svg',
  10: '/season-title-glyphs/autumn.svg'
};

const seasonCycle = [1, 4, 7, 10];

const nextSeason = computed(() => {
  const currentIndex = seasonCycle.indexOf(props.selectedMonth);

  if (currentIndex === -1) return null;

  return seasonCycle[(currentIndex + 1) % seasonCycle.length];
});
</script>

<template>
  <div
    id="season-header"
    class="flex min-h-[calc(100dvh-13rem)] w-full flex-col items-center justify-center gap-2 border border-foreground"
  >
    <div>
      <select
        class="mr-2 cursor-pointer appearance-none bg-gold text-4xl font-bold sm:text-6xl"
        :value="selectedYear"
        @change="$emit('year-change', $event)"
        aria-label="选择年份"
      >
        <option v-for="year in years" :key="year" :value="year" class="bg-background">
          {{ year }}
        </option>
      </select>
    </div>
    <div class="relative">
      <div class="relative h-[clamp(12rem,45dvh,40rem)] w-[clamp(12rem,45dvh,40rem)]">
        <div
          v-if="nextSeason"
          class="absolute inset-0 translate-y-8 bg-red bg-center bg-no-repeat opacity-25"
          :style="{
            maskImage: `url(${monthGlyphs[nextSeason]})`,
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
            maskSize: 'contain',
            WebkitMaskImage: `url(${monthGlyphs[nextSeason]})`,
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            WebkitMaskSize: 'contain'
          }"
          aria-hidden="true"
        ></div>
        <div
          class="absolute inset-0 bg-blue bg-center bg-no-repeat"
          :style="{
            maskImage: `url(${monthGlyphs[selectedMonth]})`,
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
            maskSize: 'contain',
            WebkitMaskImage: `url(${monthGlyphs[selectedMonth]})`,
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            WebkitMaskSize: 'contain'
          }"
          aria-hidden="true"
        ></div>
      </div>
      <select
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
    <h1 class="text-4xl sm:text-6xl">{{ texts._seasonBattleStatus }}</h1>

    <h2 class="mt-4 text-xl text-gray-400">该季度最热门的作品对比</h2>
  </div>
</template>
