<template>
  <div class="h-full" ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, shallowRef } from 'vue';
import Highcharts from '@/utils/highcharts';
import _ from 'lodash';
import dayjs from 'dayjs';
import { COLORS10, PINK } from '@/constants/colors.js';
import { useChartTheme } from '@/composables/useChartTheme';

const props = defineProps({
  historyData: {
    type: Array,
    required: true
  },
  yearlyData: {
    type: Array,
    required: true
  },
  dic: {
    type: Object,
    required: true
  }
});

const chartContainer = ref(null);
const chartInstance = shallowRef(null);

useChartTheme(chartInstance);

const updateData = () => {
  if (chartInstance.value) {
    chartInstance.value.series[1].update({ data: props.yearlyData }, false);
    chartInstance.value.series[0].update({ data: props.historyData }, true);
  }
};

const initializeChart = () => {
  if (chartInstance.value) {
    chartInstance.value.destroy(); // Destroys previous instance if exists
  }
  if (chartContainer.value) {
    const chart = Highcharts.chart(chartContainer.value, {
      chart: {
        type: 'scatter',
        zoomType: 'xy',
        backgroundColor: null,
        events: {
          load: function () {
            chartInstance.value = this;
          }
        }
      },
      boost: {
        enabled: true,
        useGPUTranslations: true,
        usePreAllocated: true
      },

      tooltip: {
        // xDateFormat: '%Y-%m-%d',
        formatter: function () {
          if (this.series.name === '年度均分') {
            return `${dayjs(this.x).year()}年均分：<b>${this.y.toFixed(2)}</b>`;
          }
          let rank = _.round(_.padEnd((this.y + '').split('.')[1], 9, '0').slice(-5));

          if (!props.dic[rank]) {
            return `Error`;
          }

          return `<div class="scatter-tp-title"><b>${
            props.dic[rank].name_cn || props.dic[rank].name
          }</b></div><br /><div class="scatter-tp-body">首播：${dayjs(this.x).format('YYYY.MM.DD')}<br />排名：${rank}<br />均分：${props.dic[rank].score}</div>`;
        }
      },
      subtitle: {
        enabled: false
      },
      plotOptions: {
        spline: {
          marker: {
            enabled: false
          }
        },
        line: {
          marker: {
            symbol: 'circle'
          }
        },
        series: {
          cursor: 'pointer',
          animation: {
            enabled: false,
            complete: function () {
              self.rendering = false;
            }
          },
          point: {
            events: {
              click: function () {
                let rank = _.round(_.padEnd((this.y + '').split('.')[1], 9, '0').slice(-5));
                if (this.series.name === '评分') window.open(`/subject/${props.dic[rank].bgmId}`);
              }
            }
          }
        },
        scatter: {
          marker: {
            radius: 5,
            states: {
              hover: {
                enabled: true,
                fillColor: COLORS10[8]
              }
            }
          },
          states: {
            hover: {
              marker: {
                enabled: false
              }
            }
          },
          tooltip: {}
        }
      },
      yAxis: [
        {
          startOnTick: false,
          // reversed: true,
          title: {
            enabled: false
          },
          labels: {
            format: '{value:.1f}'
          }
        },
        {
          startOnTick: false,
          title: {
            enabled: false
          },
          labels: {
            format: '{value:.1f}'
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
          month: '%Y-%m',
          year: '%Y'
        }
      },

      series: [
        {
          color: 'rgba(49, 148, 255, 0.4)',
          name: '评分',
          data: []
        },
        {
          type: 'line',
          color: PINK,
          name: '年度均分',
          data: []
        }
      ],
      colors: COLORS10
    });

    // Immediately set the chartInstance
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

// Watch for changes in userData and globalData props and update the chart accordingly
watch(
  [() => props.historyData],
  () => {
    updateData();
  },
  { deep: true }
);
</script>
