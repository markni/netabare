<template>
  <div class="home">
    <user-search />
    <subject-search />
  </div>
</template>

<script>
// @ is an alias to /src
import UserSearch from '@/components/UserSearch';
import SubjectSearch from '@/components/SubjectSearch';

export default {
  name: 'home',
  components: {
    UserSearch,
    SubjectSearch
  }
};
</script>

<style scoped>
.home {
  display: flex;
  width: 100%;
  height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}
</style>
