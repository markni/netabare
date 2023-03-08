<template>
  <Scatter :data="historyStore.bubbleChartData" :options="historyStore.chartOptions"/>
</template>

<script lang="ts" setup>
import {useHistoryStore} from "@/stores/history";
import {Scatter} from "vue-chartjs";
import {Chart as ChartJS, Legend, LinearScale, PointElement, TimeScale, TimeSeriesScale, Tooltip} from 'chart.js'
import 'chartjs-adapter-moment';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, TimeScale, TimeSeriesScale)

const historyStore = useHistoryStore();

await historyStore.fetchHistory();

</script>

<style scoped>

</style>
