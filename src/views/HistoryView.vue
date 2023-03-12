<template>
  <div v-if="loaded" class="h-full sm:pb-32">
    <Chart ref="chartRef" :data="historyStore.chartData" :options="historyStore.chartOptions"/>
    <div class="flex justify-end sm:pr-10 sm:pt-10 text-xl items-center gap-4">
      <span>从</span>
      <input class="bg-transparent border-b w-[100px] text-fie" max="2050" min="1900"
             type="number"/>
      <span>至</span>
      <input class="bg-transparent border-b w-[100px] text-fie" max="2050" min="1900"
             type="number"/>
      <span>且高于</span>
      <input class="bg-transparent border-b w-[100px] text-fie" max="0" min="9"
             type="number"/>
      <span>分</span>
    </div>
  </div>

</template>

<script lang="ts" setup>
import {useHistoryStore} from "@/stores/history";
import {Chart, ChartComponentRef} from "vue-chartjs";
import {Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, TimeScale, Title, Tooltip,} from 'chart.js'
import 'chartjs-adapter-moment';
import {ref} from "vue";

ChartJS.register(LinearScale, PointElement, Tooltip, TimeScale, Legend, LineElement, Title,);

const loaded = ref(false);


const historyStore = useHistoryStore();

await historyStore.fetchHistory();

loaded.value = true;


const chartRef = ref<ChartComponentRef | null>(null)
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

<style scoped>


</style>
