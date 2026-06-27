<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/stores/app.js';
import FullscreenOverlay from '@/components/FullscreenOverlay.vue';
import FallPageLoading from '@/components/FallPageLoading.vue';
import GlobalHeader from '@/components/GlobalHeader.vue';
import texts from '@/constants/texts.js';
import { useThemeStore } from './stores/theme';
import { computed, onMounted, ref, watch } from 'vue';
import { DARK_GRAY, IVORY } from './constants/colors';
import useScrollToAnchor from '@/composables/useScrollToAnchor';

const store = useAppStore();
const { networkError, longPolling, notFoundUserError, notFoundSubjectError } = storeToRefs(store);
const themeStore = useThemeStore();
const route = useRoute();
const isUiRoute = computed(() => route.path === '/ui');
const showFallLoader = ref(!isUiRoute.value);
const isFallLoaderLoading = ref(!isUiRoute.value);
const isAppContentVisible = ref(isUiRoute.value);

useScrollToAnchor();

const waitForAdobeFonts = () => {
  const root = document.documentElement;

  if (root.classList.contains('wf-active') || root.classList.contains('wf-inactive')) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      if (root.classList.contains('wf-active') || root.classList.contains('wf-inactive')) {
        observer.disconnect();
        resolve();
      }
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ['class']
    });
  });
};

onMounted(() => {
  themeStore.initTheme();

  if (isUiRoute.value) return;

  waitForAdobeFonts().finally(() => {
    isAppContentVisible.value = true;
    isFallLoaderLoading.value = false;
  });
});

const handleFallLoaderExit = () => {
  showFallLoader.value = false;
};

watch(
  () => themeStore.isDarkMode,
  (newValue) => {
    document.documentElement.style.backgroundColor = newValue ? DARK_GRAY : IVORY;
    // Add this line to update the scrollbar color
    document.documentElement.style.setProperty(
      '--scrollbar-color',
      newValue ? 'rgba(0,0,0,0.3)' : ''
    );

    // Update title if running on localhost
    if (window.location.hostname === 'localhost') {
      document.title = '[DEV] Netabare';
    }
  },
  { immediate: true }
);

console.log(`
  _   _ ______ _______       ____          _____  ______
 | \\ | |  ____|__   __|/\\   |  _ \\   /\\   |  __ \\|  ____|
 |  \\| | |__     | |  /  \\  | |_) | /  \\  | |__) | |__
 | . \` |  __|    | | / /\\ \\ |  _ < / /\\ \\ |  _  /|  __|
 | |\\  | |____   | |/ ____ \\| |_) / ____ \\| | \\ \\| |____
 |_| \\_|______|  |_/_/    \\_\\____/_/    \\_\\_|  \\_\\______|

 Star the repo or submit a pull request here:  https://github.com/markni/netabare
 欢迎提交问题和建议:  https://github.com/markni/netabare/issues

`);
</script>

<template>
  <div :class="{ dark: themeStore.isDarkMode }">
    <FullscreenOverlay
      v-if="networkError"
      :text="texts._lostConnection"
      code="504"
      annotation="lost connection"
    />
    <FullscreenOverlay
      v-if="notFoundUserError"
      :text="texts._notFoundUser"
      code="404"
      color="bg-blue"
      annotation="not found"
    />
    <FullscreenOverlay
      v-if="notFoundSubjectError"
      :text="texts._notFoundSubject"
      code="404"
      color="bg-blue"
      annotation="not found"
    />
    <FullscreenOverlay
      v-if="longPolling"
      color="bg-green"
      :text="texts._loading"
      annotation="loading"
    />
    <div
      v-if="isAppContentVisible || isUiRoute"
      id="main"
      class="flex min-h-screen flex-col bg-background font-serif text-black transition-[background-color] duration-300 dark:text-white"
    >
      <GlobalHeader />
      <div
        :class="[
          'bottom-0 mx-auto w-full max-w-5xl',
          route.path === '/art'
            ? 'px-0 pt-6 pb-0'
            : route.path === '/'
              ? 'px-4 pt-6 pb-0'
              : 'p-4 pt-6'
        ]"
      >
        <RouterView />
      </div>
      <footer
        v-if="route.path !== '/' && route.path !== '/art'"
        class="mt-auto bg-black text-white dark:bg-neutral-800 dark:text-white"
      >
        <div class="mx-auto w-full max-w-5xl px-4 py-24 sm:py-32">
          <div
            class="flex flex-col items-start gap-4 text-sm sm:flex-row sm:flex-wrap sm:items-center"
          >
            <RouterLink to="/" active-class="!text-white" exact-active-class="!text-white">{{
              texts._backToHome
            }}</RouterLink>
            <a href="https://bgm.tv/group/topic/346147" target="_blank" rel="noopener noreferrer">{{
              texts._feedback
            }}</a>
            <a href="https://bgm.tv/group/topic/346147" target="_blank" rel="noopener noreferrer">{{
              texts._changeLog
            }}</a>
            <RouterLink to="/quiz" active-class="!text-white" exact-active-class="!text-white">{{
              texts._scoreChartRecognition
            }}</RouterLink>
            <RouterLink
              to="/unbanned"
              active-class="!text-white"
              exact-active-class="!text-white"
              >{{ texts._recentlyUnbanned }}</RouterLink
            >
            <RouterLink to="/ui" active-class="!text-white" exact-active-class="!text-white"
              >设计系统</RouterLink
            >
            <RouterLink to="/tabemono" active-class="!text-white" exact-active-class="!text-white"
              >动画 x 食物</RouterLink
            >
          </div>
        </div>
      </footer>
    </div>

    <div class="pointer-events-none fixed right-0 bottom-0 opacity-0">
      {{ texts._allTextCombined }}
    </div>

    <FallPageLoading
      v-if="showFallLoader && !isUiRoute"
      :loading="isFallLoaderLoading"
      @after-exit="handleFallLoaderExit"
    />
  </div>
</template>

<style>
/* Add this style block at the end of the file */
:root {
  --scrollbar-color: initial;
}

* {
  scrollbar-color: var(--scrollbar-color) transparent;
}

*::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-color);
}
</style>
