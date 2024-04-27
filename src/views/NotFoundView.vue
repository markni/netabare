<script setup>
import FullscreenOverlay from '@/components/FullscreenOverlay.vue'
import texts from '@/constants/texts.js'
</script>

<template>
  <FullscreenOverlay color="bg-teal" :text="texts._notFound" code="404" annotation="not found" />
</template>

<style scoped></style>
