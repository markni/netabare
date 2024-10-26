<template>
  <div class="avatar">
    <div class="flex">
      <img
        :alt="user.nickname"
        :src="httpsAvatarUrl"
        class="box-border h-[8vmax] max-h-[120px] w-[8vmax] max-w-[120px] rounded-full"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// Prop 'user' is defined implicitly when using <script setup>
const props = defineProps({
  user: Object
});

// const httpsUserUrl = computed(() => props.user.url.replace('http:', 'https:'));
const httpsAvatarUrl = computed(() => props.user.avatar.large.replace('http:', 'https:'));
</script>
