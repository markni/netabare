<script setup>
import { useSubjectStore } from '@/stores/subject'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import ScoreChart from '@/components/charts/ScoreChart.vue'
import RankChart from '@/components/charts/RankChart.vue'
import CollectionChart from '@/components/charts/CollectionChart.vue'
import DeltaDisplay from '@/components/DeltaDisplay.vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})
const filteredBy = ref('none')
const store = useSubjectStore()
const {
  subject,
  combinedData,
  delta,
  epsData,
  oneWeekBeforeFirstEpTimestamp,
  oneWeekAfterLastEpTimestamp
} = storeToRefs(store)

const _setfilteredBy = (f) => {
  filteredBy.value = f
}

store.fetchSubject(props.id)
</script>

<template>
  <div v-if="subject">
    <div class="flex flex-col gap-4 items-end">
      <div class="sticky top-0 bg-paper z-50 gap-4 py-14 w-full flex flex-col items-end">
        <h1 class="text-6xl">
          <a target="_blank" title="访问Bangumi上的条目" :href="'https://bgm.tv/subject/' + id">{{
            subject.name
          }}</a>
        </h1>
        <h2 class="text-4xl">{{ subject.name_cn }}</h2>

        <div class="flex gap-2 mt-4 text-xl">
          <div
            class="cursor-pointer hover:underline underline-offset-8 decoration-gold"
            :class="{ 'underline underline-offset-8': filteredBy === 'none' }"
            @click="_setfilteredBy(`none`)"
          >
            全部
          </div>
          <div
            class="cursor-pointer hover:underline underline-offset-8 decoration-gold"
            :class="{ 'underline underline-offset-8': filteredBy === 'eps' }"
            @click="_setfilteredBy('eps')"
          >
            放送期间
          </div>
        </div>
        <div
          title="用鼠标左键在图表中拖选一个方块自定义时间范围，点击图表右上角的重置缩放按钮恢复"
          class="cursor-help text-gray-200"
        >
          如何自定义时间范围？
        </div>
      </div>

      <div class="mt-20">
        <div class="text-2xl">
          评分
          <DeltaDisplay :delta="delta.score" />
        </div>
        <div class="text-8xl">{{ subject.rating.score }}</div>
      </div>

      <div class="aspect-square sm:aspect-[16/8] w-full">
        <ScoreChart
          :eps-data="epsData"
          :ten-data="combinedData.scoreData.ten"
          :one-data="combinedData.scoreData.one"
          :history-data="combinedData.scoreData.history"
          :x-max="filteredBy === 'eps' ? oneWeekAfterLastEpTimestamp : null"
          :x-min="filteredBy === 'eps' ? oneWeekBeforeFirstEpTimestamp : null"
        />
      </div>

      <div class="mt-20">
        <div class="text-2xl">
          排名
          <DeltaDisplay :delta="delta.rank" />
        </div>
        <div class="text-8xl">{{ subject.rank }}</div>
      </div>

      <div class="aspect-square sm:aspect-[16/8] w-full">
        <RankChart
          :eps-data="epsData"
          :history-data="combinedData.rankData.history"
          :x-max="filteredBy === 'eps' ? oneWeekAfterLastEpTimestamp : null"
          :x-min="filteredBy === 'eps' ? oneWeekBeforeFirstEpTimestamp : null"
        />
      </div>

      <div class="mt-10">
        <div class="text-2xl">
          在看
          <DeltaDisplay :delta="delta.watching" />
        </div>
        <div class="text-8xl">{{ subject.rank }}</div>
      </div>

      <div class="aspect-square sm:aspect-[16/8] w-full">
        <CollectionChart
          :eps-data="epsData"
          :history-data="combinedData.collectionData.history"
          :x-max="filteredBy === 'eps' ? oneWeekAfterLastEpTimestamp : null"
          :x-min="filteredBy === 'eps' ? oneWeekBeforeFirstEpTimestamp : null"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
