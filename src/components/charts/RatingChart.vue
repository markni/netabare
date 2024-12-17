<template>
  <div class="h-full" ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import Highcharts from '@/utils/highcharts';
import { COLORS10 } from '@/constants/colors';

const props = defineProps({
  ratingData: {
    type: Object,
    required: true
  }
});

// Store the initial maximum value
const initialMaxValue = ref(null);

// Transform the rating data into the format the chart expects
const chartData = computed(() => {
  if (!props.ratingData?.count) return [];
  return [10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((score) => props.ratingData.count[score] || 0);
});

const chartContainer = ref(null);
let chartInstance = null;

const updateData = () => {
  if (chartInstance) {
    chartInstance.series[0].setData(chartData.value, true);
  }
};

const initializeChart = () => {
  if (chartInstance) {
    chartInstance.destroy();
  }
  if (chartContainer.value) {
    chartInstance = Highcharts.chart(chartContainer.value, {
      chart: {
        type: 'bar'
      },

      tooltip: {
        formatter: function () {
          return `${this.x}分：<b>${this.y}</b>人评分`;
        }
      },

      plotOptions: {
        bar: {
          colorByPoint: true,
          pointPadding: 0,
          dataLabels: {
            enabled: false
          }
        }
      },
      yAxis: {
        title: {
          enabled: false
        },
        labels: {
          format: '{value:.0f}'
        },
        // Set fixed max based on initial data
        max: initialMaxValue.value,
        endOnTick: false
      },
      xAxis: {
        categories: ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1']
      },
      series: [
        {
          name: '评分',
          color: 'red',
          data: chartData.value,
          colors: COLORS10,
          maxPointWidth: 70,
          events: {
            legendItemClick: function () {
              return false;
            }
          }
        }
      ],
      colors: COLORS10
    });
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
  (newData) => {
    if (initialMaxValue.value === null && newData?.count) {
      const values = Object.values(newData.count);
      initialMaxValue.value = Math.max(...values);
    }
  },
  { immediate: true }
);

watch(
  () => props.ratingData,
  () => {
    updateData();
  },
  { deep: true }
);
</script>
