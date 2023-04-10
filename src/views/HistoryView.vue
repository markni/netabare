<template>
  <div v-if="loaded" class="h-full sm:pb-32">
    <Chart ref="chartRef" :data="historyStore.chartData" :options="historyStore.chartOptions" />
    <div class="flex justify-end sm:pr-10 sm:pt-10 text-xl items-center gap-4">
      <span>筛选：从</span>
      <input
        v-model="startingYear"
        class="bg-transparent border-b border-gray-800 dark:border-gray-100 w-[80px] text-fie"
        max="2050"
        min="1900"
        type="number"
      />
      <span>至</span>
      <input
        v-model="endingYear"
        class="bg-transparent border-b w-[80px] border-gray-800 dark:border-gray-100 text-fie"
        max="2050"
        min="1900"
        type="number"
      />
      <span>且高于</span>
      <input
        v-model="minScore"
        class="bg-transparent border-gray-800 dark:border-gray-100 border-b w-[40px] text-fie"
        max="0"
        min="9"
        type="number"
      />
      <span>分</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useHistoryStore } from '@/stores/history';
import { Chart, ChartComponentRef } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip
} from 'chart.js';
import 'chartjs-adapter-moment';
import { computed, ref } from 'vue';

ChartJS.register(LinearScale, PointElement, Tooltip, TimeScale, Legend, LineElement, Title);

const loaded = ref(false);

const historyStore = useHistoryStore();

await historyStore.fetchHistory();

loaded.value = true;

const chartRef = ref<ChartComponentRef | null>(null);

const startingYear = computed({
  get() {
    return historyStore.startingYear;
  },
  set(val) {
    if (val > 1900 && val < 2050 && val <= historyStore.endingYear) {
      historyStore.startingYear = val;
    }
  }
});

const endingYear = computed({
  get() {
    return historyStore.endingYear;
  },
  set(val) {
    if (val > 1900 && val < 2050 && val >= historyStore.startingYear) {
      historyStore.endingYear = val;
    }
  }
});

const minScore = computed({
  get() {
    return historyStore.minScore;
  },
  set(val) {
    if (val > 0 && val < 9) {
      historyStore.minScore = val;
    }
  }
});

// const datasetAtEvent = (dataset: InteractionItem[]) => {
//   if (!dataset.length) return
//
//   const datasetIndex = dataset[0].datasetIndex
//
//   console.log('dataset', datasetIndex)
// }
//
//
// const elementAtEvent = (element: InteractionItem[]) => {
//   if (!element.length) return
//
//   const {datasetIndex, index} = element[0]
//
//   console.log(
//       'element',
//       // historyStore.chartData.labels[index],
//       historyStore.bubbleChartData.datasets[datasetIndex].data[index]
//   )
// }
//
// const onClick = (event: any) => {
//   const chart = chartRef?.value?.chart;
//
//
//   if (!chart) {
//     return
//   }
//
//
//   elementAtEvent(getElementAtEvent(chart, event))
// }
</script>

<style scoped></style>
