<script setup>
import { RouterLink } from 'vue-router';
import texts from '../constants/texts.js';
import { ref } from 'vue';
import { useThemeStore } from '../stores/theme';

const themeStore = useThemeStore();

const isMenuExpanded = ref(false);
</script>

<template>
  <!-- z-49 so it's lower than overlay -->
  <header
    class="bg-paper dark:bg-paper-dark min-w-32 px-8 py-4 transition-[background-color] duration-300"
    :class="{
      'dark:bg-paper-dark fixed inset-0 z-40 h-full w-full overflow-y-auto sm:relative sm:h-auto sm:w-auto sm:overflow-visible':
        isMenuExpanded
    }"
  >
    <nav class="flex flex-col items-center sm:items-start">
      <div
        class="border-t-paper-dark dark:border-t-paper h-1 w-32 cursor-pointer border-t-4 border-solid pb-4 text-gray-400 hover:text-gray-700 sm:hidden dark:hover:text-white"
        @click="isMenuExpanded = !isMenuExpanded"
      ></div>
      <div
        class="flex flex-col gap-4 overflow-hidden sm:h-auto"
        :class="{ 'h-auto': isMenuExpanded, 'h-0': !isMenuExpanded }"
      >
        <div
          v-if="$route.path !== '/'"
          class="text-gray-400 hover:text-gray-700 dark:hover:text-white"
        >
          <RouterLink to="/">{{ texts._backToHome }}</RouterLink>
        </div>
        <div class="text-gray-400 hover:text-gray-700 dark:hover:text-white">
          <a href="https://bgm.tv/group/topic/346147" about="blank">{{ texts._feedback }}</a>
        </div>
        <div class="text-gray-400 hover:text-gray-700 dark:hover:text-white">
          <a href="https://bgm.tv/group/topic/346147" about="blank">{{ texts._changeLog }}</a>
        </div>
        <!--        <div class="text-gray-400 hover:text-gray-700 dark:hover:text-white">-->
        <!--          <a href="https://github.com/markni/netabare" about="blank">{{ texts._submitPr }}</a>-->
        <!--        </div>-->
        <div class="mt-4">
          <!-- gap between main links and other links -->
        </div>
        <div
          v-if="$route.path !== '/'"
          class="text-gray-400 hover:text-gray-700 dark:hover:text-white"
          :class="{ 'text-gray-700 dark:text-white': $route.path === '/season' }"
        >
          <RouterLink to="/season">{{ texts._season }}</RouterLink>
        </div>
        <div
          v-if="$route.path !== '/'"
          class="text-gray-400 hover:text-gray-700 dark:hover:text-white"
          :class="{ 'text-gray-700 dark:text-white': $route.path === '/trending' }"
        >
          <RouterLink to="/trending">{{ texts._trending }}</RouterLink>
        </div>
        <div
          v-if="$route.path !== '/'"
          class="text-gray-400 hover:text-gray-700 dark:hover:text-white"
          :class="{ 'text-gray-700 dark:text-white': $route.path === '/history' }"
        >
          <RouterLink to="/history">{{ texts._history }}</RouterLink>
        </div>
        <div
          v-if="$route.path !== '/'"
          class="text-gray-400 hover:text-gray-700 dark:hover:text-white"
          :class="{ 'text-gray-700 dark:text-white': $route.path.startsWith('/user') }"
        >
          <RouterLink to="/user">{{ texts._user }}</RouterLink>
        </div>
        <div
          v-if="$route.path !== '/'"
          class="text-gray-400 hover:text-gray-700 dark:hover:text-white"
          :class="{ 'text-gray-700 dark:text-white': $route.path.includes('/vs/') }"
        >
          <RouterLink to="/395378/vs/400602">{{ texts._experimental }}</RouterLink>
        </div>

        <div class="mt-4">
          <!-- gap between main links and other links -->
        </div>

        <div
          class="flex cursor-pointer text-gray-400 hover:text-gray-700 sm:hidden dark:hover:text-white"
        >
          <a @click="themeStore.toggleDarkMode">{{
            themeStore.isDarkMode ? texts._lightMode : texts._darkMode
          }}</a>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped></style>
