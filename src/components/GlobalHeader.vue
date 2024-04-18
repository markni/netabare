<script setup>
import { RouterLink } from 'vue-router'
import texts from '../constants/texts.js'
</script>

<template>
  <header class="p-8 fixed top-0 left-0">
    <nav class="inline-flex gap-4 pr-10 items-start justify-start">
      <div v-if="$route.path !== '/'" class="text-gray-400 hover:text-gray-700">
        <RouterLink to="/">{{ texts._backToHome }}</RouterLink>
      </div>
      <div class="text-gray-400 hover:text-gray-400">
        <a href="https://bgm.tv/group/topic/346147" about="blank">{{ texts._feedback }}</a>
      </div>
      <div class="text-gray-400 hover:text-gray-400">
        <a href="https://bgm.tv/group/topic/346147" about="blank">{{ texts._changeLog }}</a>
      </div>
    </nav>
  </header>
</template>

<style scoped></style>
