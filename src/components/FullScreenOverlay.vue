<template>
  <div
      class="overlay tracking-wide text-4xl sm:text-8xl fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-10">
    <div class="" v-bind:class="{ float: props.animated }">{{ props.text }}</div>
  </div>
</template>

<script lang="ts" setup>

export type FullScreenText = '读取中' | '四〇四'

interface Props {
  text: FullScreenText
  animated: boolean
}

const props = withDefaults(defineProps<Props>(), {
  text: '读取中',
  animated: false,
})

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
  writing-mode: vertical-rl;
  pointer-events: none;
}
</style>
