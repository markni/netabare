<script setup>
import { useHistoryStore } from '@/stores/history'
import { storeToRefs } from 'pinia'
import HistoryChart from '@/components/charts/HistoryChart.vue'
import texts from '@/constants/texts.js'

const store = useHistoryStore()
const { combinedData, dic, startingYear, endingYear, minScore, maxScore } = storeToRefs(store)

store.fetchHistory()
</script>

<template>
  <div class="flex gap-4 text-3xl justify-end">
    <div class="flex-col flex">
      <label for="startingYear" class="text-xl">{{ texts._startingYear }}</label>
      <input
        class="bg-transparent w-40"
        type="number"
        id="startingYear"
        v-model="startingYear"
        placeholder="Starting Year"
      />
    </div>
    <div class="flex-col flex">
      <label for="endingYear" class="text-xl">{{ texts._endingYear }}</label>
      <input
        class="bg-transparent w-40"
        type="number"
        id="endingYear"
        v-model="endingYear"
        placeholder="Ending Year"
      />
    </div>
    <div class="flex-col flex">
      <label for="minScore" class="text-xl">{{ texts._minScore }}</label>
      <input
        class="bg-transparent w-40"
        type="number"
        id="minScore"
        v-model="minScore"
        placeholder="Minimum Score"
      />
    </div>
    <div class="flex-col flex">
      <label for="maxScore" class="text-xl">{{ texts._maxScore }}</label>
      <input
        class="bg-transparent w-40"
        type="number"
        id="maxScore"
        v-model="maxScore"
        placeholder="Maximum Score"
      />
    </div>
  </div>

  <div v-if="combinedData.historyData" class="aspect-square sm:aspect-[16/12] pt-14">
    <HistoryChart
      :yearly-data="combinedData.yearlyData"
      :historyData="combinedData.historyData"
      :dic="dic"
    />
  </div>
</template>

<style scoped></style>
