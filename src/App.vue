<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-paper flex">
    <header class="bg-darkGray text-white p-4 gap-4 min-w-60">
      <nav class="inline-flex flex-col gap-2 pr-10 items-start justify-start">
        <div
          class="text-paper text-4xl hover:italic font-extrabold shadow p-2 hover:px-4 transition-all"
        >
          <RouterLink to="/" v-if="$route.path !== '/'">返回</RouterLink>
        </div>
        <div
          class="text-gold text-4xl hover:italic font-extrabold shadow p-2 hover:px-4 transition-all gold"
        >
          <a href="https://bgm.tv/group/topic/346147" about="blank">问题</a>
        </div>
        <div
          class="text-gold text-4xl hover:italic font-extrabold shadow p-2 hover:px-4 transition-all gold"
        >
          <a href="https://bgm.tv/group/topic/346147" about="blank">更新</a>
        </div>
      </nav>
    </header>
    <div class="container mx-auto bg-paper p-4 pt-10 bottom-0">
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
