<template>
  <div>
    <transition name="fade">
      <div class="container" v-show="subjectData.name">
        <h1 class=" title">
          <a target="_blank" :href="'https://bgm.tv/subject/' + id">{{
            subjectData.name
          }}</a>
        </h1>
        <h2 class="subtitle">{{ subjectData.name_cn }}</h2>

        <div class="rangeBtns">
          <div
            :class="{ active: filtered === 'none' }"
            @click="_setFiltered(`none`)"
          >
            全部
          </div>
          <div
            :class="{ active: filtered === 'eps' }"
            @click="_setFiltered('eps')"
          >
            放送期间
          </div>
        </div>

        <div class="score-chart">
          <div class=" minititle">
            评分
            <span
              v-if="!isNaN(subjectData.deltaScore)"
              class="delta"
              :class="{
                pink: subjectData.deltaScore >= 0,
                blue: subjectData.deltaScore < 0
              }"
              title="30天之内的评分变化"
              >{{ subjectData.deltaScoreStr }}</span
            >
          </div>
          <div class=" em">{{ subjectData.score }}</div>

          <score :UIData="filteredScoreData"></score>
        </div>
        <div class="rank-chart">
          <div class=" minititle">
            排名
            <span
              v-if="!isNaN(subjectData.deltaRank)"
              class="delta"
              :class="{
                pink: subjectData.deltaRank <= 0,
                blue: subjectData.deltaRank > 0
              }"
              title="30天之内的排名变化"
              >{{ subjectData.deltaRankStr }}</span
            >
          </div>
          <div class=" em">{{ subjectData.rank }}</div>

          <rank :UIData="filteredRankData"></rank>
        </div>
        <div class="collection-chart">
          <div class=" minititle">
            在看
            <span
              v-if="!isNaN(subjectData.deltaWatching)"
              class="delta"
              :class="{
                pink: subjectData.deltaWatching >= 0,
                blue: subjectData.deltaWatching < 0
              }"
              title="30天之内的变化"
              >{{ subjectData.deltaWatchingStr }}</span
            >
          </div>
          <div class=" em">{{ subjectData.watching }}</div>
          <collection :UIData="filteredCollectionData"></collection>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <overlay v-if="loading" text="读取中" animated="true"></overlay>
    </transition>
    <back class="" v-if="subjectData.name && !loading" />
  </div>
</template>

<script>
import _ from 'lodash';
import { fetchRank } from '@/utils/api';
import Overlay from '@/components/Overlay';
import Rank from '@/components/RankH';
import Score from '@/components/ScoreH';
import Collection from '@/components/CollectionH';
import SubjectStats from '@/components/SubjectStats';
import Back from '@/components/Back';
import moment from 'moment';

let loadingTimer;

