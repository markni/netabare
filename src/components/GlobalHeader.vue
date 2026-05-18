<script setup>
import { RouterLink } from 'vue-router';
import texts from '../constants/texts.js';
</script>

<template>
  <header class="min-w-32 paper px-4 pt-0 pb-8 sm:px-6">
    <nav class="flex items-stretch">
      <div class="header-links ml-auto flex flex-row flex-wrap items-stretch justify-end gap-0">
        <!--        <div class="text-gray-400 hover:text-gray-700 dark:hover:text-white">-->
        <!--          <a href="https://github.com/markni/netabare" about="blank">{{ texts._submitPr }}</a>-->
        <!--        </div>-->
        <div
          v-if="$route.path !== '/'"
          :class="['header-link', { 'header-link-active': $route.path === '/season' }]"
        >
          <RouterLink to="/season">{{ texts._season }}</RouterLink>
        </div>
        <div
          v-if="$route.path !== '/'"
          :class="['header-link', { 'header-link-active': $route.path === '/trending' }]"
        >
          <RouterLink to="/trending">{{ texts._trending }}</RouterLink>
        </div>
        <div
          v-if="$route.path !== '/'"
          :class="['header-link', { 'header-link-active': $route.path === '/history' }]"
        >
          <RouterLink to="/history">{{ texts._history }}</RouterLink>
        </div>
        <div
          v-if="$route.path !== '/'"
          :class="['header-link', { 'header-link-active': $route.path === '/user' }]"
        >
          <RouterLink to="/user">{{ texts._user }}</RouterLink>
        </div>
        <div
          v-if="$route.path !== '/'"
          :class="[
            'header-link',
            { 'header-link-active': $route.path.startsWith('/395378/vs/400602') }
          ]"
        >
          <RouterLink to="/395378/vs/400602">{{ texts._experimental }}</RouterLink>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.header-links {
  border: none;
}

.header-link {
  border: none;
  color: #111827;
  font-family: 'Noto Serif SC', 'Source Han Serif SC', 'Songti SC', serif;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.2;
}

.header-link :deep(a) {
  display: block;
  padding: 3.3rem 0.5rem 0.6rem;
  text-align: center;
}

.header-link-active :deep(a) {
  border: 1px solid #c9c9c9;
  border-top: none;
  color: #6b7280;
  font-weight: 700;
}

@media (min-width: 640px) {
  .header-link {
    min-width: 7.5rem;
  }
}

.dark .header-link {
  border: none;
  color: #d1d5db;
}

.dark .header-links {
  border: none;
}

.dark .header-link-active :deep(a) {
  border: 1px solid #6b7280;
  border-top: none;
  color: #f3f4f6;
  font-weight: 700;
}
</style>
