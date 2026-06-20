<script setup>
import texts from '@/constants/texts';

defineProps({
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
</script>

<template>
  <div class="flex h-full w-full flex-col items-center justify-center gap-2">
    <div>
      <select
        v-if="interactive"
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
      <span v-else class="mr-2 bg-gold text-4xl font-bold sm:text-6xl">{{ year }}</span>
    </div>

    <div class="relative">
      <div class="relative h-[clamp(12rem,45dvh,40rem)] w-[clamp(12rem,45dvh,40rem)]">
        <div class="absolute inset-0 h-full w-full" aria-hidden="true">
          <div
            class="h-full w-full bg-center bg-no-repeat"
            :class="glyphClass"
            :style="glyphStyle"
          ></div>
        </div>
      </div>
      <select
        v-if="interactive"
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
