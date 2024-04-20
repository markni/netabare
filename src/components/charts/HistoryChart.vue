<template>
  <div class="h-full" ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Highcharts from '@/utils/highcharts'
import _ from 'lodash'
import dayjs from 'dayjs'
import { COLORS, GOLD } from '@/constants/colors.js'

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
})

const chartContainer = ref(null)
let chartInstance = null

const updateData = () => {
  if (chartInstance) {
    chartInstance.series[1].update({ data: props.yearlyData }, false)
    chartInstance.series[0].update({ data: props.historyData }, true)
  }
}

const initializeChart = () => {
  if (chartInstance) {
    chartInstance.destroy() // Destroys previous instance if exists
  }
  if (chartContainer.value) {
    chartInstance = Highcharts.chart(chartContainer.value, {
      chart: {
        type: 'scatter',
        zoomType: 'xy',
        backgroundColor: null
      },
      boost: {
        enabled: true,
        useGPUTranslations: true,
        usePreAllocated: true
      },
      rangeSelector: {
        verticalAlign: 'top',
        x: 0,
        y: 0
      },
      title: {
        text: '',
        enabled: false
      },
      tooltip: {
        crosshairs: true,
        backgroundColor: 'black',
        borderColor: 'none',
        style: {
          color: 'white'
        },
        // xDateFormat: '%Y-%m-%d',
        formatter: function () {
          if (this.series.name === '年度均分') {
            return `${dayjs(this.x).year()}年均分：<b>${this.y.toFixed(2)}</b>`
          }
          let rank = _.round(_.padEnd((this.y + '').split('.')[1], 9, '0').slice(-5))

          if (!props.dic[rank]) {
            return `Error`
          }

          return `<div class="scatter-tp-title"><b>${
            props.dic[rank].name_cn || props.dic[rank].name
          }</b></div><br /><div class="scatter-tp-body">首播：${dayjs(this.x).format('YYYY.MM.DD')}<br />排名：${rank}<br />均分：${props.dic[rank].score}</div>`
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
              self.rendering = false
            }
          },
          point: {
            events: {
              click: function () {
                let rank = _.round(_.padEnd((this.y + '').split('.')[1], 9, '0').slice(-5))
                if (this.series.name === '评分') window.open(`/subject/${props.dic[rank].bgmId}`)
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
                // lineColor: 'rgb(100,100,100)',
                fillColor: COLORS[8]
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
      exporting: {
        enabled: false
      },

      credits: {
        enabled: false
      },
      series: [
        {
          color: 'rgba(49, 148, 255, 0.4)',
          name: '评分',
          data: []
        },
        {
          type: 'line',
          color: GOLD,
          name: '年度均分',
          data: []
        }
      ],
      colors: COLORS,
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom'
              }
            }
          }
        ]
      }
    })
    updateData()
  }
}

onMounted(() => {
  initializeChart()
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})

// Watch for changes in userData and globalData props and update the chart accordingly
watch(
  [() => props.historyData],
  () => {
    updateData()
  },
  { deep: true }
)
</script>
