<template>
  <Chart :data="archiveStore.archiveChartData(props.bgmId)" :options="archiveStore.chartOptions({interactive:true})"/>
</template>

<script lang="ts" setup>
import {Chart} from "vue-chartjs";
import {Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, TimeScale, Title, Tooltip,} from 'chart.js'
import 'chartjs-adapter-moment';
import {useArchiveStore} from "@/stores/archive";

ChartJS.register(LinearScale, PointElement, Tooltip, TimeScale, Legend, LineElement, Title,);

type ChartSize = 'mini' | 'small' | 'medium' | 'large' | 'full';

interface Props {
  size?: ChartSize
  bgmId: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 'mini'
})


const archiveStore = useArchiveStore();

</script>

<style scoped>

</style>
