<script setup>
import { ref, onMounted, onUnmounted, watch, shallowRef } from 'vue';
import Highcharts from '@/utils/highcharts';
import { BLUE } from '@/constants/colors';
import { useChartTheme } from '@/composables/useChartTheme';

const props = defineProps({
  historyData: {
    type: Array,
    required: true
  },
  color: {
    type: String,
    default: BLUE
  }
});

const chartContainer = ref(null);
const chartInstance = shallowRef(null);
useChartTheme(chartInstance);

const updateData = () => {
  if (chartInstance.value) {
    chartInstance.value.series[0].setData(props.historyData, true);
  }
};

const initializeChart = () => {
  if (chartInstance.value) {
    chartInstance.value.destroy(); // Destroys previous instance if exists
  }
  if (chartContainer.value) {
    const chart = Highcharts.chart(chartContainer.value, {
      tooltip: {
        enabled: false
      },

      plotOptions: {
        area: {
          marker: {
            enabled: false
          },
          fillColor: {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
              [0, Highcharts.color(props.color).setOpacity(0.5).get('rgba')],
              [1, Highcharts.color(props.color).setOpacity(0).get('rgba')]
            ]
          },
          lineWidth: 2,
          threshold: null
        },
        series: {
          animation: {
            defer: 500,
            duration: 1000
          }
        }
      },
      yAxis: [
        {
          title: {
            enabled: false
          },
          labels: {
            enabled: false
          },
          gridLineWidth: 0,
          tickInterval: 0.1
        }
      ],
      xAxis: {
        type: 'datetime',
        tickWidth: 0, // This hides the ticks

        labels: {
          enabled: false
        }
      },

      legend: {
        enabled: false
      },

      series: [
        {
          type: 'area',
          name: '评分',
          yAxis: 0,
          data: [],
          color: props.color
        }
      ]
    });

    // Immediately set the chartInstance
    chartInstance.value = chart;

    updateData();
  }
};

onMounted(() => {
  initializeChart();
});

onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
    chartInstance.value = null;
  }
});

// Watch for changes in historyData prop and update the chart accordingly
watch(
  () => props.historyData,
  () => {
    updateData();
  },
  { deep: false }
);
</script>

<template><div class="h-full" ref="chartContainer"></div></template>
