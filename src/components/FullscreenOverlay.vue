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
    default: 'bg-blood',
    type: String,
    required: false
  }
})
</script>

<template>
  <div :class="'fixed inset-0 flex items-center justify-center z-50 flex-col gap-4 ' + color">
    <p class="text-white text-center float vertical-rl text-6xl tracking-[30px]">
      {{ text }}
    </p>
    <div class="flex flex-col gap-2">
      <p v-if="annotation" class="text-white text-center text-2xl italic">{{ annotation }}.</p>
      <p v-if="code" class="text-white text-center text-2xl">({{ code }})</p>
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
