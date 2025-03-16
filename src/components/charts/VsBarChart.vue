<template>
  <div class="h-full" ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, shallowRef } from 'vue';
import Highcharts from '@/utils/highcharts';
import { BLUE, PINK } from '@/constants/colors';
import { useChartTheme } from '@/composables/useChartTheme';

const props = defineProps({
  ratingData: {
    type: Object,
    required: true
  },
  comparisonData: {
    type: Object,
    required: false,
    default: null
  }
});

const chartContainer = ref(null);
const chartInstance = shallowRef(null);

useChartTheme(chartInstance);

const updateData = () => {
  if (chartInstance.value) {
    chartInstance.value.series[0].setData(props.ratingData.data, false);
    if (props.comparisonData) {
      chartInstance.value.series[1].setData(props.comparisonData.data, true);
    }
  }
};

const initializeChart = () => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }
  if (chartContainer.value) {
    chartInstance.value = Highcharts.chart(chartContainer.value, {
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
          name: props.ratingData.name,
          data: [],
          color: BLUE
        },
        {
          name: props.comparisonData?.name || '动画1',
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
  if (chartInstance.value) {
    chartInstance.value.destroy();
    chartInstance.value = null;
  }
});

watch(
  [() => props.ratingData, () => props.comparisonData],
  () => {
    updateData();
  },
  { deep: true }
);
</script>
