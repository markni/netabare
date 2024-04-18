<template>
  <div v-if="user && id" class="grid grid-cols-12 gap-4">
    <div class="col-span-10">
      <div class="aspect-square sm:aspect-[16/12] pt-14">
        <UserChart :userData="userData" :globalData="globalData" />
      </div>
    </div>
    <div class="col-span-2 px-2 flex flex-col">
      <UserStats :user="user" />
      <form @submit="submit" class="mt-10 flex flex-col">
        <input
          id="username"
          autocomplete="off"
          data-lpignore="true"
          required
          pattern="^\w+$"
          class="text-xl bg-transparent border-b-2 focus:outline-0 p-2"
          maxlength="15"
          type="text"
          v-model="bgmUserId"
          placeholder="username / id"
        />
      </form>
    </div>
  </div>
  <div v-if="!user || !id" class="h-full flex flex-col items-center justify-center">
    <form @submit="submit" class="mt-10 flex flex-col">
      <label for="username" class="text-xl">输入目标用户名</label>

      <input
        id="username"
        autocomplete="off"
        data-lpignore="true"
        required
        pattern="^\w+$"
        class="text-4xl bg-transparent border-b-2 focus:outline-0 p-2"
        maxlength="15"
        type="text"
        v-model="bgmUserId"
        placeholder="username / id"
      />
    </form>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import UserChart from '@/components/charts/UserChart.vue'
import UserStats from '@/components/UserStats.vue'
import { ref, watch } from 'vue'
import router from '@/router/index.js'

// Import the defineProps function, which is available in <script setup>
const props = defineProps({
  id: {
    type: String, // or Number, depending on what the ID is supposed to be
    required: false
  }
})

const store = useUserStore()
const { userData, globalData, user, username } = storeToRefs(store)

const bgmUserId = ref('')

const submit = (event) => {
  event.preventDefault() // Prevent the default form submission behavior
  router.replace(`/user/${bgmUserId.value}`) // Redirect to the user page
  // Add your submission logic here
}
if (props.id) {
  store.fetchUser(props.id)
} else if (username.value) {
  router.replace(`/user/${username.value}`)
} // Example user ID

watch(
  [() => props.id],
  () => {
    if (props.id) {
      store.fetchUser(props.id)
      bgmUserId.value = props.id
    }
  },
  { deep: true }
)
</script>
