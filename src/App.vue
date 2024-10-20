<script setup>
import { RouterView, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/stores/app.js';
import FullscreenOverlay from '@/components/FullscreenOverlay.vue';
import GlobalHeader from '@/components/GlobalHeader.vue';
import texts from '@/constants/texts.js';
import { useThemeStore } from './stores/theme';
import { computed, onMounted, watch } from 'vue';
import ThemeToggle from '@/components/ThemeToggle.vue';
import { DARK_GRAY, IVORY } from './constants/colors';

const route = useRoute();

const store = useAppStore();
const { networkError, longPolling, notFoundUserError, notFoundSubjectError } = storeToRefs(store);
const themeStore = useThemeStore();

onMounted(() => {
  themeStore.initTheme();
});

watch(
  () => themeStore.isDarkMode,
  (newValue) => {
    document.documentElement.style.backgroundColor = newValue ? DARK_GRAY : IVORY;
  },
  { immediate: true }
);

const showThemeToggle = computed(() => {
  return !route.path.startsWith('/uxxxser');
});

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
      color="bg-gold"
      :text="texts._loading"
      annotation="loading"
    />
    <ThemeToggle v-if="showThemeToggle" />

    <GlobalHeader />

    <div
      class="min-h-screen transition-[background-color] duration-300 bg-paper dark:bg-paper-dark flex text-black dark:text-white font-serif"
    >
      <div :class="['w-full p-4 mx-auto pt-10 bottom-0', { container: $route.path !== '/' }]">
        <RouterView />
      </div>
    </div>
    <div class="opacity-0 fixed bottom-0 right-0 pointer-events-none">
      {{ texts._allTextCombined }}
    </div>
  </div>
</template>
