<template>
    <div class="chart-container" ref="container">
    </div>
</template>
<script>
import { COLORS2 } from '@/constants/colors';
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
    UIData: {
      handler: function() {
        this._refresh();
      },
      deep: true
    }
  },
  methods: {
    _refresh: function() {
      if (this.chart && this.UIData && this.UIData.history) {
        this.chart.series[0].update(
          {
            data: this.UIData.history['dropped']
          },
          false
        );
        this.chart.series[1].update(
          {
            data: this.UIData.history['wish']
          },
          false
        );
        this.chart.series[2].update(
          {
            data: this.UIData.history['on_hold']
          },
          false
        );
        this.chart.series[3].update(
          {
            data: this.UIData.history['doing']
          },
          false
        );
        this.chart.series[4].update(
          {
            data: this.UIData.history['collect']
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
          subject.eps.filter(ep => ep.type === 0 && ep.airdate).forEach(ep => {
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
          xDateFormat: '%Y-%m-%d',
          shared: true
        },
        subtitle: {
          enabled: false
        },
        plotOptions: {
          spline: {
            marker: {
              enabled: false
            }
          }
        },
        yAxis: {
          title: {
            enabled: false
          },
          labels: {
            format: '{value:.0f}'
          }
        },
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
          // layout: 'vertical',
          align: 'right',
          verticalAlign: 'bottom',
          itemStyle: {
            color: '#2c3e50',
            fontWeight: 'normal',
            fontSize: '1vw',
            fontFamily: `'source-han-serif-sc', serif`
          }
        },
        credits: {
          enabled: false
        },
        series: [
          {
            type: 'spline',
            name: '抛弃',
            data: this.UIData.history['dropped']
          },
          {
            type: 'spline',
            name: '想看',
            data: []
          },
          {
            type: 'spline',
            name: '搁置',
            data: []
          },
          {
            type: 'spline',
            name: '看过',
            data: []
          },
          {
            type: 'spline',
            name: '在看',
            data: []
          }
        ],
        colors: COLORS2,
        lang: {
          thousandsSep: ''
        }
      });
    });

    if (this.UIData && this.UIData.meta && this.UIData.meta.name)
      this._refresh();
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
