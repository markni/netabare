<template>
  <div v-if="user && id" class="grid grid-cols-12 gap-4">
    <div class="col-span-12 sm:col-span-10">
      <div class="aspect-square pt-14 sm:aspect-[16/12]">
        <UserChart :userData="currentYearData['data']" :globalData="globalData" />
      </div>
    </div>

    <div class="col-span-12 flex flex-col items-center px-2 sm:col-span-2 sm:items-start">
      <YearSlider :years="availableYears" v-model:selectedYear="selectedYear" class="mb-5">
        <template #info>
          <UserAvatar :user="userProfile" />
        </template>
      </YearSlider>

      <UserStats :user="currentYearData" />
      <form @submit="submit" class="mb-16 mt-auto flex flex-col">
        <input
          id="username"
          autocomplete="off"
          data-lpignore="true"
          required
          pattern="^\w+$"
          class="border-b-2 bg-transparent p-2 focus:outline-0"
          maxlength="15"
          type="text"
          v-model="bgmUserId"
          placeholder="username / id"
        />
      </form>
    </div>
  </div>
  <div v-if="!id" class="flex h-full flex-col items-center justify-center">
    <form @submit="submit" class="mt-10 flex flex-col">
      <label for="username" class="text-xl">{{ texts._enterTargetUsername }}</label>

      <input
        id="username"
        autocomplete="off"
        data-lpignore="true"
        required
        pattern="^\w+$"
        class="border-b-2 bg-transparent p-2 text-4xl focus:outline-0"
        maxlength="15"
        type="text"
        v-model="bgmUserId"
        placeholder="username / id"
      />
    </form>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import UserChart from '@/components/charts/UserChart.vue';
import UserStats from '@/components/UserStats.vue';
import YearSlider from '@/components/YearSlider.vue';
import { ref, watch, computed } from 'vue';
import router from '@/router/index.js';
import texts from '../constants/texts.js';
import UserAvatar from '@/components/UserAvatar.vue';

// Import the defineProps function, which is available in <script setup>
const props = defineProps({
  id: {
    type: String, // or Number, depending on what the ID is supposed to be
    required: false
  }
});

const store = useUserStore();
const { globalData, user, username, availableYears, userProfile } = storeToRefs(store);

const bgmUserId = ref('');
const selectedYear = ref(null);

const currentYearData = computed(() => {
  return {
    ...store.userData(selectedYear.value),
    user: user.value?.user
  };
});

const submit = (event) => {
  event.preventDefault();
  router.replace(`/user/${bgmUserId.value}`);
  // Add your submission logic here
};

if (props.id) {
  store.fetchUser(props.id);
} else if (username.value) {
  router.replace(`/user/${username.value}`);
}

// Modify the availableYears watcher
watch(
  availableYears,
  (newYears) => {
    if (newYears.length > 0) {
      // Always set the selectedYear to the most recent year when availableYears changes
      selectedYear.value = newYears[newYears.length - 1];
    } else {
      // Reset selectedYear if there are no available years
      selectedYear.value = null;
    }
  },
  { immediate: true }
);

watch(
  () => props.id,
  (newId) => {
    if (newId) {
      store.fetchUser(newId);
      bgmUserId.value = newId;
    }
  }
);
</script>
