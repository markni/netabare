<template>
  <div class="home">
      <h1 class="tk-myriad-pro title">netabare.</h1>
    <div class="inputs">
      <div class="typekit-text input-label">查看个人评分分布:</div>
      <div class="input-box">
        <user-search font-size="1vmax"/>
      </div>
      <div class="typekit-text input-label">查看动画评分趋势:</div>
      <div class="input-box">
        <subject-search font-size="1vmax" />
      </div>

    </div>

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
.inputs {
  display: flex;
  align-items: flex-end;
  width: 60vw;
  justify-content: flex-start;
  padding-left: 5px;
}
.inputs > div {
  margin-right: 1vmax;
}
.input-label {
  font-size: 1.2vmax;
  font-weight: bold;
}
.input-box {
  width: 10vw;
}
.title {
  font-size: 10vmax;
}
.title {
  transition: opacity 2s, text-shadow 1s;
  opacity: 0;
  position: relative;
  text-shadow: 0.5vmax 0 rgba(49, 148, 255, 0.3),
    -0.2vmax -0.5vmax rgba(242, 0, 110, 0.3);
  cursor: pointer;
  margin-bottom: 1vmax;
}
.title:hover {
  text-shadow: 0.3vmax 0 rgba(242, 0, 110, 0.4),
    -0.3vmax -0.4vmax rgba(49, 148, 255, 0.5);
}
.wf-loading .title {
  opacity: 0;
}
.wf-active .title {
  opacity: 1;
}
.wf-inactive .title {
  opacity: 1;
}
.home {
  padding-left: 10vw;
  display: flex;
  width: 100%;
  height: 100vh;
  flex-direction: column;
  align-items: left;
  box-sizing: border-box;
  /*justify-content: space-evenly;*/
}
</style>
