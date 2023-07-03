<template>
  <Chart
    :data="archiveStore.archiveChartData(props.bgmId, { range })"
    :options="archiveStore.chartOptions({ interactive })"
  />
  <div v-if="interactive" class="flex gap-4">
    <div class="cursor-pointer" @click="range = '6M'">6月</div>
    <div class="cursor-pointer" @click="range = '1Y'">1年</div>
  </div>
</template>

<script lang="ts" setup>
import { Chart } from 'vue-chartjs';
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
import { useArchiveStore } from '@/stores/archive';
import { ref } from 'vue';

ChartJS.register(LinearScale, PointElement, Tooltip, TimeScale, Legend, LineElement, Title);

type ChartSize = 'mini' | 'small' | 'medium' | 'large' | 'full';

interface Props {
  size?: ChartSize;
  bgmId: number;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'mini'
});

const interactive = props.size !== 'mini';

const archiveStore = useArchiveStore();

const range = ref('6M');
</script>

<style scoped></style>
