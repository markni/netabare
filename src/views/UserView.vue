<template>
  <div class="container mx-auto">
    <div class="aspect-square sm:aspect-[16/10] mt-40">
      <UserChart :userData="userData" :globalData="globalData" />
      <UserStats :user="user" />

    </div>
  </div>


</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import UserChart from '@/components/charts/UserChart.vue'
import UserStats from '@/components/UserStats.vue'

// Import the defineProps function, which is available in <script setup>
const props = defineProps({
  id: {
    type: String, // or Number, depending on what the ID is supposed to be
    required: true
  }
});


const store = useUserStore()
const { userData, globalData, user } = storeToRefs(store)

store.fetchUser(props.id) // Example user ID
</script>
