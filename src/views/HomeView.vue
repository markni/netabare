<template>
  <div
    class="flex flex-col h-full w-full items-center justify-center text-6xl tracking-wider gap-16"
  >
    <div class="text-4xl">Netabare</div>

    <div class="flex flex-col gap-4 tracking-widest">
      <div class="gap-10 flex items-baseline">
        <div class="text-4xl">个人动画</div>
        <RouterLink class="text-5xl hover:bg-gold" to="/user">评分分布</RouterLink>
      </div>

      <div class="gap-10 flex items-baseline">
        <div class="text-4xl">全站动画</div>
        <RouterLink class="text-5xl hover:bg-pink" to="/history">评分分布图</RouterLink>
      </div>

      <div class="gap-10 flex items-baseline">
        <div class="text-4xl">全站动画</div>
        <RouterLink class="text-5xl hover:bg-blue" to="/trending">热门趋势</RouterLink>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
<script setup></script>
