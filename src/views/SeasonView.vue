<script setup>
import { useSeasonStore } from '@/stores/season.js';
import { useTrendingStore } from '@/stores/trending';
import { storeToRefs } from 'pinia';
import BattleChart from '@/components/charts/BattleChart.vue';
import BattleBarChart from '@/components/charts/BattleBarChart.vue';
import BattleRankChart from '@/components/charts/BattleRankChart.vue';
import TrendingActionsDailyChart from '@/components/charts/TrendingActionsDailyChart.vue';
import HintDiv from '@/components/ui/HintDiv.vue';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, watch, computed, ref, onUnmounted } from 'vue';
import ScoreBubbleChart from '@/components/charts/ScoreBubbleChart.vue';
import texts from '@/constants/texts';

const store = useSeasonStore();
const trendingStore = useTrendingStore();
const route = useRoute();
const router = useRouter();
const { historyData, balanceData, subjectsData, analysis } = storeToRefs(store);
const { actionsDailySeries } = storeToRefs(trendingStore);
const showLabels = ref(false); // Set to false by default
const splitNearMiddleByStop = (text) => {
  const content = text.trim();
  if (!content) return { first: '', second: '' };

  const stops = [...content.matchAll(/。/g)].map((match) => match.index);
  if (!stops.length) return { first: content, second: '' };

  const middle = Math.floor(content.length / 2);
  let splitIndex = stops[0];
  let bestDistance = Math.abs(stops[0] - middle);

  for (const stopIndex of stops) {
    const distance = Math.abs(stopIndex - middle);
    if (distance < bestDistance) {
      bestDistance = distance;
      splitIndex = stopIndex;
    }
  }

  return {
    first: content.slice(0, splitIndex + 1).trim(),
    second: content.slice(splitIndex + 1).trim()
  };
};

const splitIntoTwoParagraphs = (text) => {
  const { first, second } = splitNearMiddleByStop(text);
  return [first, second].filter(Boolean);
};

const scoreAnalysisParagraphs = computed(() => splitIntoTwoParagraphs(analysis.value?.score || ''));
const rankAnalysisParagraphs = computed(() => splitIntoTwoParagraphs(analysis.value?.rank || ''));
const divisiveAnalysisParagraphs = computed(() =>
  splitIntoTwoParagraphs(analysis.value?.divisive || '')
);
const popularityAnalysisParagraphs = computed(() =>
  splitIntoTwoParagraphs(analysis.value?.popularity || '')
);

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
  trendingStore.fetchTrendingActionsDaily();
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
  <div class="@container mt-14 flex flex-col gap-[7.5rem]">
    <div id="season-header" class="flex flex-col gap-2">
      <div class="flex items-baseline">
        <select
          class="mr-2 bg-transparent text-4xl sm:text-6xl sm:font-bold"
          :value="route.params.year || new Date().getFullYear()"
          @change="handleYearChange"
          aria-label="选择年份"
        >
          <option v-for="year in years" :key="year" :value="year" class="bg-background">
            {{ year }}
          </option>
        </select>
        <select
          class="mr-2 bg-transparent text-4xl sm:text-6xl sm:font-bold"
          :value="parseInt(route.params.month) || getCurrentSeason(new Date().getMonth() + 1)"
          @change="handleSeasonChange"
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
        <h1 class="text-4xl sm:text-6xl sm:font-bold">{{ texts._seasonBattleStatus }}</h1>
      </div>

      <h2 class="text-3xl font-bold">该季度最热门的作品对比</h2>
    </div>

    <div id="season-score-comparison" class="flex flex-col gap-4">
      <HintDiv :title="texts._zoomInstruction">
        {{ texts._howToZoom }}
      </HintDiv>
      <HintDiv :title="texts._altKeyShowLabels"> {{ texts._howToShowLabels }} </HintDiv>
      <h2 class="text-2xl">{{ texts._top10ScoreComparison }}</h2>

      <div
        v-if="scoreAnalysisParagraphs.length"
        class="mt-3 space-y-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300"
      >
        <p v-for="(paragraph, index) in scoreAnalysisParagraphs" :key="`score-${index}`">
          {{ paragraph }}
        </p>
      </div>

      <div class="bleed-left-to-container-right sm:aspect-[16/10]">
        <BattleChart :historyData="historyData" :showLabels="showLabels" />
      </div>
    </div>

    <div id="season-ranking-comparison" class="flex flex-col gap-4">
      <h2 class="text-2xl">{{ texts._top10RankingComparison }}</h2>
      <div
        v-if="rankAnalysisParagraphs.length"
        class="mt-3 space-y-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300"
      >
        <p v-for="(paragraph, index) in rankAnalysisParagraphs" :key="`rank-${index}`">
          {{ paragraph }}
        </p>
      </div>
      <div class="bleed-right-to-container-left sm:aspect-[16/10]">
        <BattleRankChart :historyData="historyData" :showLabels="showLabels" />
      </div>
    </div>

    <div id="season-balance-chart" class="flex flex-col gap-4">
      <h2 class="text-2xl">{{ texts._balanceChart }}</h2>
      <p class="text-gray-400">{{ texts._scoreComparison }}</p>
      <div
        v-if="divisiveAnalysisParagraphs.length"
        class="mt-3 space-y-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300"
      >
        <p v-for="(paragraph, index) in divisiveAnalysisParagraphs" :key="`divisive-${index}`">
          {{ paragraph }}
        </p>
      </div>
      <div class="bleed-left-to-container-right sm:aspect-[10/5]">
        <BattleBarChart :balanceData="balanceData" />
      </div>
    </div>

    <div id="season-distribution-chart" class="flex flex-col gap-4">
      <h2 class="text-2xl">{{ texts._distributionChart }}</h2>
      <p class="cursor-help text-gray-400" :title="texts._chartLegend">
        {{ texts._chartLegend }}
      </p>
      <div
        v-if="popularityAnalysisParagraphs.length"
        class="mt-3 space-y-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300"
      >
        <p v-for="(paragraph, index) in popularityAnalysisParagraphs" :key="`popularity-${index}`">
          {{ paragraph }}
        </p>
      </div>
      <div class="bleed-right-to-container-left sm:aspect-[10/5]">
        <ScoreBubbleChart :subjects="subjectsData" />
      </div>
    </div>

    <div
      id="season-site-trending-actions"
      v-if="actionsDailySeries.length"
      class="flex flex-col gap-4"
    >
      <h2 class="text-right text-2xl">{{ texts._trendingActionsDaily }}</h2>
      <div class="bleed-left-to-container-right sm:aspect-[16/6]">
        <TrendingActionsDailyChart :actions-daily-series="actionsDailySeries" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
