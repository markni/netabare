<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>

    <nav class="flex gap-2">
      <RouterLink to="/" v-if="$route.path !== '/'">返回首页</RouterLink>
      <a href="https://bgm.tv/group/topic/346147" about="blank">问题反馈</a>
      <a href="https://bgm.tv/group/topic/346147" about="blank">更新日志</a>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>

</style>
