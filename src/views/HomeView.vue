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

    <div class="flex flex-col gap-16" v-if="licenses">
      <h2 class="text-4xl text-center">Credits</h2>

      <div class="flex flex-col gap-4 tracking-widest">
        <div
          v-for="(value, key) in licenses"
          :key="key"
          class="gap-10 flex items-baseline justify-between lg:flex-row flex-col"
        >
          <a :href="value.repository" class="text-sm lg:text-2xl hover:bg-blue">{{ key }}</a>
          <a :href="value.repository" class="text-lg lg:text-3xl hover:bg-blue">{{
            value.publisher
          }}</a>
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
