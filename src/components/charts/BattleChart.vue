<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Highcharts from '@/utils/highcharts'
import { COLORS } from '@/constants/colors'

const props = defineProps({
  historyData: {
    type: Array,
    required: true
  }
})

const chartContainer = ref(null)
let chartInstance = null

const updateData = () => {
  if (chartInstance) {
    const currentSeries = {}

    // Create a map of existing series by their names for easy lookup
    chartInstance.series.forEach((series) => {
      currentSeries[series.name] = series
    })

    // Add or update series
    props.historyData.forEach((seriesData) => {
      if (currentSeries[seriesData.name]) {
        // Update existing series
        currentSeries[seriesData.name].setData(seriesData.history, false)
        delete currentSeries[seriesData.name] // Remove from currentSeries to avoid deleting it later
      } else {
        // Add new series if it does not exist
        chartInstance.addSeries(
          {
            name: seriesData.name,
            id: seriesData.bgmId,
            data: seriesData.history,
            type: 'spline',
            yAxis: 0
          },
          false
        )
      }
    })

    // Remove series that are no longer present in newData
    Object.keys(currentSeries).forEach((name) => {
      currentSeries[name].remove(false)
    })

    // Redraw the chart after all operations
    chartInstance.redraw()
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
          },
          events: {
            legendItemClick: function () {
              window.location.href = `/subject/${this.options.id}`
              return false // Prevents the default toggle behavior
            }
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
        // layout: 'vertical',
        align: 'right',
        verticalAlign: 'bottom',
        itemStyle: {
          color: '#2c3e50',
          fontWeight: 'normal',
          fontSize: '16px',
          fontFamily: `'source-han-serif-sc', serif`
        }
      },
      credits: {
        enabled: false
      },
      series: [],
      colors: COLORS // Use the COLORS constant
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
