<template>
  <div ref="rootRef" class="fall-loader" role="status" aria-live="polite" aria-label="Loading">
    <div class="fall-loader__paper" aria-hidden="true"></div>

    <div class="fall-loader__curtains" aria-hidden="true">
      <span
        v-for="(color, index) in colors"
        :key="`curtain-${color}`"
        class="fall-loader__curtain"
        :style="{
          '--loader-color': color,
          '--curtain-index': index
        }"
      ></span>
    </div>

    <div class="fall-loader__field" aria-hidden="true">
      <span
        v-for="leaf in leaves"
        :key="leaf.id"
        class="fall-loader__leaf"
        :style="{
          '--loader-color': leaf.color,
          '--leaf-x': `${leaf.x}%`,
          '--leaf-y': `${leaf.y}%`,
          '--leaf-size': `${leaf.size}px`,
          '--leaf-tilt': `${leaf.tilt}deg`,
          '--leaf-radius': leaf.radius
        }"
      ></span>
    </div>

    <div class="fall-loader__copy">
      <p class="fall-loader__kicker">NETABARE</p>
      <div class="fall-loader__title" aria-hidden="true">
        <span
          v-for="(mark, index) in loadingMarks"
          :key="`${mark}-${index}`"
          class="fall-loader__mark"
          >{{ mark }}</span
        >
      </div>
      <p class="fall-loader__caption">読み込み中</p>
    </div>

    <div class="fall-loader__signal" aria-hidden="true">
      <span
        v-for="(color, index) in colors"
        :key="`signal-${color}`"
        :style="{ '--loader-color': color, '--signal-index': index }"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { gsap } from 'gsap';
import { COLORS10_VIVID } from '@/constants/colors';

const props = defineProps({
  loading: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['after-exit']);

const rootRef = ref(null);
const colors = COLORS10_VIVID;
const loadingMarks = ['降', 'る', '色', 'を', '待', 'つ'];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

let context = null;
let driftTimeline = null;
let markTimeline = null;
let hasExited = false;

const leaves = computed(() =>
  Array.from({ length: 44 }, (_, index) => {
    const color = colors[index % colors.length];
    const row = Math.floor(index / 11);

    return {
      id: index,
      color,
      x: (index * 23 + row * 11) % 104,
      y: -18 - ((index * 17) % 76),
      size: 12 + ((index * 7) % 34),
      tilt: -36 + ((index * 19) % 82),
      radius: index % 3 === 0 ? '80% 12% 72% 16%' : '12% 80% 18% 72%'
    };
  })
);

const createMotion = () => {
  if (!rootRef.value) return;

  context = gsap.context(() => {
    const curtains = gsap.utils.toArray('.fall-loader__curtain');
    const leaves = gsap.utils.toArray('.fall-loader__leaf');
    const marks = gsap.utils.toArray('.fall-loader__mark');
    const signals = gsap.utils.toArray('.fall-loader__signal span');

    gsap.set(rootRef.value, { autoAlpha: 1 });
    gsap.set(curtains, { scaleY: 1, transformOrigin: '50% 100%' });
    gsap.set(leaves, {
      xPercent: 0,
      yPercent: -120,
      rotate: (index) => leaves[index].style.getPropertyValue('--leaf-tilt'),
      transformOrigin: '50% 50%'
    });

    if (reduceMotion.matches) {
      gsap.set(leaves, { yPercent: 0, opacity: 0.72 });
      return;
    }

    gsap
      .timeline()
      .from('.fall-loader__paper', {
        scaleX: 0,
        transformOrigin: '0% 50%',
        duration: 0.7,
        ease: 'power4.out'
      })
      .from(
        '.fall-loader__copy',
        {
          y: 20,
          opacity: 0,
          duration: 0.55,
          ease: 'power3.out'
        },
        '-=0.32'
      )
      .from(
        signals,
        {
          scaleY: 0,
          transformOrigin: '50% 100%',
          stagger: 0.035,
          duration: 0.52,
          ease: 'back.out(2.2)'
        },
        '-=0.42'
      );

    driftTimeline = gsap.timeline({ repeat: -1 });
    leaves.forEach((leaf, index) => {
      driftTimeline.fromTo(
        leaf,
        {
          x: 0,
          y: '-22vh',
          rotate: -50 + ((index * 29) % 100),
          opacity: 0
        },
        {
          x: `${-46 + ((index * 37) % 92)}vw`,
          y: '132vh',
          rotate: `+=${190 + ((index * 23) % 260)}`,
          opacity: 1,
          duration: 4.8 + (index % 9) * 0.24,
          ease: 'none'
        },
        index * 0.105
      );
    });

    markTimeline = gsap
      .timeline({ repeat: -1, repeatDelay: 0.1 })
      .to(marks, {
        y: -10,
        color: (index) => colors[index % colors.length],
        duration: 0.42,
        ease: 'power2.out',
        stagger: 0.08
      })
      .to(
        marks,
        {
          y: 0,
          color: 'currentColor',
          duration: 0.72,
          ease: 'bounce.out',
          stagger: 0.08
        },
        0.16
      );
  }, rootRef.value);
};

const playExit = () => {
  if (!rootRef.value || hasExited) return;

  hasExited = true;
  driftTimeline?.pause();
  markTimeline?.pause();

  if (reduceMotion.matches) {
    emit('after-exit');
    return;
  }

  context?.add(() => {
    const curtains = gsap.utils.toArray('.fall-loader__curtain');
    const leaves = gsap.utils.toArray('.fall-loader__leaf');
    const marks = gsap.utils.toArray('.fall-loader__mark');

    gsap
      .timeline({
        defaults: { ease: 'power3.inOut' },
        onComplete: () => emit('after-exit')
      })
      .to(marks, {
        y: -18,
        opacity: 0,
        stagger: 0.035,
        duration: 0.28,
        ease: 'power2.in'
      })
      .to(
        leaves,
        {
          y: '+=44vh',
          x: (index) => `${-120 + ((index * 47) % 240)}vw`,
          rotate: '+=360',
          opacity: 0,
          stagger: {
            each: 0.012,
            from: 'random'
          },
          duration: 0.72,
          ease: 'expo.in'
        },
        0
      )
      .to(
        '.fall-loader__paper',
        {
          clipPath: 'inset(0 0 100% 0)',
          duration: 0.8
        },
        0.16
      )
      .to(
        curtains,
        {
          scaleY: 0,
          stagger: {
            each: 0.035,
            from: 'edges'
          },
          duration: 0.85
        },
        0.18
      )
      .to(
        rootRef.value,
        {
          autoAlpha: 0,
          duration: 0.18,
          ease: 'power1.out'
        },
        '-=0.08'
      );
  });
};

onMounted(() => {
  createMotion();

  if (!props.loading) {
    playExit();
  }
});

watch(
  () => props.loading,
  (loading) => {
    if (!loading) {
      playExit();
    }
  }
);

onUnmounted(() => {
  driftTimeline?.kill();
  markTimeline?.kill();
  context?.revert();
});
</script>

<style scoped>
.fall-loader {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  place-items: center;
  overflow: hidden;
  color: var(--color-foreground);
  pointer-events: auto;
}

.fall-loader__paper {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
        90deg,
        color-mix(in srgb, var(--color-foreground) 5%, transparent) 1px,
        transparent 1px
      )
      0 0 / 2.4rem 100%,
    linear-gradient(
        0deg,
        color-mix(in srgb, var(--color-foreground) 6%, transparent) 1px,
        transparent 1px
      )
      0 0 / 100% 2.4rem,
    color-mix(in srgb, var(--color-background) 92%, var(--color-foreground) 8%);
}

