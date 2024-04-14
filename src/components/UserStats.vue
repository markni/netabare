<template>
  <div>
    <Avatar v-if="!!user?.user" :user="user.user" />
    <div>{{user}}</div>
  </div>
</template>

<script setup>


import Avatar from '@/components/Avatar.vue'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});




</script>
