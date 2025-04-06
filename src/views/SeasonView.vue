<script setup>
import { useSeasonStore } from '@/stores/season.js';
import { storeToRefs } from 'pinia';
import BattleChart from '@/components/charts/BattleChart.vue';
import BattleBarChart from '@/components/charts/BattleBarChart.vue';
import BattleRankChart from '@/components/charts/BattleRankChart.vue';
import HintDiv from '@/components/HintDiv.vue';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, watch, computed, ref, onUnmounted } from 'vue';
import ScoreBubbleChart from '@/components/charts/ScoreBubbleChart.vue';
import texts from '@/constants/texts';

const store = useSeasonStore();
const route = useRoute();
const router = useRouter();
const { historyData, balanceData, subjectsData } = storeToRefs(store);
const showLabels = ref(false); // Set to false by default

// Generate array of last 5 years
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

// Define seasons
const seasons = [
  { month: 1, name: texts._january },
  { month: 4, name: texts._april },
  { month: 7, name: texts._july },
  { month: 10, name: texts._october }
];

// Get current season
const getCurrentSeason = (month) => {
  if (month >= 1 && month <= 3) return 1;
  if (month >= 4 && month <= 6) return 4;
  if (month >= 7 && month <= 9) return 7;
  return 10;
};

// Get available seasons based on selected year
const availableSeasons = computed(() => {
  const selectedYear = parseInt(route.params.year) || currentYear;
  const today = new Date();

  // If selected year is current year, filter seasons
  if (selectedYear === currentYear) {
    const currentMonth = today.getMonth() + 1; // Convert to 1-based month
    return seasons.filter((season) => season.month <= getCurrentSeason(currentMonth));
  }

  // If selected year is past year, show all seasons
  if (selectedYear < currentYear) {
    return seasons;
  }

  // If somehow we got a future year, return no seasons
  return [];
});

// Toggle labels when Alt key is pressed
const handleKeyDown = (e) => {
  if (e.key === 'Alt') {
    e.preventDefault(); // Prevent default Alt behavior
    showLabels.value = !showLabels.value; // Toggle the value
  }
};

// Add and remove event listeners
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  fetchSeason();
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

// Function to fetch season subjects with optional year and month
const fetchSeason = async () => {
  const { year, month } = route.params;
  try {
    await store.fetchSeason(year, month);
  } catch (error) {
    console.error('Failed to fetch season:', error);
    // Handle error appropriately
  }
};

// Create a computed property for route parameters
const routeParams = computed(() => route.params);

// Watch for changes in the computed route parameters
watch(routeParams, () => {
  fetchSeason();
});

// Handle year change
const handleYearChange = (event) => {
  const newYear = parseInt(event.target.value);
  const currentMonth = parseInt(route.params.month) || getCurrentSeason(new Date().getMonth() + 1);

  // If switching to current year, ensure selected month is not in the future
  if (newYear === currentYear) {
    const currentSeason = getCurrentSeason(new Date().getMonth() + 1);
    const newMonth = currentMonth <= currentSeason ? currentMonth : currentSeason;
    router.push({ name: 'season', params: { year: newYear, month: newMonth } });
  } else {
    router.push({ name: 'season', params: { year: newYear, month: currentMonth } });
  }
};

// Handle season change
const handleSeasonChange = (event) => {
  const newMonth = parseInt(event.target.value);
  const currentYear = route.params.year || new Date().getFullYear();
  router.push({ name: 'season', params: { year: currentYear, month: newMonth } });
};
</script>

<template>
  <div class="mt-14 flex flex-col gap-10">
    <div class="flex items-baseline">
      <select
        class="mr-2 bg-transparent text-4xl sm:text-6xl"
        :value="route.params.year || new Date().getFullYear()"
        @change="handleYearChange"
        aria-label="选择年份"
      >
        <option v-for="year in years" :key="year" :value="year" class="bg-paper dark:bg-paper-dark">
          {{ year }}
        </option>
      </select>
      <select
        class="mr-2 bg-transparent text-4xl sm:text-6xl"
        :value="parseInt(route.params.month) || getCurrentSeason(new Date().getMonth() + 1)"
        @change="handleSeasonChange"
        aria-label="选择季度"
      >
        <option
          v-for="season in availableSeasons"
          :key="season.month"
          :value="season.month"
          class="bg-paper dark:bg-paper-dark"
        >
          {{ season.name }}
        </option>
      </select>
      <h1 class="text-4xl sm:text-6xl">{{ texts._seasonBattleStatus }}</h1>
    </div>

    <div class="flex flex-col gap-4">
      <HintDiv :title="texts._zoomInstruction">
        {{ texts._howToZoom }}
      </HintDiv>
      <HintDiv :title="texts._altKeyShowLabels"> {{ texts._howToShowLabels }} </HintDiv>
      <h2 class="text-2xl">{{ texts._top10ScoreComparison }}</h2>

      <div class="sm:aspect-[16/10]">
        <BattleChart :historyData="historyData" :showLabels="showLabels" />
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <h2 class="text-2xl">{{ texts._top10RankingComparison }}</h2>
      <div class="sm:aspect-[16/10]">
        <BattleRankChart :historyData="historyData" :showLabels="showLabels" />
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <h2 class="text-2xl">{{ texts._balanceChart }}</h2>
      <p class="text-gray-400">{{ texts._scoreComparison }}</p>
      <div class="sm:aspect-[10/5]">
        <BattleBarChart :balanceData="balanceData" />
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <h2 class="text-2xl">{{ texts._distributionChart }}</h2>
      <p class="cursor-help text-gray-400" :title="texts._chartLegend">
        {{ texts._chartLegend }}
      </p>
      <div class="sm:aspect-[10/5]">
        <ScoreBubbleChart :subjects="subjectsData" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
