<script setup>
import _ from 'lodash'

const _getDeltaSymbol = (value) => {
  return value >= 0 ? '▴' : '▾'
}

const props = defineProps({
  delta: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <span
    v-if="!isNaN(props.delta)"
    class="cursor-help"
    :class="{
      'text-gold': props.delta >= 0,
      'text-mint': props.delta < 0
    }"
    title="30天之内的评分变化"
    >{{ _getDeltaSymbol(props.delta) }}{{ Math.abs(_.round(props.delta, 2)).toFixed(2) }}</span
  >
</template>
