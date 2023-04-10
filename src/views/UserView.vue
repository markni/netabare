<template>
  <div
    class="user-view h-full flex sm:justify-center justify-end items-center gap-4 flex-col-reverse sm:flex-row"
  >
    <div
      v-if="useUserStore().user?.bgmId"
      class="block sm:w-full w-[90%] h-full sm:ml-[10%] ml-0 pt-8 pb-16 sm:pb-8 h-full"
    >
      <Bar
        v-if="userStore.barChartData"
        :data="userStore.barChartData"
        :options="userStore.chartOptions"
      />
    </div>

    <div
      v-if="useUserStore().user?.bgmId"
      class="flex flex-col shrink-0 gap-4 sm:mb-auto ml-auto mr-[25%] items-end pt-8 w-auto sm:w-2/12 overflow-hidden"
    >
      <AvatarBlock />
      <p class="name text-3xl sm:text-6xl whitespace-nowrap">
        {{ useUserStore().user?.user?.nickname || useUserStore().user?.user?.username }}
      </p>
      <div
        v-for="item in useUserStore().statsArray"
        :key="item.name"
        class="flex flex-col items-end gap-0"
      >
        <p class="sm:text-xl tracking-widest leading-none whitespace-nowrap">{{ item.name }}</p>
        <p class="sm:text-3xl text-xl tracking-widest leading-none whitespace-nowrap">
          {{ item.value }}
        </p>
      </div>
    </div>

    <form
      :class="{
        'fixed bottom-8 right-8': !!useUserStore().user.bgmId,
        'bottom-1/2 right-1/2': !useUserStore().user.bgmId
      }"
      class="duration-1000 transition-br ease-in-out flex justify-center items-center"
      @submit.prevent="submit"
    >
      <label class="text-xl" for="user-id">输入：</label>
      <input
        id="user-id"
        v-model="bgmId"
        :autofocus="!useUserStore().user.bgmId"
        aria-label="User's bangumi.tv username or uid"
        class="bg-transparent border-b dark:border-b-amber-50 border-gray-900 pl-1 pb-1 outline-11y"
        placeholder="uid / username"
        type="text"
      />
    </form>
  </div>
</template>

<script lang="ts" setup>
console.log('UserView.tsx');

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

import { Bar } from 'vue-chartjs';
import AvatarBlock from '@/components/AvatarBlock.vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { ref, watch } from 'vue';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

await sleep(500);

const userStore = useUserStore();

const bgmId = ref('');

const route = useRoute();
const router = useRouter();
//
//
if (route?.params?.id && !Array.isArray(route.params.id)) {
  try {
    await useUserStore().fetchUser(route.params.id);
  } catch (e) {
    router.replace({ name: 'notFound' });
  }
}

//
function submit() {
  if (route.params.id) {
    router.push({ name: 'user', params: { id: bgmId.value } });
  } else {
    router.replace({ name: 'user', params: { id: bgmId.value } });
  }
}

watch(
  () => route.params.id,
  (id) => {
    if (id && !Array.isArray(id)) {
      useUserStore().fetchUser(id);
    } else if (id === '') {
      useUserStore().$reset();
    }
  }
);
</script>

<style scoped></style>
