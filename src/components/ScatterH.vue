<template>
    <div class="wrapper">
        <div class="control">
            <div class="unit">
                <div class="l">最早：</div>
                <vue-monthly-picker
                        dateFormat="YYYY年M月"
                        v-model="startYear">
                </vue-monthly-picker>
            </div>
            <div class="unit">
                <div class="l">最晚：</div>
                <vue-monthly-picker
                        dateFormat="YYYY年M月"
                        v-model="endYear">
                </vue-monthly-picker>
            </div>
            <div class="unit">
                <div class="l">最低评分：</div>
                <input type="number" v-model="startScore"/>
            </div>
            <div class="unit">
                <div class="l">最高评分：</div>
                <input type="number" v-model="endScore"/>
            </div>
            <div class="unit">
                <div class="l">符合条件：</div>
                <div>{{matched}}</div>
            </div>
        </div>
        <div class="chart-container" ref="container"></div>

    </div>
</template>
<script>
import { COLORS, PINK } from '@/constants/colors';
import VueMonthlyPicker from 'vue-monthly-picker';
import moment from 'moment';
// Load Highcharts
import Highcharts from 'highcharts';
import Overlay from '@/components/Overlay';
import _ from 'lodash';
// Alternatively, this is how to load Highstock. Highmaps is similar.
// import Highcharts from 'highcharts/highstock';

export default {
  components: { Overlay, VueMonthlyPicker },
  data() {
    let startYear = this.$route.query.start_year;
    let endYear = this.$route.query.end_year;
    let startScore = this.$route.query.low;
    let endScore = this.$route.query.high;

    if(!endScore || endScore > 10) endScore = 10;
    if(!startScore || startScore < 1) startScore = 1;

    startYear = moment()
      .year(startYear || 1980)
      .startOf('year');
    endYear = moment();
    return {
      chart: null,
      dic: {},
      startYear: startYear,
      endYear: endYear,
      startRank: 1,
      endRank: 9999,
      startScore: startScore,
      endScore: endScore,
      matched: 0
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
    _refresh: function(from) {
      if (this.UIData) {
        this.UIData.forEach(
          ({ rank, air_date, bgmId, name, name_cn, score }) => {
            this.dic[rank] = { rank, bgmId, name, name_cn, score, air_date };
          }
        );
      }

      if (this.chart && this.UIData) {
        let matched = this.UIData.filter(
          ({ air_date, score }) =>
            moment(air_date) >= this.startYear &&
            moment(air_date) <= this.endYear &&
            score >= this.startScore &&
            score <= this.endScore
        ).map(({ air_date, score, rank, name }) => {
          let s = parseFloat(score.toFixed(4) + '' + _.padStart(rank, 4, '0'));
          return [
          moment(air_date).valueOf(),
          parseFloat(score.toFixed(4) + '' + _.padStart(rank, 4, '0'))
        ]});
        let yearly = {};
        let yearlyData = [];
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
          yearlyData.push({
            x: moment()
              .year(key)
              .startOf('year')
              .valueOf(),
            y: _.mean(yearly[key])
          });
        }
        this.matched = matched.length;
        this.chart.series[0].update(
          {
            data: matched
          },
          false
        );
        this.chart.series[1].update(
          {
            data: yearlyData
          },
          true
        );
        // this.chart.data.datasets[0].data = this.UIData;
        // this.chart.update();
      }
    }
  },
  props: ['UIData'],
  mounted() {
    this.$nextTick(function() {
      Highcharts.setOptions({
        lang: {
          thousandsSep: ''
        }
      });
      let self = this;
      this.chart = Highcharts.chart(this.$refs.container, {
        chart: {
          type: 'scatter',
          zoomType: 'xy'
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
              return `${moment(this.x).year()}年均分:<b>${this.y.toFixed(
                2
              )}</b>`;
            }
            let rank = _.round((_.padEnd((this.y + '').split('.')[1],8,'0').slice(-4)));

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
          series: {
            cursor: 'pointer',
            point: {
              events: {
                click: function() {
                  let rank = _.round((_.padEnd((this.y + '').split('.')[1],8,'0').slice(-4)));
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
          align: 'right'
        },
        credits: {
          enabled: false
        },
        series: [
          {
            color: 'rgba(49, 148, 255, 0.4)',
            name: '排名',
            data: []
          },
          {
            type: 'line',
            color: PINK,
            name: '年度均分',
            data: []
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
  font-family: 'source-han-serif-sc', serif;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
input {
  max-width: 50px;
  border: 0;
  /*border-bottom: 1px solid; */
  outline: 0;
}
.unit {
  min-width: 200px;
  margin-bottom: 10px;
}
.l {
  font-weight: bold;
  font-size: larger;
}
</style>
