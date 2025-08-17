<template>
  <div :title="title" class="cursor-help text-gray-400">
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
