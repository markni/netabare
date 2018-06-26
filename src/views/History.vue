<template>
    <div>
    <transition name="fade">
    <div class="container" >

        <div class="score-chart">
            <scatter :UIData="UIData"></scatter>
        </div>
    </div>

    </transition>
    <transition name="fade">
        <overlay v-if="loading" text="读取中" animated="true"></overlay>
    </transition>
    <back  class="" v-if="UIData && !loading" />
    </div>
</template>

<script>
import { fetchHistory } from '@/utils/api';
import Overlay from '@/components/Overlay';
import Scatter from '@/components/ScatterH';
import SubjectStats from '@/components/SubjectStats';
import Back from '@/components/Back';

let loadingTimer;

export default {
  data: function() {
    return {
      loading: false,
      UIData: null
    };
  },
  props: ['id'],
  name: 'Subject',
  components: {
    Overlay,
    Scatter,
    SubjectStats,
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
    _getData: function() {
      loadingTimer = setTimeout(() => {
        this.loading = true;
      }, 600);
      console.log(`${new Date()} | starting loading from api`);
      fetchHistory().then(res => {
        console.log(`${new Date()} | finished loading api`);
        if (res.data['error']) {
          this.$router.replace('/404');
        } else {
          let data = res.data;
          this.UIData = data.map(
            ({ bgmId, name, name_cn, rank, air_date, score }) => {
              return {
                score,
                bgmId,
                name,
                name_cn,
                air_date,
                rank
              };
            }
          );

          if (loadingTimer) clearTimeout(loadingTimer);
          this.loading = false;
        }
      });
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 90vw;
  margin: auto;
  padding-top: 2vh;
}
.score-chart {
  /*margin-left: -8vw;*/
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
</style>
