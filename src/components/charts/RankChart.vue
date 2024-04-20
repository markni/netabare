<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Highcharts from '@/utils/highcharts'
import { GOLD } from '@/constants/colors'
import _ from 'lodash'

const props = defineProps({
  historyData: {
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
})

const chartContainer = ref(null)
let chartInstance = null

const updateRange = () => {
  if (chartInstance) {
    chartInstance.xAxis[0].setExtremes(props.xMin, props.xMax)
  }
}

const updateData = () => {
  if (chartInstance) {
    const epPlotOptions = {
      color: 'rgba(0,0,0,0.1)',
      width: 2,
      dashStyle: 'longdashdot',
      label: {
        verticalAlign: 'bottom',
        textAlign: 'right',
        y: -10,
        x: 5,
        useHTML: true
      }
    }

    chartInstance.xAxis[0].plotLinesAndBands.forEach((plotLine) => {
      chartInstance.xAxis[0].removePlotLine(plotLine.id)
    })

    Object.entries(props.epsData).forEach(([airdateValue, episodes]) => {
      let epOption = _.cloneDeep(epPlotOptions)
      epOption.value = Number(airdateValue)

      // Set the label text to list all episodes for this airdate
      epOption.label.text = episodes
        .map(
          (ep) =>
            `<a target="_blank" href="https://bgm.tv/ep/${ep.id}">ep.${
              ep.sort
            } ${episodes.length > 1 ? '' : ep.name_cn || ep.name}</a>`
        )
        .join(', ')

      chartInstance.xAxis[0].addPlotLine(epOption)
    })

    // Update the series data

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
      chart: {
        zoomType: 'x'
      },
      plotOptions: {
        line: {
          marker: {
            enabled: false
          }
        },
        series: {
          turboThreshold: 365 * 10
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

      series: [
        {
          step: true,
          name: '排名',
          data: []
        }
      ],
      colors: [GOLD]
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

watch(
  [() => props.xMax],
  () => {
    updateRange()
  },
  { deep: true }
)
</script>

<template><div class="h-full" ref="chartContainer"></div></template>

<style scoped></style>
