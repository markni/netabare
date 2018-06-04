<template>
    <div class="overlay">
        <div class="typekit-text">{{ text }}</div>
    </div>
</template>

<script>
export default {
  name: 'overlay',
  props: ['text']
};
</script>

<style scoped>
.typekit-text {
  /*visibility: hidden;*/
}
.overlay {
  font-family: 'source-han-serif-sc', serif;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 7vh;
  writing-mode: vertical-rl;
  letter-spacing: 1.05vh;
}
</style>
