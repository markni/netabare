<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="p-8 fixed top-0 left-0">
    <nav class="inline-flex gap-4 pr-10 items-start justify-start">
      <div v-if="$route.path !== '/'" class="text-gray-400 hover:text-gray-700">
        <RouterLink to="/">返回首页</RouterLink>
      </div>
      <div class="text-gray-400 hover:text-gray-400">
        <a href="https://bgm.tv/group/topic/346147" about="blank">问题反馈</a>
      </div>
      <div class="text-gray-400 hover:text-gray-400">
        <a href="https://bgm.tv/group/topic/346147" about="blank">更新日志</a>
      </div>
    </nav>
  </header>
</template>

<style scoped></style>
