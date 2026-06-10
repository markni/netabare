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
      viewBox="0 0 112 620"
      role="img"
      aria-label="内容读取中"
      preserveAspectRatio="xMidYMid meet"
    >
      <g
        v-for="(glyph, index) in glyphs"
        :key="glyph.id"
        :transform="`translate(${-index * 86} ${index * 112})`"
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
    color: colors[1],
    d: 'M85.364 59.762 81.074 64.598H62.9C63.134 60.932 63.29 57.032000000000004 63.446 52.898C65.318 52.664 66.098 51.806 66.25399999999999 50.714L53.93 49.7C53.93 55.004 53.852 59.996 53.54 64.598H37.472L27.644 60.542V122.786H29.125999999999998C33.025999999999996 122.786 36.769999999999996 120.602 36.769999999999996 119.432V66.86H53.384C52.37 80.354 48.938 90.962 37.472 99.854L38.33 101.024C50.966 95.642 57.05 88.544 60.092 79.72999999999999C64.616 85.03399999999999 69.14 91.976 70.7 98.138C79.436 104.378 85.676 86.516 60.872 77.23400000000001C61.808 74.036 62.354 70.52600000000001 62.666 66.86H81.854V110.774C81.854 111.944 81.386 112.568 79.904 112.568C77.33 112.568 66.72200000000001 111.866 66.72200000000001 111.866V112.958C71.636 113.738 73.82 114.83 75.458 116.312C77.096 117.716 77.642 119.9 78.11 122.94200000000001C89.498 121.85 91.136 118.106 91.136 111.788V68.26400000000001C92.696 67.952 93.788 67.25 94.256 66.78200000000001Z'
  },
  {
    id: 'glyph-1',
    color: colors[9],
    d: 'M169.102 62.648C168.712 65.456 168.088 68.96600000000001 167.464 71.384L168.166 71.852C171.51999999999998 70.05799999999999 175.732 66.78200000000001 178.228 64.364C179.788 64.286 180.64600000000002 64.13 181.192 63.428L173.15800000000002 55.706L168.55599999999998 60.386H147.808C152.722 58.358 153.19 49.07599999999999 137.512 49.934L136.966 50.402C139.462 52.352 141.958 56.174 142.348 59.684C142.816 59.996 143.284 60.23 143.752 60.386H120.508C120.196 58.982 119.806 57.578 119.182 56.018H118.09C118.324 60.386 115.282 64.44200000000001 112.474 65.924C110.134 67.094 108.496 69.2 109.354 71.93C110.446 74.816 114.19 75.44 116.686 73.80199999999999C119.338 72.164 121.366 68.26400000000001 120.82 62.648ZM150.07 67.952C155.764 71.384 162.94 77.702 166.138 83.24000000000001C175.732 86.906 178.462 68.26400000000001 150.69400000000002 67.25ZM114.346 86.048C123.78399999999999 82.77199999999999 132.988 76.376 137.98 70.838C139.696 70.994 140.32 70.52600000000001 140.71 69.74600000000001L130.336 65.144C127.372 71.384 120.664 79.886 113.644 85.112ZM155.84199999999998 97.748H133.846L127.84 95.33C136.34199999999998 90.494 143.518 84.72200000000001 147.652 78.95C150.382 84.41 154.594 89.402 159.82 93.458ZM133.3 114.83V99.932H156.54399999999998V114.83ZM139.30599999999998 73.1C136.108 82.616 121.834 95.95400000000001 108.184 102.74L108.574 103.754C113.878 102.116 119.338 99.854 124.408 97.202V123.02H125.734C129.322 123.02 133.3 120.992 133.3 120.212V117.014H156.54399999999998V122.396H158.10399999999998C161.06799999999998 122.396 165.514 120.68 165.59199999999998 120.134V101.102C166.996 100.868 167.85399999999998 100.244 168.244 99.776L162.472 95.33C166.45 98.06 170.89600000000002 100.4 175.498 102.116C175.966 98.762 178.38400000000001 94.862 182.128 93.77V92.52199999999999C170.584 90.494 156.076 85.502 148.978 78.01400000000001C151.39600000000002 77.78 152.332 77.312 152.644 76.298Z'
  },
  {
    id: 'glyph-2',
    color: colors[4],
    d: 'M216.57 72.632 217.194 74.894H256.74C256.194 78.326 255.336 82.85 254.55599999999998 85.97L255.336 86.516C258.76800000000003 83.94200000000001 263.058 79.652 265.554 76.53200000000001C267.11400000000003 76.45400000000001 267.972 76.22 268.596 75.674L260.64 68.108L256.116 72.632H244.026V63.116H261.42C262.512 63.116 263.29200000000003 62.726 263.526 61.868C260.406 58.982 255.102 55.004 255.102 55.004L250.578 60.932H244.026V52.742C245.898 52.43 246.522 51.727999999999994 246.678 50.714L235.446 49.7V60.932H219.846L220.47 63.116H235.446V72.632ZM222.888 78.01400000000001C225.852 79.886 229.05 83.47399999999999 230.142 86.594C237.39600000000002 90.182 241.452 76.142 223.512 77.39ZM219.378 88.232C222.264 90.182 225.54 93.926 226.554 97.202C233.808 100.946 238.176 87.062 220.002 87.608ZM199.566 50.870000000000005C202.452 54.302 205.88400000000001 59.372 207.132 63.896C215.322 69.2 221.796 53.6 200.268 50.402ZM220.548 102.974C217.74 104.3 214.85399999999998 105.548 212.202 106.718V74.50399999999999C214.074 74.19200000000001 215.01 73.568 215.4 73.02199999999999L207.834 66.78200000000001L203.778 70.838H194.028L194.73 73.1H203.7V106.79599999999999C203.7 108.512 203.154 109.214 199.644 111.086L206.04 120.758C206.976 120.134 207.99 118.964 208.614 117.248C214.23 111.71 218.754 106.484 220.86 103.754ZM244.10399999999998 104.768C249.486 109.05799999999999 256.35 116.0 259.31399999999996 121.85C268.36199999999997 126.374 272.262 108.902 244.80599999999998 104.144ZM254.322 99.074H244.88400000000001C247.14600000000002 93.536 248.55 87.062 249.32999999999998 79.418C251.436 79.418 252.06 78.872 252.29399999999998 78.01400000000001L239.65800000000002 76.22C239.736 85.112 238.8 92.678 236.61599999999999 99.074H215.4L216.024 101.336H235.758C231.78 111.086 224.214 117.794 211.89 122.162L212.28 123.098C229.20600000000002 119.12 238.644 112.334 243.948 101.336H265.632C266.724 101.336 267.582 100.946 267.738 100.088C264.462 97.124 259.08 92.912 259.08 92.912Z'
  },
  {
    id: 'glyph-3',
    color: colors[6],
    d: 'M296.33 88.77799999999999H306.704V99.542C303.038 100.166 299.606 100.868 296.33 101.414ZM306.704 59.216V71.696H296.33V59.216ZM296.33 73.958H306.704V86.516H296.33ZM315.44 101.258C318.95 99.776 321.992 98.45 324.644 97.202L324.40999999999997 96.188L315.44 97.904V59.216H324.02C325.112 59.216 325.814 58.826 326.048 57.968C322.85 54.926 317.39 50.714 317.39 50.714L312.554 56.954H280.496L281.12 59.216H287.672V102.896C284.474 103.44200000000001 281.822 103.91 279.872 104.144L284.864 114.44C285.722 114.206 286.502 113.426 286.892 112.412C294.536 109.682 301.166 107.186 306.704 104.924V122.864H308.264C312.788 122.864 315.44 120.68 315.44 119.978ZM340.244 67.406C338.996 76.61 336.812 85.892 333.302 94.628C328.622 87.14 325.19 78.17 323.396 67.406ZM344.534 59.996 339.62 65.144H316.376L317.078 67.406H321.68C323.162 80.588 325.892 91.976 330.338 101.336C326.438 109.214 321.446 116.312 314.972 121.928L315.83 122.708C323.318 118.574 329.09000000000003 113.582 333.77 107.81C337.358 113.738 341.726 118.574 346.952 122.55199999999999C347.654 118.964 350.54 116.312 354.36199999999997 115.454L354.596 114.44C348.43399999999997 111.164 342.974 106.79599999999999 338.372 101.414C344.61199999999997 91.508 347.88800000000003 80.19800000000001 349.83799999999997 69.044C351.71 68.81 352.49 68.49799999999999 353.036 67.64Z'
  },
  {
    id: 'glyph-4',
    color: colors[1],
    d: 'M407.758 90.026V69.2H425.308V90.026ZM380.614 90.026V69.2H398.008V90.026ZM428.974 62.102 424.606 66.938H407.758V53.288C409.864 52.976 410.488 52.118 410.644 51.025999999999996L398.008 49.855999999999995V66.938H381.316L370.942 62.882V100.01H372.346C376.324 100.01 380.614 97.826 380.614 96.89V92.288H398.008V122.94200000000001H399.802C403.546 122.94200000000001 407.758 120.602 407.758 119.588V92.288H425.308V98.84H426.946C430.144 98.84 434.98 97.124 435.058 96.5V70.838C436.696 70.52600000000001 437.71 69.74600000000001 438.256 69.122Z'
  }
];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

