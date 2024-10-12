<script setup>
import { ref, onMounted, onUnmounted, watch, shallowRef, computed } from 'vue';
import Highcharts from '@/utils/highcharts';
import { GOLD } from '@/constants/colors';
import { useChartTheme } from '@/composables/useChartTheme';
import { useEpisodePlot } from '@/composables/useEpisodePlot'; // Import the new composable

const props = defineProps({
  historyData: {
    type: Array,
    required: true
  },

  oneData: {
    type: Array,
    required: true
  },
  tenData: {
    type: Array,
    required: true
  },
  epsData: {
    type: Object,
    required: true
  },
  xMin: {
    type: Number,
    required: false
  },
  xMax: {
    type: Number,
    required: false
  }
});

const chartContainer = ref(null);
const chartInstance = shallowRef(null);

useChartTheme(chartInstance);

// Use the new composable
const { drawPlotLines } = useEpisodePlot(
  chartInstance,
  computed(() => props.epsData)
);

const updateRange = () => {
  if (chartInstance.value) {
    chartInstance.value.xAxis[0].setExtremes(props.xMin, props.xMax);
  }
};

const updateData = () => {
  if (chartInstance.value) {
    drawPlotLines(); // Call the drawPlotLines function from the composable

    // Update the series data
    chartInstance.value.series[1].update(
      {
        data: props.oneData
      },
      false
    );
    chartInstance.value.series[2].update(
      {
        data: props.tenData
      },
      false
    );
    chartInstance.value.series[0].update(
      {
        data: props.historyData
      },
      true
    );
  }
};

const initializeChart = () => {
  if (chartInstance.value) {
    chartInstance.value.destroy(); // Destroys previous instance if exists
  }
  if (chartContainer.value) {
    const chart = Highcharts.chart(chartContainer.value, {
      chart: {
        backgroundColor: null,
        zoomType: 'x',
        events: {
          load: function () {
            chartInstance.value = this;
          }
        }
      },
      plotOptions: {
        spline: {
          marker: {
            enabled: false
          }
        },
        series: {
          turboThreshold: 365 * 10,
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
            format: '{value:.2f}'
          }
        },
        {
          title: {
            enabled: false
          },
          labels: {
            format: '{value:.0f}'
          },
          opposite: true
        }
      ],
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          millisecond: '%m-%d',
          second: '%m-%d',
          minute: '%m-%d',
          hour: '%m-%d',
          day: '%m-%d',
          week: '%m-%d',
          month: '%m-%d',
          year: '%m-%d'
        },
        events: {
          // Re-apply these extremes after reset
          setExtremes: function (e) {
            if (e.min === undefined) {
              e.preventDefault();
              this.setExtremes(props.xMin, props.xMax);
            }
          }
        }
      },

      series: [
        {
          type: 'spline',
          name: '评分',
          yAxis: 0,
          data: [],
          color: GOLD
        },
        {
          type: 'spline',
          name: '1分',
          yAxis: 1,
          data: [],
          color: 'rgba(0,0,0, 0.1)',
          dashStyle: 'dot'
        },
        {
          type: 'spline',
          name: '10分',
          yAxis: 1,
          data: [],
          dashStyle: 'longdashdot',
          color: 'rgba(0,0,0, 0.1)'
        }
      ],
      colors: GOLD // Use the COLORS constant
    });

    // Immediately set the chartInstance
    chartInstance.value = chart;

    updateData();
    updateRange();
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

// Watch for changes in userData and globalData props and update the chart accordingly
watch(
  [() => props.historyData],
  () => {
    updateData();
  },
  { deep: true }
);

watch(
  [() => props.xMax],
  () => {
    updateRange();
  },
  { deep: true }
);
</script>

<template>
  <div class="h-full" ref="chartContainer"></div>
</template>

<style scoped></style>
