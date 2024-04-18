<script setup>
import { useHistoryStore } from '@/stores/history'
import { storeToRefs } from 'pinia'
import HistoryChart from '@/components/charts/HistoryChart.vue'

const store = useHistoryStore()
const { historyData, dic, yearlyData, startingYear, endingYear, minScore, maxScore } =
  storeToRefs(store)

store.fetchHistory()
</script>

<template>
  <div class="flex gap-4 text-3xl justify-end">
    <div class="flex-col flex">
      <label for="startingYear" class="text-xl">开始年份</label>
      <input
        class="bg-transparent w-40"
        type="number"
        id="startingYear"
        v-model="startingYear"
        placeholder="Starting Year"
      />
    </div>
    <div class="flex-col flex">
      <label for="endingYear" class="text-xl">结束年份</label>
      <input
        class="bg-transparent w-40"
        type="number"
        id="endingYear"
        v-model="endingYear"
        placeholder="Ending Year"
      />
    </div>
    <div class="flex-col flex">
      <label for="minScore" class="text-xl">最低分</label>
      <input
        class="bg-transparent w-40"
        type="number"
        id="minScore"
        v-model="minScore"
        placeholder="Minimum Score"
      />
    </div>
    <div class="flex-col flex">
      <label for="maxScore" class="text-xl">最高分</label>
      <input
        class="bg-transparent w-40"
        type="number"
        id="maxScore"
        v-model="maxScore"
        placeholder="Maximum Score"
      />
    </div>
  </div>

  <div v-if="historyData" class="aspect-square sm:aspect-[16/12] pt-14">
    <HistoryChart :yearly-data="yearlyData" :historyData="historyData" :dic="dic" />
  </div>
</template>

<style scoped></style>
