<script lang="ts" setup>
import {RouterView, useRoute} from 'vue-router'
import LightSwitch from "@/components/LightSwitch.vue";
import {useThemeStore} from "@/stores/theme";
import FullScreenOverlay, {FullScreenText} from "@/components/FullScreenOverlay.vue";
import NavBar from "@/components/NavBar.vue";
import {onErrorCaptured, ref, watch} from "vue";
import {NotFoundError} from "@/errors/customErrors";

const themeStore = useThemeStore();

const route = useRoute();

const text = ref<FullScreenText>('读取中');

const resetError = () => {
  text.value = '读取中';
}

watch(() => route.fullPath, () => {
  resetError();
});


onErrorCaptured((err) => {
  if (err instanceof NotFoundError) {
    text.value = '四〇四';
  }
});

</script>

<template>
  <div :class="{dark: themeStore.theme === 'dark'}" class="h-full">
    <div class="wrapper h-full font-serif dark:bg-gray-800 bg-gray-100  text-gray-800 dark:text-gray-50">
      <LightSwitch/>
      <NavBar/>
      <RouterView v-slot="{ Component, route }">

        <template v-if="Component">
          <Transition :name="route.meta.transition || 'fade'" mode="out-in">
            <KeepAlive>
              <Suspense timeout="0">
                <!-- main content -->
                <component :is="Component"></component>

                <!-- loading state -->
                <template #fallback>
                  <FullScreenOverlay :text="text" animated/>
                </template>
              </Suspense>
            </KeepAlive>
          </Transition>
        </template>

      </RouterView>
    </div>

  </div>

</template>
