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
const endLabelElements = [];
let endLabelsFallbackTimer = null;
let resizeObserver = null;
let resizeEndTimer = null;
const router = useRouter();
const themeStore = useThemeStore();
useChartTheme(chartInstance);
const { isInViewOnce } = useInViewOnce(chartContainer, { enabled: props.animateWhenInView });
const scoreColors = computed(() => (props.useThemePalette ? COLORS10_VIVID : COLORS10));

const getLatestScore = (scoreHistory = []) => {
  if (!Array.isArray(scoreHistory) || scoreHistory.length === 0) return Number.NEGATIVE_INFINITY;
  const latest = Number(scoreHistory[scoreHistory.length - 1]?.[1]);
  return Number.isFinite(latest) ? latest : Number.NEGATIVE_INFINITY;
};

const destroyEndLabels = () => {
  while (endLabelElements.length) {
    endLabelElements.pop()?.destroy();
  }

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

const formatEndLabel = (name, scoreColor, underlineName = false) => {
  const textColor = themeStore.isDarkMode ? IVORY : BLACK;
  const nameStyle = `color: ${textColor};${
    underlineName ? ' text-decoration: underline; text-underline-offset: 3px;' : ''
  }`;
  const match = String(name).match(/^(\d+\.\d{2}|N\/A)\s+(.*)$/);
  if (!match) return `<span style="${nameStyle}">${escapeHtml(name)}</span>`;

  return [
    `<span style="color: ${scoreColor};">${escapeHtml(match[1])}</span>`,
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
    if (Array.isArray(seriesData?.scoreHistory) && seriesData.scoreHistory.length > 0) {
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
  if (!chart) return;

  destroyEndLabels();
  if (!endLabelsReady.value) return;

  const labelX = chart.plotLeft + chart.plotWidth + 48;
  const minY = chart.plotTop + 8;
  const maxY = chart.plotTop + chart.plotHeight - 8;
  const group = chart.renderer.g('battle-end-labels').attr({ zIndex: 7 }).add();
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
          fontWeight: 'normal',
          cursor: 'pointer',
          textOutline: 'none'
        })
        .attr({
          padding: 0
        })
        .add(group);
      endLabelElements.push(label);

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

    const connector = chart.renderer
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
    endLabelElements.push(connector);

    const pointMarker = chart.renderer
      .circle(item.pointX, item.pointY, 3.5)
      .attr({
        fill: item.color,
        stroke: item.color,
        'stroke-width': 1,
        opacity: 0.9
      })
      .add(group);
    endLabelElements.push(pointMarker);

    item.label.attr({
      x: labelX,
      y: item.labelY
    });
  });
};

const scheduleResizeRender = () => {
  destroyEndLabels();

  if (resizeEndTimer) {
    clearTimeout(resizeEndTimer);
  }

  resizeEndTimer = setTimeout(() => {
    resizeEndTimer = null;
    chartInstance.value?.reflow();
    renderEndLabels();
  }, 180);
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
    resetEndLabelAnimationGate(sortedHistoryData);

    // Add or update series
    sortedHistoryData.forEach((seriesData, index) => {
      const { name, bgmId, scoreHistory, color, airDate } = seriesData;
      const seriesColor = color || scoreColors.value[index % scoreColors.value.length];
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
          color: seriesColor // Optional: maintain the original color
        },
        {
          dashStyle: 'Solid',
          color: seriesColor // Optional: maintain the original color
        }
      ];

      const formattedData = Array.isArray(scoreHistory)
        ? scoreHistory.map((point) => [point[0], point[1]])
        : [];

      if (currentSeries[String(bgmId)]) {
        // Update existing series

        currentSeries[String(bgmId)].setData(formattedData, false, true, false);

        currentSeries[String(bgmId)].update({ color: seriesColor, zones, name: legendName }, false);
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
            color: seriesColor,
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
      legend: {
        enabled: false,
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
      colors: scoreColors.value
    });

    // Immediately set the chartInstance
    chartInstance.value = chart;

    updateData();
  }
};

onMounted(() => {
  initializeChart();

  if (chartContainer.value) {
    resizeObserver = new ResizeObserver(scheduleResizeRender);
    resizeObserver.observe(chartContainer.value);
  }
});

onUnmounted(() => {
  if (resizeEndTimer) {
    clearTimeout(resizeEndTimer);
    resizeEndTimer = null;
  }

  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }

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
  { deep: true }
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
