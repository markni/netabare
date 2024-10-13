<template>
  <div class="avatar">
    <a :href="httpsUserUrl" target="_blank" class="flex">
      <img
        :alt="user.nickname"
        :src="httpsAvatarUrl"
        class="rounded-full max-h-[120px] max-w-[120px] w-[8vmax] h-[8vmax] box-border hover:opacity-90"
      />
    </a>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// Prop 'user' is defined implicitly when using <script setup>
const props = defineProps({
  user: Object
});

const httpsUserUrl = computed(() => props.user.url.replace('http:', 'https:'));
const httpsAvatarUrl = computed(() => props.user.avatar.large.replace('http:', 'https:'));
</script>
