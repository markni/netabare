<template>
    <form @submit="submit">
        <input :style="{ fontSize: fontSize}" maxlength="15" type="text" v-model="bgmSubjectId" placeholder="anime id"/>
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
  line-height: 2;
  border: none;
  outline: none;
  border-bottom: 2px solid;
  border-color: #f2006e;
  font-family: 'source-han-serif-sc', serif;
  color: #2c3e50;
  transition: border 0.5s;
}
input:focus {
  border-color: #3194ff;
}
</style>
