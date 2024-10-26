<script setup>
defineProps({
  text: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: false
  },
  annotation: {
    type: String,
    required: false
  },
  color: {
    default: 'bg-red',
    type: String,
    required: false
  }
});
</script>

<template>
  <div :class="'fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 ' + color">
    <p class="float text-center text-6xl tracking-[30px] text-white vertical-rl">
      {{ text }}
    </p>
    <div class="flex flex-col gap-2">
      <p v-if="annotation" class="text-center text-2xl italic text-white">{{ annotation }}.</p>
      <p v-if="code" class="text-center text-2xl text-white">({{ code }})</p>
    </div>
  </div>
</template>

<style scoped>
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}
.float {
  transform: translateY(0px);

  animation: float 6s ease-in-out infinite;
}
</style>
