<template>
  <div class="chart-container" ref="container">
    <canvas ref="score"></canvas>
  </div>
</template>
<script>
import { COLORS } from '@/constants/colors';
import _ from 'lodash';
import moment from 'moment';
// Load Highcharts
import Highcharts from 'highcharts';
// Alternatively, this is how to load Highstock. Highmaps is similar.
// import Highcharts from 'highcharts/highstock';

export default {
  data() {
    return {
      chart: null,
      raw: []
    };
  },
  watch: {
    UIData: function() {
      this._refresh();
    }
  },
  methods: {
    _refresh: function() {
      if (this.chart && this.UIData && this.UIData.history) {
        // console.log(JSON.stringify(this.UIData.one, null, '  '));
        this.chart.series[1].update(
          {
            data: this.UIData.one
          },
          false
        );
        this.chart.series[2].update(
          {
            data: this.UIData.ten
          },
          false
        );
        this.chart.series[0].update(
          {
            data: this.UIData.history
          },
          true
        );
        let subject = this.UIData.meta;
        if (subject && subject.eps && subject.eps.length) {
          const plotOptions = {
            color: 'rgba(0,0,0,0.1)',
            width: 2,
            dashStyle: 'longdashdot',
            label: {
              verticalAlign: 'bottom',
              textAlign: 'right',
              y: -10,
              x: 5,
              useHTML: true
            }
          };
          subject.eps
            .filter(ep => ep.type === 0 && ep.airdate)
            .forEach(ep => {
              let epOption = _.cloneDeep(plotOptions);
              epOption.label.text = `<a target="_blank" href="https://bgm.tv/ep/${
                ep.id
              }">ep. ${ep.sort}</a>`;
              epOption.value = moment(`${ep.airdate}T00:00:00+08:00`).valueOf();
              this.chart.xAxis[0].addPlotLine(epOption);
              //this.chart.xAxis[0].update();
            });
        }
        // this.chart.data.datasets[0].data = this.UIData;
        // this.chart.update();
      }
    }
  },
  props: ['bgmId', 'UIData'],
  mounted() {
    this.$nextTick(function() {
      Highcharts.setOptions({
        lang: {
          thousandsSep: ''
        }
      });
      this.chart = Highcharts.chart(this.$refs.container, {
        chart: {
          backgroundColor: null
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
          useHTML: false,
          xDateFormat: '%Y-%m-%d'
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
          series: {
            turboThreshold: 365*10
          }
        },
        yAxis: [
          {
            title: {
              enabled: false
            },
            labels: {
              format: '{value:.2f}'
            }
          },
          {
            title: {
              enabled: false
            },
            labels: {
              format: '{value:.0f}'
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
            month: '%m-%d',
            year: '%m-%d'
          }
        },
        exporting: {
          enabled: false
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
          enabled: false
        },
        credits: {
          enabled: false
        },
        series: [
          {
            type: 'spline',
            name: '评分',
            yAxis: 0,
            data: []
          },
          {
            type: 'spline',
            name: '1分',
            yAxis: 1,
            data: [],
            color: 'rgba(0,0,0, 0.1)',
            dashStyle: 'dot'
          },
          {
            type: 'spline',
            name: '10分',
            yAxis: 1,
            data: [],
            dashStyle: 'longdashdot',
            color: 'rgba(0,0,0, 0.1)'
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

      // Highcharts.chart(this.$refs.container, {
      //
      //   xAxis: {
      //     type: 'datetime'
      //   },
      //
      //   tooltip: {
      //     xDateFormat: '%Y-%m-%d',
      //     shared: true
      //   },
      //
      //   plotOptions: {
      //     series: {
      //       pointStart: Date.UTC(2012, 0, 1),
      //       pointInterval: 24 * 3600 * 1000
      //     }
      //   },
      //
      //   series: [{
      //     data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
      //   }, {
      //     data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4].reverse()
      //   }]
      //
      // });
      this._refresh();
    });
  },
  updated() {
    this._refresh();
  }
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>
