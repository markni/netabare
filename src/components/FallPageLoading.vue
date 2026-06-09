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

    <svg
      class="fall-loader__glyphs"
      viewBox="0 0 140 520"
      role="img"
      aria-label="载入秋色"
      preserveAspectRatio="xMidYMid meet"
    >
      <g
        v-for="(glyph, index) in glyphs"
        :key="glyph.id"
        :transform="`translate(${-index * 128} ${index * 118})`"
      >
        <g class="fall-loader__glyph">
          <path :d="glyph.d" />
        </g>
      </g>
    </svg>
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
const glyphs = [
  {
    id: 'glyph-0',
    d: 'M108.56 18.680000000000007C113.24 22.28 119.11999999999999 28.760000000000005 121.39999999999999 34.16C134.0 39.8 140.24 16.64 109.52 17.840000000000003ZM87.56 94.88C80.24 95.6 72.8 96.2 65.84 96.8V86.24000000000001H85.03999999999999C86.72 86.24000000000001 87.8 85.64 88.16 84.32C83.84 80.24000000000001 76.75999999999999 74.72 76.75999999999999 74.72L70.52 82.75999999999999H65.84V74.48C68.84 74.0 69.8 72.80000000000001 70.16 71.12L55.28 69.56V82.75999999999999H44.239999999999995C46.519999999999996 78.44 49.4 73.03999999999999 51.92 67.76H83.6C85.16 67.76 86.36 67.16 86.6 65.84C82.28 61.88 74.96000000000001 56.480000000000004 74.96000000000001 56.480000000000004L68.72 64.28H53.72C54.92 61.760000000000005 56.0 59.480000000000004 56.839999999999996 57.440000000000005C59.96 57.800000000000004 61.4 56.72 62.0 55.28L46.4 50.36C45.2 53.72 42.92 58.88 40.4 64.28H26.0L26.96 67.76H38.72C36.56 72.32 34.28 76.75999999999999 32.24 80.36C30.32 81.08 28.52 82.03999999999999 27.32 83.0L38.480000000000004 91.16L43.28 86.24000000000001H53.48V97.88C41.12 98.84 31.04 99.44 25.28 99.68L31.16 115.04C32.6 114.8 33.92 113.84 34.64 112.4C41.480000000000004 110.6 47.72 108.8 53.48 107.24V126.2H55.76C62.0 126.2 65.84 123.8 65.84 123.08V103.64C74.72 100.88 81.91999999999999 98.6 87.67999999999999 96.56ZM135.68 93.44 134.36 93.32C132.44 98.36 129.56 104.84 127.75999999999999 108.08C126.67999999999999 110.12 125.83999999999999 110.24 124.03999999999999 108.68C119.47999999999999 105.56 116.0 101.48 113.0 96.56C121.28 86.36 127.03999999999999 75.08 131.24 63.92C134.36 64.16 135.56 63.440000000000005 136.16 62.0L118.28 54.32C116.24 64.4 112.75999999999999 74.84 107.72 84.68C104.47999999999999 74.84 102.92 63.080000000000005 102.2 50.24000000000001H133.76C135.44 50.24000000000001 136.76 49.64 137.12 48.32000000000001C132.2 43.64 123.92 36.92 123.92 36.92L116.72 46.760000000000005H102.08C101.72 38.36 101.84 29.480000000000004 101.96 20.480000000000004C104.96 20.120000000000005 105.92 18.680000000000007 106.28 17.24000000000001L88.88 15.079999999999998C88.88 26.120000000000005 89.0 36.68000000000001 89.6 46.760000000000005H62.239999999999995V33.8H82.16C83.72 33.8 84.92 33.2 85.28 31.88000000000001C81.44 27.680000000000007 74.6 21.92 74.6 21.92L68.72 30.320000000000007H62.239999999999995V20.0C65.47999999999999 19.400000000000006 66.44 18.200000000000003 66.68 16.52000000000001L49.4 15.079999999999998V30.320000000000007H29.48L30.439999999999998 33.8H49.4V46.760000000000005H24.2L25.16 50.24000000000001H89.84C91.03999999999999 68.72 93.8 84.8 99.67999999999999 98.0C92.6 107.84 83.84 116.84 72.68 123.56L73.64 125.0C86.0 120.2 95.96 113.84 104.0 106.28C107.72 112.04 112.16 117.08 117.56 121.04C123.32 125.24 131.95999999999998 129.32 136.39999999999998 123.92C137.95999999999998 122.0 137.36 119.0 133.39999999999998 113.12Z'
  },
  {
    id: 'glyph-1',
    d: 'M152.2 126.56C181.12 112.52 202.12 89.36 212.56 66.2C219.51999999999998 91.03999999999999 230.56 113.12 248.56 126.68C250.72 119.12 256.6 112.52 266.08 111.32L266.56 109.64C236.68 95.6 219.64 66.2 212.07999999999998 32.60000000000001C210.28 26.24000000000001 199.6 18.680000000000007 189.76 13.400000000000006C187.96 16.040000000000006 183.88 23.960000000000008 182.44 26.72C190.96 28.400000000000006 202.6 30.439999999999998 205.24 33.44C197.44 71.24000000000001 176.92 105.8 150.88 125.0Z'
  },
  {
    id: 'glyph-2',
    d: 'M336.24 40.400000000000006C336.24 47.84 331.44 55.400000000000006 327.72 58.52C324.12 60.92 322.08 64.64 323.76 68.72C325.92 73.03999999999999 332.52 73.4 335.76 69.92C340.44 65.36 342.84000000000003 54.68 337.92 40.519999999999996ZM312.12 54.080000000000005H328.8C330.36 54.080000000000005 331.56 53.480000000000004 331.92 52.160000000000004C327.96 47.96000000000001 320.88 41.84 320.88 41.84L314.88 50.72H312.12V30.560000000000002C316.56 29.60000000000001 320.52 28.52000000000001 323.88 27.439999999999998C327.72 28.760000000000005 330.36 28.400000000000006 331.8 27.200000000000003L316.08 13.88000000000001C308.4 20.24000000000001 292.56 29.0 279.72 33.8L280.08 35.24000000000001C285.96 34.88000000000001 292.2 34.040000000000006 298.32 33.2V50.72H280.32L281.28 54.080000000000005H297.12C293.76 70.76 287.52 88.76 278.4 101.6L279.84 102.92C286.92 97.16 293.16 90.44 298.32 82.88V126.56H300.84C307.56 126.56 312.0 123.44 312.12 122.6V67.64C314.88 72.92 317.28 79.64 317.4 85.4C327.48 94.76 339.36 74.36 312.12 63.800000000000004ZM377.52 39.2C373.92 48.68000000000001 369.24 58.760000000000005 365.28 65.96000000000001C362.88 54.2 361.68 40.040000000000006 361.08 23.0V20.24000000000001C363.96 19.760000000000005 365.28 18.680000000000007 365.52 16.760000000000005L347.52 15.079999999999998C347.52 66.92 350.76 100.52 314.4 124.76L315.6 126.68C349.44 111.8 357.84000000000003 90.32 360.12 60.68C362.15999999999997 93.08 367.32 115.16 381.0 126.68C382.44 118.4 387.0 112.28 393.84 110.6L393.96 109.28C378.84 101.0 370.56 88.64 366.0 69.32C373.92 64.4 381.84 57.2 388.68 49.879999999999995C391.32 50.36 393.0 49.64 393.72 48.2Z'
  },
  {
    id: 'glyph-3',
    d: 'M469.15999999999997 31.760000000000005C467.24 36.92 464.24 44.0 461.24 48.8H438.2L432.92 46.760000000000005C437.72 42.08 442.15999999999997 36.92 446.0 31.760000000000005ZM491.84000000000003 52.28V78.32H470.6V52.28ZM436.64 52.28H457.04V78.32H436.64ZM512.0 90.92H510.68C508.52 97.4 505.28 104.84 503.12 107.48C500.6 110.24 497.24 110.72 489.92 110.72H448.15999999999997C440.0 110.72 436.64 109.4 436.64 104.96000000000001V81.80000000000001H491.84000000000003V89.72H494.12C498.92 89.72 505.88 86.96000000000001 506.0 86.0V54.800000000000004C508.64 54.32 510.32 53.120000000000005 511.15999999999997 52.160000000000004L497.12 41.480000000000004L490.52 48.8H464.48C471.8 44.72 479.48 38.480000000000004 484.64 33.68000000000001C487.15999999999997 33.44 488.6 33.08 489.44 32.0L476.36 20.72L468.92 28.28H448.52C450.44 25.52000000000001 452.24 22.760000000000005 453.8 20.0C457.04 20.120000000000005 458.0 19.64 458.48 18.200000000000003L438.8 13.400000000000006C432.8 31.400000000000006 419.72 53.0 406.52 65.0L407.6 66.08C412.76 63.32 417.92 59.84 422.72 56.0V104.6C422.72 119.48 430.88 123.92 448.76 123.92H491.24C515.0 123.92 520.28 119.84 520.28 113.48C520.28 110.48 518.24 109.64 512.12 107.84Z'
  }
];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

