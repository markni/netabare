<script setup>
import { useSeasonStore } from '@/stores/season.js'
import { storeToRefs } from 'pinia'
import BattleChart from '@/components/charts/BattleChart.vue'
import dayjs from 'dayjs'

const store = useSeasonStore()
const { historyData } = storeToRefs(store)

const getCurrentSeasonStartDate = () => {
  const today = new Date()
  const month = today.getMonth() // Get the current month (0-11)
  let seasonStartMonth

  if (month >= 0 && month < 3) {
    // Jan, Feb, Mar
    seasonStartMonth = '一月' // January
  } else if (month >= 3 && month < 6) {
    // Apr, May, Jun
    seasonStartMonth = '四月' // April
  } else if (month >= 6 && month < 9) {
    // Jul, Aug, Sep
    seasonStartMonth = '七月' // July
  } else {
    // Oct, Nov, Dec
    seasonStartMonth = '十月' // October
  }

  return seasonStartMonth
}

store.fetchSeason()
</script>

<template>
  <div class="mt-14 flex flex-col gap-4">
    <h1 class="text-4xl">{{ dayjs().year() }}年{{ getCurrentSeasonStartDate() }}新番战况</h1>
    <div class="sm:aspect-[16/8]">
      <BattleChart :historyData="historyData" />
    </div>
  </div>
</template>

<style scoped></style>
