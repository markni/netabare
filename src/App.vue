<template>
  <div id="app">
    <!--<div id="nav">-->
    <!--<router-link to="/">Home</router-link> |-->
    <!--<router-link to="/about">About</router-link>-->
    <!--</div>-->
    <router-view />
  </div>
</template>

<style lang="scss">
body {
  margin: 0;
  background: rgba(244, 244, 244, 1);
}

#app {
  font-family: 'source-han-serif-sc', serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
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