let context = null;
let leafTimeline = null;
let curtainTimeline = null;
let hasExited = false;

const leaves = computed(() =>
  Array.from({ length: 32 }, (_, index) => {
    const color = colors[index % colors.length];
    const row = Math.floor(index / 8);

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
      transformOrigin: '50% 50%',
      force3D: true
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

    curtainTimeline = gsap.timeline({ repeat: -1, yoyo: true }).to(curtains, {
      scaleY: (index) => 0.9 + (index % 4) * 0.02,
      transformOrigin: (index) => (index % 2 === 0 ? '50% 0%' : '50% 100%'),
      stagger: {
        each: 0.055,
        from: 'center'
      },
      duration: 1.2,
      ease: 'sine.inOut'
    });

    leafTimeline = gsap.timeline({ repeat: -1 }).fromTo(
      leaves,
      {
        x: 0,
        y: '-12vh',
        rotate: (index) => -50 + ((index * 29) % 100),
        opacity: 0
      },
      {
        x: 0,
        y: '112vh',
        rotate: (index) => `+=${190 + ((index * 23) % 260)}`,
        opacity: 1,
        duration: (index) => 4.8 + (index % 9) * 0.24,
        ease: 'none',
        force3D: true,
        stagger: 0.105
      }
    );
  }, rootRef.value);
};

const playExit = () => {
  if (!rootRef.value || hasExited) return;

  hasExited = true;
  leafTimeline?.pause();
  curtainTimeline?.pause();

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
  leafTimeline?.kill();
  curtainTimeline?.kill();
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
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.18);
  opacity: 0;
  backface-visibility: hidden;
  contain: layout paint;
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
  position: absolute;
  top: clamp(1rem, 4vw, 3rem);
  right: clamp(1rem, 4vw, 3rem);
  z-index: 2;
  width: min(16vw, 4.6rem);
  max-height: min(72vh, 34rem);
  height: auto;
  overflow: visible;
}

.fall-loader__glyph {
  color: white;
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
