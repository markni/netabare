<template>
  <nav class="mb-auto text-2xl sm:text-4xl flex flex-col gap-8 p-8 tracking-widest fixed top-4 left-4"
       style="writing-mode: vertical-lr">

    <RouterLink
        v-for="link in visibleLinks"
        :key="link.name"
        :aria-label="link.ariaLabel"
        :to="link.to"
        class="font-bold hover:mt-2 transition-all">{{ link.name }}
    </RouterLink>

    <div aria-hidden="true" class="invisible pointer-events-none text-xs">
      {{ textStore.getAltText }}
    </div>


  </nav>
</template>

<script lang="ts" setup>
import {useRoute} from "vue-router";
import {ref, watch} from "vue";
import {useUserStore} from "@/stores/user";
import {useTextStore} from "@/stores/text";

const route = useRoute();
const userStore = useUserStore();
const textStore = useTextStore();

const links = [
  {
    name: textStore.getText('评分分布'),
    to: '/history',
    ariaLabel: textStore.getText('评分分布')
  },
  {
    name: textStore.getText('条目趋势'),
    to: '/trending',
    ariaLabel: textStore.getText('条目趋势')
  },
  {
    name: textStore.getText('个人评分'),
    to: '/user',
    ariaLabel: textStore.getText('个人评分')
  },
  {
    name: textStore.getText('返回首页'),
    to: '/',
    ariaLabel: textStore.getText('返回首页')
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
    if (userStore.user?.bgmId) {
      visibleLinks.value[2].to = `/user/${userStore.user.bgmId}`
    }
  }

});
</script>

<style scoped>

</style>
