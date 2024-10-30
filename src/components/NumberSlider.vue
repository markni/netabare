<template>
  <div class="controls">
    <label :for="id">{{ label }}: {{ modelValue }}</label>
    <input
      :id="id"
      type="range"
      :value="modelValue"
      @input="$emit('update:modelValue', Number($event.target.value))"
      :min="min"
      :max="max"
      class="slider"
    />
  </div>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  modelValue: {
    type: Number,
    required: true
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  }
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.slider {
  width: 200px;
  height: 15px;
  -webkit-appearance: none;
  background: #d3d3d3;
  outline: none;
  border-radius: 8px;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #4caf50;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #4caf50;
  cursor: pointer;
}
</style>
