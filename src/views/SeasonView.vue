<script setup>
import { useSeasonStore } from '@/stores/season.js';
import { storeToRefs } from 'pinia';
import BattleChart from '@/components/charts/BattleChart.vue';
import BattleBarChart from '@/components/charts/BattleBarChart.vue';
import BattleRankChart from '@/components/charts/BattleRankChart.vue';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, watch, computed } from 'vue';
import ScoreBubbleChart from '@/components/charts/ScoreBubbleChart.vue';
import SeasonTitleSection from '@/components/SeasonTitleSection.vue';
import texts from '@/constants/texts';
import { COLORS10_VIVID_SORTED } from '@/constants/colors';

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

const getLatestScore = (scoreHistory = []) => {
  if (!Array.isArray(scoreHistory) || scoreHistory.length === 0) return Number.NEGATIVE_INFINITY;
  const latest = Number(scoreHistory[scoreHistory.length - 1]?.[1]);
  return Number.isFinite(latest) ? latest : Number.NEGATIVE_INFINITY;
};

const getLatestRank = (rankHistory = []) => {
  if (!Array.isArray(rankHistory) || rankHistory.length === 0) return Number.POSITIVE_INFINITY;
  const latest = Number(rankHistory[rankHistory.length - 1]?.[1]);
  return Number.isFinite(latest) ? latest : Number.POSITIVE_INFINITY;
};

const createChartColorMap = (sortedSeries) =>
  sortedSeries.reduce((colorMap, seriesData, index) => {
    colorMap[String(seriesData.bgmId)] =
      seriesData.color || COLORS10_VIVID_SORTED[index % COLORS10_VIVID_SORTED.length];
    return colorMap;
  }, {});

const scoreChartColorMap = computed(() => {
  const sortedHistoryData = [...(historyData.value || [])].sort((a, b) => {
    const scoreDiff = getLatestScore(b.scoreHistory) - getLatestScore(a.scoreHistory);
    if (scoreDiff !== 0) return scoreDiff;
    const nameA = a?.name || '';
    const nameB = b?.name || '';
    return nameA.localeCompare(nameB, 'zh-Hans-CN');
  });

  return createChartColorMap(sortedHistoryData);
});

const rankChartColorMap = computed(() => {
  const sortedHistoryData = [...(historyData.value || [])].sort((a, b) => {
    const rankDiff = getLatestRank(a.rankHistory) - getLatestRank(b.rankHistory);
    if (rankDiff !== 0) return rankDiff;
    const nameA = a?.name || '';
    const nameB = b?.name || '';
    return nameA.localeCompare(nameB, 'zh-Hans-CN');
  });

  return createChartColorMap(sortedHistoryData);
});

const linkSubjectNames = (text, colorMap = {}) => {
  const segments = [];
  const subjectNamePattern = /《([^》]+)》/g;
  let lastIndex = 0;
  let match;

  while ((match = subjectNamePattern.exec(text)) !== null) {
    const [quotedName, nameCn] = match;
    const bgmId = findBgmIdByNameCn(nameCn);

    if (match.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, match.index), bgmId: null, color: null });
    }

    segments.push({ text: quotedName, bgmId, color: bgmId ? colorMap[String(bgmId)] : null });
    lastIndex = match.index + quotedName.length;
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), bgmId: null, color: null });
  }

  return segments.length ? segments : [{ text, bgmId: null, color: null }];
};

const splitAndLinkAnalysis = (text, colorMap) =>
  splitIntoTwoParagraphs(text).map((paragraph) => linkSubjectNames(paragraph, colorMap));

const scoreAnalysisParagraphs = computed(() =>
  splitAndLinkAnalysis(analysis.value?.score || '', scoreChartColorMap.value)
);
const rankAnalysisParagraphs = computed(() =>
  splitAndLinkAnalysis(analysis.value?.rank || '', rankChartColorMap.value)
);
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

