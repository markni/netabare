<script setup>
import { useHistoryStore } from '@/stores/history';
import { storeToRefs } from 'pinia';
import HistoryChart from '@/components/charts/HistoryChart.vue';
import texts from '@/constants/texts.js';
import { computed } from 'vue';

const store = useHistoryStore();
const { combinedData, dic, startingYear, endingYear, minScore, maxScore } = storeToRefs(store);

store.fetchHistory();

// Generate an array of years from 1900 to the current year
const currentYear = new Date().getFullYear();
const years = [
  ...Array.from({ length: 8 }, (_, i) => 1900 + i * 10), // 1900, 1910, 1920, ..., 1970
  ...Array.from({ length: currentYear - 1979 }, (_, i) => 1980 + i) // 1980 to current year
];

// Computed properties for valid year ranges
const validStartYears = computed(() => years.filter((year) => year < endingYear.value));
const validEndYears = computed(() => years.filter((year) => year > startingYear.value));

// Computed properties for valid score ranges
const validMinScores = computed(() => Array.from({ length: maxScore.value + 1 }, (_, i) => i));
const validMaxScores = computed(() =>
  Array.from({ length: 11 - minScore.value }, (_, i) => i + minScore.value)
);
</script>

<template>
  <div class="flex justify-end gap-4 text-3xl">
    <div class="flex flex-col">
      <label for="startingYear" class="text-xl">{{ texts._startingYear }}</label>
      <select class="w-40 bg-transparent" id="startingYear" v-model="startingYear">
        <option
          class="bg-paper dark:bg-paper-dark"
          v-for="year in validStartYears"
          :key="year"
          :value="year"
        >
          {{ year }}
        </option>
      </select>
    </div>
    <div class="flex flex-col">
      <label for="endingYear" class="text-xl">{{ texts._endingYear }}</label>
      <select class="w-40 bg-transparent" id="endingYear" v-model="endingYear">
        <option
          class="bg-paper dark:bg-paper-dark"
          v-for="year in validEndYears"
          :key="year"
          :value="year"
        >
          {{ year }}
        </option>
      </select>
    </div>
    <div class="flex flex-col">
      <label for="minScore" class="text-xl">{{ texts._minScore }}</label>
      <select class="w-40 bg-transparent" id="minScore" v-model="minScore">
        <option
          class="bg-paper dark:bg-paper-dark"
          v-for="score in validMinScores"
          :key="score"
          :value="score"
        >
          {{ score }}
        </option>
      </select>
    </div>
    <div class="flex flex-col">
      <label for="maxScore" class="text-xl">{{ texts._maxScore }}</label>
      <select class="w-40 bg-transparent" id="maxScore" v-model="maxScore">
        <option
          class="bg-paper dark:bg-paper-dark"
          v-for="score in validMaxScores"
          :key="score"
          :value="score"
        >
          {{ score }}
        </option>
      </select>
    </div>
  </div>

  <div v-if="combinedData.historyData" class="aspect-square pt-14 sm:aspect-[16/12]">
    <HistoryChart
      :yearly-data="combinedData.yearlyData"
      :historyData="combinedData.historyData"
      :dic="dic"
      :min-year="startingYear"
      :max-year="endingYear"
      :min-score="minScore"
      :max-score="maxScore"
    />
  </div>
</template>

<style scoped></style>
