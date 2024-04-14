<template>
  <div class="about">
    <h1>This is an about page</h1>
    <p>The ID from the route is: {{ id }}</p>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

// Import the defineProps function, which is available in <script setup>
const props = defineProps({
  id: {
    type: String, // or Number, depending on what the ID is supposed to be
    required: true
  }
});


const store = useUserStore()
const { user, isLoggedIn } = storeToRefs(store)

store.fetchUser(props.id) // Example user ID
</script>
