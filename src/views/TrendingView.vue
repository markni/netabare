<script setup>
import { useTrendingStore } from '@/stores/trending'
import { storeToRefs } from 'pinia'
import MiniScoreChart from '@/components/charts/MiniScoreChart.vue'
import { GOLD, TEAL } from '@/constants/colors.js'
import DeltaDisplay from '@/components/DeltaDisplay.vue'

const store = useTrendingStore()
const { up, down, done, popular } = storeToRefs(store)

store.fetchTrending()

const formatData = (history) => {
  return history.map((item) => {
    return {
      x: new Date(item.recordedAt),
      y: item.score
    }
  })
}
</script>

<template>
  <div class="flex flex-col pt-14">
    <div class="flex flex-col gap-8">
      <h2 class="text-2xl">热门条目</h2>
      <ol class="flex flex-col gap-8 list-decimal">
        <li class="" v-for="item in done" :key="item.bgmId">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-8">
              <div class="text-4xl">
                <RouterLink :to="'/subject/' + item.bgmId">{{ item.subject.name_cn }}</RouterLink>
              </div>
              <div class="text-lg">{{ item.subject.name }}</div>
            </div>

            <div class="aspect-[16/8] col-span-3">
              <MiniScoreChart
                :color="item.score >= 0 ? GOLD : TEAL"
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
