<script setup>
import { useHistoryStore } from '@/stores/history'
import { storeToRefs } from 'pinia'
import HistoryChart from '@/components/charts/HistoryChart.vue'

const store = useHistoryStore()
const { historyData, dic, yearlyData } = storeToRefs(store)

store.fetchHistory()
</script>

<template>
  <div v-if="historyData" class="aspect-square sm:aspect-[16/12] pt-14">
    <HistoryChart :yearly-data="yearlyData" :historyData="historyData" :dic="dic" />
  </div>
</template>

<style scoped></style>
