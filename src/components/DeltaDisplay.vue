<script setup>
import _ from 'lodash';

const _getDeltaSymbol = (value) => {
  return value >= 0 ? '▴' : '▾';
};

const props = defineProps({
  delta: {
    type: Number,
    required: true
  },
  precision: {
    type: Number,
    default: 2
  }
});
</script>

<template>
  <span v-if="!isNaN(props.delta)" class="cursor-help" title="30天之内的评分变化"
    ><span
      :class="{
        'text-pink': props.delta >= 0,
        'text-blue': props.delta < 0
      }"
      >{{ _getDeltaSymbol(props.delta) }}</span
    ><span>{{ Math.abs(_.round(props.delta, 2)).toFixed(props.precision) }}</span></span
  >
</template>
