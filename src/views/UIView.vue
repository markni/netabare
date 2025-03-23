<template>
  <div class="container mx-auto p-4">
    <div class="rounded-lgp-6 mb-6">
      <div class="flex items-center">
        <EclipseToggle @toggle="handleToggle" :mode="themeStore.isDarkMode ? 'dark' : 'light'" />
      </div>
    </div>
  </div>
</template>

<script setup>
// Using Vue 3 Composition API as per project rules
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
