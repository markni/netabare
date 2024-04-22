<script setup>
import { useSubjectStore } from '@/stores/subject'
import { storeToRefs } from 'pinia'
import { ref, onUnmounted } from 'vue'
import ScoreChart from '@/components/charts/ScoreChart.vue'
import RankChart from '@/components/charts/RankChart.vue'
import CollectionChart from '@/components/charts/CollectionChart.vue'
import DeltaDisplay from '@/components/DeltaDisplay.vue'

const props = defineProps({
  id1: {
    type: String,
    required: true
  },
  id2: {
    type: String,
    required: true
  }
})

const localId1 = ref(props.id1)
const localId2 = ref(props.id2)
const updateId1 = (val) => {
  localId1.value = props.id1
}
</script>

<template>
  <div class="grid grid-cols-2">
    <div class="col-span-1">
      <form @submit.prevent="updateId1">
        <input name="id1" />
        <button type="submit">Submit</button>
      </form>
      {{ localId1 }}
    </div>
  </div>
</template>

<style scoped></style>
