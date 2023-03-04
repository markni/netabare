<template>
  <form @submit="submit">
    <input
      type="number"
      :style="{ fontSize: fontSize }"
      class="tk-source-han-serif-sc"
      maxlength="7"
      v-model="bgmSubjectId"
      placeholder="anime id"
    />
  </form>
</template>

<script>
export default {
  name: 'Search',
  props: ['fontSize'],
  data: function() {
    return {
      bgmSubjectId: ''
    };
  },
  methods: {
    submit: function(e) {
      e.preventDefault();
      if (this.bgmSubjectId) this.$router.push(`/subject/${this.bgmSubjectId}`);
    }
  }
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
  border-color: #f2006e;
  color: #2c3e50;
  transition: border 0.5s;
  opacity: 0.5;
}
input:focus {
  border-color: #3194ff;
}
</style>
