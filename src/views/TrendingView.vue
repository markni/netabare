<script setup>
import { useTrendingStore } from '@/stores/trending';
import { storeToRefs } from 'pinia';
import MiniScoreChart from '@/components/charts/MiniScoreChart.vue';
import { BLUE, COLORS10, PINK } from '@/constants/colors.js';
import DeltaDisplay from '@/components/DeltaDisplay.vue';
import texts from '@/constants/texts.js';

const store = useTrendingStore();
const { up, down, done } = storeToRefs(store);

store.fetchTrending();

const formatData = (history) =>
  history.map((item) => ({ x: new Date(item.recordedAt), y: item.score }));
</script>

<template>
  <div class="xl: grid grid-cols-1 gap-32 px-4 pt-14 xl:grid-cols-3" v-if="done.length">
    <div v-for="(items, index) in [done, up, down]" :key="index" class="flex flex-col gap-16">
      <div class="sticky top-0 z-10 flex w-full paper py-4">
        <h2
          :id="['popular', 'up', 'down'][index]"
          class="mr-auto text-2xl"
          :class="['bg-gold', 'bg-pink', 'bg-blue'][index]"
        >
          <a :href="'#' + ['popular', 'up', 'down'][index]" class="anchor-link">
            {{ [texts._popularEntries, texts._increasingRank, texts._decreasingRank][index] }}
          </a>
        </h2>
      </div>

      <ol class="flex list-decimal flex-col gap-16 xl:gap-8">
        <li v-for="item in items" :key="item.bgmId">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-8">
              <div class="text-2xl">
                <RouterLink
                  class="line-clamp-1"
                  :class="['hover:bg-gold', 'hover:bg-pink', 'hover:bg-blue'][index]"
                  :to="'/subject/' + item.bgmId"
                  :title="item.subject.name_cn || item.subject.name"
                  >{{ item.subject.name_cn || item.subject.name }}</RouterLink
                >
              </div>
              <div class="text-md line-clamp-1 text-light-gray" :title="item.subject.name">
                {{ item.subject.name }}
              </div>
            </div>
            <div class="col-span-4 text-2xl">
              <div class="flex flex-col items-end">
                <DeltaDisplay :delta="item.score" />
                <span
                  class="ml-2 px-1 text-sm text-white"
                  :style="{
                    color: COLORS10[Math.round(item.history[item.history.length - 1].score)]
                  }"
                  >{{ item.history[item.history.length - 1].score }}</span
                >
              </div>
            </div>
            <div class="col-span-12 aspect-[24/8]">
              <MiniScoreChart
                :color="item.score >= 0 ? PINK : BLUE"
                :history-data="formatData(item.history)"
              />
            </div>
          </div>
        </li>
      </ol>
    </div>
  </div>
</template>

<style scoped></style>
