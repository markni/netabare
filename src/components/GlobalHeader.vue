<script setup>
import { RouterLink } from 'vue-router';
import texts from '../constants/texts.js';
import EclipseToggle from './ui/EclipseToggle.vue';
import { useThemeStore } from '../stores/theme';

const themeStore = useThemeStore();
</script>

<template>
  <header class="min-w-32 paper pt-0 pb-8">
    <div class="container mx-auto w-full px-0">
      <nav class="flex items-stretch">
        <div class="header-links flex w-full flex-row flex-wrap items-stretch justify-start gap-4">
          <!--        <div class="text-gray-400 hover:text-gray-700 dark:hover:text-white">-->
          <!--          <a href="https://github.com/markni/netabare" about="blank">{{ texts._submitPr }}</a>-->
          <!--        </div>-->
          <div
            v-if="$route.path !== '/'"
            :class="['header-link', { 'header-link-active': $route.path === '/season' }]"
          >
            <RouterLink class="block px-3 pt-14 pb-2 text-center" to="/season">{{
              texts._season
            }}</RouterLink>
          </div>
          <div
            v-if="$route.path !== '/'"
            :class="['header-link', { 'header-link-active': $route.path === '/trending' }]"
          >
            <RouterLink class="block px-3 pt-14 pb-2 text-center" to="/trending">{{
              texts._trending
            }}</RouterLink>
          </div>
          <div
            v-if="$route.path !== '/'"
            :class="['header-link', { 'header-link-active': $route.path === '/history' }]"
          >
            <RouterLink class="block px-3 pt-14 pb-2 text-center" to="/history">{{
              texts._history
            }}</RouterLink>
          </div>
          <div
            v-if="$route.path !== '/'"
            :class="['header-link', { 'header-link-active': $route.path === '/user' }]"
          >
            <RouterLink class="block px-3 pt-14 pb-2 text-center" to="/user">{{
              texts._user
            }}</RouterLink>
          </div>
          <div
            v-if="$route.path !== '/'"
            :class="[
              'header-link',
              { 'header-link-active': $route.path.startsWith('/395378/vs/400602') }
            ]"
          >
            <RouterLink class="block px-3 pt-14 pb-2 text-center" to="/395378/vs/400602">{{
              texts._experimental
            }}</RouterLink>
          </div>
          <div class="header-toggle ml-auto flex items-end pb-2 pl-3">
            <EclipseToggle
              @toggle="themeStore.toggleDarkMode"
              :mode="themeStore.isDarkMode ? 'dark' : 'light'"
            />
          </div>
        </div>
      </nav>
    </div>
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
}

.header-link-active :deep(a) {
  border: 1px solid #c9c9c9;
  border-top: none;
  color: #6b7280;
  font-weight: 700;
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
