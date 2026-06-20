<script setup>
import texts from '@/constants/texts';

defineProps({
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
</script>

<template>
  <div
    id="season-header"
    class="mx-auto flex min-h-[calc(100dvh-13rem)] w-fit flex-col justify-center gap-2"
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
    <div class="flex items-baseline">
      <select
        class="mr-2 cursor-pointer appearance-none bg-transparent text-4xl sm:text-6xl"
        :value="selectedMonth"
        @change="$emit('season-change', $event)"
        aria-label="选择季度"
      >
        <option
          v-for="season in availableSeasons"
          :key="season.month"
          :value="season.month"
          class="bg-background transition-[background-color] duration-300"
        >
          {{ season.name }}
        </option>
      </select>
      <span class="mr-2 text-4xl sm:text-6xl">·</span>
      <h1 class="text-4xl sm:text-6xl">{{ texts._seasonBattleStatus }}</h1>
    </div>

    <h2 class="mt-4 text-xl text-gray-400">该季度最热门的作品对比</h2>
  </div>
</template>
