<script setup>
import { RouterLink } from 'vue-router'
import texts from '../constants/texts.js'
</script>

<template>
  <header class="p-8 fixed top-0 left-0 z-[49]">
    <nav
      class="inline-flex min-[1800px]:flex-col gap-4 pr-10 items-start justify-start bg-paper z-50"
    >
      <div v-if="$route.path !== '/'" class="text-gray-400 hover:text-gray-700">
        <RouterLink to="/">{{ texts._backToHome }}</RouterLink>
      </div>
      <div class="text-gray-400 hover:text-gray-700 xl:block hidden">
        <a href="https://bgm.tv/group/topic/346147" about="blank">{{ texts._feedback }}</a>
      </div>
      <div class="text-gray-400 hover:text-gray-700 xl:block hidden">
        <a href="https://bgm.tv/group/topic/346147" about="blank">{{ texts._changeLog }}</a>
      </div>
      <div class="mt-4"></div>
      <div
        v-if="$route.path !== '/'"
        class="text-gray-400 hover:text-gray-700"
        :class="{ 'text-gray-700': $route.path === '/season' }"
      >
        <RouterLink to="/season">{{ texts._season }}</RouterLink>
      </div>
      <div
        v-if="$route.path !== '/'"
        class="text-gray-400 hover:text-gray-700"
        :class="{ 'text-gray-700': $route.path === '/trending' }"
      >
        <RouterLink to="/trending">{{ texts._trending }}</RouterLink>
      </div>
      <div
        v-if="$route.path !== '/'"
        class="text-gray-400 hover:text-gray-700"
        :class="{ 'text-gray-700': $route.path === '/history' }"
      >
        <RouterLink to="/history">{{ texts._history }}</RouterLink>
      </div>
      <div
        v-if="$route.path !== '/'"
        class="text-gray-400 hover:text-gray-700"
        :class="{ 'text-gray-700': $route.path.startsWith('/user') }"
      >
        <RouterLink to="/user">{{ texts._user }}</RouterLink>
      </div>
      <div
        v-if="$route.path !== '/'"
        class="text-gray-400 hover:text-gray-700"
        :class="{ 'text-gray-700': $route.path.includes('/vs/') }"
      >
        <RouterLink to="/395378/vs/400602">{{ texts._experimental }}</RouterLink>
      </div>
    </nav>
  </header>
</template>

<style scoped></style>