export default {
  data: function() {
    return {
      oneWeekBeforeFirstEpTimestamp: 0, //ms since epoch
      oneWeekAfterLastEpTimestamp: Infinity, //ms since epoch
      filtered: 'none',
      loading: false,
      scoreData: [],
      rankData: [],
      subjectData: {},
      collectionData: {
        history: {
          wish: [],
          collect: [],
          doing: [],
          on_hold: [],
          dropped: []
        },
        meta: {}
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
    Collection,
    Back
  },
  mounted: function() {
    this._getData();
  },
  watch: {
    id: function() {
      this._getData();
    }
  },
  methods: {
    _filterDataByEpsTimestamp: function(data) {
      return data.filter(
        d =>
          d.x >= this.oneWeekBeforeFirstEpTimestamp &&
          d.x <= this.oneWeekAfterLastEpTimestamp
      );
    },
    _getData: function() {
      loadingTimer = setTimeout(() => {
        this.loading = true;
      }, 600);
      if (this.id) {
        fetchRank(this.id).then(res => {
          if (
            res.data['error'] ||
            res.data.length === 0 ||
            res.data.history.length === 0
          ) {
            this.$router.replace('/404');
          } else {
            let data = res.data;
            let subject = data.subject;

            // Set the oneWeekBeforeFirstEpTimestamp to 1 week before the first episode's airdate
            this.oneWeekBeforeFirstEpTimestamp =
              subject && subject.eps && subject.eps[0].airdate
                ? moment(subject.eps[0].airdate)
                    .subtract(1, 'weeks')
                    .valueOf()
                : 0;

            // Set the oneWeekAfterLastEpTimestamp to 1 week after the last episode's airdate
            this.oneWeekAfterLastEpTimestamp =
              subject &&
              subject.eps &&
              subject.eps[subject.eps.length - 1].airdate
                ? moment(subject.eps[subject.eps.length - 1].airdate)
                    .add(1, 'weeks')
                    .valueOf()
                : Infinity;

            if (data.history) {
              this.rankData = {
                history: data.history
                  .filter(r => !!r.rank)
                  .map(r => {
                    let y = r.rank;
                    let x = moment(r.recordedAt).valueOf();
                    return { x, y };
                  })
                  .reverse(),
                meta: data.subject
              };
              this.scoreData = {
                history: data.history
                  .filter(r => !!r.score)
                  .map(r => {
                    let y = r.score;
                    let x = moment(r.recordedAt).valueOf();
                    return { x, y };
                  })
                  .reverse(),
                meta: data.subject
              };
              this.scoreData.one = [];
              this.scoreData.ten = [];
              data.history.forEach(h => {
                if (h.collect) {
                  for (let key in h.collect) {
                    let y = h.collect[key];
                    let x = moment(h.recordedAt).valueOf();
                    this.collectionData['history'][key].push({ x, y });
                  }
                }
                if (h.rating && h.rating.count) {
                  let ten = h.rating.count[10] || 0;
                  let one = h.rating.count[1] || 0;
                  let x = moment(h.recordedAt).valueOf();
                  this.scoreData.one.push({ x, y: one });
                  this.scoreData.ten.push({ x, y: ten });
                }
              });
              this.scoreData.one.reverse();
              this.scoreData.ten.reverse();
              for (let key in this.collectionData['history']) {
                this.collectionData['history'][key] = this.collectionData[
                  'history'
                ][key].reverse();
              }
              this.collectionData.meta = data.subject;
            }
            if (data.subject) {
              let { subject } = data;
              this.subjectData = {
                name: subject.name,
                name_cn: subject.name_cn,
                score: data.history[0].score,
                rank: data.history[0].rank,
                watching: data.history[0].collect.doing
              };
              if (data.history.length >= 30) {
                let current = _.first(data.history);
                let before = _.nth(data.history, 29);

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
    },
    _setFiltered: function(filtered) {
      this.filtered = filtered;
    }
  },
  computed: {
    filteredScoreData: function() {
      if (this.filtered === 'eps') {
        const filteredData = {
          ...this.scoreData, // Spread the scoreData object to retain all its properties
          history: this._filterDataByEpsTimestamp(this.scoreData.history),
          ten: this._filterDataByEpsTimestamp(this.scoreData.ten),
          one: this._filterDataByEpsTimestamp(this.scoreData.one)
        };

        // Log the filtered data for debugging
        return filteredData;
      } else {
        return _.cloneDeep(this.scoreData); // Return the full scoreData object
      }
    },
    filteredRankData: function() {
      if (this.filtered === 'eps') {
        // Filter the history data based on the condition
        return {
          ...this.rankData, // Spread the rankData object to retain all its properties
          history: this._filterDataByEpsTimestamp(this.rankData.history)
        };
      } else {
        return _.cloneDeep(this.rankData); // Return the full rankData object
      }
    },
    filteredCollectionData: function() {
      if (this.filtered === 'eps') {
        return {
          history: {
            wish: this._filterDataByEpsTimestamp(
              this.collectionData.history.wish
            ),
            collect: this._filterDataByEpsTimestamp(
              this.collectionData.history.collect
            ),
            doing: this._filterDataByEpsTimestamp(
              this.collectionData.history.doing
            ),
            on_hold: this._filterDataByEpsTimestamp(
              this.collectionData.history.on_hold
            ),
            dropped: this._filterDataByEpsTimestamp(
              this.collectionData.history.dropped
            )
          },
          meta: this.collectionData.meta
        };
      } else {
        return _.cloneDeep(this.collectionData);
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
  /*margin-left: -8vw;*/
  height: 30vw;
  margin-bottom: 5vh;
}

.rank-chart {
  /*margin-right: -8vw;*/
  height: 30vw;
  margin-bottom: 5vh;
  margin-top: 10vh;
}
.collection-chart {
  /*margin-left: -8vw;*/

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

.rangeBtns {
  display: flex;
  justify-content: flex-start;
  gap: 8px;
  padding-left: 5px;
  div {
    padding: 0;
    border: none;
    font-size: 1vmax;
    border-radius: 4px;
    cursor: pointer;
    text-underline-offset: 10px;
    &.active,
    &:hover {
      text-decoration: underline;
      text-decoration-color: #f2006e;
    }
  }
}
</style>
