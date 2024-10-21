<template>
  <div
    class="flex flex-col h-full w-full items-center justify-center text-6xl tracking-wider gap-64"
  >
    <div class="flex flex-col gap-16 pt-32">
      <h1 class="text-4xl text-center">Netabare</h1>

      <div class="flex flex-col gap-4 tracking-widest">
        <h2 class="gap-4 lg:gap-10 flex items-baseline justify-between lg:flex-row flex-col">
          <span class="lg:text-4xl text-2xl">当季动画</span>
          <RouterLink class="lg:text-5xl text-3xl hover:bg-teal" to="/season">龙争虎斗</RouterLink>
        </h2>

        <h2 class="gap-4 lg:gap-10 flex items-baseline justify-between lg:flex-row flex-col">
          <span class="lg:text-4xl text-2xl">全站动画</span>
          <RouterLink class="lg:text-5xl text-3xl hover:bg-blue" to="/trending"
            >热门趋势</RouterLink
          >
        </h2>

        <h2 class="gap-4 lg:gap-10 flex items-baseline justify-between lg:flex-row flex-col">
          <span class="lg:text-4xl text-2xl">全站动画</span>
          <RouterLink class="lg:text-5xl text-3xl hover:bg-pink" to="/history"
            >评分分布图</RouterLink
          >
        </h2>
        <h2 class="gap-4 lg:gap-10 flex items-baseline justify-between lg:flex-row flex-col">
          <span class="lg:text-4xl text-2xl">个人动画</span>
          <RouterLink class="lg:text-5xl text-3xl hover:bg-gold" to="/user">评分分布</RouterLink>
        </h2>
      </div>
    </div>

    <div class="w-full flex flex-col gap-16" v-if="licenses">
      <h2 class="text-4xl text-center">Credits</h2>

      <div class="flex flex-col gap-4 tracking-widest">
        <div v-for="(value, key) in licenses" :key="key" class="rainbow py-1">
          <div
            class="flex items-baseline justify-between lg:flex-row flex-col lg:max-w-5xl max-w-sm mx-auto"
          >
            <a
              :href="value.repository"
              class="text-sm lg:text-xl hover:bg-blue dark:hover:bg-transparent text-in-rainbow"
              >{{ key }}</a
            >
            <a
              :href="value.repository"
              class="text-lg lg:text-2xl hover:bg-blue dark:hover:bg-transparent text-in-rainbow"
              >{{ value.publisher }}</a
            >
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-16" v-if="licenses">
      <h2 class="lg:text-4xl text-2xl text-center">Special Thanks</h2>

      <div class="flex flex-col gap-4 tracking-widest">
        <div class="gap-10 flex items-baseline justify-between lg:flex-row flex-col">
          <div class="lg:text-4xl text-2xl">数据支持</div>
          <a href="https://bgm.tv" target="_blank" class="lg:text-5xl text-3xl hover:bg-pink"
            >bangumi.tv</a
          >
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-16 mt-32 mb-64" v-if="licenses">
      <h2 class="lg:text-4xl text-2xl text-center">Netabare制作委员会</h2>
    </div>
  </div>
</template>
<script setup>
import licenses from '../../licenses.json';
</script>
<style scoped>
.rainbow {
  --c1-opacity: 0;
  --c2-opacity: 0;
  --c3-opacity: 0;
  --c4-opacity: 0;
  --c5-opacity: 0;
  --c6-opacity: 0;
  background: linear-gradient(
    to bottom,
    rgba(228, 244, 48, var(--c1-opacity)) 0%,
    rgba(157, 252, 47, var(--c2-opacity)) 20%,
    rgba(40, 252, 252, var(--c3-opacity)) 30%,
    rgba(58, 40, 255, var(--c4-opacity)) 50%,
    rgba(255, 40, 255, var(--c5-opacity)) 70%,
    rgba(255, 40, 65, var(--c6-opacity)) 90%
  );
  transition: background 0.1s linear;
}

.dark .rainbow:hover {
  animation: shine 1s forwards;

  mask: linear-gradient(to right, transparent 5%, black 45%, black 55%, transparent 95%),
    linear-gradient(to top, transparent, black 40%, black 90%, transparent);

  mask-composite: intersect;
}

.text-in-rainbow:hover {
  text-shadow: 0 0 10px rgba(255, 255, 255, 1);
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
