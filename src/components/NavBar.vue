<template>
  <nav class="mb-auto text-4xl flex flex-col gap-8 p-8 tracking-widest fixed top-4 left-4"
       style="writing-mode: vertical-lr">

    <RouterLink
        v-for="link in visibleLinks"
        :key="link.name"
        :aria-label="link.ariaLabel"
        :to="link.to"
        class="font-bold hover:mt-2 transition-all">{{ link.name }}
    </RouterLink>


  </nav>
</template>

<script lang="ts" setup>
import {useRoute} from "vue-router";
import {ref, watch} from "vue";

const route = useRoute();

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
  },
  {
    name: '返回首页',
    to: '/',
    ariaLabel: '返回首页'
  },
]

const visibleLinks = ref(links.filter(link => link.name !== '返回首页'));


watch(() => route.name, (name) => {
  console.log('watch', name);
  if (name !== 'home') {
    // if not at home page, show the return home link
    visibleLinks.value = links.filter(link => link.name == '返回首页');
  } else {
    // if at home page, hide the return home link and show the others
    visibleLinks.value = links.filter(link => link.name !== '返回首页');
  }

});
</script>

<style scoped>

</style>