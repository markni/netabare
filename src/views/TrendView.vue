<template>
  <!--  <div class="h-[100px] aspect-video">-->
  <!--    <SubjectScore :bgm-id="329014" size="mini" />-->
  <!--  </div>-->
  <div class="container mx-auto flex p-12">
    <div class="flex gap-x-3">
      <div class="flex flex-col border-r-2">
        <div
          v-for="panel in panels"
          :key="panel.name"
          :class="{ 'bg-red-600': activePanel === panel.name }"
          class="text-lg wm-rl px-1 py-4 cursor-pointer"
          @click="activePanel = panel.name"
        >
          {{ panel.label }}
        </div>
      </div>
      <div class="flex flex-col">
        <div class="flex flex-col gap-y-3 text-xl">
          <div v-for="item in activeData" v-bind:key="item.bgmId">
            {{ item.subject.name_cn || item.subject.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useTrendStore } from '@/stores/trend';
import { computed, ref } from 'vue';

const trendStore = useTrendStore();
await trendStore.fetchTrend();

const activePanel = ref('done');

const { done, up, down } = trendStore.trend;

const panels = [
  { name: 'done', label: '热门', data: done },
  { name: 'up', label: '涨幅', data: up },
  { name: 'down', label: '跌幅', data: down }
];

const activeData = computed(() => panels.find((p) => p.name === activePanel.value)!.data);
</script>

<style lang="scss" scoped>
.wm-rl {
  writing-mode: vertical-rl;
}
</style>
