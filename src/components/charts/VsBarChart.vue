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

const normalizeSeries = (seriesData, fallbackName) => {
  if (seriesData && typeof seriesData === 'object' && !Array.isArray(seriesData)) {
    return {
      name: seriesData.name || fallbackName,
      data: Array.isArray(seriesData.data) ? seriesData.data : []
    };
  }

  return {
    name: fallbackName,
    data: []
  };
};

const updateData = () => {
  if (chartInstance.value) {
    const ratingSeries = normalizeSeries(props.ratingData, '动画0');
    const comparisonSeries = normalizeSeries(props.comparisonData, '动画1');

    chartInstance.value.series[0].update({ name: ratingSeries.name }, false);
    chartInstance.value.series[0].setData(ratingSeries.data, false);

    chartInstance.value.series[1].update({ name: comparisonSeries.name }, false);
    chartInstance.value.series[1].setData(comparisonSeries.data, false);

    chartInstance.value.redraw();
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
          name: normalizeSeries(props.ratingData, '动画0').name,
          data: [],
          color: BLUE
        },
        {
          name: normalizeSeries(props.comparisonData, '动画1').name,
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
