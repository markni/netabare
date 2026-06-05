<template>
  <main class="@container flex min-h-[calc(100dvh-8.75rem)] flex-col items-center justify-between">
    <nav class="flex flex-col gap-4 tracking-widest">
      <h2 class="flex flex-col items-baseline justify-between gap-4 lg:flex-row lg:gap-10">
        <span class="text-2xl lg:text-4xl">{{ texts._currentSeason }}</span>
        <RouterLink class="text-3xl hover:bg-teal lg:text-5xl" to="/season">
          {{ texts._dragonVsTiger }}
        </RouterLink>
      </h2>

      <h2 class="flex flex-col items-baseline justify-between gap-4 lg:flex-row lg:gap-10">
        <span class="text-2xl lg:text-4xl">{{ texts._allSiteAnime }}</span>
        <RouterLink class="text-3xl hover:bg-blue lg:text-5xl" to="/trending">
          {{ texts._hotTrends }}
        </RouterLink>
      </h2>

      <h2 class="flex flex-col items-baseline justify-between gap-4 lg:flex-row lg:gap-10">
        <span class="text-2xl lg:text-4xl">{{ texts._allSiteAnime }}</span>
        <RouterLink class="text-3xl hover:bg-pink lg:text-5xl" to="/history">
          {{ texts._scoreDistribution }}
        </RouterLink>
      </h2>

      <h2 class="flex flex-col items-baseline justify-between gap-4 lg:flex-row lg:gap-10">
        <span class="text-2xl lg:text-4xl">{{ texts._personalAnime }}</span>
        <RouterLink class="text-3xl hover:bg-gold lg:text-5xl" to="/user">
          {{ texts._scoreDistribution2 }}
        </RouterLink>
      </h2>
    </nav>

    <div class="bleed-both-to-viewport h-[calc(100dvh-24rem)] min-h-80 w-dvw overflow-hidden">
      <ColorFan />
    </div>
  </main>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import ColorFan from '@/components/ui/ColorFan.vue';
import texts from '@/constants/texts.js';
</script>
