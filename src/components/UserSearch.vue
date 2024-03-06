<template>
  <form @submit="submit">
    <input
      id="username"
      autocomplete="off"
      data-lpignore="true"
      required
      pattern="^\w+$"
      class="tk-source-han-serif-sc"
      :style="{ fontSize: fontSize }"
      maxlength="15"
      type="text"
      v-model="bgmUserId"
      placeholder="username / id"
    />
  </form>
</template>

<script>
export default {
  name: 'Search',
  props: ['fontSize'],
  data: function () {
    return {
      bgmUserId: '',
    };
  },
  methods: {
    submit: function (e) {
      e.preventDefault();
      if (this.bgmUserId) this.$router.push(`/user/${this.bgmUserId}`);
    },
  },
};
</script>

<style scoped>
input {
  width: 90%;
  background: none;
  font-size: 4vh;
  line-height: 1;
  border: none;
  outline: none;
  border-bottom: 2px solid;
  border-color: #3194ff;
  color: #2c3e50;
  transition: border 0.5s;
  opacity: 0.5;
}
input:focus {
  border-color: #f2006e;
}
</style>
