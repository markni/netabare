<script setup>
import { useTrendingStore } from '@/stores/trending';
import { storeToRefs } from 'pinia';
import MiniScoreChart from '@/components/charts/MiniScoreChart.vue';
import { BLUE, COLORS10, PINK } from '@/constants/colors.js';
import DeltaDisplay from '@/components/DeltaDisplay.vue';

const store = useTrendingStore();
const { up, down, done } = storeToRefs(store);

store.fetchTrending();

const formatData = (history) =>
  history.map((item) => ({ x: new Date(item.recordedAt), y: item.score }));
</script>

<template>
  <div class="flex flex-col gap-16 pt-14" v-if="done.length">
    <div v-for="(items, index) in [done, up, down]" :key="index" class="flex flex-col gap-8">
      <h2
        :id="['popular', 'up', 'down'][index]"
        class="mr-auto text-2xl"
        :class="['bg-gold', 'bg-pink', 'bg-blue'][index]"
      >
        <a :href="'#' + ['popular', 'up', 'down'][index]" class="anchor-link">
          {{ ['热门条目', '涨幅排行', '跌幅排行'][index] }}
        </a>
      </h2>
      <ol class="flex list-decimal flex-col gap-8">
        <li v-for="item in items" :key="item.bgmId">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-8">
              <div class="text-4xl">
                <RouterLink
                  :class="['hover:bg-gold', 'hover:bg-pink', 'hover:bg-blue'][index]"
                  :to="'/subject/' + item.bgmId"
                  >{{ item.subject.name_cn || item.subject.name }}</RouterLink
                >
                <span
                  class="ml-2 px-1 text-sm text-white"
                  :style="{
                    color: COLORS10[Math.round(item.history[item.history.length - 1].score)]
                  }"
                  >{{ item.history[item.history.length - 1].score }}</span
                >
              </div>
              <div class="text-lg">{{ item.subject.name }}</div>
            </div>
            <div class="col-span-3 aspect-[16/8]">
              <MiniScoreChart
                :color="item.score >= 0 ? PINK : BLUE"
                :history-data="formatData(item.history)"
              />
            </div>
            <div class="col-span-1 text-4xl">
              <DeltaDisplay :delta="item.score" />
            </div>
          </div>
        </li>
      </ol>
    </div>
  </div>
</template>

<style scoped></style>
