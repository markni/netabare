<script setup>
import { ref, onMounted, onUnmounted, watch, shallowRef, computed } from 'vue';
import Highcharts from '@/utils/highcharts';
import { GOLD } from '@/constants/colors';
import _ from 'lodash';
import { useChartTheme } from '@/composables/useChartTheme';
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

const themeStore = useThemeStore(); // Use the theme store

const epPlotLineColor = computed(() => {
  return themeStore.isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.1)';
});

const updateRange = () => {
  if (chartInstance.value) {
    chartInstance.value.xAxis[0].setExtremes(props.xMin, props.xMax);
  }
};

const drawPlotLines = () => {
  const epPlotOptions = {
    color: epPlotLineColor.value, // Use the computed color here
    width: 2,
    dashStyle: 'longdashdot',
    label: {
      verticalAlign: 'bottom',
      textAlign: 'right',
      y: -10,
      x: 5,
      useHTML: true
    }
  };

  chartInstance.value.xAxis[0].plotLinesAndBands.forEach((plotLine) => {
    chartInstance.value.xAxis[0].removePlotLine(plotLine.id);
  });

  Object.entries(props.epsData).forEach(([airdateValue, episodes]) => {
    let epOption = _.cloneDeep(epPlotOptions);
    epOption.value = Number(airdateValue);

    // Set the label text to list all episodes for this airdate
    epOption.label.text = episodes
      .map(
        (ep) =>
          `<a target="_blank" href="https://bgm.tv/ep/${ep.id}">ep.${
            ep.sort
          } ${episodes.length > 1 ? '' : ep.name_cn || ep.name}</a>`
      )
      .join(', ');

    chartInstance.value.xAxis[0].addPlotLine(epOption);
  });
};

const updateData = () => {
  if (chartInstance.value) {
    drawPlotLines(); // Call the new method here

    // Update the series data
    chartInstance.value.series[1].update(
      {
        data: props.oneData
      },
      false //redraw
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

<template><div class="h-full" ref="chartContainer"></div></template>

<style scoped></style>
