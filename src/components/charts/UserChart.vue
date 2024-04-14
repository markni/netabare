<template>
  <div class="h-full" ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Highcharts from '@/utils/highcharts'
import { COLORS } from '@/constants/colors'

const props = defineProps({
  userData: {
    type: Array,
    required: true
  },
  globalData: {
    type: Array,
    default: () => [] // Set default to an empty array if not provided
  }
})

const chartContainer = ref(null)
let chartInstance = null

const initializeChart = () => {
  if (chartInstance) {
    chartInstance.destroy() // Destroys previous instance if exists
  }
  chartInstance = Highcharts.chart(chartContainer.value, {
    chart: {
      type: 'column',
      backgroundColor: null
    },
    title: {
      text: '',
      enabled: false
    },
    tooltip: {
      backgroundColor: 'black',
      borderColor: 'none',
      style: {
        color: 'white'
      },
      formatter: function () {
        return `${this.x}分：<b>${this.y}</b>部`
      }
    },
    subtitle: {
      enabled: false
    },
    plotOptions: {
      column: {
        colorByPoint: true,
        pointPadding: 0,
        dataLabels: {
          enabled: false
        }
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
    xAxis: {},
    exporting: {
      enabled: false
    },
    legend: {
      // layout: 'vertical',
      squareSymbol: true,
      align: 'center',
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
    series: [
      {
        name: '个人评分',
        color: 'red',
        data: [],
        colors: COLORS,
        maxPointWidth: 70,

        events: {
          legendItemClick: function () {
            return false // Prevents toggling this series off
          }
        }
      },
      {
        name: '全站评分',
        data: [],
        colors: ['rgba(0, 0, 0, 0.2)'],
        visible: false
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
}

onMounted(() => {
  initializeChart()
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})

// Watch for changes in userData and globalData props and update the chart accordingly
watch(
  [() => props.userData, () => props.globalData],
  () => {
    if (chartInstance) {
      chartInstance.series[0].setData(props.userData)
      if (props.globalData && props.globalData.length) {
        chartInstance.series[1].setData(props.globalData)
      }
      chartInstance.series[1].hide() // Hide the series if no data
    }
  },
  { deep: true }
)
</script>
