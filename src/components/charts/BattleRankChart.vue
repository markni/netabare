<script setup>
import { computed, ref, onMounted, onUnmounted, watch, shallowRef } from 'vue';
import Highcharts from '@/utils/highcharts';
import { BLACK, BLUE, COLORS10, COLORS10_VIVID, IVORY } from '@/constants/colors';
import { useRouter } from 'vue-router';
import { useChartTheme } from '@/composables/useChartTheme';
import { useInViewOnce } from '@/composables/useInViewOnce';
import { useThemeStore } from '@/stores/theme';

const props = defineProps({
  historyData: {
    type: Array,
    required: true
  },
  animateWhenInView: {
    type: Boolean,
    default: false
  },
  useThemePalette: {
    type: Boolean,
    default: false
  }
});

const chartContainer = ref(null);
const chartInstance = shallowRef(null);
const endLabelsGroup = shallowRef(null);
const endLabelsReady = ref(false);
const pendingEndLabelSeriesIds = new Set();
let endLabelsFallbackTimer = null;
useChartTheme(chartInstance);
const { isInViewOnce } = useInViewOnce(chartContainer, { enabled: props.animateWhenInView });

const router = useRouter();
const themeStore = useThemeStore();
const rankColors = computed(() =>
  props.useThemePalette && !themeStore.isDarkMode ? COLORS10 : COLORS10_VIVID
);

const getLatestRank = (rankHistory = []) => {
  if (!Array.isArray(rankHistory) || rankHistory.length === 0) return Number.POSITIVE_INFINITY;
  const latest = Number(rankHistory[rankHistory.length - 1]?.[1]);
  return Number.isFinite(latest) ? latest : Number.POSITIVE_INFINITY;
};

const destroyEndLabels = () => {
  if (endLabelsGroup.value) {
    endLabelsGroup.value.destroy();
    endLabelsGroup.value = null;
  }
};

const clearEndLabelsFallbackTimer = () => {
  if (endLabelsFallbackTimer) {
    clearTimeout(endLabelsFallbackTimer);
    endLabelsFallbackTimer = null;
  }
};

const getLatestRenderedPoint = (series) =>
  [...series.points].reverse().find((point) => Number.isFinite(point.plotX + point.plotY));

