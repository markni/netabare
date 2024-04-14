// highchartsSettings.js
import Highcharts from 'highcharts';
import HighchartsBoost from 'highcharts/modules/boost';

HighchartsBoost(Highcharts);

// Set global Highcharts options
Highcharts.setOptions({
  lang: {
    thousandsSep: '',
    resetZoom: '重置缩放',
  },
  boost: {
    enabled: false, // Enable boost globally
  },
  plotOptions: {
    series: {
      states: {
        inactive: {
          opacity: 1
        }
      },
      animation: true, // Enable initial animation for all series
      duration: 5000, // Set the initial animation duration to 1 second
    },
  },
  // Add other global options as needed
});

// Export the Highcharts object with global options set
export default Highcharts;
