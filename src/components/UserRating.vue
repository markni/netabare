<template>
    <div class="wrapper">
        <div class="chart-container">
            <transition name="fade">
                <overlay v-if="!raw" text="读取中" float="true"></overlay>
            </transition>
            <canvas ref="bar"></canvas>
        </div>
        <div class="info-card">
            <avatar :user="raw.user" v-if="raw" />
            <div v-if="raw" class="nickname typekit-text">{{raw.user.nickname}}</div>
            <div v-if="raw" class="subtitle typekit-text">看过</div>
            <div v-if="raw" class="score typekit-text">{{raw.total}}</div>
            <div v-if="raw" class="subtitle typekit-text">已评</div>
            <div v-if="raw" class="score typekit-text">{{((raw.total - raw.count[-1])/raw.total*100).toFixed(0)}}<span class="percent">%</span></div>
            <div v-if="raw" class="subtitle typekit-text">均值</div>
            <div v-if="raw" class="score typekit-text">{{raw.avg}}</div>
            <div v-if="raw" class="subtitle typekit-text">中值</div>
            <div v-if="raw" class="score typekit-text">{{raw.median}}</div>
            <div v-if="raw" class="subtitle typekit-text">标准差</div>
            <div v-if="raw" class="score typekit-text">{{raw.stdev}}</div>
        </div>
    </div>

</template>
<script>
import Chart from 'chart.js';
import Overlay from '@/components/Overlay';
import Avatar from '@/components/Avatar';
import { fetchUser } from '@/untils/api';

const options = {
  legend: {
    display: false
  },
  maintainAspectRatio: false,
  scales: {
    xAxes: [
      {
        // type: 'time'
      }
    ],
    yAxes: [
      {
        ticks: {
          beginAtZero: true
        }
      }
    ]
  }
};

const chartData = {
  labels: [...Array(10 + 1).keys()].slice(1), //cool trick to get array 1 to 10, https://stackoverflow.com/questions/3746725/create-a-javascript-array-containing-1-n
  datasets: [
    {
      backgroundColor: [
        '#3094FF',
        '#4683EE',
        '#5B73DE',
        '#7162CE',
        '#8652BE',
        '#9C41AE',
        '#B1319E',
        '#C7208E',
        '#DC107E',
        '#F2006E'
      ],
      data: []
    }
  ]
};

export default {
  data() {
    return {
      chart: null,
      raw: null
    };
  },
  components: {
    Overlay,
    Avatar
  },
  props: ['bgmUserId'],
  methods: {
    _getRaw: function() {
      if (this.bgmUserId) {
        fetchUser(this.bgmUserId).then(res => {
          setTimeout(() => {
            if (res.data['error']) {
              this.$router.replace('/404');
            } else {
              this.raw = res.data;
              if (this.raw['user'] && this.chart) {
                let r = [];
                for (let key in this.raw.count) {
                  if (key !== '-1') {
                    r.push({ x: key, y: this.raw.count[key] });
                  }
                }

                this.chart.data.datasets[0].data = r;
                this.chart.update();
              }
            }
          }, 1000);
        });
      }
    }
  },
  watch: {
    bgmUserId: function() {
      this.raw = null;
      this._getRaw();
    }
  },
  mounted() {
    this.$nextTick(function() {
      const ctx = this.$refs.bar.getContext('2d');
      this.chart = new Chart(ctx, { type: 'bar', data: chartData, options });
      this._getRaw();
    });
  },
  updated() {
    console.log('updated');
  }
};
</script>

<style scoped>
.wrapper {
  display: flex;
}
.chart-container {
  width: 80vw;
  height: 100vh;
}

.info-card {
  width: 20vw;
  padding-top: 5vh;
  padding-right: 5vw;
  box-sizing: border-box;
  text-align: right;
}

.nickname {
  font-size: 6vh;
  font-weight: bold;
}

.subtitle {
  font-size: 2vh;
}

.score {
  font-size: 4vh;
  line-height: 1;
  margin-bottom: 1vh;
}

.percent {
  font-size: 2vh;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
