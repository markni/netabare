<template>
  <div id="app">
    <div class="left-panel">
      <rank></rank>
      <score></score>
    </div>
  </div>
</template>

<script>
import rank from "./components/rank.vue";
import score from "./components/score.vue";

export default {
  name: "app",
  components: {
    rank,
    score,
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
  height: 40vh;
  position: relative;
  width: 80vw;
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
