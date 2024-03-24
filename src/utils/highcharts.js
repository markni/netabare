// highchartsSettings.js
import Highcharts from 'highcharts';
import HighchartsBoost from 'highcharts/modules/boost';

HighchartsBoost(Highcharts);

// Set global Highcharts options
Highcharts.setOptions({
  boost: {
    enabled: false, // Enable boost globally
  },
  plotOptions: {
    series: {
      animation: true, // Enable initial animation for all series
    },
  },
  // Add other global options as needed
});

// Export the Highcharts object with global options set
export default Highcharts;
