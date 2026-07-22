<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useScoreIncreasesStore } from '@/stores/scoreIncreases.js';
import MiniScoreChart from '@/components/charts/MiniScoreChart.vue';
import DeltaDisplay from '@/components/DeltaDisplay.vue';
import { COLORS10, PINK } from '@/constants/colors.js';
import texts from '@/constants/texts.js';

const store = useScoreIncreasesStore();
const { items } = storeToRefs(store);

store.fetchScoreIncreases();

const formatData = (history) =>
  history.map((item) => ({ x: new Date(item.recordedAt), y: item.score }));

const scoreRange = (history) => {
  const first = history[0]?.score;
  const latest = history[history.length - 1]?.score;

  return {
    first: Number.isFinite(first) ? first.toFixed(2) : '—',
    latest: Number.isFinite(latest) ? latest.toFixed(2) : '—'
  };
};

const rankedItems = computed(() =>
  items.value.map((item) => ({
    ...item,
    range: scoreRange(item.history)
  }))
);
</script>

<template>
  <main class="@container mt-14 px-4 pt-0">
    <div v-if="rankedItems.length" class="flex flex-col gap-16">
      <header class="grid max-w-3xl gap-2">
        <p class="type-page-kicker">{{ texts._scoreIncreasesKicker }}</p>
        <h1 id="score-increases" class="type-page-title">{{ texts._scoreIncreaseRank }}</h1>
        <p class="type-page-subtitle">{{ texts._scoreIncreasesSubtitle }}</p>
      </header>

      <ol class="flex list-decimal flex-col gap-16 xl:gap-8">
        <li v-for="item in rankedItems" :key="item.bgmId">
          <article class="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-center lg:gap-8">
            <div class="flex flex-col gap-4 lg:col-span-5">
              <div>
                <div class="text-2xl">
                  <RouterLink
                    class="line-clamp-1 hover:bg-pink"
                    :to="'/subject/' + item.bgmId"
                    :title="item.subject.name_cn || item.subject.name"
                  >
                    {{ item.subject.name_cn || item.subject.name }}
                  </RouterLink>
                </div>
                <div class="text-md line-clamp-1" :title="item.subject.name">
                  {{ item.subject.name }}
                </div>
              </div>

              <div class="flex items-baseline gap-3">
                <DeltaDisplay :delta="item.score" />
                <span class="text-sm text-muted-foreground tabular-nums">
                  {{ item.range.first }} →
                  <span :style="{ color: COLORS10[Math.round(Number(item.range.latest))] }">
                    {{ item.range.latest }}
                  </span>
                </span>
              </div>
            </div>

            <div
              class="aspect-video w-full max-w-64 justify-self-center lg:col-span-6 lg:col-start-7 lg:justify-self-end"
            >
              <MiniScoreChart :color="PINK" :history-data="formatData(item.history)" />
            </div>
          </article>
        </li>
      </ol>
    </div>
  </main>
</template>
