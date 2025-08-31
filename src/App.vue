<script setup>
import { RouterView } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/stores/app.js';
import FullscreenOverlay from '@/components/FullscreenOverlay.vue';
import GlobalHeader from '@/components/GlobalHeader.vue';
import texts from '@/constants/texts.js';
import { useThemeStore } from './stores/theme';
import { onMounted, watch, ref } from 'vue';
import { DARK_GRAY, IVORY } from './constants/colors';
import useScrollToAnchor from '@/composables/useScrollToAnchor';
import BaseModal from '@/components/ui/BaseModal.vue';
import FoilCard from '@/components/FoilCard.vue';
import bangumiTan from '@/assets/bangumi_tan.png';
import MorseCodeLoading from '@/components/MorseCodeLoading.vue';
import EclipseToggle from './components/ui/EclipseToggle.vue';

const store = useAppStore();
const { networkError, longPolling, notFoundUserError, notFoundSubjectError } = storeToRefs(store);
const themeStore = useThemeStore();
const showWelcomeModal = ref(false);

// Check if current date is March 31st or April 1st
const checkDate = () => {
  const today = new Date();
  const month = today.getMonth() + 1; // getMonth() returns 0-11
  const date = today.getDate();
  return (month === 3 && date === 31) || (month === 4 && date === 1);
};

useScrollToAnchor();

onMounted(() => {
  themeStore.initTheme();
  if (checkDate()) {
    showWelcomeModal.value = true;
  }
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
    <BaseModal v-model="showWelcomeModal">
      <div class="flex gap-8 rounded-lg bg-white p-8">
        <div class="min-h-[400px] flex-1">
          <a
            href="https://bgm.tv/group/topic/8061"
            target="_blank"
            rel="noopener noreferrer"
            class="block h-full"
          >
            <FoilCard>
              <template #default>
                <img
                  :src="bangumiTan"
                  alt="Bangumi Tan"
                  class="card-image h-full w-full object-contain"
                />
              </template>
            </FoilCard>
          </a>
        </div>
        <div class="flex flex-1 items-center justify-center gap-8">
          <div class="writing-mode-vertical text-sm text-gray-700">四月十八日 预售开始</div>

          <div class="writing-mode-vertical text-3xl text-gray-700">爱是粉色。爱是可触摸。</div>
        </div>
      </div>
    </BaseModal>

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
      id="main"
      class="bg-paper dark:bg-zinc flex min-h-screen flex-col font-serif text-black transition-[background-color] duration-300 sm:flex-row dark:text-white"
    >
      <GlobalHeader />
      <div :class="['bottom-0 container mx-auto w-full p-4 pt-10']">
        <RouterView />
      </div>
      <div class="sticky top-10 right-10 hidden self-start sm:flex">
        <EclipseToggle
          @toggle="themeStore.toggleDarkMode"
          :mode="themeStore.isDarkMode ? 'dark' : 'light'"
        />
      </div>
    </div>

    <MorseCodeLoading />

    <div class="pointer-events-none fixed right-0 bottom-0 opacity-0">
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

.writing-mode-vertical {
  writing-mode: vertical-rl;
  text-orientation: upright;
  letter-spacing: 0.5em;
}
</style>
