<template>
  <div class="text-center">
    <h1 class="mb-4 text-4xl font-bold">The design system of netabare.</h1>
    <p class="text-lg text-gray-600 dark:text-gray-400">
      A expiremental borderless and card-less design system.
    </p>
  </div>

  <section class="mt-10 flex flex-col items-center gap-6 text-center">
    <h2 class="mb-2 text-4xl font-semibold">Glow Text</h2>
    <GlowTextBlock
      class="w-full max-w-5xl text-sm leading-relaxed"
      glow-rgb="255,140,70"
      text="Small sample row. Scroll and resize to test how each word glows near the top-right."
    />
    <GlowTextBlock
      class="w-full max-w-5xl text-lg leading-relaxed"
      glow-rgb="255,190,80"
      text="Medium sample row. Glow intensity should drop as words approach the center."
    />
    <GlowTextBlock
      class="w-full max-w-5xl text-2xl leading-relaxed"
      glow-rgb="100,210,255"
      text="Larger sample row for clearer per-word glow behavior across the viewport."
    />
    <GlowTextBlock
      class="w-full max-w-5xl text-4xl leading-relaxed"
      glow-rgb="255,120,210"
      text="Extra large row so you can inspect contrast and edge behavior quickly."
    />
  </section>

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
        <div class="text-6xl font-bold">動畫番號 貳拾壹</div>
      </div>
    </section>

    <section class="mt-16 flex flex-col gap-4">
      <h2 class="mb-8 text-4xl font-semibold">链接</h2>
      <a>测试</a>
      <HintDiv title="鼠标悬停即可看到解释">这个链接是如何工作的</HintDiv>
    </section>

    <section class="mt-16 flex flex-col gap-4">
      <h2 class="mb-8 text-4xl font-semibold">顏色</h2>
      <div class="aspect-square w-full max-w-2xl">
        <ColorFan />
      </div>

      <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div
          v-for="suggestion in vivid10Suggestions"
          :key="suggestion.name"
          class="flex flex-col gap-3"
        >
          <div class="aspect-square w-full">
            <ColorFan :colors="suggestion.colors" />
          </div>
          <div class="flex items-center justify-between gap-3 text-left text-sm">
            <div>
              <div class="font-semibold">{{ suggestion.name }}</div>
              <div class="text-muted-foreground">{{ suggestion.note }}</div>
            </div>
            <div
              class="h-8 w-8 shrink-0 rounded-full border border-neutral-500/50"
              :style="{ backgroundColor: suggestion.replacement }"
              :aria-label="suggestion.replacement"
            ></div>
          </div>
        </div>
      </div>

      <div class="flex gap-4">
        <div class="h-10 w-60 bg-red"></div>
        <div class="h-10 w-60 bg-pink"></div>
        <div class="h-10 w-60 bg-gold"></div>
        <div class="h-10 w-60 bg-blue"></div>
        <div class="h-10 w-60 bg-teal"></div>
        <div class="h-10 w-60 bg-ivory"></div>
        <div class="h-10 w-60 bg-white"></div>
      </div>

      <div class="flex gap-4">
        <div class="h-10 w-60" :style="{ backgroundColor: RED }"></div>
        <div class="h-10 w-60" :style="{ backgroundColor: PINK }"></div>
        <div class="h-10 w-60" :style="{ backgroundColor: GOLD }"></div>
        <div class="h-10 w-60" :style="{ backgroundColor: BLUE }"></div>
        <div class="h-10 w-60" :style="{ backgroundColor: TEAL }"></div>
        <div class="h-10 w-60" :style="{ backgroundColor: IVORY }"></div>
        <div class="h-10 w-60" :style="{ backgroundColor: WHITE }"></div>
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
import GlowTextBlock from '@/components/GlowTextBlock.vue';
import ColorFan from '@/components/ui/ColorFan.vue';
import { RED, PINK, GOLD, BLUE, TEAL, IVORY, WHITE, COLORS10_VIVID } from '@/constants/colors';

const themeStore = useThemeStore();
const showOverlay = ref(false);
const vivid10ReplacementIndex = 9;
const orangeReplacementIndex = 3;
const formerVivid10Raspberry = '#c2185b';
const vivid10Suggestions = [
  {
    name: 'Current',
    note: 'Cyan vivid10',
    replacement: COLORS10_VIVID[vivid10ReplacementIndex],
    colors: COLORS10_VIVID
  },
  {
    name: 'Former',
    note: 'Previous raspberry edge',
    replacement: formerVivid10Raspberry,
    colors: withVivid10Replacement(formerVivid10Raspberry)
  },
  {
    name: 'Emerald Swap',
    note: 'Less red, more balance',
    replacement: '#00a86b',
    colors: withVivid10Replacement('#00a86b')
  },
  {
    name: 'Violet Swap',
    note: 'Keeps intensity without heat',
    replacement: '#5b5bd6',
    colors: withVivid10Replacement('#5b5bd6')
  },
  {
    name: 'Orange Swap',
    note: 'Replaces muted olive',
    replacement: '#ff7a1a',
    colors: withVivid10Replacement('#ff7a1a', orangeReplacementIndex)
  }
];

// Initialize theme on component mount
onMounted(() => {
  themeStore.initTheme();
});

function withVivid10Replacement(replacement, replacementIndex = vivid10ReplacementIndex) {
  return COLORS10_VIVID.map((color, index) => (index === replacementIndex ? replacement : color));
}

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
