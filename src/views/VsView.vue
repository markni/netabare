<script setup>
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';

import { useVsStore } from '@/stores/vs.js';
import BattleChart from '@/components/charts/BattleChart.vue';
import { useRouter } from 'vue-router';
import BattleRankChart from '@/components/charts/BattleRankChart.vue';
import FullscreenOverlay from '@/components/FullscreenOverlay.vue';

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
const { histories } = storeToRefs(store);

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
</script>

<template>
  <div class="pt-14">
    <div v-if="props.id0 === props.id1" class="text-6xl">
      <FullscreenOverlay
        text="你摧毁了时空结构"
        annotation="game over"
        code="400602"
        color="bg-red"
      />
    </div>
    <div v-if="props.id0 !== props.id1" class="flex flex-col gap-20">
      <div class="grid grid-cols-2 text-3xl gap-4">
        <form @submit.prevent="submit" class="flex flex-col gap-4">
          <label for="localId0" class="text-xl">动画零</label>
          <input type="number" class="bg-transparent w-40" id="localId0" v-model="localId0" />
        </form>
        <form @submit.prevent="submit" class="flex flex-col gap-4">
          <label for="localId1" class="text-xl">动画一</label>
          <input type="number" class="bg-transparent w-40" id="localId1" v-model="localId1" />
        </form>
      </div>
      <div v-if="histories[0] || histories[1]" class="flex flex-col gap-8">
        <div class="sm:aspect-[16/10]">
          <BattleChart :history-data="histories.filter((h) => !!h)" />
        </div>
        <div class="sm:aspect-[16/10]">
          <BattleRankChart :history-data="histories.filter((h) => !!h)" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
