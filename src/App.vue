<script setup>
import { RouterView } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/stores/app.js';
import FullscreenOverlay from '@/components/FullscreenOverlay.vue';
import GlobalHeader from '@/components/GlobalHeader.vue';
import texts from '@/constants/texts.js';
import { useThemeStore } from './stores/theme';
import { onMounted, watch } from 'vue';
import ThemeToggle from '@/components/ThemeToggle.vue';
import { DARK_GRAY, IVORY } from './constants/colors';

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
      color="bg-gold"
      :text="texts._loading"
      annotation="loading"
    />

    <div
      class="flex min-h-screen flex-col bg-paper font-serif text-black transition-[background-color] duration-300 dark:bg-paper-dark dark:text-white sm:flex-row"
    >
      <GlobalHeader />
      <div :class="['container bottom-0 mx-auto w-full p-4 pt-10']">
        <RouterView />
      </div>
      <div class="sticky top-0 self-start">
        <ThemeToggle />
      </div>
    </div>
    <div class="pointer-events-none fixed bottom-0 right-0 opacity-0">
      {{ texts._allTextCombined }}
    </div>
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
