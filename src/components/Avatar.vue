<template>
  <div class="avatar">
    <a
      v-bind:href="user.url.replace('http:', 'https:')"
      :alt="user.nickname"
      target="_blank"
    >
      <img :src="user.avatar.large.replace('http:', 'https:')" />
    </a>
  </div>
</template>

<script>
export default {
  name: 'Avatar',
  props: ['user'],
};
</script>

<style scoped>
.avatar {
  /*display: inline;*/
}
.avatar img {
  border-radius: 50%;
  max-height: 120px;
  max-width: 120px;
  width: 8vmax;
  height: 8vmax;
  box-sizing: border-box;
}
.avatar img:hover {
}
</style>
