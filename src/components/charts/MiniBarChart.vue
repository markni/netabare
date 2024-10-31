<template>
  <div class="h-full" ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import Highcharts from '@/utils/highcharts';

const props = defineProps({
  ratingData: {
    type: Array,
    required: true
  }
});

const chartContainer = ref(null);
let chartInstance = null;

const updateData = () => {
  if (chartInstance) {
    chartInstance.series[0].setData(props.ratingData, true);
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
        enabled: false
      },
      tooltip: {
        enabled: false
      },
      plotOptions: {
        column: {
          colorByPoint: true,
          pointPadding: 0,
          dataLabels: {
            enabled: false
          },
          states: {
            hover: {
              enabled: false // Disable hover effect
            }
          }
        }
      },
      yAxis: {
        title: {
          enabled: false
        },
        labels: {
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
          name: '评分分布',
          data: [],
          maxPointWidth: 70,
          events: {
            legendItemClick: function () {
              return false;
            }
          }
        }
      ],
      colors: ['#E0E0E0']
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
