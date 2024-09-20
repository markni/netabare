<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Highcharts from '@/utils/highcharts'
import { BLUE, COLORS10 } from '@/constants/colors'
import { useRouter } from 'vue-router'

const props = defineProps({
  historyData: {
    type: Array,
    required: true
  }
})

const chartContainer = ref(null)
let chartInstance = null
const router = useRouter()

const updateData = () => {
  if (chartInstance) {
    const currentSeries = {}

    // Create a map of existing series by their names for easy lookup
    chartInstance.series.forEach((series) => {
      currentSeries[series.name] = series
    })

    // Add or update series
    props.historyData.forEach((seriesData) => {
      const { name, bgmId, scoreHistory, color, airDate } = seriesData
      const zones = [
        {
          value: airDate, // All points with x < airDate
          dashStyle: 'Dash',
          color: color // Optional: maintain the original color
        },
        {
          dashStyle: 'Solid',
          color: color // Optional: maintain the original color
        }
      ]

      if (currentSeries[name]) {
        // Update existing series
        currentSeries[name].setData(scoreHistory, false)
        currentSeries[name].update({ zones }, false)
        delete currentSeries[name] // Remove from currentSeries to avoid deleting it later
      } else {
        // Add new series if it does not exist
        chartInstance.addSeries(
          {
            name: name,
            id: bgmId,
            data: scoreHistory,
            type: 'spline',
            yAxis: 0,
            color: color,
            zones: zones,
            zoneAxis: 'x' // Ensure zones are based on the x-axis
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
            legendItemClick: function (e) {
              const { browserEvent } = e
              if (
                browserEvent.target &&
                browserEvent.target.matches('.legend-link') &&
                e.target.userOptions.id
              ) {
                router.push(`/subject/${e.target.userOptions.id}`)
                return false
              }
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
      legend: {
        useHTML: true,
        labelFormatter: function () {
          return `${this.name} <span class="legend-link" style="color: ${BLUE}; opacity: 0.5; font-size: 11px; cursor: pointer;" >[↗]</span>`
        }
      },
      series: [],
      colors: COLORS10 // Use the COLORS constant
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

// Watch for changes in historyData prop and update the chart accordingly
watch(
  () => props.historyData,
  () => {
    updateData()
  },
  { deep: true }
)
</script>

<template>
  <div class="h-full" ref="chartContainer"></div>
</template>

<style scoped></style>
