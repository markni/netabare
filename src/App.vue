<template>
  <div id="app">
    <overlay></overlay>
    <rank :raw="raw"></rank>
    <score :raw="raw"></score>
  </div>
</template>

<script>
import axios from "axios";
import Rank from "./components/rank.vue";
import Score from "./components/score.vue";
import Overlay from "./components/overlay";

export default {
  name: "app",
  components: {
    Overlay,
    Rank,
    Score
  },
  data() {
    return {
      raw: []
    };
  },
  mounted() {
    axios.get("http://api.netaba.re/rank/218711").then(res => {
      this.raw = res.data;
    });
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
  flex-wrap: wrap;
}

</style>
