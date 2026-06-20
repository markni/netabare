<script setup>
import { RouterLink } from 'vue-router';
import texts from '../constants/texts.js';
import EclipseToggle from './ui/EclipseToggle.vue';
import { useThemeStore } from '../stores/theme';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const themeStore = useThemeStore();
const userStore = useUserStore();
const { username } = storeToRefs(userStore);
const userNavTarget = computed(() => (username.value ? `/user/${username.value}` : '/user'));
</script>

<template>
  <header class="min-w-32 bg-background pt-0 pb-8 transition-[background-color] duration-300">
    <div class="mx-auto w-full max-w-5xl px-4">
      <nav class="flex items-stretch">
        <div class="flex w-full flex-row flex-wrap items-stretch justify-start gap-2 sm:gap-4">
          <div
            :class="[
              'mx-1 border-0 text-[0.95rem] leading-[1.2] font-bold text-foreground sm:mx-0',
              { invisible: $route.path === '/', 'pointer-events-none': $route.path === '/' }
            ]"
          >
            <RouterLink
              active-class="!border !border-foreground !border-t-0 !text-muted-foreground"
              :class="[
                'block border border-t-0 border-transparent px-3 py-2 pt-14 pb-3 text-center vertical-rl sm:pt-14 sm:pb-2 sm:horizontal-tb',
                {
                  '!border !border-t-0 !border-foreground !text-muted-foreground':
                    $route.name === 'season'
                }
              ]"
              to="/season"
              >{{ texts._season }}</RouterLink
            >
          </div>
          <div
            :class="[
              'mx-1 border-0 text-[0.95rem] leading-[1.2] font-bold text-foreground sm:mx-0',
              { invisible: $route.path === '/', 'pointer-events-none': $route.path === '/' }
            ]"
          >
            <RouterLink
              active-class="!border !border-foreground !border-t-0 !text-muted-foreground"
              class="block border border-t-0 border-transparent px-3 py-2 pt-14 pb-3 text-center vertical-rl sm:pt-14 sm:pb-2 sm:horizontal-tb"
              to="/trending"
              >{{ texts._trending }}</RouterLink
            >
          </div>
          <div
            :class="[
              'mx-1 border-0 text-[0.95rem] leading-[1.2] font-bold text-foreground sm:mx-0',
              { invisible: $route.path === '/', 'pointer-events-none': $route.path === '/' }
            ]"
          >
            <RouterLink
              active-class="!border !border-foreground !border-t-0 !text-muted-foreground"
              class="block border border-t-0 border-transparent px-3 py-2 pt-14 pb-3 text-center vertical-rl sm:pt-14 sm:pb-2 sm:horizontal-tb"
              to="/history"
              >{{ texts._history }}</RouterLink
            >
          </div>
          <div
            :class="[
              'mx-1 border-0 text-[0.95rem] leading-[1.2] font-bold text-foreground sm:mx-0',
              { invisible: $route.path === '/', 'pointer-events-none': $route.path === '/' }
            ]"
          >
            <RouterLink
              active-class="!border !border-foreground !border-t-0 !text-muted-foreground"
              class="block border border-t-0 border-transparent px-3 py-2 pt-14 pb-3 text-center vertical-rl sm:pt-14 sm:pb-2 sm:horizontal-tb"
              :to="userNavTarget"
              >{{ texts._user }}</RouterLink
            >
          </div>
          <div
            :class="[
              'mx-1 border-0 text-[0.95rem] leading-[1.2] font-bold text-foreground sm:mx-0',
              { invisible: $route.path === '/', 'pointer-events-none': $route.path === '/' }
            ]"
          >
            <RouterLink
              active-class="!border !border-foreground !border-t-0 !text-muted-foreground"
              class="block border border-t-0 border-transparent px-3 py-2 pt-14 pb-3 text-center vertical-rl sm:pt-14 sm:pb-2 sm:horizontal-tb"
              to="/395378/vs/400602"
              >{{ texts._experimental }}</RouterLink
            >
          </div>
          <div class="ml-auto flex items-end pb-2 pl-3">
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
