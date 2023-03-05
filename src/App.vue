<script lang="ts" setup>
import {RouterView} from 'vue-router'
import LightSwitch from "@/components/LightSwitch.vue";
import {useThemeStore} from "@/stores/theme";

const themeStore = useThemeStore();

</script>

<template>
  <div :class="{dark: themeStore.isDark}" class="h-full">
    <div class="wrapper h-full dark:bg-gray-800 bg-gray-100  text-gray-800 dark:text-gray-50">
      <LightSwitch/>

      <RouterView v-slot="{ Component, route }">

        <template v-if="Component">
          <Transition :name="route.meta.transition || 'fade'" mode="out-in">
            <KeepAlive>
              <Suspense>
                <!-- main content -->
                <component :is="Component"></component>

                <!-- loading state -->
                <template #fallback>
                  Loading...
                </template>
              </Suspense>
            </KeepAlive>
          </Transition>
        </template>

      </RouterView>
    </div>

  </div>

</template>

