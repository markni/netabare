<template>
  <div class="container mx-auto p-4">
    <div class="text-center">
      <h1 class="mb-4 text-4xl font-bold">The design system of netabare.</h1>
      <p class="text-lg text-gray-600 dark:text-gray-400">
        A expiremental borderless and card-less design system.
      </p>
    </div>

    <div class="mt-8 flex justify-center">
      <EclipseToggle @toggle="handleToggle" :mode="themeStore.isDarkMode ? 'dark' : 'light'" />
    </div>

    <!-- Typography Section -->
    <section class="mt-16">
      <h2 class="mb-8 text-4xl font-semibold">字型</h2>
      <div class="space-y-4">
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
  </div>
</template>

<script setup>
// Using Vue 3 Composition API as per project rules
// This view is only available in development mode
import { onMounted } from 'vue';
import EclipseToggle from '../components/ui/EclipseToggle.vue';
import { useThemeStore } from '../stores/theme';

const themeStore = useThemeStore();

// Initialize theme on component mount
onMounted(() => {
  themeStore.initTheme();
});

function handleToggle() {
  themeStore.toggleDarkMode();
}
</script>
