<template>
  <div class="chart-container" ref="container">
    <canvas ref="score"></canvas>
  </div>
</template>
<script>
import { PINK } from '@/constants/colors';
import _ from 'lodash';
import moment from 'moment';
// Load Highcharts
import Highcharts from '@/utils/highcharts';

export default {
  data() {
    return {
      chart: null,
      raw: [],
    };
  },
  watch: {
    UIData: function () {
      this._refresh();
    },
  },
  methods: {
    _refresh: function () {
      if (this.chart && this.UIData && this.UIData.history) {
        this.chart.series[0].update(
          {
            data: this.UIData.history,
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
              useHTML: true,
            },
          };

          // Clean up: Remove existing plot lines
          this.chart.xAxis[0].plotLinesAndBands.forEach((plotLine) => {
            this.chart.xAxis[0].removePlotLine(plotLine.id);
          });

          // Group episodes by airdate
          const episodesByDate = subject.eps
            .filter((ep) => ep.type === 0 && ep.airdate)
            .reduce((acc, ep) => {
              const airdateValue = moment(
                `${ep.airdate}T00:00:00+08:00`
              ).valueOf();
              if (!acc[airdateValue]) {
                acc[airdateValue] = [];
              }
              acc[airdateValue].push(ep);
              return acc;
            }, {});

          // Create a plot line for each group of episodes with the same airdate
          Object.entries(episodesByDate).forEach(([airdateValue, episodes]) => {
            let epOption = _.cloneDeep(plotOptions);
            epOption.value = Number(airdateValue);

            // Adjust label to list all episodes for this airdate
            epOption.label.text = episodes
              .map(
                (ep) =>
                  `<a target="_blank" href="https://bgm.tv/ep/${ep.id}">ep.${
                    ep.sort
                  } ${episodes.length > 1 ? '' : ep.name_cn || ep.name}</a>`
              )
              .join(', ');

            this.chart.xAxis[0].addPlotLine(epOption);
          });
        }
        // this.chart.data.datasets[0].data = this.UIData;
        // this.chart.update();
      }
    },
  },
  props: ['bgmId', 'UIData'],
  mounted() {
    this.$nextTick(function () {
      this.chart = Highcharts.chart(this.$refs.container, {
        chart: {
          zoomType: 'x',
          backgroundColor: null,
        },
        title: {
          text: '',
          enabled: false,
          backgroundColor: null,
        },
        tooltip: {
          crosshairs: true,
          backgroundColor: 'black',
          borderColor: 'none',
          style: {
            color: 'white',
          },
          useHTML: false,
          xDateFormat: '%Y-%m-%d',
        },
        subtitle: {
          enabled: false,
        },
        plotOptions: {
          line: {
            marker: {
              enabled: false,
            },
          },
          series: {
            turboThreshold: 365 * 10,
          },
        },
        yAxis: {
          reversed: true,
          title: {
            enabled: false,
          },
          labels: {
            format: '{value:.0f}',
          },
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
            year: '%m-%d',
          },
        },
        exporting: {
          enabled: false,
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
          enabled: false,
        },
        credits: {
          enabled: false,
        },
        series: [
          {
            step: true,
            name: '排名',
            data: [],
          },
        ],
        colors: [PINK],
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 500,
              },
              chartOptions: {
                legend: {
                  layout: 'horizontal',
                  align: 'center',
                  verticalAlign: 'bottom',
                },
              },
            },
          ],
        },
      });
      if (this.UIData && this.UIData.meta && this.UIData.meta.name)
        this._refresh();
    });
  },
  updated() {
    this._refresh();
  },
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>
