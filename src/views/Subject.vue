<template>
    <div>
    <transition name="fade">
    <div class="container" v-show="subjectData.name">
        <h1 class="typekit-text title">{{subjectData.name}}</h1>
        <h2 class="typekit-text subtitle">{{subjectData.name_cn}}</h2>

        <div class="score-chart">
            <div class="typekit-text minititle">评分 <span class="delta" :class="{pink: (subjectData.deltaScore >=0), blue: subjectData.deltaScore < 0}"  title="2周之内的评分变化">{{subjectData.deltaScoreStr}}</span></div>
            <div class="typekit-text em">{{subjectData.score}}</div>

            <score :UIData="scoreData"></score>

        </div>
        <div class="rank-chart">
            <div class="typekit-text minititle">排名 <span class="delta" :class="{pink: (subjectData.deltaRank <=0), blue: subjectData.deltaRank > 0}" title="2周之内的排名变化">{{subjectData.deltaRankStr}}</span></div>
            <div class="typekit-text em">{{subjectData.rank}}</div>

            <rank :UIData="rankData"></rank>
        </div>
        <div class="collection-chart">
            <div class="typekit-text minititle">在看 <span class="delta" :class="{pink: (subjectData.deltaWatching >=0), blue: subjectData.deltaWatching < 0}" title="2周之内的变化">{{subjectData.deltaWatchingStr}}</span></div>
            <div class="typekit-text em">{{subjectData.watching}}</div>
            <collection :UIData="collectionData"></collection>
        </div>
    </div>
    </transition>
    <transition name="fade">
        <overlay v-if="loading" text="读取中" float="true"></overlay>
    </transition>
    </div>
</template>

<script>
import _ from 'lodash';
import { fetchRank } from '@/untils/api';
import Overlay from '@/components/Overlay';
import Rank from '@/components/Rank';
import Score from '@/components/Score';
import Collection from '@/components/Collection';
import SubjectStats from '@/components/SubjectStats';
let loadingTimer;

export default {
  data: function() {
    return {
      loading: false,
      scoreData: [],
      rankData: [],
      subjectData: {},
      collectionData: {
        wish: [],
        collect: [],
        doing: [],
        on_hold: [],
        dropped: []
      }
    };
  },
  props: ['id'],
  name: 'Subject',
  components: {
    Overlay,
    Rank,
    Score,
    SubjectStats,
    Collection
  },
  mounted: function() {
    this._getData();
  },
  watch: {
    id: function() {
      console.log('route updated');
      this._getData();
    }
  },
  methods: {
    _getData: function() {
      loadingTimer = setTimeout(() => {
        this.loading = true;
      }, 600);
      if (this.id) {
        fetchRank(this.id).then(res => {
          console.log(res.data);
          if (
            res.data['error'] ||
            res.data.length === 0 ||
            res.data.history.length === 0
          ) {
            this.$router.replace('/404');
          } else {
            let data = res.data;
            if (data.history) {
              this.rankData = data.history.filter(r => !!r.rank).map(r => {
                let y = r.rank;
                let x = new Date(r.recordedAt);
                return { x, y };
              });
              this.scoreData = data.history.filter(r => !!r.score).map(r => {
                let y = r.score;
                let x = new Date(r.recordedAt);
                return { x, y };
              });
              data.history.forEach(h => {
                if (h.collect) {
                  for (let key in h.collect) {
                    let y = h.collect[key];
                    let x = new Date(h.recordedAt);
                    this.collectionData[key].push({ x, y });
                  }
                }
              });
              console.log('setting UIData...');
            }
            if (data.subject) {
              let { subject } = data;
              this.subjectData = {
                name: subject.name,
                name_cn: subject.name_cn,
                score: subject.rating.score,
                rank: subject.rank,
                watching: subject.collection.doing
              };
              if (data.history.length >= 14) {
                let current = _.first(data.history);
                let before = _.nth(data.history, 13);
                console.log(current, before);
                this.subjectData.deltaScore = current.score - before.score;
                if (this.subjectData.deltaScore >= 0)
                  this.subjectData.deltaScoreStr =
                    '▴' + this.subjectData.deltaScore.toFixed(2);
                else {
                  this.subjectData.deltaScoreStr =
                    '▾' + Math.abs(this.subjectData.deltaScore.toFixed(2));
                }
                this.subjectData.deltaRank = current.rank - before.rank;
                if (this.subjectData.deltaRank > 0)
                  this.subjectData.deltaRankStr =
                    '▾' + this.subjectData.deltaRank;
                else {
                  this.subjectData.deltaRankStr =
                    '▴' + Math.abs(this.subjectData.deltaRank);
                }
                this.subjectData.deltaWatching =
                  current.collect.doing - before.collect.doing;
                if (this.subjectData.deltaWatching > 0)
                  this.subjectData.deltaWatchingStr =
                    '▴' + this.subjectData.deltaWatching;
                else {
                  this.subjectData.deltaWatchingStr =
                    '▾' + Math.abs(this.subjectData.deltaWatching);
                }
              }
            }
            if (loadingTimer) clearTimeout(loadingTimer);
            this.loading = false;
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 80vw;
  margin: auto;
  padding-top: 2vh;
}
.score-chart {
  margin-left: -8vw;
  height: 30vw;
  margin-bottom: 5vh;
}

.rank-chart {
  margin-right: -8vw;
  height: 30vw;
  margin-bottom: 5vh;
  margin-top: 10vh;
}
.collection-chart {
  margin-left: -8vw;

  height: 30vw;
  margin-bottom: 5vh;
  margin-top: 10vh;
}
.title {
  font-size: 4vmax;
  line-height: 1.2;
  margin: 0;
  text-align: left;
}
.subtitle {
  font-size: 2vmax;
  line-height: 1.2;
  margin: 0;
  margin-top: 2vh;
  margin-bottom: 4vh;
  padding-left: 5px;
  text-align: left;
}
.minititle {
  font-size: 1.2vmax;
  line-height: 1.2;
}
.score-chart > .minititle {
  text-align: right;
  padding-right: 0.2vmax;
}
.collection-chart > .minititle {
  text-align: right;
  padding-right: 0.2vmax;
}
.rank-chart > .minititle {
  text-align: left;
}
.em {
  font-weight: bold;
  font-size: 3vmax;
  overflow: hidden;
  line-height: 1;
  margin-bottom: 2vh;
}
.rank-chart > .em {
  text-align: left;
}
.score-chart > .em {
  text-align: right;
}
.collection-chart > .em {
  text-align: right;
}
.delta {
  font-size: 1.1vmax;
}
.delta:hover {
  text-decoration: underline;
  cursor: help;
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
</style>