.fall-loader__curtains {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(10, minmax(0, 1fr));
  mix-blend-mode: multiply;
  opacity: 0.78;
}

.dark .fall-loader__curtains {
  mix-blend-mode: screen;
  opacity: 0.52;
}

.fall-loader__curtain {
  background: var(--loader-color);
  transform-origin: 50% 100%;
}

.fall-loader__curtain:nth-child(odd) {
  opacity: 0.36;
}

.fall-loader__curtain:nth-child(even) {
  opacity: 0.22;
}

.fall-loader__field {
  position: absolute;
  inset: -10vh -8vw;
  pointer-events: none;
}

.fall-loader__leaf {
  position: absolute;
  left: var(--leaf-x);
  top: var(--leaf-y);
  width: var(--leaf-size);
  height: calc(var(--leaf-size) * 1.42);
  border-radius: var(--leaf-radius);
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.42), transparent 42%), var(--loader-color);
  box-shadow:
    0 18px 32px rgba(0, 0, 0, 0.16),
    inset 0 -1px 0 rgba(0, 0, 0, 0.18);
  opacity: 0;
  will-change: transform, opacity;
}

.fall-loader__leaf::after {
  content: '';
  position: absolute;
  inset: 12% 47% 10%;
  width: 1px;
  background: rgba(255, 255, 255, 0.45);
  transform: rotate(10deg);
}

.fall-loader__copy {
  position: relative;
  z-index: 2;
  display: grid;
  gap: clamp(0.7rem, 2vw, 1.15rem);
  justify-items: center;
  padding: 1rem;
  text-align: center;
}

.fall-loader__kicker,
.fall-loader__caption {
  color: color-mix(in srgb, var(--color-foreground) 64%, transparent);
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.34em;
}

.fall-loader__title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(0.25rem, 1.6vw, 0.7rem);
  font-size: clamp(3.4rem, 13vw, 10rem);
  font-weight: 700;
  line-height: 0.9;
  writing-mode: vertical-rl;
}

.fall-loader__mark {
  display: inline-block;
  text-shadow: 0 1px 22px color-mix(in srgb, var(--color-background) 85%, transparent);
  will-change: transform, opacity, color;
}

.fall-loader__signal {
  position: absolute;
  right: clamp(0.7rem, 2vw, 1.6rem);
  bottom: clamp(0.7rem, 2vw, 1.6rem);
  left: clamp(0.7rem, 2vw, 1.6rem);
  display: grid;
  height: 0.45rem;
  grid-template-columns: repeat(10, minmax(0, 1fr));
  gap: 0.28rem;
}

.fall-loader__signal span {
  background: var(--loader-color);
  transform-origin: 50% 100%;
}

@media (min-width: 760px) {
  .fall-loader__title {
    writing-mode: horizontal-tb;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fall-loader__leaf,
  .fall-loader__mark,
  .fall-loader__signal span,
  .fall-loader__curtain,
  .fall-loader__paper {
    transition: none;
  }
}
</style>
