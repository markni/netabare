<script setup>
import { RouterView } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app.js'
import FullscreenOverlay from '@/components/FullscreenOverlay.vue'
import GlobalHeader from '@/components/GlobalHeader.vue'
import texts from '@/constants/texts.js'

const store = useAppStore()
const { networkError, longPolling } = storeToRefs(store)
</script>

<template>
  <FullscreenOverlay
    v-if="networkError"
    :text="texts._lostConnection"
    code="504"
    annotation="lost connection"
  />
  <FullscreenOverlay
    v-if="longPolling"
    color="bg-gold"
    :text="texts._loading"
    annotation="loading"
  />
  <GlobalHeader />
  <div class="min-h-screen bg-paper flex font-serif">
    <div
      :class="['bg-paper w-full p-4 mx-auto pt-10 bottom-0', { container: $route.path !== '/' }]"
    >
      <RouterView />
    </div>
  </div>
  <div class="opacity-0 fixed bottom-0 right-0 pointer-events-none">
    {{ texts._allTextCombined }}
  </div>
</template>

<style scoped></style>
