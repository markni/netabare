<script setup>
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';

import { useVsStore } from '@/stores/vs.js';
import BattleChart from '@/components/charts/BattleChart.vue';
import { useRouter } from 'vue-router';
import BattleRankChart from '@/components/charts/BattleRankChart.vue';
import FullscreenOverlay from '@/components/FullscreenOverlay.vue';
import FoilCard from '@/components/FoilCard.vue';
import VsBarChart from '@/components/charts/VsBarChart.vue';
import texts from '@/constants/texts.js';

const router = useRouter();

const props = defineProps({
  id0: {
    type: String,
    required: true
  },
  id1: {
    type: String,
    required: true
  }
});

const store = useVsStore();
const { histories, subjects } = storeToRefs(store);

const localId0 = ref(props.id0);
const localId1 = ref(props.id1);

const submit = () => {
  router.push({
    name: 'vs',
    params: { id0: localId0.value, id1: localId1.value } // Make sure to match the parameter names in your route definition
  });
};

if (props.id0 !== props.id1) {
  store.fetchSubject(props.id0, 0);
  store.fetchSubject(props.id1, 1);

  watch(
    [() => props.id0],
    () => {
      store.fetchSubject(props.id0, 0);
    },
    { deep: false }
  );

  watch(
    [() => props.id1],
    () => {
      store.fetchSubject(props.id1, 1);
    },
    { deep: false }
  );
}

const isDev = import.meta.env.DEV;

const { getRatingData } = store;
</script>

<template>
  <div class="pt-14">
    <div v-if="props.id0 === props.id1" class="text-6xl">
      <FullscreenOverlay
        :text="texts._destroyedSpaceTime"
        :annotation="texts._gameOver"
        code="400602"
        color="bg-red"
      />
    </div>
    <div v-if="props.id0 !== props.id1" class="flex flex-col gap-20">
      <div class="sticky top-0 z-10 grid grid-cols-2 gap-4 paper py-4 text-3xl">
        <form @submit.prevent="submit" class="flex flex-col gap-4 text-blue">
          <!-- <input type="number" class="w-40 bg-transparent" id="localId0" v-model="localId0" /> -->
          <div class="text-6xl">
            {{ subjects[0]?.rating?.score || 'N/A' }}
          </div>
          <label for="localId0" class="text-xl">{{
            subjects[0]?.name_cn || subjects[0]?.name
          }}</label>
        </form>
        <form @submit.prevent="submit" class="al flex flex-col items-end gap-4 text-pink">
          <!-- <input type="number" class="w-40 bg-transparent" id="localId1" v-model="localId1" /> -->
          <div class="text-6xl">
            {{ subjects[1]?.rating?.score || 'N/A' }}
          </div>
          <label for="localId1" class="text-xl">
            {{ subjects[1]?.name_cn || subjects[1]?.name }}
          </label>
        </form>
      </div>
      <div class="flex w-full flex-col gap-1">
        <div v-for="n in 10" :key="n" class="flex items-center gap-2">
          <span class="w-4 text-sm">{{ n }}</span>
          <div class="flex h-4 w-full">
            <div
              class="h-full bg-blue transition-all"
              :style="{
                width: `${(subjects[0]?.rating?.count[n] / (subjects[0]?.rating?.count[n] + subjects[1]?.rating?.count[n])) * 100}%`
              }"
            />
            <div
              class="h-full bg-pink transition-all"
              :style="{
                width: `${(subjects[1]?.rating?.count[n] / (subjects[0]?.rating?.count[n] + subjects[1]?.rating?.count[n])) * 100}%`
              }"
            />
          </div>
        </div>
      </div>
      <div v-if="histories[0] || histories[1]" class="flex flex-col gap-8">
        <div class="sm:aspect-[16/10]">
          <VsBarChart :rating-data="getRatingData(0)" :comparison-data="getRatingData(1)" />
        </div>

        <div class="sm:aspect-[16/10]">
          <BattleChart :history-data="histories.filter((h) => !!h)" />
        </div>
        <div class="sm:aspect-[16/10]">
          <BattleRankChart :history-data="histories.filter((h) => !!h)" />
        </div>
      </div>
    </div>

    <FoilCard v-if="isDev" />
  </div>
</template>

<style scoped></style>
