<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <RouterLink to="/tabemono" class="footer-corner-triangle" aria-label="动画 x 美食"></RouterLink>
</template>

<style scoped>
.footer-corner-triangle {
  position: absolute;
  left: 0;
  bottom: 0;
  width: var(--footer-corner-size, clamp(6rem, 16vw, 10rem));
  height: var(--footer-corner-size, clamp(6rem, 16vw, 10rem));
  overflow: hidden;
  clip-path: polygon(0 0, 100% 100%, 0 100%);
}

.footer-corner-triangle::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('@/assets/footer-corner-maid-san-01.webp');
  background-repeat: no-repeat;
  background-position: center;
  background-size: auto;
  transform-origin: center;
  transition: transform 180ms ease;
}

.footer-corner-triangle:hover::before {
  transform: scale(1.08);
}
</style>
