<template>
  <div id="app">
    <div class="left-panel">
      <chart></chart>
    </div>
    <div class="right-panel">
      <div class="number-block">
        <div class="number-block-title"></div>
        <div class="number-block-number">8.9</div>
      </div>
      <div class="number-block">
        <div class="number-block-title"></div>
        <div class="number-block-number">1715</div>
      </div>
      <div class="number-block">
        <div class="number-block-title"></div>
        <div class="number-block-number">213</div>
      </div>
    </div>
  </div>
</template>

<script>
import chart from "./components/chart.vue";

export default {
  name: "app",
  components: {
    chart
  }
};
</script>

<style>
html {
  box-sizing: border-box;
  font-size: 16px;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

body,
h1,
h2,
h3,
h4,
h5,
h6,
p,
ol,
ul {
  margin: 0;
  padding: 0;
  font-weight: normal;
}

ol,
ul {
  list-style: none;
}

img {
  max-width: 100%;
  height: auto;
}

#app {
  display: flex;
}

.left-panel {
  height: 100vh;
  position: relative;
  width: 50vw;
}
.right-panel {
  height: 100vh;
  position: relative;
  width: 50vw;
}
.number-block {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.number-block-number {
  justify-content: center;
  align-items: center;
  display: flex;
  font-size: 20vh;
}
</style>
