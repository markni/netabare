<script setup>
import { onMounted, onUnmounted, ref, shallowRef, watch } from 'vue';
import Highcharts from '@/utils/highcharts';
import { COLORS6 } from '@/constants/colors';
import { useChartTheme } from '@/composables/useChartTheme';

const props = defineProps({
  actionsDailySeries: {
    type: Array,
    required: true
  }
});

const chartContainer = ref(null);
const chartInstance = shallowRef(null);
const LABELS = {
  wish: '想看',
  collect: '看过',
  doing: '在看',
  on_hold: '搁置',
  dropped: '抛弃'
};

useChartTheme(chartInstance);

const updateData = () => {
  if (!chartInstance.value) return;

  const incoming = Array.isArray(props.actionsDailySeries) ? props.actionsDailySeries : [];
  const incomingByKey = Object.fromEntries(incoming.map((series) => [series.key, series]));

  chartInstance.value.series.forEach((series) => {
    const key = series.userOptions?.id;
    const next = incomingByKey[key];
    series.setData(next?.data || [], false);
  });
  chartInstance.value.redraw();
};

const initializeChart = () => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }
  if (!chartContainer.value) return;

  const chart = Highcharts.chart(chartContainer.value, {
    chart: {
      backgroundColor: null
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
    yAxis: {
      title: {
        text: ''
      },
      labels: {
        enabled: false
      }
    },
    legend: { enabled: true },
    tooltip: {
      shared: true,
      formatter: function () {
        let s = `<p style="font-size: 10px;">${Highcharts.dateFormat('%Y-%m-%d', this.x)}</p>`;
        this.points.forEach((point) => {
          s += `<br/><span style="color:${point.color}">●</span> ${point.series.name}`;
        });
        return s;
      }
    },
    plotOptions: {
      area: {
        stacking: 'normal',
        marker: {
          enabled: false
        },
        lineWidth: 2,
        fillOpacity: 0.25
      },
      series: {
        animation: {
          defer: 300,
          duration: 900
        }
      }
    },
    series: [
      {
        type: 'area',
        id: 'wish',
        name: LABELS.wish,
        data: [],
        color: COLORS6[0]
      },
      {
        type: 'area',
        id: 'collect',
        name: LABELS.collect,
        data: [],
        color: COLORS6[1]
      },
      {
        type: 'area',
        id: 'doing',
        name: LABELS.doing,
        data: [],
        color: COLORS6[2]
      },
      {
        type: 'area',
        id: 'on_hold',
        name: LABELS.on_hold,
        data: [],
        color: COLORS6[3]
      },
      {
        type: 'area',
        id: 'dropped',
        name: LABELS.dropped,
        data: [],
        color: COLORS6[4]
      }
    ]
  });

  chartInstance.value = chart;
  updateData();
};

onMounted(initializeChart);

onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
    chartInstance.value = null;
  }
});

watch(
  () => props.actionsDailySeries,
  () => {
    updateData();
  },
  { deep: false }
);
</script>

<template>
  <div class="h-full" ref="chartContainer"></div>
</template>
