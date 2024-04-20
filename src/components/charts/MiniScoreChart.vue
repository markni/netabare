<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Highcharts from '@/utils/highcharts'
import { BLUE } from '@/constants/colors'

const props = defineProps({
  historyData: {
    type: Array,
    required: true
  },
  color: {
    type: String,
    default: BLUE
  }
})

const chartContainer = ref(null)
let chartInstance = null

const updateData = () => {
  if (chartInstance) {
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
      tooltip: {
        enabled: false
      },

      plotOptions: {
        spline: {
          marker: {
            enabled: false
          }
        },
        series: {
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
            enabled: false
          },
          tickInterval: 0.1
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
        labels: {
          enabled: false
        }
      },

      legend: {
        enabled: false
      },

      series: [
        {
          type: 'spline',
          name: '评分',
          yAxis: 0,
          data: [],
          color: props.color
        }
      ]
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
  { deep: false }
)
</script>

<template><div class="h-full" ref="chartContainer"></div></template>
