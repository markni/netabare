<script setup>
import { ref, onMounted, onUnmounted, watch, shallowRef } from 'vue';
import Highcharts from '@/utils/highcharts';
import { BLUE, COLORS10 } from '@/constants/colors';
import { useRouter } from 'vue-router';
import { useChartTheme } from '@/composables/useChartTheme';
import { useInViewOnce } from '@/composables/useInViewOnce';

const props = defineProps({
  historyData: {
    type: Array,
    required: true
  },
  showLabels: {
    type: Boolean,
    default: false
  },
  animateWhenInView: {
    type: Boolean,
    default: false
  }
});

const chartContainer = ref(null);
const chartInstance = shallowRef(null);
const router = useRouter();
useChartTheme(chartInstance);
const { isInViewOnce } = useInViewOnce(chartContainer, { enabled: props.animateWhenInView });

const getLatestScore = (scoreHistory = []) => {
  if (!Array.isArray(scoreHistory) || scoreHistory.length === 0) return Number.NEGATIVE_INFINITY;
  const latest = Number(scoreHistory[scoreHistory.length - 1]?.[1]);
  return Number.isFinite(latest) ? latest : Number.NEGATIVE_INFINITY;
};

const updateData = () => {
  if (props.animateWhenInView && !isInViewOnce.value) return;
  if (chartInstance.value) {
    const currentSeries = {};

    // Create a map of existing series by their id for reliable updates
    chartInstance.value.series.forEach((series) => {
      const seriesId = String(series.userOptions?.id || '');
      if (seriesId) {
        currentSeries[seriesId] = series;
      }
    });

    // Keep sorting local to this chart: do not mutate source data from the store.
    const sortedHistoryData = [...props.historyData].sort((a, b) => {
      const scoreDiff = getLatestScore(b.scoreHistory) - getLatestScore(a.scoreHistory);
      if (scoreDiff !== 0) return scoreDiff;
      const nameA = a?.name || '';
      const nameB = b?.name || '';
      return nameA.localeCompare(nameB, 'zh-Hans-CN');
    });

    // Add or update series
    sortedHistoryData.forEach((seriesData) => {
      const { name, bgmId, scoreHistory, color, airDate } = seriesData;
      const latestScore =
        Array.isArray(scoreHistory) && scoreHistory.length > 0
          ? Number(scoreHistory[scoreHistory.length - 1][1])
          : null;
      const scorePrefix = Number.isFinite(latestScore) ? latestScore.toFixed(2) : 'N/A';
      const legendName = `${scorePrefix} ${name}`;
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
            format: `${legendName}: {y:.2f}`,
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

      if (currentSeries[String(bgmId)]) {
        // Update existing series

        currentSeries[String(bgmId)].setData(formattedData, false, true, false);

        currentSeries[String(bgmId)].update({ zones, name: legendName }, false);
        delete currentSeries[String(bgmId)]; // Remove from currentSeries to avoid deleting it later
      } else {
        // Add new series if it does not exist
        chartInstance.value.addSeries(
          {
            name: legendName,
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
          animation:
            props.animateWhenInView && !isInViewOnce.value
              ? false
              : {
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
        tickPixelInterval: 120,
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
          const match = this.name.match(/^(\d+\.\d{2}|N\/A)\s+(.*)$/);
          const displayName = match
            ? `<span style="color: ${this.color};">${match[1]}</span> ${match[2]}`
            : this.name;
          return `${displayName} <span class="legend-link" style="color: ${BLUE}; opacity: 0.5; font-size: 11px; cursor: pointer;" >[↗]</span>`;
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

watch(
  () => isInViewOnce.value,
  (visible) => {
    if (props.animateWhenInView && visible) {
      initializeChart();
    }
  }
);
</script>

<template>
  <div class="h-full" ref="chartContainer"></div>
</template>

<style scoped></style>
