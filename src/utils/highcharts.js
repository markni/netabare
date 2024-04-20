// highchartsSettings.js
import Highcharts from 'highcharts'
import HighchartsBoost from 'highcharts/modules/boost'

HighchartsBoost(Highcharts)

// Set global Highcharts options
Highcharts.setOptions({
  chart: {
    backgroundColor: null
  },
  lang: {
    thousandsSep: '',
    resetZoom: '重置缩放'
  },
  title: {
    text: '',
    enabled: false
  },
  boost: {
    enabled: false // Enable boost globally
  },
  exporting: {
    enabled: false
  },
  credits: {
    enabled: false
  },
  plotOptions: {
    series: {
      states: {
        inactive: {
          opacity: 1
        }
      },
      animation: true, // Enable initial animation for all series
      duration: 5000 // Set the initial animation duration to 1 second
    }
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
  }
  // Add other global options as needed
})

// Export the Highcharts object with global options set
export default Highcharts
