<script setup>
import { ref, onMounted, onUnmounted, watch, shallowRef, computed } from 'vue';
import Highcharts from '@/utils/highcharts';
import { COLORS2 } from '@/constants/colors';
import { useChartTheme } from '@/composables/useChartTheme';
import { useEpisodePlot } from '@/composables/useEpisodePlot';

const props = defineProps({
  historyData: {
    type: Object,
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
    drawPlotLines();
    chartInstance.value.series[0].update(
      {
        data: props.historyData.doing
      },
      false
    );
    chartInstance.value.series[1].update(
      {
        data: props.historyData.collect
      },
      false
    );
    // Update the series data

    chartInstance.value.series[2].update(
      {
        data: props.historyData.rated
      },
      false
    );
    chartInstance.value.series[3].update(
      {
        data: props.historyData.wish
      },
      false //redraw
    );

    chartInstance.value.series[4].update(
      {
        data: props.historyData.on_hold
      },
      false
    );
    chartInstance.value.series[5].update(
      {
        data: props.historyData.dropped
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
      title: {
        text: '',
        enabled: false
      },
      tooltip: {
        shared: true,
        formatter: function () {
          let s =
            '<p style="font-size: 10px;">' + Highcharts.dateFormat('%Y-%m-%d', this.x) + '</p>';

          // Calculate total (excluding rated)
          const total = this.points.reduce((sum, point) => {
            // Skip 'rated' series in total calculation
            if (point.series.name !== '打分') {
              return sum + point.y;
            }
            return sum;
          }, 0);

          this.points.forEach(function (point) {
            const percentage = ((point.y / total) * 100).toFixed(1);
            s +=
              '<br/>' +
              '<span style="color:' +
              point.color +
              '">●</span> ' +
              point.series.name +
              ': <b>' +
              point.y +
              '</b> (' +
              percentage +
              '%)';
          });

          return s;
        }
      },
      boost: {
        enabled: true,
        useGPUTranslations: true,
        usePreAllocated: true
      },
      plotOptions: {
        spline: {
          marker: {
            enabled: false
          }
        },
        series: {
          turboThreshold: 365 * 10
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
      exporting: {
        enabled: false
      },

      credits: {
        enabled: false
      },
      series: [
        {
          type: 'spline',
          name: '在看',
          data: []
        },
        {
          type: 'spline',
          name: '看过',
          data: []
        },
        {
          type: 'spline',
          name: '打分',
          data: []
        },

        {
          type: 'spline',
          name: '想看',
          data: []
        },
        {
          type: 'spline',
          name: '搁置',
          data: []
        },
        {
          type: 'spline',
          name: '抛弃',
          data: []
        }
      ],
      colors: COLORS2,
      lang: {
        thousandsSep: ''
      }
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
