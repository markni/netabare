<script setup>
import { useSubjectStore } from '@/stores/subject';
import { storeToRefs } from 'pinia';
import { ref, onUnmounted } from 'vue';
import ScoreChart from '@/components/charts/ScoreChart.vue';
import RankChart from '@/components/charts/RankChart.vue';
import CollectionChart from '@/components/charts/CollectionChart.vue';
import DeltaDisplay from '@/components/DeltaDisplay.vue';
import HintDiv from '@/components/HintDiv.vue';
import _ from 'lodash';

const props = defineProps({
  id: {
    type: String,
    required: true
  }
});
const store = useSubjectStore();
const {
  subject,
  combinedData,
  delta,
  epsData,
  oneWeekBeforeFirstEpTimestamp,
  oneWeekAfterLastEpTimestamp
} = storeToRefs(store);

/**
 * @type {Ref<UnwrapRef<'none' | 'eps' | 'disabled'>>}
 */
const filteredBy = ref('none');

const _setFilteredBy = (f) => {
  filteredBy.value = f;
};

store.fetchSubject(props.id).then(() => {
  _setFilteredBy(_.isEmpty(epsData.value) ? 'disabled' : 'eps');
});

onUnmounted(() => {
  store.$reset();
});
</script>

<template>
  <div v-if="subject">
    <div class="flex flex-col gap-4 items-end">
      <h1 class="text-6xl pt-8">
        <a
          class="hover:bg-gold"
          target="_blank"
          title="访问Bangumi上的条目"
          :href="'https://bgm.tv/subject/' + id"
          >{{ subject.name }}</a
        >
      </h1>
      <div
        class="sticky top-0 bg-paper dark:bg-paper-dark z-[48] gap-4 py-5 w-full flex flex-col items-end"
      >
        <h2 class="text-4xl" v-if="subject.name_cn">
          <a
            class="hover:bg-gold"
            target="_blank"
            title="访问Bangumi上的条目"
            :href="'https://bgm.tv/subject/' + id"
            >{{ subject.name_cn }}</a
          >
        </h2>

        <div class="flex gap-2 mt-4 text-xl">
          <button
            class="cursor-pointer hover:underline underline-offset-8 decoration-gold"
            :class="{
              underline: filteredBy === 'none' || filteredBy === 'disabled'
            }"
            :disabled="filteredBy === 'disabled'"
            @click="_setFilteredBy(`none`)"
          >
            全部
          </button>
          <button
            class="cursor-pointer underline-offset-8 decoration-gold"
            :class="{
              'hover:underline': filteredBy !== 'disabled',
              underline: filteredBy === 'eps',
              'text-gray-200': filteredBy === 'disabled'
            }"
            :disabled="filteredBy === 'disabled'"
            @click="_setFilteredBy('eps')"
          >
            放送期间
          </button>
        </div>
      </div>
      <HintDiv
        title="用鼠标左键在图表中拖选一个方块自定义时间范围，点击图表右上角的重置缩放按钮恢复"
      >
        如何自定义时间范围？
      </HintDiv>

      <div class="mt-20 flex flex-col items-end">
        <div class="text-2xl">
          评分
          <DeltaDisplay v-if="delta?.score !== undefined" :delta="delta.score" />
        </div>
        <div class="text-8xl">{{ subject.rating?.score ?? 'N/A' }}</div>
      </div>

      <div class="aspect-square sm:aspect-[16/8] w-full">
        <ScoreChart
          :eps-data="epsData"
          :ten-data="combinedData.scoreData.ten"
          :one-data="combinedData.scoreData.one"
          :history-data="combinedData.scoreData.history"
          :x-max="filteredBy === 'eps' ? oneWeekAfterLastEpTimestamp : null"
          :x-min="filteredBy === 'eps' ? oneWeekBeforeFirstEpTimestamp : null"
        />
      </div>

      <div class="mt-20 flex flex-col items-end">
        <div class="text-2xl">
          排名
          <DeltaDisplay v-if="delta?.rank !== undefined" :precision="0" :delta="delta.rank" />
        </div>
        <div class="text-8xl">{{ subject.rank ?? 'N/A' }}</div>
      </div>

      <div class="aspect-square sm:aspect-[16/8] w-full">
        <RankChart
          :eps-data="epsData"
          :history-data="combinedData.rankData.history"
          :x-max="filteredBy === 'eps' ? oneWeekAfterLastEpTimestamp : null"
          :x-min="filteredBy === 'eps' ? oneWeekBeforeFirstEpTimestamp : null"
        />
      </div>

      <div class="mt-20 flex flex-col items-end">
        <div class="text-2xl">
          在看
          <DeltaDisplay
            v-if="delta?.watching !== undefined"
            :precision="0"
            :delta="delta.watching"
          />
        </div>
        <div class="text-8xl">{{ subject.collection?.doing ?? 'N/A' }}</div>
      </div>

      <div class="aspect-square sm:aspect-[16/8] w-full">
        <CollectionChart
          :eps-data="epsData"
          :history-data="combinedData.collectionData.history"
          :x-max="filteredBy === 'eps' ? oneWeekAfterLastEpTimestamp : null"
          :x-min="filteredBy === 'eps' ? oneWeekBeforeFirstEpTimestamp : null"
        />
      </div>

      <div v-if="props.id !== '400602'" class="bg-pink">
        <RouterLink :to="`/${props.id}/vs/400602`">实验功能：对比「葬送的芙莉莲」</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
