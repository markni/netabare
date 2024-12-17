<script setup>
import { useSubjectStore } from '@/stores/subject';
import { storeToRefs } from 'pinia';
import { ref, onUnmounted, computed } from 'vue';
import ScoreChart from '@/components/charts/ScoreChart.vue';
import RankChart from '@/components/charts/RankChart.vue';
import CollectionChart from '@/components/charts/CollectionChart.vue';
import DeltaDisplay from '@/components/DeltaDisplay.vue';
import HintDiv from '@/components/HintDiv.vue';
import _ from 'lodash';
import RatingChart from '@/components/charts/RatingChart.vue';

const props = defineProps({
  id: {
    type: String,
    required: true
  }
});
const store = useSubjectStore();
const {
  ratingDeltas,
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
  const airDate = new Date(subject.value.air_date);
  const cutoffDate = new Date('2018-05-16');
  _setFilteredBy(_.isEmpty(epsData.value) || airDate < cutoffDate ? 'disabled' : 'eps');
});

onUnmounted(() => {
  store.$reset();
});

// Function to decode HTML entities

// Todo: move this to backend
function decodeHtmlEntities(str) {
  return str
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

const decodedName = computed(() => {
  return decodeHtmlEntities(subject.value.name || '');
});

const decodedNameCn = computed(() => {
  return decodeHtmlEntities(subject.value.name_cn || '');
});

// Add this near the top of the script section, with other refs
const selectedRatingPeriod = ref('now');

// Add this computed property to get rating data for the selected period
const currentRatingData = computed(() => {
  return ratingDeltas.value(selectedRatingPeriod.value);
});

// Add this function to handle period selection
const setRatingPeriod = (period) => {
  selectedRatingPeriod.value = period;
};
</script>

<template>
  <div v-if="subject">
    <div class="flex flex-col items-end gap-4">
      <h1 class="pt-8 text-6xl">
        <a
          class="hover:bg-gold"
          target="_blank"
          title="访问Bangumi上的条目"
          :href="'https://bgm.tv/subject/' + id"
          >{{ decodedName }}</a
        >
      </h1>
      <div
        class="sticky top-0 z-[48] flex w-full flex-col items-end gap-4 bg-paper py-5 transition-[background-color] duration-300 dark:bg-paper-dark"
      >
        <h2 class="text-4xl" v-if="subject.name_cn">
          <a
            class="hover:bg-gold"
            target="_blank"
            title="访问Bangumi上的条目"
            :href="'https://bgm.tv/subject/' + id"
            >{{ decodedNameCn }}</a
          >
        </h2>

        <div class="mt-4 flex gap-2 text-xl">
          <button
            class="cursor-pointer decoration-gold underline-offset-8 hover:underline"
            :class="{
              underline: filteredBy === 'none' || filteredBy === 'disabled'
            }"
            :disabled="filteredBy === 'disabled'"
            @click="_setFilteredBy(`none`)"
          >
            全部
          </button>
          <button
            class="cursor-pointer decoration-gold underline-offset-8"
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

      <!-- Section 1: Score -->
      <section id="score" class="flex w-full scroll-mt-16 flex-col gap-4">
        <div class="mt-20 flex flex-col items-end">
          <h3 class="z-10 text-2xl">
            <a href="#score" class="hover:bg-gold">
              评分
              <DeltaDisplay v-if="delta?.score !== undefined" :delta="delta.score" />
            </a>
          </h3>
          <div class="text-8xl">{{ subject.rating?.score ?? 'N/A' }}</div>
        </div>
        <div class="aspect-square w-full sm:aspect-[16/8]">
          <ScoreChart
            :eps-data="epsData"
            :ten-data="combinedData.scoreData.ten"
            :one-data="combinedData.scoreData.one"
            :history-data="combinedData.scoreData.history"
            :x-max="filteredBy === 'eps' ? oneWeekAfterLastEpTimestamp : null"
            :x-min="filteredBy === 'eps' ? oneWeekBeforeFirstEpTimestamp : null"
          />
        </div>
      </section>

      <!-- Section 2: Rank -->
      <section id="rank" class="flex w-full snap-start scroll-mt-20 flex-col gap-4">
        <div class="mt-20 flex flex-col items-end">
          <h3 class="z-10 text-2xl">
            <a href="#rank" class="hover:bg-blue">
              排名
              <DeltaDisplay v-if="delta?.rank !== undefined" :precision="0" :delta="delta.rank" />
            </a>
          </h3>
          <div class="text-8xl">{{ subject.rank ?? 'N/A' }}</div>
        </div>
        <div class="aspect-square w-full sm:aspect-[16/8]">
          <RankChart
            :eps-data="epsData"
            :history-data="combinedData.rankData.history"
            :x-max="filteredBy === 'eps' ? oneWeekAfterLastEpTimestamp : null"
            :x-min="filteredBy === 'eps' ? oneWeekBeforeFirstEpTimestamp : null"
          />
        </div>
      </section>

      <!-- Section 3: Collection -->
      <section id="watching" class="flex w-full snap-start scroll-mt-20 flex-col gap-4">
        <div class="mt-20 flex flex-col items-end">
          <h3 class="z-10 text-2xl">
            <a href="#watching" class="hover:bg-pink">
              在看
              <DeltaDisplay
                v-if="delta?.watching !== undefined"
                :precision="0"
                :delta="delta.watching"
              />
            </a>
          </h3>
          <div class="text-8xl">{{ subject.collection?.doing ?? 'N/A' }}</div>
        </div>
        <div class="aspect-square w-full sm:aspect-[16/8]">
          <CollectionChart
            :eps-data="epsData"
            :history-data="combinedData.collectionData.history"
            :x-max="filteredBy === 'eps' ? oneWeekAfterLastEpTimestamp : null"
            :x-min="filteredBy === 'eps' ? oneWeekBeforeFirstEpTimestamp : null"
          />
        </div>
      </section>

      <section id="rating" class="flex w-full snap-start scroll-mt-20 flex-col gap-4">
        <div class="mt-20 flex flex-col items-end">
          <div class="bg-pink">
            <RouterLink :to="`/${props.id}/vs/400602`">实验功能</RouterLink>
          </div>
          <h3 class="z-10 text-2xl">
            评分分布
            <DeltaDisplay
              :title="
                selectedRatingPeriod === 'now'
                  ? '当前均分'
                  : selectedRatingPeriod === '1m'
                    ? '一个月内均分与当前均分的差异'
                    : '一年内均分与当前均分的差异'
              "
              v-show="currentRatingData?.score"
              :delta="currentRatingData?.score - subject.rating?.score"
            />
          </h3>
          <div class="text-8xl">{{ currentRatingData?.score ?? 'N/A' }}</div>

          <div class="mt-4 flex gap-2 text-xl">
            <button
              class="cursor-pointer decoration-gold underline-offset-8 hover:underline"
              :class="{
                underline: selectedRatingPeriod === 'now'
              }"
              @click="setRatingPeriod('now')"
            >
              当前评分
            </button>
            <!-- <button
              class="cursor-pointer decoration-gold underline-offset-8 hover:underline"
              :class="{
                underline: selectedRatingPeriod === '1w'
              }"
              @click="setRatingPeriod('1w')"
            >
              一周内
            </button> -->
            <button
              class="cursor-pointer decoration-gold underline-offset-8 hover:underline"
              :class="{
                underline: selectedRatingPeriod === '1m'
              }"
              @click="setRatingPeriod('1m')"
            >
              一个月内评分
            </button>
            <!-- <button
              class="cursor-pointer decoration-gold underline-offset-8 hover:underline"
              :class="{
                underline: selectedRatingPeriod === '6m'
              }"
              @click="setRatingPeriod('6m')"
            >
              半年内
            </button> -->
            <button
              class="cursor-pointer decoration-gold underline-offset-8 hover:underline"
              :class="{
                underline: selectedRatingPeriod === '1y'
              }"
              @click="setRatingPeriod('1y')"
            >
              一年内评分
            </button>
          </div>

          <div class="aspect-square w-full sm:aspect-[16/8]">
            <RatingChart v-if="currentRatingData?.rating" :rating-data="currentRatingData.rating" />
          </div>
        </div>
      </section>

      <div v-if="props.id !== '400602'" class="bg-pink">
        <RouterLink :to="`/${props.id}/vs/400602`">实验功能：对比「葬送的芙莉莲」</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
