<template>
  <div
    ref="containerRef"
    class="flex h-full w-full flex-col items-center justify-center gap-64 text-6xl tracking-wider"
  >
    <div class="flex flex-col gap-16 pt-32">
      <h1 class="rainbow text-center text-4xl">Netabare</h1>

      <div class="flex flex-col gap-4 tracking-widest">
        <h2 class="flex flex-col items-baseline justify-between gap-4 lg:flex-row lg:gap-10">
          <span class="text-2xl lg:text-4xl">当季动画</span>
          <RouterLink class="text-3xl hover:bg-teal lg:text-5xl" to="/season">龙争虎斗</RouterLink>
        </h2>

        <h2 class="flex flex-col items-baseline justify-between gap-4 lg:flex-row lg:gap-10">
          <span class="text-2xl lg:text-4xl">全站动画</span>
          <RouterLink class="text-3xl hover:bg-blue lg:text-5xl" to="/trending"
            >热门趋势</RouterLink
          >
        </h2>

        <h2 class="flex flex-col items-baseline justify-between gap-4 lg:flex-row lg:gap-10">
          <span class="text-2xl lg:text-4xl">全站动画</span>
          <RouterLink class="text-3xl hover:bg-pink lg:text-5xl" to="/history"
            >评分分布图</RouterLink
          >
        </h2>
        <h2 class="flex flex-col items-baseline justify-between gap-4 lg:flex-row lg:gap-10">
          <span class="text-2xl lg:text-4xl">个人动画</span>
          <RouterLink class="text-3xl hover:bg-gold lg:text-5xl" to="/user">评分分布</RouterLink>
        </h2>
      </div>
    </div>

    <div class="flex w-full flex-col gap-16" v-if="licenses">
      <h2 class="rainbow text-center text-4xl">Credits</h2>

      <div class="flex flex-col gap-4 tracking-widest">
        <div v-for="(value, key) in licenses" :key="key" class="rainbow py-1">
          <div
            class="mx-auto flex max-w-sm flex-col items-baseline justify-between lg:max-w-5xl lg:flex-row"
          >
            <a
              :href="value.repository"
              class="text-sm hover:bg-blue dark:hover:bg-transparent lg:text-xl"
              >{{ key }}</a
            >
            <a
              :href="value.repository"
              class="text-lg hover:bg-blue dark:hover:bg-transparent lg:text-2xl"
              >{{ value.publisher }}</a
            >
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-16" v-if="licenses">
      <h2 class="rainbow text-center text-2xl lg:text-4xl">Special Thanks</h2>

      <div class="rainbow flex flex-col gap-4 tracking-widest">
        <div class="flex flex-col items-baseline justify-between gap-10 lg:flex-row">
          <div class="text-2xl lg:text-4xl">数据支持</div>
          <a
            href="https://bgm.tv"
            target="_blank"
            class="text-3xl hover:bg-pink dark:hover:bg-transparent lg:text-5xl"
            >bangumi.tv</a
          >
        </div>
      </div>
    </div>

    <div class="mb-64 mt-32 flex w-full flex-col gap-16" v-if="licenses">
      <h2 class="rainbow text-center text-2xl lg:text-4xl">Netabare制作委员会</h2>
    </div>
  </div>
</template>
<script setup>
import licenses from '../../licenses.json';
import { onMounted, onUnmounted, ref, nextTick } from 'vue';

// Create a ref for the container
const containerRef = ref(null);

// Initialize observer reference
const observer = ref(null);

// Setup intersection observer on component mount
onMounted(async () => {
  // Wait for the next DOM update
  await nextTick();

  // Create observer that triggers when element is in middle 1/3 of viewport
  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Add .inview class when in view, remove when out
        if (entry.isIntersecting) {
          entry.target.classList.add('inview');
        } else {
          entry.target.classList.remove('inview');
        }
      });
    },
    {
      // Define threshold for middle 1/6 of viewport (50% narrower than before)
      rootMargin: '-42% 0px -42% 0px',
      threshold: 0
    }
  );

  // Use containerRef to query for rainbow elements within our component
  if (containerRef.value) {
    const elements = containerRef.value.querySelectorAll('.rainbow');
    elements.forEach((el) => {
      observer.value.observe(el);
    });
  }
});

// Clean up observer on component unmount
onUnmounted(() => {
  if (observer.value) {
    observer.value.disconnect();
  }
});
</script>
<style scoped>
.dark .rainbow {
  --rainbow-gradient: linear-gradient(
    to bottom,
    rgba(228, 244, 48, var(--c1-opacity)) 0%,
    rgba(157, 252, 47, var(--c2-opacity)) 20%,
    rgba(40, 252, 252, var(--c3-opacity)) 30%,
    rgba(58, 40, 255, var(--c4-opacity)) 50%,
    rgba(255, 40, 255, var(--c5-opacity)) 70%,
    rgba(255, 40, 65, var(--c6-opacity)) 90%
  );
  --c1-opacity: 0;
  --c2-opacity: 0;
  --c3-opacity: 0;
  --c4-opacity: 0;
  --c5-opacity: 0;
  --c6-opacity: 0;
  --lg1-c6-percent: 95%;
  --lg1-c1-percent: 5%;
  background: var(--rainbow-gradient);
  transition:
    background 0.1s linear,
    text-shadow 0.1s linear;
}

.dark .rainbow:hover,
.dark .rainbow.inview {
  text-shadow: 0 0 10px rgba(255, 255, 255, 1);
  animation: shine 1s forwards;

  background: linear-gradient(
      to right,
      rgba(23, 23, 23, 1) var(--lg1-c1-percent),
      rgba(23, 23, 23, 0.7) 25%,
      rgba(23, 23, 23, 0.1) 40%,
      rgba(23, 23, 23, 0.1) 60%,
      rgba(23, 23, 23, 0.7) 75%,
      rgba(23, 23, 23, 1) var(--lg1-c6-percent)
    ),
    linear-gradient(
      to bottom,
      rgba(23, 23, 23, 0.8) 1%,
      rgba(23, 23, 23, 0.1) 45%,
      rgba(23, 23, 23, 0.3) 55%,
      rgba(23, 23, 23, 1) 98%
    ),
    var(--rainbow-gradient);
}

@keyframes shine {
  10% {
    --c1-opacity: 1;
  }
  20% {
    --c1-opacity: 0.5;
    --c2-opacity: 0.8;
  }
  30% {
    --c1-opacity: 0;
    --c2-opacity: 0.5;
    --c3-opacity: 0.8;
  }
  40% {
    --c2-opacity: 0;
    --c3-opacity: 0.5;
    --c4-opacity: 0.8;
  }
  50% {
    --c3-opacity: 0;
    --c4-opacity: 0.5;
    --c5-opacity: 0.8;
    --lg1-c1-percent: 1%;
    --lg1-c6-percent: 99%;
  }
  60% {
    --c4-opacity: 0;
    --c5-opacity: 0.5;
    --c6-opacity: 0.8;
  }
  70% {
    --c5-opacity: 0;
    --c6-opacity: 0.5;
  }
  80% {
    --c6-opacity: 0;
  }
}
</style>
