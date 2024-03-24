<template>
  <div class="container">
    <div v-show="items.length">
      <h2>热门条目</h2>
      <h3>在看最多的条目</h3>
      <div>
        <div class="row" v-for="(item, index) in items" :key="item.bgmId">
          <div class="index">{{ index + 1 }}.</div>
          <div class="title">
            <router-link :to="{ path: 'subject/' + item.bgmId }"
              >{{ item.name_cn || item.name }}
            </router-link>
          </div>
          <div class="chart-cell">
            <mini-score :color="pink" :UIData="item.history" />
          </div>
          <div class="score">{{ item.history[0].score }}</div>
        </div>
      </div>
      <back />
    </div>
    <transition name="fade">
      <overlay v-if="loading" text="读取中" animated="true"></overlay>
    </transition>
  </div>
</template>

<script>
import { fetchPopular } from '@/utils/api';
import MiniScore from '@/components/charts/MiniScoreH.vue';
import Back from '@/components/Back';
import { PINK } from '@/constants/colors';
import Overlay from '@/components/Overlay';
import moment from 'moment';

let loadingTimer;

export default {
  name: 'Trending',
  components: { MiniScore, Overlay, Back },
  data: function () {
    return {
      loading: false,
      pink: PINK,
      lastUpdate: null,
      items: [],
    };
  },
  mounted: function () {
    this._gedIVata();
  },
  methods: {
    _gedIVata: function () {
      loadingTimer = setTimeout(() => {
        this.loading = true;
      }, 300);
      fetchPopular().then((res) => {
        if (res.data['error'] || !res.data || !res.data.length) {
          this.$router.replace('/404');
        } else {
          let data = res.data;
          this.items = res.data;
          if (data.length && data[0].history.length) {
            this.lastUpdate = moment(data[0].history[0].recordedAt).format(
              'YYYY-MM-DD'
            );
          }
        }
        if (loadingTimer) clearTimeout(loadingTimer);
        this.loading = false;
      });
    },
  },
};
</script>

<style scoped>
h2 {
  font-weight: bold;
  font-size: 3vw;
}
table {
  border-spacing: 2vw;
}

.container {
  width: 90vw;
  margin: auto;
}
.score {
  font-size: 1.8vw;
  font-weight: bold;
  width: 5vw;
}
.delta {
  font-size: 1.5vw;
  width: 5vw;
}
.title {
  font-size: 2vw;
  font-weight: bold;
  width: 25vw;
  padding-right: 5vw;
}
.index {
  font-size: 1vw;
  width: 2vw;
}
.container a {
  text-decoration: none;
  color: #2c3e50;
}
.container a:active {
  color: #2c3e50;
}

.container a:visited {
  color: #2c3e50;
}
.container a:hover {
  color: #3194ff;
}
.chart-cell {
  width: 35vw;
  height: 9vw;
  padding-right: 5vw;
}
.row {
  display: flex;
  height: 20vh;
  align-items: center;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.pink {
  color: #f2006e;
}
.blue {
  color: #3194ff;
}
@media only screen and (max-width: 900px) {
  .row {
    align-items: flex-start;
    height: 100%;
    margin-bottom: 5vh;
    flex-wrap: wrap;
  }
  .index {
    font-size: 5vw;
    width: 7vw;
  }
  .title {
    font-size: 5vw;
    width: 80vw;
  }
  .chart-cell {
    width: 90vw;
    height: 30vw;
  }
  .score {
    width: 10vw;
    font-size: 5vw;
  }
  .delta {
    width: 20vw;
    font-size: 5vw;
  }
  h2 {
    font-size: 8vw;
  }
  h3 {
    font-size: 6vw;
  }
}
</style>
