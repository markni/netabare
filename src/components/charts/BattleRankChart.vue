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
    const epPlotOptions = {
      color: 'rgba(0,0,0,0.2)',
      width: 2,
      dashStyle: 'longdashdot',
      label: {
        useHTML: true,
        y: 20,
        style: {
          fontSize: '14px',
          fontFamily: `'source-han-serif-sc', serif`,
          color: 'rgba(0,0,0,0.2)'
        },
        text: '<a target="_blank" href="https://bgm.tv/anime/browser?sort=rank" title="Bangumi排名第一页">第一页之墙</a>'
      },
      value: 24
    }

    const currentSeries = {}

    // Create a map of existing series by their names for easy lookup
    chartInstance.series.forEach((series) => {
      currentSeries[series.name] = series
    })

    chartInstance.yAxis[0].plotLinesAndBands.forEach((plotLine) => {
      chartInstance.yAxis[0].removePlotLine(plotLine.id)
    })

    chartInstance.yAxis[0].addPlotLine(epPlotOptions)
    // Add or update series
    props.historyData.forEach((seriesData) => {
      if (currentSeries[seriesData.name]) {
        // Update existing series
        currentSeries[seriesData.name].setData(seriesData.rankHistory, false)
        delete currentSeries[seriesData.name] // Remove from currentSeries to avoid deleting it later
      } else {
        // Add new series if it does not exist
        chartInstance.addSeries(
          {
            name: seriesData.name,
            id: seriesData.bgmId,
            data: seriesData.rankHistory,
            type: 'line',
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
        zoomType: 'xy'
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
          },
          states: {
            inactive: {
              opacity: 0.5
            }
          },
          events: {
            // legendItemClick: function () {
            //   window.location.href = `/subject/${this.options.id}`
            //   return false // Prevents the default toggle behavior
            // }
          }
        }
      },
      yAxis: {
        reversed: true,
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
        }
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
