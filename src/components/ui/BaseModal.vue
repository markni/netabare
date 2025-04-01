<script setup>
import { onMounted, onUnmounted } from 'vue';

defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const closeModal = () => {
  emit('update:modelValue', false);
};

// Handle escape key
const handleEscape = (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape);
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="modelValue" class="fixed inset-0 z-50 overflow-hidden">
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          @click="closeModal"
        ></div>

        <!-- Modal -->
        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div
            class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
          >
            <Transition
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
              enter-to-class="translate-y-0 opacity-100 sm:scale-100"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="translate-y-0 opacity-100 sm:scale-100"
              leave-to-class="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
            >
              <div
                v-if="modelValue"
                class="relative transform overflow-hidden rounded-lg px-4 pb-4 pt-5 text-left transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6"
                @click.stop
              >
                <!-- Modal content -->
                <slot></slot>

                <!-- Close button -->
                <div class="absolute right-8 top-8">
                  <button type="button" class="text-black hover:text-gray-600" @click="closeModal">
                    <span class="sr-only">Close</span>
                    X
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
