<template>
  <div class="home" v-bind:class="{ ready: !loading }">
    <div>
      <h1 class="title">netabare.</h1>
      <div class="inputs">
        <div class="input-label">
          个人
          <router-link class="link" to="/history">评分分布</router-link>
          :
        </div>
        <div class="input-box">
          <user-search font-size="1rem" />
        </div>
        <div class="input-label">
          动画
          <router-link class="link" to="/trending">评分趋势</router-link>
          :
        </div>
        <div class="input-box">
          <subject-search font-size="1rem" />
        </div>
      </div>
    </div>
    <div class="line-art">
      <line-art />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import UserSearch from '@/components/UserSearch';
import SubjectSearch from '@/components/SubjectSearch';
import LineArt from '@/components/LineArt';

export default {
  name: 'home',
  data: function () {
    return {
      loading: true,
    };
  },
  mounted: function () {
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  },
  components: {
    UserSearch,
    SubjectSearch,
    LineArt,
  },
};
</script>

<style scoped>
.inputs {
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  padding-left: 5px;
}
.link {
  border-bottom: 1px dashed #2c3e50;
}
.inputs > div {
  margin-right: 1vmax;
}
.input-label {
  font-size: 1.4rem;
  font-weight: bold;
}
.input-box {
  width: 10vw;
}
.title {
  font-size: 12rem;
  transition: opacity 2s, text-shadow 1s;
  position: relative;
  text-shadow: 0.5vmax 0 rgba(49, 148, 255, 0.3),
    -0.2vmax -0.5vmax rgba(242, 0, 110, 0.3);
  cursor: pointer;
  margin-bottom: 1vmax;
  margin-top: 20vh;
  animation: shadow-dance 15s infinite;
}

@keyframes shadow-dance {
  0% {
    text-shadow: 0.5vmax 0 rgba(242, 0, 110, 0.4),
      -0.3vmax -0.4vmax rgba(49, 148, 255, 0.5);
  }
  50% {
    text-shadow: -0.5vmax -0.5vmax rgba(49, 148, 255, 0.5),
      0.5vmax 0.5vmax rgba(242, 0, 110, 0.4);
  }
  100% {
    text-shadow: 0.5vmax 0 rgba(242, 0, 110, 0.4),
      -0.3vmax -0.4vmax rgba(49, 148, 255, 0.5);
  }
}

.wf-active .home {
  opacity: 1;
}
.home.ready {
  opacity: 1 !important;
}
.home {
  overflow: hidden;
  opacity: 0;
  transition: opacity 1s ease-out;
  display: flex;
  width: 100%;
  height: 100vh;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;

  background-image: url('../assets/background.svg');
  background-size: 100%;
  background-position: bottom;
  background-repeat: no-repeat;
  justify-content: space-between;
}
.line-art {
  width: 100%;
}
</style>
