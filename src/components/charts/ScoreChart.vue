<script setup>
import { ref, onMounted, onUnmounted, watch, shallowRef, computed } from 'vue';
import Highcharts from '@/utils/highcharts';
import { GOLD } from '@/constants/colors';
import { useChartTheme } from '@/composables/useChartTheme';
import { useEpisodePlot } from '@/composables/useEpisodePlot'; // Import the new composable
import { useThemeStore } from '@/stores/theme'; // Import the theme store

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

const themeStore = useThemeStore(); // Use the theme store

const getSeriesColor = computed(() =>
  themeStore.isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
);

const updateRange = () => {
  if (chartInstance.value) {
    chartInstance.value.xAxis[0].setExtremes(props.xMin, props.xMax);
  }
};

const updateData = () => {
  if (chartInstance.value) {
    drawPlotLines();

    // Update the series data and color
    chartInstance.value.series[1].update(
      {
        data: props.oneData,
        color: getSeriesColor.value
      },
      false
    );
    chartInstance.value.series[2].update(
      {
        data: props.tenData,
        color: getSeriesColor.value
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
          setExtremes: function (e) {
            if (e.min === undefined && e.max === undefined && e.trigger === 'zoom') {
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
          color: 'rgba(111,111,111)',
          dashStyle: 'dot'
        },
        {
          type: 'spline',
          name: '10分',
          yAxis: 1,
          data: [],
          dashStyle: 'longdashdot',
          color: 'rgba(111,111,111)'
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

// Watch for theme changes
watch(
  () => themeStore.isDarkMode,
  () => {
    updateData();
  }
);
</script>

<template>
  <div class="h-full" ref="chartContainer"></div>
</template>

<style scoped></style>
