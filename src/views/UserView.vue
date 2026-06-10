<template>
  <div class="min-h-[calc(100dvh-8.75rem)]">
    <div
      v-if="user && activeUserId"
      class="relative left-1/2 grid w-dvw -translate-x-1/2 grid-cols-12 gap-4 overflow-hidden"
    >
      <div class="order-last col-span-12 sm:order-first sm:col-span-10">
        <div class="pt-14">
          <div class="h-[calc(100dvh-12.25rem)] min-h-80">
            <UserChart :userData="currentYearData['data']" :globalData="globalData" />
          </div>
        </div>
      </div>

      <div class="col-span-12 flex flex-col items-center px-2 sm:col-span-2 sm:items-start">
        <YearSlider :years="availableYears" v-model:selectedYear="selectedYear" class="mb-5">
          <template #info>
            <UserAvatar :user="userProfile" />
          </template>
        </YearSlider>

        <UserStats :user="currentYearData" />
        <form @submit.prevent="submit" class="mt-auto mb-16 hidden flex-col sm:flex">
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

    <div v-else class="flex min-h-[calc(100dvh-8.75rem)] flex-col items-center justify-center">
      <form @submit.prevent="submit" class="flex flex-col items-start">
        <label for="username" class="text-xl">{{ texts._enterTargetUsername }}</label>

        <input
          id="username"
          autocomplete="off"
          data-lpignore="true"
          required
          pattern="^\w+$"
          class="border-b-2 bg-transparent p-2 text-xl focus:outline-0 sm:text-4xl"
          maxlength="15"
          type="text"
          v-model="bgmUserId"
          placeholder="username / id"
        />
      </form>
    </div>
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
const activeUserId = ref('');

// Watch for user data changes to update title
watch(
  () => user.value,
  (newUser) => {
    if (newUser?.user?.username) {
      document.title = `${newUser.user.username} | netaba.re`;
    } else {
      document.title = `${texts._user} | netaba.re`;
    }
  },
  { immediate: true }
);

const currentYearData = computed(() => {
  return {
    ...store.userData(selectedYear.value),
    user: user.value?.user
  };
});

const submit = () => {
  const nextUserId = bgmUserId.value.trim();

  if (!nextUserId) return;

  router.replace({ name: 'user', params: { id: nextUserId } });
};

const syncUserRoute = (id) => {
  if (id) {
    activeUserId.value = id;
    bgmUserId.value = id;
    store.clearUser();
    store.fetchUser(id);
    return;
  }

  activeUserId.value = '';

  if (username.value) {
    router.replace({ name: 'user', params: { id: username.value } });
  } else {
    store.clearUser();
  }
};

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
    syncUserRoute(newId);
  },
  { immediate: true }
);
</script>
