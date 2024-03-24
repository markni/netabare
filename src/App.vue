<template>
  <div id="app">
    <div id="nav">
      <router-link to="/" v-if="$route.path !== '/'">返回首页</router-link>
      <a href="https://bgm.tv/group/topic/346147" about="blank">问题反馈</a>
      <a href="https://bgm.tv/group/topic/346147" about="blank">更新日志</a>
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
body {
  margin: 0;
  background: rgba(244, 244, 244, 1);
}

#app {
  font-family: 'source-han-serif-sc', 'source-han-serif-japanese', '宋体',
    '新宋体', serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}
#nav > *:not(:last-child)::after {
  content: '|';
  margin: 0 4px;
}
#nav {
  display: flex;
  padding: 30px;
  a {
    opacity: 0.3;

    font-weight: bold;
    color: #2c3e50;
    &:hover {
      opacity: 1;
      color: #3194ff;
    }
  }
}
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type='number'] {
  -moz-appearance: textfield;
}
a {
  text-decoration: none;
  color: #2c3e50;
}
a:active {
  color: #2c3e50;
}

a:visited {
  color: #2c3e50;
}
a:hover {
  color: #3194ff;
}
.highcharts-plot-line-label {
  opacity: 0.7;
}
</style>
