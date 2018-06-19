<template>
    <div class="container">
        <div v-show="up.length">
        <h2>评分跌幅榜</h2>
        <h3>30天内评分下降最多的条目 (最后更新：{{lastUpdate}})</h3>
            <div class="row" v-for="(item,index) in down" :key="item.bgmId">
                <div class="index">{{index+1}}.</div>
                <div class="title"><router-link :to="{ path: 'subject/'+ item.bgmId}">{{item.subject.name_cn || item.subject.name}}</router-link></div>
                <div class="chart-cell">
                    <mini-score :UIData="item.history" />
                </div>
                <div class="score">{{item.history[0].score}}</div>
                <div class="delta blue">▾{{Math.abs(item.score).toFixed(2)}}</div>
            </div>
        <h2>评分涨幅榜</h2>
        <h3>30天内评分上升最多的条目, 是时候吹一波了 (最后更新：{{lastUpdate}})</h3>
            <div class="row" v-for="(item,index) in up" :key="item.bgmId">
                <div class="index">{{index+1}}.</div>
                <div class="title"><router-link :to="{ path: 'subject/'+ item.bgmId}">{{item.subject.name_cn || item.subject.name}}</router-link></div>
                <div class="chart-cell">
                    <mini-score :color="pink" :UIData="item.history" />
                </div>
                <div class="score">{{item.history[0].score}}</div>
                <div class="delta pink">▴{{Math.abs(item.score).toFixed(2)}}</div>
            </div>
        <back />
        </div>
        <transition name="fade">
            <overlay v-if="loading" text="读取中" float="true"></overlay>
        </transition>
    </div>
</template>

<script>
import { fetchTrending } from '@/utils/api';
import MiniScore from '@/components/MiniScore';
import Back from '@/components/Back';
import { PINK } from '@/constants/colors';
import Overlay from '@/components/Overlay';
import moment from 'moment';

let loadingTimer;

export default {
  name: 'Trending',
  components: { MiniScore, Overlay, Back },
  data: function() {
    return {
      up: [],
      down: [],
      loading: false,
      pink: PINK,
      lastUpdate: null
    };
  },
  mounted: function() {
    this._gedIVata();
  },
  methods: {
    _gedIVata: function() {
      loadingTimer = setTimeout(() => {
        this.loading = true;
      }, 300);
      fetchTrending().then(res => {
        if (res.data['error'] || !res.data.up || !res.data.up.length) {
          this.$router.replace('/404');
        } else {
          let data = res.data;
          this.up = data.up;
          this.down = data.down;
          if (data.up.length && data.up[0].history.length) {
            this.lastUpdate = moment(data.up[0].history[0].recordedAt).format(
              'YYYY-MM-DD'
            );
          }
        }
        if (loadingTimer) clearTimeout(loadingTimer);
        this.loading = false;
      });
    }
  }
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
  font-family: 'source-han-serif-sc', serif;
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
    width: 5vw;
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
