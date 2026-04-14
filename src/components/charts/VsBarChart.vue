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
const SCORE_LABELS = ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1'];

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

const toCategoryData = (data) => {
  const map = new Map();

  data.forEach((point) => {
    if (!point || point.x === undefined || point.y === undefined) return;
    map.set(String(point.x), Number(point.y) || 0);
  });

  return SCORE_LABELS.map((score) => map.get(score) || 0);
};

const updateData = () => {
  if (chartInstance.value) {
    const ratingSeries = normalizeSeries(props.ratingData, '动画0');
    const comparisonSeries = normalizeSeries(props.comparisonData, '动画1');

    chartInstance.value.series[0].update({ name: ratingSeries.name }, false);
    chartInstance.value.series[0].setData(toCategoryData(ratingSeries.data), false);

    chartInstance.value.series[1].update({ name: comparisonSeries.name }, false);
    chartInstance.value.series[1].setData(toCategoryData(comparisonSeries.data), false);

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
        labels: {
          formatter: function () {
            return `${this.value}%`;
          }
        },
        title: {
          enabled: false
        }
      },
      tooltip: {
        pointFormatter: function () {
          return `${this.series.name}: <b>${this.y.toFixed(2)}%</b><br/>`;
        }
      },
      xAxis: {
        categories: SCORE_LABELS,
        labels: {
          enabled: true
        }
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
