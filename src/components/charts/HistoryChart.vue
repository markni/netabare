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
  filteredYearlyData: {
    type: Array,
    required: true
  },
  dic: {
    type: Object,
    required: true
  },
  // Add new props
  minYear: {
    type: Number,
    default: 1970
  },
  maxYear: {
    type: Number,
    default: () => dayjs().year()
  },
  minScore: {
    type: Number,
    default: 0
  },
  maxScore: {
    type: Number,
    default: 10
  }
});

const chartContainer = ref(null);
const chartInstance = shallowRef(null);
let hoveredPoint = null;

useChartTheme(chartInstance);

const handleChartClick = () => {
  if (hoveredPoint) {
    let bgmId = parseInt(_.padEnd((hoveredPoint.y + '').split('.')[1], 12, '0').slice(-8));

    if (hoveredPoint.series.name === '评分') {
      window.open(`/subject/${bgmId}`);
    }
  }
};

onMounted(() => {
  initializeChart();
  if (chartContainer.value) {
    chartContainer.value.addEventListener('click', handleChartClick);
  }
});

onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
    chartInstance.value = null;
  }
  if (chartContainer.value) {
    chartContainer.value.removeEventListener('click', handleChartClick);
  }
});

const updateData = () => {
  if (chartInstance.value) {
    const countData = props.filteredYearlyData.map((point) => ({
      x: point.x,
      y: point.count || 0
    }));

    chartInstance.value.series[2].setData(countData, false);
    chartInstance.value.series[1].setData(props.filteredYearlyData, false);

    chartInstance.value.series[0].setData(props.historyData, false);

    chartInstance.value.redraw(); // Redraw chart after all updates
  }
};

const initializeChart = () => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
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
            requestAnimationFrame(() => {
              updateData();
            });
          }
        }
      },
      boost: {
        enabled: true,
        useGPUTranslations: true,
        usePreAllocated: true
      },

      tooltip: {
        formatter: function () {
          if (this.series.name === '均分') {
            return `${dayjs(this.x).year()}年<br/>
                   均分：<b>${this.y.toFixed(2)}</b><br/>
                   数量：<b>${this.point.count}</b>条`;
          }
          if (this.series.name === '数量') {
            return `${dayjs(this.x).year()}年<br/>
                   数量：<b>${this.y}</b>条`;
          }
          let bgmId = parseInt(_.padEnd((hoveredPoint.y + '').split('.')[1], 12, '0').slice(-8));

          if (!props.dic[bgmId]) {
            return `Error`;
          }

          return `<div class="scatter-tp-title"><b>${
            props.dic[bgmId].name_cn || props.dic[bgmId].name
          }</b></div><br /><div class="scatter-tp-body">首播：${dayjs(this.x).format('YYYY.MM.DD')}<br />排名：${props.dic[bgmId].rank}<br />评分：${props.dic[bgmId].score}</div>`;
        }
      },
      subtitle: {
        enabled: false
      },
      plotOptions: {
        scatter: {
          boostThreshold: 1,

          cursor: 'pointer',
          animation: {
            enabled: false,
            complete: function () {
              self.rendering = false;
            }
          },
          point: {
            events: {
              // click: function () {
              //   console.log('test');
              //   let rank = _.round(_.padEnd((this.y + '').split('.')[1], 9, '0').slice(-5));
              //   if (this.series.name === '评分') window.open(`/subject/${props.dic[rank].bgmId}`);
              // },
              mouseOver: function () {
                hoveredPoint = this;
              },
              mouseOut: function () {
                hoveredPoint = null;
              }
            }
          },
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
        },
        line: {
          boost: {
            enabled: false
          },
          marker: {
            symbol: 'circle'
          }
        },
        series: {}
      },
      yAxis: [
        {
          // Primary y-axis for scores
          startOnTick: false,
          title: {
            enabled: false
          },
          labels: {
            format: '{value:.1f}'
          },
          min: props.minScore - (props.minScore > 0 ? 0.05 : 0),
          max: props.maxScore + (props.maxScore < 10 ? 0.05 : 0)
        },
        {
          // Secondary y-axis for count
          min: 0,
          title: {
            enabled: false
          },
          labels: {
            style: {
              color: 'rgba(128, 128, 128, 0.8)'
            }
          },
          opposite: true,
          gridLineWidth: 0
        }
      ],
      xAxis: {
        type: 'datetime',
        min: dayjs().year(props.minYear).startOf('year').valueOf(),
        max: dayjs().year(props.maxYear).endOf('year').valueOf(),

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
          data: [],
          zones: [
            {
              value: props.minScore,
              color: 'transparent'
            },
            {
              value: props.maxScore,
              color: 'rgba(49, 148, 255, 0.4)'
            },
            {
              color: 'transparent'
            }
          ]
        },
        {
          type: 'line',
          color: PINK,
          name: '均分',
          data: []
        },
        // Add new series for count
        {
          type: 'column',
          name: '数量',
          yAxis: 1,
          data: [],
          color: 'rgba(128, 128, 128, 0.3)',
          tooltip: {
            valueSuffix: ' 条'
          },
          pointPadding: 0.1,
          groupPadding: 0.2,
          borderWidth: 0,
          zIndex: -1,
          visible: false
        }
      ],
      colors: COLORS10
    });

    chartInstance.value = chart;
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
  [
    () => props.historyData,
    () => props.minYear,
    () => props.maxYear,
    () => props.minScore,
    () => props.maxScore
  ],
  () => {
    if (chartInstance.value) {
      chartInstance.value.xAxis[0].setExtremes(
        dayjs().year(props.minYear).startOf('year').valueOf(),
        dayjs().year(props.maxYear).endOf('year').valueOf()
      );
      chartInstance.value.yAxis[0].setExtremes(
        props.minScore - (props.minScore > 0 ? 0.05 : 0),
        props.maxScore + (props.maxScore < 10 ? 0.05 : 0)
      );

      // todo: figure out why this is not working v11+;

      // // Update zones
      // chartInstance.value.series[0].update(
      //   {
      //     zones: [
      //       // Zone 1: Hide points below minScore

      //       {
      //         value: props.minScore,
      //         color: 'transparent'
      //       },
      //       // Zone 2: Show points between minScore and maxScore

      //       {
      //         value: props.maxScore,
      //         color: 'rgba(49, 148, 255, 0.4)'
      //       },
      //       // Zone 3: Hide points above maxScore
      //       {
      //         color: 'transparent'
      //       }
      //     ]
      //   },
      //   false
      // );

      updateData();
    }
  },
  { deep: true }
);
</script>
