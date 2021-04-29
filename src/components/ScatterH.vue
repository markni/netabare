<template>
  <div class="wrapper">
    <div class="control">
      <div class="unit ">
        <div class="l">最早：</div>
        <vue-monthly-picker dateFormat="YYYY年M月" v-model="startYear">
        </vue-monthly-picker>
      </div>
      <div class="unit ">
        <div class="l">最晚：</div>
        <vue-monthly-picker dateFormat="YYYY年M月" v-model="endYear">
        </vue-monthly-picker>
      </div>
      <div class="unit ">
        <div class="l">最低评分：</div>
        <input type="number" v-model="startScore" />
      </div>
      <div class="unit ">
        <div class="l">最高评分：</div>
        <input type="number" v-model="endScore" />
      </div>
      <div class="unit ">
        <div class="l">符合条件：</div>
        <div>{{ matched }}</div>
      </div>
    </div>
    <overlay text="渲染中" animated="true" v-if="rendering" />
    <div class="chart-container" ref="container"></div>
  </div>
</template>
<script>
import { COLORS, PINK } from '@/constants/colors';
import VueMonthlyPicker from 'vue-monthly-picker';
import moment from 'moment';
// Load Highcharts
import Highcharts from 'highcharts';
import Boost from 'highcharts/modules/boost';
Boost(Highcharts);
import Overlay from '@/components/Overlay';
import _ from 'lodash';
import stats from 'stats-lite';
// Alternatively, this is how to load Highstock. Highmaps is similar.
// import Highcharts from 'highcharts/highstock';

