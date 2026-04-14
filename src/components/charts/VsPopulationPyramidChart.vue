<template>
  <div class="h-full" ref="chartContainer"></div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, shallowRef, watch } from 'vue';
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

const SCORE_LABELS = ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1'];
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

const toScoreMap = (data) => {
  const map = new Map();
  data.forEach((point) => {
    if (!point || point.x === undefined || point.y === undefined) return;
    map.set(String(point.x), Number(point.y) || 0);
  });
  return map;
};

const buildPyramidData = () => {
  const leftSeries = normalizeSeries(props.ratingData, '动画0');
  const rightSeries = normalizeSeries(props.comparisonData, '动画1');

  const leftMap = toScoreMap(leftSeries.data);
  const rightMap = toScoreMap(rightSeries.data);

  return {
    leftName: leftSeries.name,
    rightName: rightSeries.name,
    leftData: SCORE_LABELS.map((score) => -(leftMap.get(score) || 0)),
    rightData: SCORE_LABELS.map((score) => rightMap.get(score) || 0)
  };
};

const getSymmetricAxisBound = (leftData, rightData) => {
  const values = [...leftData, ...rightData].map((v) => Math.abs(Number(v) || 0));
  const maxValue = Math.max(...values, 0);
  return maxValue > 0 ? maxValue : 1;
};

const updateData = () => {
  if (!chartInstance.value) return;

  const { leftName, rightName, leftData, rightData } = buildPyramidData();
  chartInstance.value.series[0].update({ name: leftName }, false);
  chartInstance.value.series[0].setData(leftData, false);
  chartInstance.value.series[1].update({ name: rightName }, false);
  chartInstance.value.series[1].setData(rightData, false);
  const axisBound = getSymmetricAxisBound(leftData, rightData);
  chartInstance.value.yAxis[0].setExtremes(-axisBound, axisBound, false);
  chartInstance.value.redraw();
};

const initializeChart = () => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  if (!chartContainer.value) return;

  const { leftName, rightName, leftData, rightData } = buildPyramidData();
  const axisBound = getSymmetricAxisBound(leftData, rightData);

  chartInstance.value = Highcharts.chart(chartContainer.value, {
    chart: {
      type: 'bar'
    },
    legend: {
      enabled: true
    },
    plotOptions: {
      bar: {
        borderWidth: 0,
        pointWidth: 24,
        groupPadding: 0.03,
        pointPadding: 0.01,
        grouping: false
      }
    },
    xAxis: {
      categories: SCORE_LABELS,
      labels: {
        enabled: true
      }
    },
    yAxis: {
      min: -axisBound,
      max: axisBound,
      title: {
        enabled: false
      },
      labels: {
        formatter: function () {
          return `${Math.abs(this.value)}%`;
        }
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size: 10px">评分: {point.key}</span><br/>',
      pointFormatter: function () {
        return `${this.series.name}: <b>${Math.abs(this.y).toFixed(2)}%</b><br/>`;
      }
    },
    series: [
      {
        name: leftName,
        data: [],
        color: BLUE
      },
      {
        name: rightName,
        data: [],
        color: PINK
      }
    ]
  });

  updateData();
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