const selectedYear = computed(() => route.params.year || currentYear);
const selectedMonth = computed(
  () => parseInt(route.params.month) || getCurrentSeason(new Date().getMonth() + 1)
);

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
    <SeasonTitleSection
      :years="years"
      :selected-year="selectedYear"
      :selected-month="selectedMonth"
      :available-seasons="availableSeasons"
      @year-change="handleYearChange"
      @season-change="handleSeasonChange"
    />

    <div class="bleed-both-to-viewport border-t border-foreground/10" aria-hidden="true"></div>

    <div id="season-score-comparison" class="flex min-h-[calc(100dvh-13rem)] flex-col gap-4">
      <h2 class="text-5xl">{{ texts._top10ScoreComparison }}</h2>
      <p class="text-gray-400">{{ texts._top10ScoreComparisonSubtitle }}</p>

      <div
        v-if="scoreAnalysisParagraphs.length"
        class="mt-3 max-w-2xl space-y-4 text-base leading-relaxed text-gray-700 dark:text-gray-300"
      >
        <p v-for="(paragraph, index) in scoreAnalysisParagraphs" :key="`score-${index}`">
          <template v-for="(segment, segmentIndex) in paragraph" :key="segmentIndex">
            <RouterLink v-if="segment.bgmId" :to="`/subject/${segment.bgmId}`" class="inline">
              <span
                v-if="segment.color"
                class="relative -top-0.5 mx-1 inline-block size-3 rounded-full align-middle"
                :style="{ backgroundColor: segment.color }"
                aria-hidden="true"
              ></span>
              <span class="underline underline-offset-4">{{ segment.text }}</span>
            </RouterLink>
            <span v-else>{{ segment.text }}</span>
          </template>
        </p>
      </div>

      <div class="mt-6 bleed-left-to-container-right aspect-[2/3] sm:aspect-[5/2]">
        <BattleChart
          :historyData="historyData"
          :animate-when-in-view="true"
          :use-theme-palette="true"
        />
      </div>
    </div>

    <div class="bleed-both-to-viewport border-t border-foreground/10" aria-hidden="true"></div>

    <div id="season-ranking-comparison" class="flex min-h-[calc(100dvh-13rem)] flex-col gap-4">
      <h2 class="text-5xl">{{ texts._top10RankingComparison }}</h2>
      <p class="text-gray-400">{{ texts._top10RankingComparisonSubtitle }}</p>
      <div
        v-if="rankAnalysisParagraphs.length"
        class="mt-3 max-w-2xl space-y-4 text-base leading-relaxed text-gray-700 dark:text-gray-300"
      >
        <p v-for="(paragraph, index) in rankAnalysisParagraphs" :key="`rank-${index}`">
          <template v-for="(segment, segmentIndex) in paragraph" :key="segmentIndex">
            <RouterLink v-if="segment.bgmId" :to="`/subject/${segment.bgmId}`" class="inline">
              <span
                v-if="segment.color"
                class="relative -top-0.5 mx-1 inline-block size-3 rounded-full align-middle"
                :style="{ backgroundColor: segment.color }"
                aria-hidden="true"
              ></span>
              <span class="underline underline-offset-4">{{ segment.text }}</span>
            </RouterLink>
            <span v-else>{{ segment.text }}</span>
          </template>
        </p>
      </div>
      <div class="mt-6 bleed-right-to-container-left aspect-[2/3] sm:aspect-[5/2]">
        <BattleRankChart
          :historyData="historyData"
          :animate-when-in-view="true"
          :use-theme-palette="true"
        />
      </div>
    </div>

    <div class="bleed-both-to-viewport border-t border-foreground/10" aria-hidden="true"></div>

    <div id="season-balance-chart" class="flex min-h-[calc(100dvh-13rem)] flex-col gap-4">
      <h2 class="text-5xl">{{ texts._balanceChart }}</h2>
      <p class="text-gray-400">{{ texts._scoreComparison }}</p>
      <div
        v-if="divisiveAnalysisParagraphs.length"
        class="mt-3 max-w-2xl space-y-4 text-base leading-relaxed text-gray-700 dark:text-gray-300"
      >
        <p v-for="(paragraph, index) in divisiveAnalysisParagraphs" :key="`divisive-${index}`">
          <template v-for="(segment, segmentIndex) in paragraph" :key="segmentIndex">
            <RouterLink v-if="segment.bgmId" :to="`/subject/${segment.bgmId}`" class="inline">
              <span
                v-if="segment.color"
                class="relative -top-0.5 mx-1 inline-block size-3 rounded-full align-middle"
                :style="{ backgroundColor: segment.color }"
                aria-hidden="true"
              ></span>
              <span class="underline underline-offset-4">{{ segment.text }}</span>
            </RouterLink>
            <span v-else>{{ segment.text }}</span>
          </template>
        </p>
      </div>
      <div class="mt-6 bleed-left-to-container-right sm:aspect-[5/2]">
        <BattleBarChart :balanceData="balanceData" :animate-when-in-view="true" />
      </div>
    </div>

    <div class="bleed-both-to-viewport border-t border-foreground/10" aria-hidden="true"></div>

    <div id="season-distribution-chart" class="flex min-h-[calc(100dvh-13rem)] flex-col gap-4">
      <h2 class="text-5xl">{{ texts._distributionChart }}</h2>
      <p class="cursor-help text-gray-400" :title="texts._chartLegend">
        {{ texts._chartLegend }}
      </p>
      <div
        v-if="popularityAnalysisParagraphs.length"
        class="mt-3 max-w-2xl space-y-4 text-base leading-relaxed text-gray-700 dark:text-gray-300"
      >
        <p v-for="(paragraph, index) in popularityAnalysisParagraphs" :key="`popularity-${index}`">
          <template v-for="(segment, segmentIndex) in paragraph" :key="segmentIndex">
            <RouterLink v-if="segment.bgmId" :to="`/subject/${segment.bgmId}`" class="inline">
              <span
                v-if="segment.color"
                class="relative -top-0.5 mx-1 inline-block size-3 rounded-full align-middle"
                :style="{ backgroundColor: segment.color }"
                aria-hidden="true"
              ></span>
              <span class="underline underline-offset-4">{{ segment.text }}</span>
            </RouterLink>
            <span v-else>{{ segment.text }}</span>
          </template>
        </p>
      </div>
      <div class="mt-6 bleed-right-to-container-left sm:aspect-[5/2]">
        <ScoreBubbleChart :subjects="subjectsData" :animate-when-in-view="true" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
