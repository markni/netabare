<template>
  <nav class="mb-auto text-4xl flex flex-col gap-8 p-8 tracking-widest fixed top-4 left-4"
       style="writing-mode: vertical-lr">

    <RouterLink v-for="link in links"
                :key="link.name"
                :aria-label="link.ariaLabel"
                :to="link.to"
                class="font-bold hover:mt-2 transition-all">{{ link.name }}
    </RouterLink>

  </nav>
</template>

<script lang="ts" setup>
// import {useRoute} from "vue-router";

// const route = useRoute();

const links = [
  {
    name: '评分分布',
    to: '/history',
    ariaLabel: '评分分布'
  },
  {
    name: '条目趋势',
    to: '/trending',
    ariaLabel: '条目趋势'
  },
  {
    name: '个人评分',
    to: '/user',
    ariaLabel: '个人评分'
  }
]

// watch(() => route.name, (name) => {
//   console.log('watch', name);
//
// });
</script>

<style scoped>

</style>