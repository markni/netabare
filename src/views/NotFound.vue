<template>
    <div>
        <Overlay text="哎呦 你走错了" />
        <rank bgm-id="218711"></rank>
        <score bgm-id="218711"></score>
    </div>
</template>

<script>
import Overlay from '@/components/Overlay.vue';
import Rank from '@/components/Rank';
import Score from '@/components/Score';

export default {
  name: 'NotFound',
  components: {
    Overlay,
    Rank,
    Score
  }
};
</script>

<style scoped>
</style>
