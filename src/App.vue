<script setup>
import { RouterView } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app.js'
import FullscreenOverlay from '@/components/FullscreenOverlay.vue'
import GlobalHeader from '@/components/GlobalHeader.vue'
const store = useAppStore()
const { networkError, longPolling } = storeToRefs(store)
</script>

<template>
  <FullscreenOverlay v-if="networkError" text="失去链接" code="504" annotation="lost connection" />
  <FullscreenOverlay v-if="longPolling" color="bg-gold" text="读取中" annotation="loading" />
  <GlobalHeader />
  <div class="min-h-screen bg-paper flex font-serif">
    <div
      :class="['bg-paper w-full p-4 mx-auto pt-10 bottom-0', { container: $route.path !== '/' }]"
    >
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
