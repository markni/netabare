<script setup>
import { useSubjectStore } from '@/stores/subject'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import _ from 'lodash'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})
const filtered = ref('none')
const store = useSubjectStore()
const { subject, combinedData, delta } = storeToRefs(store)

const _setFiltered = (f) => {
  filtered.value = f
}

store.fetchSubject(props.id)
</script>

<template>
  <div class="pt-14" v-if="subject">
    <div class="flex flex-col gap-4 items-end">
      <h1 class="text-6xl">{{ subject.name }}</h1>
      <h2 class="text-4xl">{{ subject.name_cn }}</h2>

      <div class="flex gap-2 mt-4 text-xl">
        <div
          class="cursor-pointer hover:underline underline-offset-8 decoration-gold"
          :class="{ 'underline underline-offset-8': filtered === 'none' }"
          @click="_setFiltered(`none`)"
        >
          全部
        </div>
        <div
          class="cursor-pointer hover:underline underline-offset-8 decoration-gold"
          :class="{ 'underline underline-offset-8': filtered === 'eps' }"
          @click="_setFiltered('eps')"
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

      <div class="mt-10">
        <div class="text-2xl">
          评分
          <span
            v-if="!isNaN(delta.score)"
            class="delta"
            :class="{
              'text-gold': delta.score >= 0,
              'text-mint': delta.score < 0
            }"
            title="30天之内的评分变化"
            >{{ Math.abs(_.round(delta.score, 2)) }}</span
          >
        </div>
        <div class="text-8xl">{{ subject.rating.score }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
