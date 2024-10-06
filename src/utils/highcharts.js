// highchartsSettings.js
import Highcharts from 'highcharts';
import HighchartsBoost from 'highcharts/modules/boost';
import { IVORY } from '../constants/colors';

HighchartsBoost(Highcharts);

// Set global Highcharts options
Highcharts.setOptions({
  chart: {
    backgroundColor: null
  },
  lang: {
    thousandsSep: '',
    resetZoom: '重置缩放'
  },

  subtitle: {
    enabled: false
  },
  tooltip: {
    crosshairs: true,
    backgroundColor: 'black',
    borderColor: 'none',
    style: {
      color: IVORY
    },
    useHTML: false,
    xDateFormat: '%Y-%m-%d'
  },
  title: {
    text: '',
    enabled: false
  },
  boost: {
    enabled: false,
    useGPUTranslations: true,
    usePreAllocated: true
  },
  exporting: {
    enabled: false
  },
  accessibility: {
    enabled: false
  },
  credits: {
    enabled: false
  },
  plotOptions: {
    spline: {
      // lineWidth: 3,
      // shadow: {
      //   color: 'rgba(255, 255, 255, 0.5)', // White shadow for glow
      //   width: 8,
      //   offsetX: 0,
      //   offsetY: 0
      // }
    },
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
      fontWeight: 'normal',
      fontSize: '16px',
      fontFamily: `'source-han-serif-sc', serif`
    }
  }

  // Add other global options as needed
});

// Export the Highcharts object with global options set
export default Highcharts;
