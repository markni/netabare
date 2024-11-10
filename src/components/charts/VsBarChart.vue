<template>
  <div class="h-full" ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import Highcharts from '@/utils/highcharts';
import { BLUE, PINK } from '@/constants/colors';
const props = defineProps({
  ratingData: {
    type: Array,
    required: true
  },
  comparisonData: {
    type: Array,
    required: false,
    default: null
  }
});

const chartContainer = ref(null);
let chartInstance = null;

const updateData = () => {
  if (chartInstance) {
    chartInstance.series[0].setData(props.ratingData, false);
    if (props.comparisonData) {
      chartInstance.series[1].setData(props.comparisonData, true);
    }
  }
};

const initializeChart = () => {
  if (chartInstance) {
    chartInstance.destroy();
  }
  if (chartContainer.value) {
    chartInstance = Highcharts.chart(chartContainer.value, {
      chart: {
        type: 'column'
      },
      legend: {
        enabled: true
      },

      plotOptions: {
        column: {
          pointPadding: 0
        }
      },
      yAxis: {
        title: {
          enabled: false
        }
      },
      xAxis: {
        categories: ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1'].reverse(),
        labels: {
          enabled: true
        },
        reversed: true
      },
      series: [
        {
          name: '动画0',
          data: [],
          color: BLUE
        },
        {
          name: '动画1',
          data: [],
          color: PINK
        }
      ]
    });
    updateData();
  }
};

onMounted(() => {
  initializeChart();
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
});

watch(
  () => props.ratingData,
  () => {
    updateData();
  },
  { deep: true }
);
</script>
