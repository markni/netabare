<script setup>
import { computed, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue';
import { useRouter } from 'vue-router';
import Highcharts from '@/utils/highcharts';
import { useChartTheme } from '@/composables/useChartTheme';
import { TEAL } from '@/constants/colors';

const props = defineProps({
  subjects: { type: Array, required: true }
});
const router = useRouter();
const chartContainer = ref(null);
const chartInstance = shallowRef(null);
useChartTheme(chartInstance);

const points = computed(() =>
  props.subjects.flatMap((subject) => {
    const frames = Number(subject.frames);
    const episodes = Number(subject.episodeCount);
    const score = Number(subject.score);
    if (
      !Number.isFinite(frames) ||
      frames < 0 ||
      !Number.isFinite(episodes) ||
      episodes <= 0 ||
      !Number.isFinite(score) ||
      score <= 0 ||
      score > 10
    )
      return [];
    return [
      {
        name: subject.title || subject.subjectName,
        x: frames / episodes,
        y: score,
        custom: { bgmId: subject.bgmId, frames, episodes }
      }
    ];
  })
);

onMounted(() => {
  chartInstance.value = Highcharts.chart(chartContainer.value, {
    chart: { type: 'scatter', animation: false },
    legend: { enabled: false },
    xAxis: {
      min: 0,
      title: { text: null },
      gridLineWidth: 1,
      labels: { format: '{value}' },
      startOnTick: true,
      endOnTick: true
    },
    yAxis: {
      min: 0,
      max: 10,
      tickInterval: 2,
      title: { text: null },
      labels: { format: '{value}' }
    },
    tooltip: {
      headerFormat: '',
      pointFormat:
        '<b>{point.name}</b><br/>评分：{point.y:.2f}<br/>食物密度：{point.x:.2f} 画面 / 含食物集<br/>入选画面：{point.custom.frames}<br/>含食物集数：{point.custom.episodes}'
    },
    plotOptions: {
      scatter: {
        animation: false,
        marker: { radius: 5, symbol: 'circle', lineWidth: 1, lineColor: TEAL },
        cursor: 'pointer',
        point: {
          events: {
            click() {
              if (this.options.custom.bgmId) router.push(`/subject/${this.options.custom.bgmId}`);
            }
          }
        }
      }
    },
    series: [
      {
        name: '作品评分',
        color: Highcharts.color(TEAL).setOpacity(0.65).get('rgba'),
        data: points.value
      }
    ]
  });
});

watch(points, (data) => chartInstance.value?.series[0].setData(data, true, false));
onUnmounted(() => {
  chartInstance.value?.destroy();
  chartInstance.value = null;
});
</script>

<template>
  <figure class="border border-foreground/25 bg-background p-4 sm:p-7">
    <p class="mb-2 text-sm text-muted-foreground">作品评分（0–10）</p>
    <div
      ref="chartContainer"
      class="h-[clamp(22rem,50vw,32rem)] w-full"
      role="img"
      aria-label="食物密度与作品评分散点图"
      aria-describedby="food-score-chart-caption"
    ></div>
    <figcaption
      id="food-score-chart-caption"
      class="mt-2 text-center text-sm text-muted-foreground"
    >
      食物密度（入选画面数 / 含食物集数）
    </figcaption>
    <p v-if="!points.length" class="mt-4 text-center text-muted-foreground">暂无可比较的评分数据</p>
  </figure>
</template>