let context = null;
let driftTimeline = null;
let glyphTimeline = null;
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
    const glyphs = gsap.utils.toArray('.fall-loader__glyph');

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
      .from(leaves.slice(0, 10), {
        scale: 0,
        opacity: 0,
        stagger: 0.035,
        duration: 0.5,
        ease: 'back.out(2.2)'
      })
      .set(glyphs, { opacity: 1 }, 0);

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

    glyphTimeline = gsap
      .timeline({ repeat: -1, repeatDelay: 0.2 })
      .to(glyphs, {
        y: -8,
        stagger: 0.08,
        duration: 0.42,
        ease: 'power2.out'
      })
      .to(
        glyphs,
        {
          y: 0,
          stagger: 0.08,
          duration: 0.72,
          ease: 'bounce.out'
        },
        0.16
      );
  }, rootRef.value);
};

const playExit = () => {
  if (!rootRef.value || hasExited) return;

  hasExited = true;
  driftTimeline?.pause();
  glyphTimeline?.pause();

  if (reduceMotion.matches) {
    emit('after-exit');
    return;
  }

  context?.add(() => {
    const curtains = gsap.utils.toArray('.fall-loader__curtain');
    const leaves = gsap.utils.toArray('.fall-loader__leaf');
    const glyphs = gsap.utils.toArray('.fall-loader__glyph');

    gsap
      .timeline({
        defaults: { ease: 'power3.inOut' },
        onComplete: () => emit('after-exit')
      })
      .to(glyphs, {
        y: -22,
        opacity: 0,
        stagger: 0.04,
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
  glyphTimeline?.kill();
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
}

.fall-loader__curtain {
  background: var(--loader-color);
  transform-origin: 50% 100%;
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

.fall-loader__glyphs {
  position: relative;
  z-index: 2;
  width: min(34vw, 11rem);
  max-height: min(78vh, 40rem);
  height: auto;
  overflow: visible;
}

.fall-loader__glyph {
  color: black;
  will-change: transform, opacity;
}

.fall-loader__glyph path {
  fill: currentColor;
}

@media (prefers-reduced-motion: reduce) {
  .fall-loader__leaf,
  .fall-loader__glyph,
  .fall-loader__curtain,
  .fall-loader__paper {
    transition: none;
  }
}
</style>
