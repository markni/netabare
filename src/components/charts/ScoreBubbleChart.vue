<template>
  <div class="h-full" ref="chartContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, shallowRef } from 'vue';
import Highcharts from '@/utils/highcharts';
import { useChartTheme } from '@/composables/useChartTheme';
import { BLUE, RED } from '@/constants/colors';
import { useInViewOnce } from '@/composables/useInViewOnce';

const props = defineProps({
  subjects: {
    type: Array,
    required: true
  },
  animateWhenInView: {
    type: Boolean,
    default: false
  }
});

const chartContainer = ref(null);
const chartInstance = shallowRef(null);
const { isInViewOnce } = useInViewOnce(chartContainer, { enabled: props.animateWhenInView });

useChartTheme(chartInstance);

onMounted(() => {
  initializeChart();
});

onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
    chartInstance.value = null;
  }
});

const minPinkStd = 1;
const maxPinkStd = 2;

const getColorByStd = (std) => {
  const ratio = Math.max(0, Math.min(1, (std - minPinkStd) / (maxPinkStd - minPinkStd)));
  return Highcharts.color(BLUE).tweenTo(Highcharts.color(RED), ratio);
};

const updateData = () => {
  if (props.animateWhenInView && !isInViewOnce.value) return;
  if (chartInstance.value) {
    const maxTotal = Math.max(...props.subjects.map((subject) => subject.total));

    const bubbleData = props.subjects.map((subject) => ({
      x: subject.total,
      y: subject.score,
      z: (subject.total / maxTotal) * 500,
      color: getColorByStd(subject.std)
    }));
    chartInstance.value.series[0].setData(bubbleData, true);
  }
};

const initializeChart = () => {
  if (chartContainer.value) {
    const maxTotal = Math.max(...props.subjects.map((subject) => subject.total));

    const bubbleData = props.subjects.map((subject) => ({
      x: subject.total,
      y: subject.score,
      z: (subject.total / maxTotal) * 500,
      color: getColorByStd(subject.std)
    }));

    const chart = Highcharts.chart(chartContainer.value, {
      chart: {
        type: 'bubble', // Changed from scatter to bubble
        zoomType: 'xy',
        backgroundColor: null
      },
      tooltip: {
        formatter: function () {
          const subject = props.subjects.find((s) => s.total === this.x && s.score === this.y);
          if (!subject) return 'Error';

          return `${subject.name_cn || subject.name}<br/>评分：${subject.score}<br/>标准差：${subject.std.toFixed(2)}<br/>总票数：${this.x}`;
        }
      },
      subtitle: {
        enabled: false
      },
      plotOptions: {
        bubble: {
          // Changed from scatter to bubble
          ...(props.animateWhenInView && !isInViewOnce.value ? { animation: false } : {}),
          minSize: 3,
          maxSize: 25,
          zMin: 0,
          zMax: 50,
          marker: {
            fillOpacity: 0.85
          },
          states: {
            hover: {
              enabled: true
            }
          },
          cursor: 'pointer',
          point: {
            // Add click event to points
            events: {
              click: function () {
                const subject = props.subjects.find(
                  (s) => Math.abs(s.std - this.x) < 0.001 && s.score === this.y
                );
                if (subject) {
                  window.open(`/subject/${subject.bgmId}`);
                }
              }
            }
          }
        }
      },
      yAxis: {
        startOnTick: false,
        title: {
          enabled: false
        },
        labels: {
          format: '{value:.1f}'
        }
      },
      xAxis: {
        type: 'linear',

        labels: {
          formatter: function () {
            return this.value; // Format numbers with thousands separator
          }
        }
      },
      series: [
        {
          name: '评分',
          data: bubbleData
          // Remove the colors property since we're setting individual colors
        }
      ]
    });

    chartInstance.value = chart;
  }
};

watch(
  () => props.subjects,
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
