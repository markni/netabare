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
</script>

<template>
  <div class="flex gap-4 text-3xl justify-end">
    <div class="flex-col flex">
      <label for="startingYear" class="text-xl">{{ texts._startingYear }}</label>
      <select class="bg-transparent w-40" id="startingYear" v-model="startingYear">
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
    <div class="flex-col flex">
      <label for="endingYear" class="text-xl">{{ texts._endingYear }}</label>
      <select class="bg-transparent w-40" id="endingYear" v-model="endingYear">
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
    <div class="flex-col flex">
      <label for="minScore" class="text-xl">{{ texts._minScore }}</label>
      <select class="bg-transparent w-40" id="minScore" v-model="minScore">
        <option class="bg-paper dark:bg-paper-dark" v-for="n in 11" :key="n - 1" :value="n - 1">
          {{ n - 1 }}
        </option>
      </select>
    </div>
    <div class="flex-col flex">
      <label for="maxScore" class="text-xl">{{ texts._maxScore }}</label>
      <select class="bg-transparent w-40" id="maxScore" v-model="maxScore">
        <option class="bg-paper dark:bg-paper-dark" v-for="n in 11" :key="n - 1" :value="n - 1">
          {{ n - 1 }}
        </option>
      </select>
    </div>
  </div>

  <div v-if="combinedData.historyData" class="aspect-square sm:aspect-[16/12] pt-14">
    <HistoryChart
      :yearly-data="combinedData.yearlyData"
      :historyData="combinedData.historyData"
      :dic="dic"
    />
  </div>
</template>

<style scoped></style>
