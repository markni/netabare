<script setup>
import { useHistoryStore } from '@/stores/history';
import { storeToRefs } from 'pinia';
import HistoryChart from '@/components/charts/HistoryChart.vue';
import texts from '@/constants/texts.js';
import { computed, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const store = useHistoryStore();
const { combinedData, dic, startingYear, endingYear, minScore, maxScore, filteredYearlyData } =
  storeToRefs(store);

const router = useRouter();
const route = useRoute();

store.fetchHistory();

// Generate an array of years from 1900 to the current year
const currentYear = new Date().getFullYear();
const years = [
  ...Array.from({ length: 8 }, (_, i) => 1900 + i * 10), // 1900, 1910, 1920, ..., 1970
  ...Array.from({ length: currentYear - 1979 }, (_, i) => 1980 + i) // 1980 to current year
];

// Computed properties for valid year ranges
const validStartYears = computed(() => years.filter((year) => year < endingYear.value).reverse());
const validEndYears = computed(() => years.filter((year) => year > startingYear.value).reverse());

// Computed properties for valid score ranges
const validMinScores = computed(() => Array.from({ length: maxScore.value + 1 }, (_, i) => i));
const validMaxScores = computed(() =>
  Array.from({ length: 11 - minScore.value }, (_, i) => i + minScore.value)
);

// Parse route parameters on mount
onMounted(() => {
  // Reset to store defaults
  startingYear.value = store.$state.startingYear;
  endingYear.value = store.$state.endingYear;
  minScore.value = store.$state.minScore;
  maxScore.value = store.$state.maxScore;

  if (route.params.yearRange) {
    const [startYear, endYear] = route.params.yearRange.split('-').map(Number);

    // Validate years are within valid range and in correct order
    if (years.includes(startYear) && years.includes(endYear) && startYear < endYear) {
      startingYear.value = startYear;
      endingYear.value = endYear;
    } else {
      // Invalid years - redirect to base history route
      router.replace({ name: 'history' });
    }
  }

  if (route.params.scoreRange) {
    const [minScoreVal, maxScoreVal] = route.params.scoreRange.split('-').map(Number);

    // Validate scores are within valid range and in correct order
    if (minScoreVal >= 0 && maxScoreVal <= 10 && minScoreVal < maxScoreVal) {
      minScore.value = minScoreVal;
      maxScore.value = maxScoreVal;
    } else {
      // Invalid scores - redirect to base history route
      router.replace({ name: 'history' });
    }
  }
});

// Update URL when filters change (only if values are valid)
watch(
  [startingYear, endingYear, minScore, maxScore],
  ([newStartYear, newEndYear, newMinScore, newMaxScore]) => {
    if (
      newStartYear &&
      newEndYear &&
      newStartYear < newEndYear &&
      newMinScore !== undefined &&
      newMaxScore !== undefined &&
      newMinScore < newMaxScore
    ) {
      const yearRange = `${newStartYear}-${newEndYear}`;
      const scoreRange = `${newMinScore}-${newMaxScore}`;

      router.replace({
        name: 'history-filtered',
        params: {
          yearRange,
          scoreRange
        }
      });
    } else {
      // Invalid values - reset to base route
      router.replace({ name: 'history' });
    }
  },
  { deep: false }
);

watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/history') {
      store.resetFilters();
      // Force update the refs
      startingYear.value = store.$state.startingYear;
      endingYear.value = store.$state.endingYear;
      minScore.value = store.$state.minScore;
      maxScore.value = store.$state.maxScore;
    }
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <div class="history-page">
    <div class="history-filter-bar">
      <div class="history-filter">
        <label for="startingYear" class="type-control-label">{{ texts._startingYear }}</label>
        <select id="startingYear" v-model="startingYear" class="metric-value">
          <option
            class="bg-background transition-[background-color] duration-300"
            v-for="year in validStartYears"
            :key="year"
            :value="year"
          >
            {{ year }}
          </option>
        </select>
      </div>
      <div class="history-filter">
        <label for="endingYear" class="type-control-label">{{ texts._endingYear }}</label>
        <select id="endingYear" v-model="endingYear" class="metric-value">
          <option
            class="bg-background transition-[background-color] duration-300"
            v-for="year in validEndYears"
            :key="year"
            :value="year"
          >
            {{ year }}
          </option>
        </select>
      </div>
      <div class="history-filter">
        <label for="minScore" class="type-control-label">{{ texts._minScore }}</label>
        <select id="minScore" v-model="minScore" class="metric-value">
          <option
            class="bg-background transition-[background-color] duration-300"
            v-for="score in validMinScores"
            :key="score"
            :value="score"
          >
            {{ score }}
          </option>
        </select>
      </div>
      <div class="history-filter">
        <label for="maxScore" class="type-control-label">{{ texts._maxScore }}</label>
        <select id="maxScore" v-model="maxScore" class="metric-value">
          <option
            class="bg-background transition-[background-color] duration-300"
            v-for="score in validMaxScores"
            :key="score"
            :value="score"
          >
            {{ score }}
          </option>
        </select>
      </div>
    </div>
    <div v-if="combinedData.historyData" class="bleed-both-to-viewport pt-14">
      <div class="h-[calc(100dvh-16.875rem)] min-h-80">
        <HistoryChart
          :yearly-data="combinedData.yearlyData"
          :historyData="combinedData.historyData"
          :dic="dic"
          :min-year="startingYear"
          :max-year="endingYear"
          :min-score="minScore"
          :max-score="maxScore"
          :filtered-yearly-data="filteredYearlyData"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.history-page {
  container-type: inline-size;
}

.history-filter-bar {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 1rem;
}

.history-filter {
  display: grid;
  min-width: 8rem;
  gap: 0.25rem;
}

.history-filter select {
  width: 100%;
  appearance: none;
  border: 0;
  background: transparent;
  color: var(--color-foreground);
}

.history-filter select:focus {
  outline: 0;
}
</style>
