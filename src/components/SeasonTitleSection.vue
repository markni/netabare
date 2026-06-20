<script setup>
import { computed } from 'vue';
import CalendarPage from '@/components/CalendarPage.vue';
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

const seasonCycle = [4, 7, 10, 1];

const nextSeason = computed(() => {
  const currentIndex = seasonCycle.indexOf(props.selectedMonth);

  if (currentIndex === -1) return null;

  return seasonCycle[(currentIndex + 1) % seasonCycle.length];
});

const nextSeasonYear = computed(() => {
  const currentIndex = seasonCycle.indexOf(props.selectedMonth);
  if (currentIndex === -1) return props.selectedYear;

  const year = Number(props.selectedYear);
  if (!Number.isFinite(year)) return props.selectedYear;

  return currentIndex === seasonCycle.length - 1 ? year + 1 : year;
});

const glyphMaskStyle = (glyph) => ({
  maskImage: `url(${glyph})`,
  maskRepeat: 'no-repeat',
  maskPosition: 'center',
  maskSize: 'contain',
  WebkitMaskImage: `url(${glyph})`,
  WebkitMaskRepeat: 'no-repeat',
  WebkitMaskPosition: 'center',
  WebkitMaskSize: 'contain'
});
</script>

<template>
  <div
    id="season-header"
    class="relative min-h-[calc(100dvh-13rem)] w-full overflow-hidden border border-foreground"
  >
    <div
      class="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
      data-layer="back"
    >
      <CalendarPage
        v-if="nextSeason"
        :year="nextSeasonYear"
        :selected-month="nextSeason"
        :month-labels="monthLabels"
        :glyph-class="'bg-red opacity-95'"
        :glyph-style="glyphMaskStyle(monthGlyphs[nextSeason])"
      />
    </div>

    <div class="absolute inset-0 h-full w-full bg-background opacity-95" data-layer="front">
      <CalendarPage
        :year="selectedYear"
        :years="years"
        :selected-month="selectedMonth"
        :available-seasons="availableSeasons"
        :month-labels="monthLabels"
        :glyph-class="'bg-blue'"
        :glyph-style="glyphMaskStyle(monthGlyphs[selectedMonth])"
        interactive
        @year-change="$emit('year-change', $event)"
        @season-change="$emit('season-change', $event)"
      />
    </div>
  </div>
</template>
