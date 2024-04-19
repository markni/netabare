<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Highcharts from '@/utils/highcharts'
import { COLORS } from '@/constants/colors'

const props = defineProps({
  historyData: {
    type: Array,
    required: true
  },

  subjectData: {
    type: Object,
    required: true
  },

  oneData: {
    type: Array,
    required: true
  },
  tenData: {
    type: Array,
    required: true
  }
})

const chartContainer = ref(null)
let chartInstance = null

const updateData = () => {
  if (chartInstance) {
    // Update the series data
    chartInstance.series[1].update(
      {
        data: props.oneData
      },
      false //redraw
    )
    chartInstance.series[2].update(
      {
        data: props.tenData
      },
      false
    )
    chartInstance.series[0].update(
      {
        data: props.historyData
      },
      true
    )
  }
}

const initializeChart = () => {
  if (chartInstance) {
    chartInstance.destroy() // Destroys previous instance if exists
  }
  if (chartContainer.value) {
    chartInstance = Highcharts.chart(chartContainer.value, {
      // Chart configuration options
      chart: {
        zoomType: 'x',
        backgroundColor: null
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
        useHTML: false,
        xDateFormat: '%Y-%m-%d'
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
        }
      },
      exporting: {
        enabled: false
      },
      legend: {
        display: true,
        position: 'bottom',
        align: 'right',
        itemStyle: {
          color: '#2c3e50',
          fontWeight: 'normal',
          fontSize: '1rem',
          fontFamily: `'source-han-serif-sc', serif`
        }
      },
      credits: {
        enabled: false
      },
      series: [
        {
          type: 'spline',
          name: '评分',
          yAxis: 0,
          data: []
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
      colors: COLORS, // Use the COLORS constant
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

<template><div class="h-full" ref="chartContainer"></div></template>

<style scoped></style>
