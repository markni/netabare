<template>
  <div class="text-center">
    <h1 class="mb-4 text-4xl font-bold">The design system of netabare.</h1>
    <p class="text-lg text-gray-600 dark:text-gray-400">
      A expiremental borderless and card-less design system.
    </p>
  </div>

  <div class="mt-8 flex justify-center">
    <EclipseToggle @toggle="handleToggle" :mode="themeStore.isDarkMode ? 'dark' : 'light'" />
  </div>

  <div class="flex flex-col gap-10">
    <section class="mt-16">
      <h2 class="mb-8 text-4xl font-semibold">字型</h2>
      <div class="flex flex-col gap-4">
        <div class="text-sm">動畫番號 貳拾壹</div>
        <div class="text-lg">動畫番號 貳拾壹</div>
        <div class="text-xl">動畫番號 貳拾壹</div>
        <div class="text-2xl">動畫番號 貳拾壹</div>
        <div class="text-3xl">動畫番號 貳拾壹</div>
        <div class="text-4xl">動畫番號 貳拾壹</div>
        <div class="text-5xl">動畫番號 貳拾壹</div>
        <div class="text-6xl">動畫番號 貳拾壹</div>
      </div>
    </section>

    <section class="mt-16 flex flex-col gap-4">
      <h2 class="mb-8 text-4xl font-semibold">链接</h2>
      <a>测试</a>
      <HintDiv title="鼠标悬停即可看到解释">这个链接是如何工作的</HintDiv>
    </section>

    <section class="mt-16 flex flex-col gap-4">
      <h2 class="mb-8 text-4xl font-semibold">顏色</h2>
      <div class="flex gap-4">
        <div class="h-10 w-60 bg-red"></div>
        <div class="h-10 w-60 bg-pink"></div>

        <div class="h-10 w-60 bg-gold"></div>
        <div class="h-10 w-60 bg-blue"></div>
        <div class="h-10 w-60 bg-teal"></div>
      </div>
    </section>

    <section class="mt-16 flex flex-col gap-4">
      <h2 class="mb-8 text-4xl font-semibold">读取屏幕</h2>
      <div @click="testFullscreenOverlay" class="cursor-pointer text-xl">展开</div>
    </section>
  </div>

  <!-- FullscreenOverlay for testing -->
  <FullscreenOverlay
    v-if="showOverlay"
    text="加载中"
    annotation="loading..."
    code="404"
    color="bg-gold"
  />
</template>

<script setup>
// Using Vue 3 Composition API as per project rules
// This view is only available in development mode
import { onMounted, ref } from 'vue';
import EclipseToggle from '../components/ui/EclipseToggle.vue';
import { useThemeStore } from '../stores/theme';
import HintDiv from '@/components/ui/HintDiv.vue';
import FullscreenOverlay from '@/components/FullscreenOverlay.vue';

const themeStore = useThemeStore();
const showOverlay = ref(false);

// Initialize theme on component mount
onMounted(() => {
  themeStore.initTheme();
});

function handleToggle() {
  themeStore.toggleDarkMode();
}

function testFullscreenOverlay() {
  showOverlay.value = true;
  setTimeout(() => {
    showOverlay.value = false;
  }, 5000);
}
</script>