const getSeriesId = (series) => String(series.userOptions?.id || series.options?.id || '');

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatEndLabel = (name, rankColor, underlineName = false) => {
  const textColor = themeStore.isDarkMode ? IVORY : BLACK;
  const nameStyle = `color: ${textColor};${
    underlineName ? ' text-decoration: underline; text-underline-offset: 3px;' : ''
  }`;
  const match = String(name).match(/^(#(?:\d+|N\/A))\s+(.*)$/);
  if (!match) return `<span style="${nameStyle}">${escapeHtml(name)}</span>`;

  return [
    `<span style="color: ${rankColor};">${escapeHtml(match[1])}</span>`,
    `<span style="${nameStyle}">${escapeHtml(match[2])}</span>`
  ].join(' ');
};

const showEndLabelsAfterAnimation = () => {
  clearEndLabelsFallbackTimer();
  endLabelsReady.value = true;
  renderEndLabels();
};

const markEndLabelSeriesAnimated = (series) => {
  const seriesId = getSeriesId(series);
  if (!seriesId || !pendingEndLabelSeriesIds.size) return;

  pendingEndLabelSeriesIds.delete(seriesId);
  if (!pendingEndLabelSeriesIds.size) {
    showEndLabelsAfterAnimation();
  }
};

const resetEndLabelAnimationGate = (seriesDataList) => {
  destroyEndLabels();
  clearEndLabelsFallbackTimer();
  pendingEndLabelSeriesIds.clear();

  const isInitialDataRender = chartInstance.value?.series.length === 0;
  if (!isInitialDataRender) {
    endLabelsReady.value = true;
    return;
  }

  seriesDataList.forEach((seriesData) => {
    if (Array.isArray(seriesData?.rankHistory) && seriesData.rankHistory.length > 0) {
      pendingEndLabelSeriesIds.add(String(seriesData.bgmId));
    }
  });

  endLabelsReady.value = pendingEndLabelSeriesIds.size === 0;
  if (!endLabelsReady.value) {
    endLabelsFallbackTimer = setTimeout(showEndLabelsAfterAnimation, 1200);
  }
};

const distributeLabelY = (items, minY, maxY) => {
  const gap = 6;
  let nextY = minY;

  items
    .sort((a, b) => a.pointY - b.pointY)
    .forEach((item) => {
      item.labelY = Math.max(item.pointY - item.height / 2, nextY);
      nextY = item.labelY + item.height + gap;
    });

  const overflow = nextY - gap - maxY;
  if (overflow > 0) {
    const availableShift = Math.max(items[0].labelY - minY, 0);
    const shift = Math.min(overflow, availableShift);
    items.forEach((item) => {
      item.labelY -= shift;
    });
  }

  for (let index = items.length - 2; index >= 0; index -= 1) {
    const current = items[index];
    const next = items[index + 1];
    const maxCurrentY = next.labelY - current.height - gap;
    current.labelY = Math.min(current.labelY, maxCurrentY);
  }

  if (items.length && items[0].labelY < minY) {
    const shift = minY - items[0].labelY;
    items.forEach((item) => {
      item.labelY += shift;
    });
  }
};

const renderEndLabels = () => {
  const chart = chartInstance.value;
  if (!chart || chart.isResizing) return;

  destroyEndLabels();
  if (!endLabelsReady.value) return;

  const labelX = chart.plotLeft + chart.plotWidth + 48;
  const minY = chart.plotTop + 8;
  const maxY = chart.plotTop + chart.plotHeight - 8;
  const group = chart.renderer.g('battle-rank-end-labels').attr({ zIndex: 7 }).add();
  endLabelsGroup.value = group;

  const items = chart.series
    .filter((series) => series.visible)
    .map((series) => {
      const point = getLatestRenderedPoint(series);
      if (!point) return null;

      const color = series.color;
      const seriesId = getSeriesId(series);
      const label = chart.renderer
        .label(formatEndLabel(series.name, color), labelX, minY, null, null, null, true)
        .css({
          fontSize: '15px',
          fontFamily: `'source-han-serif-sc', serif`,
          fontWeight: 'bold',
          cursor: 'pointer',
          textOutline: 'none'
        })
        .attr({
          padding: 0
        })
        .add(group);

      if (seriesId) {
        label.on('click', () => {
          router.push(`/subject/${seriesId}`);
        });
        label.on('mouseover', () => {
          label.attr({ text: formatEndLabel(series.name, color, true) });
        });
        label.on('mouseout', () => {
          label.attr({ text: formatEndLabel(series.name, color) });
        });
      }

      const bbox = label.getBBox();

      return {
        color,
        pointX: chart.plotLeft + point.plotX,
        pointY: chart.plotTop + point.plotY,
        height: Math.max(bbox.height, 18),
        label
      };
    })
    .filter(Boolean);

  if (!items.length) return;

  distributeLabelY(items, minY, maxY);

  items.forEach((item) => {
    const labelCenterY = item.labelY + item.height / 2;
    const connectorEndX = labelX - 12;
    const connectorStartX = item.pointX + 10;

    chart.renderer
      .path([
        ['M', connectorStartX, item.pointY],
        ['L', connectorEndX, labelCenterY]
      ])
      .attr({
        stroke: item.color,
        'stroke-width': 1.25,
        opacity: 0.75,
        fill: 'none'
      })
      .add(group);

    chart.renderer
      .circle(item.pointX, item.pointY, 3.5)
      .attr({
        fill: item.color,
        stroke: item.color,
        'stroke-width': 1,
        opacity: 0.9
      })
      .add(group);

    item.label.attr({
      x: labelX,
      y: item.labelY
    });
  });
};

const updateData = () => {
  if (props.animateWhenInView && !isInViewOnce.value) return;
  if (chartInstance.value) {
    // Define the plot line options
    const epPlotOptions = {
      id: 'ep-plot-line',
      color: 'rgba(0,0,0,0.2)',
      width: 2,
      dashStyle: 'longdashdot',
      label: {
        useHTML: true,
        y: -20,
        style: {
          fontSize: '14px',
          fontFamily: `'source-han-serif-sc', serif`,
          color: 'rgba(0,0,0,0.2)'
        },
        text: '<a target="_blank" href="https://bgm.tv/anime/browser?sort=rank" title="Bangumi排名第一页">第一页之墙</a>'
      },
      value: 24 // Adjust this value as needed
    };

    // Remove existing plot lines to prevent duplicates
    chartInstance.value.yAxis[0].removePlotLine('ep-plot-line');

    // Add the new plot line
    chartInstance.value.yAxis[0].addPlotLine(epPlotOptions);

    const currentSeries = {};

    // Create a map of existing series by id for reliable updates
    chartInstance.value.series.forEach((series) => {
      const seriesId = String(series.userOptions?.id || '');
      if (seriesId) {
        currentSeries[seriesId] = series;
      }
    });

    // Keep sorting local to this chart: do not mutate source data from the store.
    const sortedHistoryData = [...props.historyData].sort((a, b) => {
      const rankDiff = getLatestRank(a.rankHistory) - getLatestRank(b.rankHistory);
      if (rankDiff !== 0) return rankDiff;
      const nameA = a?.name || '';
      const nameB = b?.name || '';
      return nameA.localeCompare(nameB, 'zh-Hans-CN');
    });
    resetEndLabelAnimationGate(sortedHistoryData);

    // Add or update series
    sortedHistoryData.forEach((seriesData, index) => {
      const { name, bgmId, rankHistory, color, airDate } = seriesData;
      const seriesColor = color || rankColors.value[index % rankColors.value.length];
      const latestRank = getLatestRank(rankHistory);
      const rankPrefix = Number.isFinite(latestRank) ? `#${Math.round(latestRank)}` : '#N/A';
      const prefixedName = `${rankPrefix} ${name}`;

      // Define zones based on airDate
      const zones = [
        {
          value: airDate, // All points with x < airDate
          dashStyle: 'ShortDot',
          color: seriesColor // Maintain original color
        },
        {
          dashStyle: 'Solid',
          color: seriesColor // Maintain original color
        }
      ];

      const formattedData = Array.isArray(rankHistory)
        ? rankHistory.map((point) => [point[0], point[1]])
        : [];

      if (currentSeries[String(bgmId)]) {
        // Update existing series
        currentSeries[String(bgmId)].setData(formattedData, false, true, false);
        currentSeries[String(bgmId)].update(
          {
            name: prefixedName,
            color: seriesColor,
            zones: zones,
            zoneAxis: 'x' // Ensure zones are based on the x-axis
          },
          false
        );
        delete currentSeries[String(bgmId)]; // Remove from currentSeries to avoid deleting it later
      } else {
        // Add new series if it does not exist
        chartInstance.value.addSeries(
          {
            name: prefixedName,
            id: bgmId,
            data: formattedData,
            type: 'line',
            yAxis: 0,
            color: seriesColor,
            zones: zones,
            zoneAxis: 'x', // Ensure zones are based on the x-axis
            marker: {
              enabled: false
            }
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
    chartInstance.value.destroy(); // Destroy previous instance if exists
  }
  if (chartContainer.value) {
    const chart = Highcharts.chart(chartContainer.value, {
      // Chart configuration options
      chart: {
        spacingRight: 400,
        zoomType: 'xy',
        events: {
          load: function () {
            chartInstance.value = this;
          },
          render: function () {
            renderEndLabels();
          }
        }
      },

      plotOptions: {
        line: {
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
            afterAnimate: function () {
              markEndLabelSeriesAnimated(this);
            },
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
      yAxis: {
        reversed: true,
        title: {
          enabled: false
        },

        min: -50, // Extend axis below 0 (visually above 0 on a reversed chart)
        labels: {
          format: '{value:.0f}',

          formatter: function () {
            return this.value >= 0 ? this.value : '';
          }
        }
      },
      legend: {
        enabled: false,
        useHTML: true,
        labelFormatter: function () {
          const match = this.name.match(/^(#(?:\d+|N\/A))\s+(.*)$/);
          const displayName = match
            ? `<span style="color: ${this.color};">${match[1]}</span> ${match[2]}`
            : this.name;
          return `${displayName} <span class="legend-link" style="color: ${BLUE}; opacity: 0.5; font-size: 11px; cursor: pointer;" >[↗]</span>`;
        }
      },
      xAxis: {
        type: 'datetime',
        maxPadding: 0,
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
      series: [],
      colors: rankColors.value
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
    clearEndLabelsFallbackTimer();
    destroyEndLabels();
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
  { deep: false }
);

watch(
  () => themeStore.isDarkMode,
  () => {
    if (props.useThemePalette) {
      chartInstance.value?.update({ colors: rankColors.value }, false);
      updateData();
    }
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
