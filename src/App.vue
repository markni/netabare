<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app.js'
import FullscreenOverlay from '@/components/FullscreenOverlay.vue'
const store = useAppStore()
const { networkError } = storeToRefs(store)
</script>

<template>
  <FullscreenOverlay v-if="networkError" text="失去链接" code="504" annotation="lost connection" />
  <!--  <header class="bg-mint text-white p-4 gap-4 min-w-60 sticky">-->
  <!--    <nav class="inline-flex flex-col gap-2 pr-10 items-start justify-start">-->
  <!--      <div class="text-paper text-4xl hover:italic font-extrabold p-2 hover:px-4 transition-all">-->
  <!--        <RouterLink to="/" v-if="$route.path !== '/'">返回</RouterLink>-->
  <!--      </div>-->
  <!--      <div-->
  <!--        class="text-gold text-4xl hover:italic font-extrabold p-2 hover:px-4 transition-all gold"-->
  <!--      >-->
  <!--        <a href="https://bgm.tv/group/topic/346147" about="blank">问题</a>-->
  <!--      </div>-->
  <!--      <div-->
  <!--        class="text-gold text-4xl hover:italic font-extrabold p-2 hover:px-4 transition-all gold"-->
  <!--      >-->
  <!--        <a href="https://bgm.tv/group/topic/346147" about="blank">更新</a>-->
  <!--      </div>-->
  <!--    </nav>-->
  <!--  </header>-->
  <div class="min-h-screen bg-paper flex font-serif">
    <!--    <div class="bg-mint w-4 cursor-pointer"></div>-->
    <div
      :class="[
        'bg-paper',
        'w-full',
        { 'container p-4 mx-auto pt-10 bottom-0': $route.path !== '/' }
      ]"
    >
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
