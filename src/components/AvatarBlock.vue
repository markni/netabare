<template>
  <img
    :alt="`An avatar for user ${useUserStore().user.user?.username}`"
    :src="useUserStore().user.user?.avatar?.large"
    class="rounded-full w-[75px] h-[75px]"
  />
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/user';
</script>

<style scoped></style>
