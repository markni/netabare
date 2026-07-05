<script setup>
import { computed } from 'vue';
import { useTrendingStore } from '@/stores/trending';
import { storeToRefs } from 'pinia';
import MiniScoreChart from '@/components/charts/MiniScoreChart.vue';
import { BLUE, COLORS10, PINK } from '@/constants/colors.js';
import DeltaDisplay from '@/components/DeltaDisplay.vue';
import texts from '@/constants/texts.js';

const store = useTrendingStore();
const { up, down } = storeToRefs(store);

store.fetchTrending();

const formatData = (history) =>
  history.map((item) => ({ x: new Date(item.recordedAt), y: item.score }));

const sections = computed(() => [
  {
    id: 'up',
    items: up.value,
    title: texts._increasingRank,
    headingClass: 'bg-pink',
    linkClass: 'hover:bg-pink'
  },
  {
    id: 'down',
    items: down.value,
    title: texts._decreasingRank,
    headingClass: 'bg-blue',
    linkClass: 'hover:bg-blue'
  }
]);
</script>

<template>
  <div class="@container mt-14 flex flex-col gap-20 px-4 pt-0">
    <div class="xl: grid grid-cols-1 gap-32 xl:grid-cols-2" v-if="up.length || down.length">
      <div v-for="section in sections" :key="section.id" class="flex flex-col gap-16">
        <div
          class="sticky top-0 z-10 flex w-full bg-background py-4 transition-[background-color] duration-300"
        >
          <h2
            :id="section.id"
            class="mr-auto text-2xl tracking-wider first-letter:text-3xl"
            :class="section.headingClass"
          >
            <a :href="'#' + section.id" class="anchor-link">
              {{ section.title }}
            </a>
          </h2>
        </div>

        <ol class="flex list-decimal flex-col gap-16 xl:gap-8">
          <li v-for="item in section.items" :key="item.bgmId">
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-8">
                <div class="text-2xl">
                  <RouterLink
                    class="line-clamp-1"
                    :class="section.linkClass"
                    :to="'/subject/' + item.bgmId"
                    :title="item.subject.name_cn || item.subject.name"
                    >{{ item.subject.name_cn || item.subject.name }}</RouterLink
                  >
                </div>
                <div class="text-md line-clamp-1" :title="item.subject.name">
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
  </div>
</template>

<style scoped></style>
