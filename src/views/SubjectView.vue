<script setup>
import { useSubjectStore } from '@/stores/subject'
import { storeToRefs } from 'pinia'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const store = useSubjectStore()
const { subject, combinedData } = storeToRefs(store)

store.fetchSubject(props.id)
</script>

<template>
  <div>
    {{ combinedData }}
  </div>
</template>

<style scoped></style>
