<script lang="ts" setup>
import {RouterView} from 'vue-router'
import LightSwitch from "@/components/LightSwitch.vue";
import {useThemeStore} from "@/stores/theme";

const themeStore = useThemeStore();

</script>

<template>
  <div :class="{dark: themeStore.isDark}" class="h-full">
    <div class="h-full dark:bg-gray-800 bg-gray-100  text-gray-800 dark:text-gray-50">
      <LightSwitch/>

      <RouterView/>
    </div>

  </div>

</template>

<style scoped></style>
