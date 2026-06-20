<script setup>
import { useSeasonStore } from '@/stores/season.js';
import { storeToRefs } from 'pinia';
import BattleChart from '@/components/charts/BattleChart.vue';
import BattleBarChart from '@/components/charts/BattleBarChart.vue';
import BattleRankChart from '@/components/charts/BattleRankChart.vue';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, watch, computed } from 'vue';
import ScoreBubbleChart from '@/components/charts/ScoreBubbleChart.vue';
import texts from '@/constants/texts';

const store = useSeasonStore();
const route = useRoute();
const router = useRouter();
const { historyData, balanceData, subjectsData, analysis } = storeToRefs(store);
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

const findBgmIdByNameCn = (nameCn) => {
  const subject = subjectsData.value.find((subject) => subject.name_cn === nameCn);
  return subject?.bgmId || null;
};

const linkSubjectNames = (text) => {
  const segments = [];
  const subjectNamePattern = /《([^》]+)》/g;
  let lastIndex = 0;
  let match;

  while ((match = subjectNamePattern.exec(text)) !== null) {
    const [quotedName, nameCn] = match;
    const bgmId = findBgmIdByNameCn(nameCn);

    if (match.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, match.index), bgmId: null });
    }

    segments.push({ text: quotedName, bgmId });
    lastIndex = match.index + quotedName.length;
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), bgmId: null });
  }

  return segments.length ? segments : [{ text, bgmId: null }];
};

const splitAndLinkAnalysis = (text) => splitIntoTwoParagraphs(text).map(linkSubjectNames);

const scoreAnalysisParagraphs = computed(() => splitAndLinkAnalysis(analysis.value?.score || ''));
const rankAnalysisParagraphs = computed(() => splitAndLinkAnalysis(analysis.value?.rank || ''));
const divisiveAnalysisParagraphs = computed(() =>
  splitAndLinkAnalysis(analysis.value?.divisive || '')
);
const popularityAnalysisParagraphs = computed(() =>
  splitAndLinkAnalysis(analysis.value?.popularity || '')
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

onMounted(() => {
  fetchSeason();
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
      <div>
        <select
          class="mr-2 cursor-pointer appearance-none bg-gold text-4xl sm:text-6xl sm:font-bold"
          :value="route.params.year || new Date().getFullYear()"
          @change="handleYearChange"
          aria-label="选择年份"
        >
          <option v-for="year in years" :key="year" :value="year" class="bg-background">
            {{ year }}
          </option>
        </select>
      </div>
      <div class="flex items-baseline">
        <select
          class="mr-2 cursor-pointer appearance-none bg-transparent text-4xl sm:text-6xl sm:font-bold"
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
        <span class="mr-2 text-4xl sm:text-6xl sm:font-bold">·</span>
        <h1 class="text-4xl sm:text-6xl sm:font-bold">{{ texts._seasonBattleStatus }}</h1>
      </div>

      <h2 class="mt-4 text-3xl text-gray-400">该季度最热门的作品对比</h2>
    </div>

    <div id="season-score-comparison" class="flex min-h-[calc(100dvh-8.75rem)] flex-col gap-4">
      <h2 class="text-3xl font-bold">{{ texts._top10ScoreComparison }}</h2>
      <p class="text-gray-400">{{ texts._top10ScoreComparisonSubtitle }}</p>

      <div
        v-if="scoreAnalysisParagraphs.length"
        class="mt-3 space-y-4 text-base leading-relaxed text-gray-700 dark:text-gray-300"
      >
        <p v-for="(paragraph, index) in scoreAnalysisParagraphs" :key="`score-${index}`">
          <template v-for="(segment, segmentIndex) in paragraph" :key="segmentIndex">
            <RouterLink
              v-if="segment.bgmId"
              :to="`/subject/${segment.bgmId}`"
              class="underline underline-offset-4"
            >
              {{ segment.text }}
            </RouterLink>
            <span v-else>{{ segment.text }}</span>
          </template>
        </p>
      </div>

      <div class="bleed-left-to-container-right sm:aspect-[5/2]">
        <BattleChart
          :historyData="historyData"
          :animate-when-in-view="true"
          :use-theme-palette="true"
        />
      </div>
    </div>

    <div id="season-ranking-comparison" class="flex min-h-[calc(100dvh-8.75rem)] flex-col gap-4">
      <h2 class="text-3xl font-bold">{{ texts._top10RankingComparison }}</h2>
      <p class="text-gray-400">{{ texts._top10RankingComparisonSubtitle }}</p>
      <div
        v-if="rankAnalysisParagraphs.length"
        class="mt-3 space-y-4 text-base leading-relaxed text-gray-700 dark:text-gray-300"
      >
        <p v-for="(paragraph, index) in rankAnalysisParagraphs" :key="`rank-${index}`">
          <template v-for="(segment, segmentIndex) in paragraph" :key="segmentIndex">
            <RouterLink
              v-if="segment.bgmId"
              :to="`/subject/${segment.bgmId}`"
              class="underline underline-offset-4"
            >
              {{ segment.text }}
            </RouterLink>
            <span v-else>{{ segment.text }}</span>
          </template>
        </p>
      </div>
      <div class="bleed-right-to-container-left sm:aspect-[5/2]">
        <BattleRankChart
          :historyData="historyData"
          :animate-when-in-view="true"
          :use-theme-palette="true"
        />
      </div>
    </div>

    <div id="season-balance-chart" class="flex min-h-[calc(100dvh-8.75rem)] flex-col gap-4">
      <h2 class="text-3xl font-bold">{{ texts._balanceChart }}</h2>
      <p class="text-gray-400">{{ texts._scoreComparison }}</p>
      <div
        v-if="divisiveAnalysisParagraphs.length"
        class="mt-3 space-y-4 text-base leading-relaxed text-gray-700 dark:text-gray-300"
      >
        <p v-for="(paragraph, index) in divisiveAnalysisParagraphs" :key="`divisive-${index}`">
          <template v-for="(segment, segmentIndex) in paragraph" :key="segmentIndex">
            <RouterLink
              v-if="segment.bgmId"
              :to="`/subject/${segment.bgmId}`"
              class="underline underline-offset-4"
            >
              {{ segment.text }}
            </RouterLink>
            <span v-else>{{ segment.text }}</span>
          </template>
        </p>
      </div>
      <div class="bleed-left-to-container-right sm:aspect-[5/2]">
        <BattleBarChart :balanceData="balanceData" :animate-when-in-view="true" />
      </div>
    </div>

    <div id="season-distribution-chart" class="flex min-h-[calc(100dvh-8.75rem)] flex-col gap-4">
      <h2 class="text-3xl font-bold">{{ texts._distributionChart }}</h2>
      <p class="cursor-help text-gray-400" :title="texts._chartLegend">
        {{ texts._chartLegend }}
      </p>
      <div
        v-if="popularityAnalysisParagraphs.length"
        class="mt-3 space-y-4 text-base leading-relaxed text-gray-700 dark:text-gray-300"
      >
        <p v-for="(paragraph, index) in popularityAnalysisParagraphs" :key="`popularity-${index}`">
          <template v-for="(segment, segmentIndex) in paragraph" :key="segmentIndex">
            <RouterLink
              v-if="segment.bgmId"
              :to="`/subject/${segment.bgmId}`"
              class="underline underline-offset-4"
            >
              {{ segment.text }}
            </RouterLink>
            <span v-else>{{ segment.text }}</span>
          </template>
        </p>
      </div>
      <div class="bleed-right-to-container-left sm:aspect-[5/2]">
        <ScoreBubbleChart :subjects="subjectsData" :animate-when-in-view="true" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
