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

const store = useSeasonStore();
const route = useRoute();
const router = useRouter();
const { historyData, balanceData, subjectsData } = storeToRefs(store);
const showLabels = ref(false); // Set to false by default

// Generate array of last 5 years
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

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

const getSeasonDateName = () => {
  const { year, month } = route.params;
  const today = year && month ? new Date(year, month - 1, 1) : new Date();
  const currentMonth = today.getMonth(); // Get the current month (0-11)
  let seasonStartMonth;

  if (currentMonth >= 0 && currentMonth < 3) {
    // Jan, Feb, Mar
    seasonStartMonth = '一月'; // January
  } else if (currentMonth >= 3 && currentMonth < 6) {
    // Apr, May, Jun
    seasonStartMonth = '四月'; // April
  } else if (currentMonth >= 6 && currentMonth < 9) {
    // Jul, Aug, Sep
    seasonStartMonth = '七月'; // July
  } else {
    // Oct, Nov, Dec
    seasonStartMonth = '十月'; // October
  }

  return seasonStartMonth;
};

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
  const currentMonth = new Date().getMonth();
  let newMonth = 1; // Default to January

  // Determine the appropriate month based on the current season
  if (currentMonth >= 0 && currentMonth < 3) {
    newMonth = 1; // January
  } else if (currentMonth >= 3 && currentMonth < 6) {
    newMonth = 4; // April
  } else if (currentMonth >= 6 && currentMonth < 9) {
    newMonth = 7; // July
  } else {
    newMonth = 10; // October
  }

  router.push({ name: 'season', params: { year: newYear, month: newMonth } });
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
      <h1 class="text-4xl sm:text-6xl">{{ getSeasonDateName() }}新番战况</h1>
    </div>

    <div class="flex flex-col gap-4">
      <HintDiv
        title="用鼠标左键在图表中拖选一个方块自定义时间范围，点击图表右上角的重置缩放按钮恢复"
      >
        如何放大缩小？
      </HintDiv>
      <HintDiv title="按Alt键可显示标签"> 如何在曲线上显示标签？ </HintDiv>
      <h2 class="text-2xl">热门前10评分对比</h2>

      <div class="sm:aspect-[16/10]">
        <BattleChart :historyData="historyData" :showLabels="showLabels" />
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <h2 class="text-2xl">热门前10排名对比</h2>
      <div class="sm:aspect-[16/10]">
        <BattleRankChart :historyData="historyData" :showLabels="showLabels" />
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <h2 class="text-2xl">平衡榜</h2>
      <p class="text-gray-400">打1分和10分的数量对比</p>
      <div class="sm:aspect-[10/5]">
        <BattleBarChart :balanceData="balanceData" />
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <h2 class="text-2xl">分布图</h2>
      <p class="cursor-help text-gray-400" title="尺寸越大越热门，颜色越红争议越大">
        尺寸越大越热门，颜色越红争议越大
      </p>
      <div class="sm:aspect-[10/5]">
        <ScoreBubbleChart :subjects="subjectsData" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