export default {
  components: { Overlay, VueMonthlyPicker },
  data() {
    let startYear = _.round(this.$route.query.start_year || 0);
    let endYear = _.round(this.$route.query.end_year || 0);
    let startScore = _.round(this.$route.query.low || 0);
    let endScore = _.round(this.$route.query.high || 0);
    if (!endScore || endScore > 10) endScore = 10;
    if (!startScore || startScore < 1) startScore = 1;

    let defaultYear = moment().subtract(20,'year').year();

    startYear = moment()
      .year(startYear || defaultYear)
      .startOf('year');
    if (endYear) {
      endYear = moment()
        .year(endYear)
        .startOf('year');
    } else {
      endYear = moment();
    }
    return {
      chart: null,
      dic: {},
      startYear: startYear,
      endYear: endYear,
      startRank: 1,
      endRank: 9999,
      startScore: startScore,
      endScore: endScore,
      matched: 0,
      rendering: true
    };
  },
  watch: {
    UIData: function() {
      this._refresh('watch uidata');
    },
    startYear: function() {
      this._refresh();
    },
    endYear: function() {
      this._refresh();
    },
    startScore: function() {
      this._refresh();
    },
    endScore: function() {
      this._refresh();
    }
  },
  methods: {
    _refresh: function() {
      if (this.UIData) {
        this.UIData.forEach(
          ({ rank, air_date, bgmId, name, name_cn, score }) => {
            this.dic[rank] = { rank, bgmId, name, name_cn, score, air_date };
          }
        );
      }

      if (this.chart && this.UIData) {
        // console.log(`${new Date()} | entered fresh`);
        let matched = this.UIData.filter(
          ({ air_date, score }) =>
            moment(air_date) >= this.startYear &&
            moment(air_date) <= this.endYear &&
            score >= this.startScore &&
            score <= this.endScore
        ).map(({ air_date, score, rank }) => {
          return [
            moment(air_date).valueOf(),
            parseFloat(score.toFixed(4) + '' + _.padStart(rank, 4, '0'))
          ];
        });
        let yearly = {};
        let yearlyData = [];
        let std1Data = [];
        let std1DataNegative = [];
        this.UIData.forEach(({ air_date, score }) => {
          let year = moment(air_date).year();
          if (
            year >= moment(this.startYear).year() &&
            year <= moment(this.endYear).year()
          ) {
            if (!yearly[year]) yearly[year] = [];
            yearly[year].push(score);
          }
        });
        for (let key in yearly) {
          let x = moment()
            .year(key)
            .startOf('year')
            .valueOf();
          let std = stats.stdev(yearly[key]);
          yearlyData.push({
            x: x,
            y: _.mean(yearly[key])
          });
          std1Data.push({
            x: x,
            y: _.mean(yearly[key]) + std,
            std
          });
          std1DataNegative.push({
            x: x,
            y: _.mean(yearly[key]) - std,
            std
          });
        }
        this.matched = matched.length;
        this.chart.series[0].update(
          {
            data: matched
          },
          false
        );
        this.chart.series[2].update(
          {
            data: std1Data
          },
          false
        );
        this.chart.series[3].update(
          {
            data: std1DataNegative
          },
          false
        );
        this.chart.series[1].update(
          {
            data: yearlyData
          },
          true
        );
      }
    }
  },
  props: ['UIData'],
  mounted() {
    this.$nextTick(function() {
      Highcharts.setOptions({
        lang: {
          thousandsSep: '',
          resetZoom: '重置缩放'
        }
      });
      let self = this;
      this.chart = Highcharts.chart(this.$refs.container, {
        chart: {
          type: 'scatter',
          zoomType: 'xy',
          backgroundColor: null
        },
        boost: {
          useGPUTranslations: true,
          usePreAllocated: true
        },
        rangeSelector: {
          verticalAlign: 'top',
          x: 0,
          y: 0
        },
        title: {
          text: '',
          enabled: false
        },
        tooltip: {
          crosshairs: true,
          backgroundColor: 'black',
          borderColor: 'none',
          style: {
            color: 'white'
          },
          // xDateFormat: '%Y-%m-%d',
          formatter: function() {
            if (this.series.name === '年度均分') {
              return `${moment(this.x).year()}年均分：<b>${this.y.toFixed(
                2
              )}</b>`;
            }
            if (this.series.name === '+1 标准差') {
              let y = _.round(this.y, 2);
              let std = _.round(this.point.std, 2);

              return `${moment(
                this.x
              ).year()}年标准差：<b>${std}</b><br />68%的作品都在${_.round(
                y - std * 2,
                2
              )} ~ ${y}分之内`;
            }
            if (this.series.name === '-1 标准差') {
              let y = _.round(this.y, 2);
              let std = _.round(this.point.std, 2);

              return `${moment(
                this.x
              ).year()}年标准差：<b>${std}</b><br />68%的作品都在${y} ~ ${_.round(
                y + std * 2,
                2
              )}分之内`;
            }
            let rank = _.round(
              _.padEnd((this.y + '').split('.')[1], 8, '0').slice(-4)
            );

            if (!self.dic[rank]) {
              return `Error`;
            }

            return `<div class="scatter-tp-title"><b>${self.dic[rank].name_cn ||
              self.dic[rank]
                .name}</b></div><br /><div class="scatter-tp-body">首播：${moment(
              this.x
            ).format('Y.M.DD')}<br />排名：${rank}<br />均分：${
              self.dic[rank].score
            }</div>`;
          }
        },
        subtitle: {
          enabled: false
        },
        plotOptions: {
          spline: {
            marker: {
              enabled: false
            }
          },
          line: {
            marker: {
              symbol: 'circle'
            }
          },
          series: {
            cursor: 'pointer',
            animation: {
              complete: function() {
                // console.log(`${new Date()} | finished update`);
                self.rendering = false;
              }
            },
            point: {
              events: {
                click: function() {
                  let rank = _.round(
                    _.padEnd((this.y + '').split('.')[1], 8, '0').slice(-4)
                  );
                  if (this.series.name === '评分')
                    window.open(`/subject/${self.dic[rank].bgmId}`);
                }
              }
            }
          },
          scatter: {
            marker: {
              radius: 5,
              states: {
                hover: {
                  enabled: true,
                  // lineColor: 'rgb(100,100,100)',
                  fillColor: COLORS[8]
                }
              }
            },
            states: {
              hover: {
                marker: {
                  enabled: false
                }
              }
            },
            tooltip: {}
          }
        },
        yAxis: [
          {
            startOnTick: false,
            // reversed: true,
            title: {
              enabled: false
            },
            labels: {
              format: '{value:.1f}'
            }
          },
          {
            startOnTick: false,
            title: {
              enabled: false
            },
            labels: {
              format: '{value:.1f}'
            },
            opposite: true
          }
        ],
        xAxis: {
          type: 'datetime',

          dateTimeLabelFormats: {
            millisecond: '%m-%d',
            second: '%m-%d',
            minute: '%m-%d',
            hour: '%m-%d',
            day: '%m-%d',
            week: '%m-%d',
            month: '%Y-%m',
            year: '%Y'
          }
        },
        exporting: {
          enabled: false
        },
        legend: {
          display: true,
          position: 'bottom',
          align: 'right',
          itemStyle: {
            color: '#2c3e50',
            fontWeight: 'normal',
            fontSize: '1rem',
            fontFamily: `'source-han-serif-sc', serif`
          }
        },
        credits: {
          enabled: false
        },
        series: [
          {
            color: 'rgba(49, 148, 255, 0.4)',
            name: '评分',
            data: []
          },
          {
            type: 'line',
            color: PINK,
            name: '年度均分',
            data: []
          },
          {
            type: 'line',
            color: 'rgba(0,0,0,0.3)',
            name: '+1 标准差',
            data: [],
            dashStyle: 'longdashdot',
            step: true,
            marker: {
              enabled: false
            },
            visible: false
          },
          {
            type: 'line',
            color: 'rgba(0,0,0,0.3)',
            name: '-1 标准差',
            data: [],
            dashStyle: 'longdashdot',
            step: true,
            marker: {
              enabled: false
            },
            visible: false
          }
        ],
        colors: COLORS,
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 500
              },
              chartOptions: {
                legend: {
                  layout: 'horizontal',
                  align: 'center',
                  verticalAlign: 'bottom'
                }
              }
            }
          ]
        }
      });

      this._refresh('finish mount');
    });
  },
  updated() {
    //this._refresh('updated');
  }
};
</script>

<style scoped>
.wrapper {
  width: 100%;
  height: 100%;
}

.chart-container {
  width: 100%;
  height: 80vh;
}

.control {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
input {
  max-width: 50px;
  border: 0;
  /*border-bottom: 1px solid; */
  outline: 0;
  background: transparent;
}
.unit {
  min-width: 200px;
  margin-bottom: 10px;
  margin-right: 30px;
}
.l {
  font-weight: bold;
  font-size: larger;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
