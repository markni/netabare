<script setup>
import { useTrendingStore } from '@/stores/trending'
import { storeToRefs } from 'pinia'
import MiniScoreChart from '@/components/charts/MiniScoreChart.vue'
import { BLUE, COLORS, GOLD, PINK } from '@/constants/colors.js'
import DeltaDisplay from '@/components/DeltaDisplay.vue'

const store = useTrendingStore()
const { up, down, done } = storeToRefs(store)

store.fetchTrending()

const formatData = (history) =>
  history.map((item) => ({ x: new Date(item.recordedAt), y: item.score }))
</script>

<template>
  <div class="flex flex-col pt-14 gap-16">
    <div v-for="(items, index) in [done, down, up]" :key="index" class="flex flex-col gap-8">
      <h2 class="text-2xl mr-auto" :class="['bg-gold', 'bg-pink', 'bg-blue'][index]">
        {{ ['热门条目', '涨幅排行', '跌幅排行'][index] }}
      </h2>
      <ol class="flex flex-col gap-8 list-decimal">
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
                  class="ml-2 text-sm px-1 text-white"
                  :style="{
                    color: COLORS[Math.round(item.history[item.history.length - 1].score)]
                  }"
                  >{{ item.history[item.history.length - 1].score }}</span
                >
              </div>
              <div class="text-lg">{{ item.subject.name }}</div>
            </div>
            <div class="aspect-[16/8] col-span-3">
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
