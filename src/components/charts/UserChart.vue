<template>
  <div class="h-full" ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import Highcharts from '@/utils/highcharts';
import { COLORS10 } from '@/constants/colors';

const props = defineProps({
  userData: {
    type: Array,
    required: true
  },
  globalData: {
    type: Array,
    default: () => [] // Set default to an empty array if not provided
  }
});

const chartContainer = ref(null);
let chartInstance = null;

const updateData = () => {
  if (chartInstance) {
    if (props.globalData && props.globalData.length) {
      chartInstance.series[1].setData(props.globalData);
    } else {
      chartInstance.series[1].hide(); // Hide the series if no data
    }

    chartInstance.series[0].setData(props.userData, true);
  }
};

const initializeChart = () => {
  if (chartInstance) {
    chartInstance.destroy(); // Destroys previous instance if exists
  }
  if (chartContainer.value) {
    chartInstance = Highcharts.chart(chartContainer.value, {
      chart: {
        type: 'bar' // Changed from 'column' to 'bar'
      },

      tooltip: {
        formatter: function () {
          return `${this.key}分：<b>${this.y}</b>部`;
        }
      },

      plotOptions: {
        bar: {
          // Changed from 'column' to 'bar'
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
        }
      },
      xAxis: {
        categories: ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1']
      },
      series: [
        {
          name: '个人评分',
          color: 'red',
          data: [],
          colors: COLORS10,
          maxPointWidth: 70,

          events: {
            legendItemClick: function () {
              return false; // Prevents toggling this series off
            }
          }
        },
        {
          name: '全站评分',
          data: [],
          colors: ['rgba(0, 0, 0, 0.2)'],
          visible: false
        }
      ],
      colors: COLORS10
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
  [() => props.userData, () => props.globalData],
  () => {
    updateData();
  },
  { deep: true }
);
</script>
