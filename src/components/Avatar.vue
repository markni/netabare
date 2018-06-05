<template>
    <div class="avatar">
        <a v-bind:href="user.url.replace('http:','https:')" :alt="user.nickname" target="_blank">
        <img :src="user.avatar.large.replace('http:','https:')" />
        </a>
    </div>
</template>

<script>
export default {
  name: 'Avatar',
  props: ['user']
};
</script>

<style scoped>
.avatar {
  /*display: inline;*/
}
.avatar img {
  border-radius: 50%;
  width: 8vh;
  height: 8vh;
}
</style>
