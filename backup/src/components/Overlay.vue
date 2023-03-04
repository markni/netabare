<template>
  <div class="overlay">
    <div class="" v-bind:class="{ float: animated }">{{ text }}</div>
  </div>
</template>

<script>
export default {
  name: 'overlay',
  props: ['text', 'animated']
};
</script>

<style scoped>
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}
.float {
  transform: translateY(0px);

  animation: float 6s ease-in-out infinite;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 7vh;
  writing-mode: vertical-rl;
  letter-spacing: 1.05vh;
  z-index: 10;
}
</style>
