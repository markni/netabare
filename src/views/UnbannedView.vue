<script setup>
import { useUnbannedStore } from '@/stores/unbanned';
import { storeToRefs } from 'pinia';
import dayjs from 'dayjs';
import texts from '@/constants/texts.js';

const store = useUnbannedStore();
const { items } = storeToRefs(store);

store.fetchUnbanned();

const formatDate = (date) => dayjs(date).format('YYYY-MM-DD');
</script>

<template>
  <div class="@container mt-14 flex flex-col gap-12 px-4 pt-0">
    <div class="flex flex-col gap-3 border-b border-border pb-6">
      <h1 class="bg-green text-3xl tracking-wider first-letter:text-4xl">
        {{ texts._unbannedSubjects }}
      </h1>
    </div>

    <ol v-if="items.length" class="flex list-decimal flex-col gap-10">
      <li v-for="item in items" :key="item.bgmId">
        <article class="grid grid-cols-12 gap-x-4 gap-y-3 border-b border-muted pb-10">
          <div class="col-span-12 sm:col-span-9">
            <RouterLink
              class="line-clamp-2 text-2xl hover:bg-green"
              :to="'/subject/' + item.bgmId"
              :title="item.name_cn || item.name"
            >
              {{ item.name_cn || item.name }}
            </RouterLink>
            <div class="mt-1 line-clamp-1 text-sm text-muted-foreground" :title="item.name">
              {{ item.name }}
            </div>
            <a
              class="mt-2 inline-block border-b border-current text-sm break-all text-blue hover:bg-blue hover:text-background"
              :href="item.bangumi"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ item.bangumi }}
            </a>
          </div>

          <div
            class="col-span-12 flex flex-col gap-1 text-sm sm:col-span-3 sm:items-end sm:text-right"
          >
            <div class="text-muted-foreground">{{ texts._firstDateAfterLongGap }}</div>
            <div>{{ formatDate(item.firstDateAfterLongGap) }}</div>
          </div>
        </article>
      </li>
    </ol>
  </div>
</template>
