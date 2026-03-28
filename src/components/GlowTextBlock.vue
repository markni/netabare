<template>
  <component :is="tag" v-bind="$attrs" :style="{ '--glow-rgb': glowRgb }">
    <template v-for="token in tokens" :key="token.id">
      <span v-if="token.isWord" :ref="(element) => setWordRef(element, token.id)" class="glow-word">
        {{ token.value }}
      </span>
      <span v-else>{{ token.value }}</span>
    </template>
  </component>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, useSlots, watch } from 'vue';

const glowUpdaters = new Set();
let globalAnimationFrame = null;
let listenersBound = false;

const runGlobalGlowUpdate = () => {
  globalAnimationFrame = null;
  glowUpdaters.forEach((update) => update());
};

const scheduleGlobalGlowUpdate = () => {
  if (globalAnimationFrame !== null) {
    return;
  }

  globalAnimationFrame = window.requestAnimationFrame(runGlobalGlowUpdate);
};

const handleViewportChange = () => {
  scheduleGlobalGlowUpdate();
};

const attachGlobalListeners = () => {
  if (listenersBound) {
    return;
  }

  listenersBound = true;
  window.addEventListener('scroll', handleViewportChange, { passive: true });
  window.addEventListener('resize', handleViewportChange, { passive: true });
};

const detachGlobalListeners = () => {
  if (!listenersBound) {
    return;
  }

  listenersBound = false;
  window.removeEventListener('scroll', handleViewportChange);
  window.removeEventListener('resize', handleViewportChange);
};

defineOptions({
  inheritAttrs: false
});

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  tag: {
    type: String,
    default: 'p'
  },
  glowRgb: {
    type: String,
    default: '255,190,90'
  },
  enabled: {
    type: Boolean,
    default: true
  }
});

const slots = useSlots();
const wordElements = new Map();
let isRegistered = false;

const extractText = (nodes) => {
  let output = '';

  for (const node of nodes || []) {
    if (typeof node.children === 'string') {
      output += node.children;
      continue;
    }

    if (Array.isArray(node.children)) {
      output += extractText(node.children);
    }
  }

  return output;
};

const sourceText = computed(() => {
  if (props.text.trim().length > 0) {
    return props.text;
  }

  return extractText(slots.default?.() || []);
});

const tokens = computed(() => {
  const segments = sourceText.value.split(/(\s+)/);
  let wordId = 0;

  return segments
    .filter((segment) => segment.length > 0)
    .map((segment, index) => {
      const isWord = /\S/.test(segment);

      if (!isWord) {
        return {
          id: `space-${index}`,
          value: segment,
          isWord
        };
      }

      const id = `word-${wordId}`;
      wordId += 1;

      return {
        id,
        value: segment,
        isWord
      };
    });
});

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const setWordRef = (element, tokenId) => {
  if (element) {
    wordElements.set(tokenId, element);
  } else {
    wordElements.delete(tokenId);
  }
};

const updateWordGlow = () => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const centerX = viewportWidth / 2;

  wordElements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    const wordX = rect.left + rect.width / 2;
    const wordY = rect.top + rect.height / 2;

    // 0 at center, 1 at right edge.
    const horizontal = clamp((wordX - centerX) / centerX, 0, 1);
    // 0 at top, 1 at 30%, 0 at 60%, then stays 0.
    const peakY = viewportHeight * 0.3;
    const endY = viewportHeight * 0.6;
    let vertical = 0;

    if (wordY <= peakY) {
      vertical = clamp(wordY / peakY, 0, 1);
    } else if (wordY <= endY) {
      vertical = clamp((endY - wordY) / (endY - peakY), 0, 1);
    }

    const intensity = clamp(Math.pow(horizontal * vertical, 0.58) * 2.3, 0, 1);

    element.style.setProperty('--glow-intensity', intensity.toFixed(3));
  });
};

const requestGlowUpdate = () => {
  if (!props.enabled) {
    return;
  }

  scheduleGlobalGlowUpdate();
};

const registerGlowUpdater = () => {
  if (isRegistered || !props.enabled) {
    return;
  }

  glowUpdaters.add(updateWordGlow);
  attachGlobalListeners();
  isRegistered = true;
};

const unregisterGlowUpdater = () => {
  if (!isRegistered) {
    return;
  }

  glowUpdaters.delete(updateWordGlow);
  isRegistered = false;

  if (glowUpdaters.size === 0) {
    detachGlobalListeners();
    if (globalAnimationFrame !== null) {
      window.cancelAnimationFrame(globalAnimationFrame);
      globalAnimationFrame = null;
    }
  }
};

onMounted(() => {
  registerGlowUpdater();
  nextTick(requestGlowUpdate);
});

watch(
  tokens,
  async () => {
    if (!props.enabled) {
      return;
    }

    await nextTick();
    requestGlowUpdate();
  },
  { immediate: true }
);

watch(
  () => props.enabled,
  async (enabled) => {
    if (enabled) {
      registerGlowUpdater();
      await nextTick();
      requestGlowUpdate();
      return;
    }

    unregisterGlowUpdater();
    wordElements.forEach((element) => {
      element.style.setProperty('--glow-intensity', '0');
    });
  }
);

onBeforeUnmount(() => {
  unregisterGlowUpdater();
  wordElements.clear();
});
</script>

<style scoped>
.glow-word {
  --glow-intensity: 0;
  transition: text-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1);
  text-shadow:
    calc(0.8px + var(--glow-intensity) * 7px) calc(-0.8px - var(--glow-intensity) * 7px)
      calc(4px + var(--glow-intensity) * 34px)
      rgba(var(--glow-rgb), calc(var(--glow-intensity) * 1)),
    calc(0.3px + var(--glow-intensity) * 4px) calc(-0.3px - var(--glow-intensity) * 4px)
      calc(2px + var(--glow-intensity) * 16px)
      rgba(var(--glow-rgb), calc(var(--glow-intensity) * 0.95)),
    calc(0.1px + var(--glow-intensity) * 1.5px) calc(-0.1px - var(--glow-intensity) * 1.5px)
      calc(1px + var(--glow-intensity) * 6px)
      rgba(var(--glow-rgb), calc(var(--glow-intensity) * 0.9));
}
</style>
