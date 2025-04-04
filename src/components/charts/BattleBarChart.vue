<script setup>
import { ref, onMounted, onUnmounted, watch, shallowRef } from 'vue';
import Highcharts from '@/utils/highcharts';
import { BLUE, PINK } from '@/constants/colors.js';
import { useChartTheme } from '@/composables/useChartTheme';

const props = defineProps({
  balanceData: {
    type: Object,
    required: true
  }
});

const chartContainer = ref(null);
const chartInstance = shallowRef(null);
useChartTheme(chartInstance);

const updateData = () => {
  if (chartInstance.value) {
    chartInstance.value.yAxis[0].setExtremes(
      -props.balanceData.extreme,
      props.balanceData.extreme,
      false,
      false
    );

    chartInstance.value.series[0].setData(props.balanceData.negative, false);
    chartInstance.value.series[1].setData(props.balanceData.positive, true);
  }
};

const initializeChart = () => {
  if (chartInstance.value) {
    chartInstance.value.destroy(); // Destroys previous instance if exists
  }
  if (chartContainer.value) {
    const chart = Highcharts.chart(chartContainer.value, {
      chart: {
        type: 'bar',
        inverted: true,
        zoomType: 'none',
        events: {
          load: function () {
            chartInstance.value = this;
          }
        }
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
          },
          pointWidth: 20 // Add this line to set a fixed width for bars
          // or use pointPadding: 0.1, // to set the padding between bars
        }
      },
      series: [
        {
          name: '1分',
          data: [],
          color: Highcharts.color(BLUE).setOpacity(0.7).get(),
          dataLabels: {
            enabled: true,
            inside: false,
            align: 'right',
            style: {
              fontWeight: 'normal',
              fontSize: '16px',
              fontFamily: `'source-han-serif-sc', serif`,
              textOutline: 'none'
            },
            format: '{point.name}'
          }
        },
        {
          name: '10分',
          data: [],
          color: Highcharts.color(PINK).setOpacity(0.7).get()
        }
      ]
    });

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

// Watch for changes in balanceData prop and update the chart accordingly
watch(
  () => props.balanceData,
  () => {
    updateData();
  },
  { deep: true }
);
</script>

<template><div class="h-full" ref="chartContainer"></div></template>

<style scoped></style>
