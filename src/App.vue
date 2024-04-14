<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>


  <div class="min-h-screen bg-stone-50">
    <header>

      <nav class="inline-flex gap-2 bg-teal-500 text-white px-4 py-2 mt-2 shadow font">
        <RouterLink to="/" v-if="$route.path !== '/'">返回首页</RouterLink>
        <a href="https://bgm.tv/group/topic/346147" about="blank">问题反馈</a>
        <a href="https://bgm.tv/group/topic/346147" about="blank">更新日志</a>
      </nav>
    </header>

    <RouterView />

  </div>

</template>

<style scoped>

</style>
