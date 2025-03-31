<script setup>
import { ref, onMounted, onUnmounted, watch, shallowRef } from 'vue';
import Highcharts from '@/utils/highcharts';
import { BLUE, COLORS10 } from '@/constants/colors';
import { useRouter } from 'vue-router';
import { useChartTheme } from '@/composables/useChartTheme';

const props = defineProps({
  historyData: {
    type: Array,
    required: true
  },
  showLabels: {
    type: Boolean,
    default: false
  }
});

const chartContainer = ref(null);
const chartInstance = shallowRef(null);
const router = useRouter();
useChartTheme(chartInstance);

const updateData = () => {
  if (chartInstance.value) {
    const currentSeries = {};

    // Create a map of existing series by their names for easy lookup
    chartInstance.value.series.forEach((series) => {
      currentSeries[series.name] = series;
    });

    // Add or update series
    props.historyData.forEach((seriesData) => {
      const { name, bgmId, scoreHistory, color, airDate } = seriesData;
      const zones = [
        {
          value: airDate, // All points with x < airDate
          dashStyle: 'ShortDot',
          color: color // Optional: maintain the original color
        },
        {
          dashStyle: 'Solid',
          color: color // Optional: maintain the original color
        }
      ];

      // Prepare data with the last point having a dataLabel if showLabels is true
      let formattedData = [...scoreHistory];

      // Always format all points as basic data points first
      formattedData = formattedData.map((point) => [point[0], point[1]]);

      // Then add data label to the last point only if showLabels is true
      if (props.showLabels && formattedData.length > 0) {
        const lastIndex = formattedData.length - 1;
        formattedData[lastIndex] = {
          x: formattedData[lastIndex][0],
          y: formattedData[lastIndex][1],
          dataLabels: {
            enabled: true,
            format: `${name}: {y:.2f}`,
            allowOverlap: true,
            align: 'left',
            verticalAlign: 'bottom',
            // backgroundColor: 'rgba(0, 0,0 , 0.5)',
            // overflow: 'allow',
            // crop: false,
            style: {
              fontSize: '15px',
              color: color,
              textOutline: false,
              fontFamily: `'source-han-serif-sc', serif`
            }
          }
        };
      }

      if (currentSeries[name]) {
        // Update existing series

        currentSeries[name].setData(formattedData, false, true, false);

        currentSeries[name].update({ zones }, false);
        delete currentSeries[name]; // Remove from currentSeries to avoid deleting it later
      } else {
        // Add new series if it does not exist
        chartInstance.value.addSeries(
          {
            name: name,
            id: bgmId,
            data: formattedData,
            type: 'spline',
            yAxis: 0,
            color: color,
            zones: zones,
            zoneAxis: 'x' // Ensure zones are based on the x-axis
          },
          false
        );
      }
    });

    // Remove series that are no longer present in newData
    Object.keys(currentSeries).forEach((name) => {
      currentSeries[name].remove(false);
    });

    // Redraw the chart after all operations
    chartInstance.value.redraw();
  }
};

const initializeChart = () => {
  if (chartInstance.value) {
    chartInstance.value.destroy(); // Destroys previous instance if exists
  }
  if (chartContainer.value) {
    const chart = Highcharts.chart(chartContainer.value, {
      // Chart configuration options
      chart: {
        zoomType: 'xy',
        events: {
          load: function () {
            chartInstance.value = this;
          }
        }
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
              const { browserEvent } = e;
              if (
                browserEvent.target &&
                browserEvent.target.matches('.legend-link') &&
                e.target.userOptions.id
              ) {
                router.push(`/subject/${e.target.userOptions.id}`);
                return false;
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
          },
          tickInterval: 0.5 // Set fixed tick interval at 0.5
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
          return `${this.name} <span class="legend-link" style="color: ${BLUE}; opacity: 0.5; font-size: 11px; cursor: pointer;" >[↗]</span>`;
        }
      },
      series: [],
      colors: COLORS10 // Use the COLORS constant
    });

    // Immediately set the chartInstance
    chartInstance.value = chart;

    updateData();
  }
};

onMounted(() => {
  initializeChart();
});

onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
    chartInstance.value = null;
  }
});

// Watch for changes in historyData prop and update the chart accordingly
watch(
  () => props.historyData,
  () => {
    updateData();
  },
  { deep: true }
);

// Update the watcher for the showLabels prop
watch(
  () => props.showLabels,
  () => {
    updateData();
  }
);
</script>

<template>
  <div class="h-full" ref="chartContainer"></div>
</template>

<style scoped></style>
