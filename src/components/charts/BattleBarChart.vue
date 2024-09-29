<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import Highcharts from '@/utils/highcharts';
import { BLUE, PINK } from '@/constants/colors.js';

const props = defineProps({
  rateData: {
    type: Object,
    required: true
  },

  name: {
    type: String,
    required: true
  }
});

const chartContainer = ref(null);
let chartInstance = null;

const updateData = () => {
  if (chartInstance) {
    chartInstance.yAxis[0].setExtremes(
      -props.rateData.extreme,
      props.rateData.extreme,
      false,
      false
    );

    chartInstance.series[0].setData(props.rateData.negative, false);
    chartInstance.series[1].setData(props.rateData.positive, true);
  }
};

const initializeChart = () => {
  if (chartInstance) {
    chartInstance.destroy(); // Destroys previous instance if exists
  }
  if (chartContainer.value) {
    chartInstance = Highcharts.chart(chartContainer.value, {
      chart: {
        type: 'bar',
        inverted: true,
        zoomType: 'none'
      },
      tooltip: {
        pointFormatter: function () {
          return `${this.series.name}: ${Math.abs(this.y)}`;
        }
      },
      xAxis: {
        visible: true
      },
      yAxis: {
        title: {
          text: null
        },
        labels: {
          enabled: true
        }
      },
      plotOptions: {
        series: {
          stacking: 'normal',
          animation: {
            defer: 1500,
            duration: 1000
          }
        }
      },
      series: [
        {
          name: '1分',
          data: [],
          color: BLUE,
          dataLabels: {
            enabled: true,
            inside: true,
            align: 'right',
            style: {
              fontWeight: 'normal',
              fontSize: '16px',
              fontFamily: `'source-han-serif-sc', serif`
            },
            format: '{point.name}' // Specifying how data labels should appear
          }
        },
        {
          name: '10分',
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

// Watch for changes in userData and globalData props and update the chart accordingly
watch(
  [() => props.rateData],
  () => {
    updateData();
  },
  { deep: true }
);
</script>

<template><div class="h-full" ref="chartContainer"></div></template>

<style scoped></style>
