<template>
  <div class="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-8">
    <section class="flex flex-col gap-2">
      <h1 class="text-3xl font-semibold">Theme Toggle Debug</h1>
      <p class="text-light-gray dark:text-gray-400">
        Compare legacy <code>ThemeToggle</code> and new <code>EclipseToggle</code> against the same
        theme state.
      </p>
    </section>

    <section class="rounded-xl border border-black/10 p-5 dark:border-white/15">
      <h2 class="mb-4 text-xl font-medium">Store State</h2>
      <div class="flex flex-wrap items-center gap-4">
        <div class="rounded-md bg-black/5 px-3 py-2 dark:bg-white/10">
          isDarkMode: <strong>{{ themeStore.isDarkMode }}</strong>
        </div>
        <div class="rounded-md bg-black/5 px-3 py-2 dark:bg-white/10">
          localStorage.theme: <strong>{{ persistedTheme }}</strong>
        </div>
        <button
          class="cursor-pointer rounded-md border border-black/20 px-3 py-2 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
          @click="themeStore.toggleDarkMode"
        >
          Toggle via store action
        </button>
      </div>
    </section>

    <section class="rounded-xl border border-black/10 p-5 dark:border-white/15">
      <h2 class="mb-4 text-xl font-medium">Legacy ThemeToggle.vue</h2>
      <div class="my-[40rem] px-8 sm:px-16">
        <div class="grid gap-x-24 gap-y-[40rem] sm:grid-cols-3">
          <div class="flex flex-col items-center gap-2">
            <span class="min-h-10 text-center text-sm text-light-gray dark:text-gray-400">
              Locked dark<br />
              (closed)
            </span>
            <ThemeToggle v-bind="normalizedLegacyShadow" mode="dark" :interactive="false" />
          </div>
          <div class="flex flex-col items-center gap-2">
            <span class="min-h-10 text-center text-sm text-light-gray dark:text-gray-400">
              Locked light<br />
              (open)
            </span>
            <ThemeToggle v-bind="normalizedLegacyShadow" mode="light" :interactive="false" />
          </div>
          <div class="flex flex-col items-center gap-2">
            <span class="min-h-10 text-center text-sm text-light-gray dark:text-gray-400">
              Interactive<br />
              (normal)
            </span>
            <ThemeToggle v-bind="normalizedLegacyShadow" />
          </div>
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <label class="flex flex-col gap-1 text-sm">
          <span>layers: {{ normalizedLegacyShadow.layers }}</span>
          <input v-model.number="legacyShadow.layers" type="range" min="0" max="50" step="1" />
        </label>

        <label class="flex flex-col gap-1 text-sm">
          <span>brightLayers: {{ normalizedLegacyShadow.brightLayers }}</span>
          <input
            v-model.number="legacyShadow.brightLayers"
            type="range"
            min="0"
            max="50"
            step="1"
          />
        </label>

        <label class="flex flex-col gap-1 text-sm">
          <span>layerSpacing: {{ legacyShadow.layerSpacing.toFixed(1) }}</span>
          <input
            v-model.number="legacyShadow.layerSpacing"
            type="range"
            min="0"
            max="50"
            step="0.1"
          />
        </label>

        <label class="flex flex-col gap-1 text-sm">
          <span>brightLayerSpacing: {{ legacyShadow.brightLayerSpacing.toFixed(1) }}</span>
          <input
            v-model.number="legacyShadow.brightLayerSpacing"
            type="range"
            min="0"
            max="5"
            step="0.1"
          />
        </label>

        <label class="flex flex-col gap-1 text-sm">
          <span>opacity: {{ legacyShadow.opacity.toFixed(2) }}</span>
          <input v-model.number="legacyShadow.opacity" type="range" min="0" max="1" step="0.01" />
        </label>

        <label class="flex flex-col gap-1 text-sm">
          <span>brightOpacity: {{ legacyShadow.brightOpacity.toFixed(2) }}</span>
          <input
            v-model.number="legacyShadow.brightOpacity"
            type="range"
            min="0"
            max="2"
            step="0.01"
          />
        </label>

        <label class="flex flex-col gap-1 text-sm">
          <span>shadowFade: {{ legacyShadow.shadowFade.toFixed(1) }}</span>
          <input v-model.number="legacyShadow.shadowFade" type="range" min="0" max="8" step="0.1" />
          <span class="text-xs text-light-gray dark:text-gray-400">
            Higher = fades out faster from center
          </span>
        </label>

        <label class="flex flex-col gap-1 text-sm">
          <span>blur: {{ legacyShadow.blur.toFixed(2) }}</span>
          <input v-model.number="legacyShadow.blur" type="range" min="0" max="10" step="0.01" />
          <span class="text-xs text-light-gray dark:text-gray-400">
            Constant blur amount applied to every layer
          </span>
        </label>

        <label class="flex flex-col gap-1 text-sm">
          <span>blurGrowth: {{ legacyShadow.blurGrowth.toFixed(2) }}</span>
          <input
            v-model.number="legacyShadow.blurGrowth"
            type="range"
            min="0"
            max="5"
            step="0.01"
          />
          <span class="text-xs text-light-gray dark:text-gray-400">
            Extra blur added per layer offset distance
          </span>
        </label>

        <label class="flex flex-col gap-1 text-sm">
          <span>closedOffset: {{ legacyShadow.travelDistance.toFixed(1) }}px</span>
          <input
            v-model.number="legacyShadow.travelDistance"
            type="range"
            min="0"
            max="48"
            step="0.1"
          />
        </label>

        <label class="flex flex-col gap-1 text-sm">
          <span>
            lightShadowHue:
            {{
              legacyShadow.lightShadowHue < 0
                ? 'default (white)'
                : `${legacyShadow.lightShadowHue}deg`
            }}
          </span>
          <input
            v-model.number="legacyShadow.lightShadowHue"
            type="range"
            min="-1"
            max="360"
            step="1"
          />
        </label>
      </div>

      <div class="mt-4">
        <button
          class="cursor-pointer rounded-md border border-black/20 px-3 py-2 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
          @click="resetLegacyShadow"
        >
          Reset legacy shadow defaults
        </button>
      </div>
    </section>

    <section class="rounded-xl border border-black/10 p-5 dark:border-white/15">
      <h2 class="mb-4 text-xl font-medium">EclipseToggle.vue</h2>
      <div class="flex items-center gap-4">
        <EclipseToggle
          @toggle="themeStore.toggleDarkMode"
          :mode="themeStore.isDarkMode ? 'dark' : 'light'"
        />
        <span class="text-sm text-light-gray dark:text-gray-400">
          mode: {{ themeStore.isDarkMode ? 'dark' : 'light' }}
        </span>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue';
import ThemeToggle from '@/components/ThemeToggle.vue';
import EclipseToggle from '@/components/ui/EclipseToggle.vue';
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore();
const legacyShadowDefaults = {
  layers: 25,
  layerSpacing: 8.3,
  brightLayerSpacing: 1.2,
  opacity: 0.2,
  brightLayers: 1,
  brightOpacity: 1,
  shadowFade: 4,
  blur: 0,
  blurGrowth: 1.16,
  travelDistance: 1,
  lightShadowHue: -1,
  color: '255, 255, 255'
};
const legacyShadow = reactive({ ...legacyShadowDefaults });

onMounted(() => {
  themeStore.initTheme();
});

const persistedTheme = computed(() => localStorage.getItem('theme') ?? '(unset)');
const normalizedLegacyShadow = computed(() => {
  const layers = Math.max(0, Math.round(legacyShadow.layers));
  const brightLayers = Math.min(Math.max(0, Math.round(legacyShadow.brightLayers)), layers);

  return {
    ...legacyShadow,
    layers,
    brightLayers
  };
});

function resetLegacyShadow() {
  Object.assign(legacyShadow, legacyShadowDefaults);
}
</script>
