<template>
  <div class="chart-container" ref="container"></div>
</template>
<script>
import { COLORS2 } from '@/constants/colors';
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
    UIData: {
      handler: function () {
        this._refresh();
      },
      deep: true,
    },
  },
  methods: {
    _refresh: function () {
      if (this.chart && this.UIData && this.UIData.history) {
        this.chart.series[0].update(
          {
            data: this.UIData.history['dropped'],
          },
          false
        );
        this.chart.series[1].update(
          {
            data: this.UIData.history['wish'],
          },
          false
        );
        this.chart.series[2].update(
          {
            data: this.UIData.history['on_hold'],
          },
          false
        );
        this.chart.series[3].update(
          {
            data: this.UIData.history['collect'],
          },
          false
        );
        this.chart.series[4].update(
          {
            data: this.UIData.history['doing'],
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
          backgroundColor: null,
          zoomType: 'x',
        },
        title: {
          text: '',
          enabled: false,
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
          shared: true,
        },
        subtitle: {
          enabled: false,
        },
        plotOptions: {
          spline: {
            marker: {
              enabled: false,
            },
          },
          series: {
            turboThreshold: 365 * 10,
          },
        },
        yAxis: {
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
          // layout: 'vertical',
          align: 'right',
          verticalAlign: 'bottom',
          itemStyle: {
            color: '#2c3e50',
            fontWeight: 'normal',
            fontSize: '1vw',
            fontFamily: `'source-han-serif-sc', serif`,
          },
        },
        credits: {
          enabled: false,
        },
        series: [
          {
            type: 'spline',
            name: '抛弃',
            data: this.UIData.history['dropped'],
          },
          {
            type: 'spline',
            name: '想看',
            data: [],
          },
          {
            type: 'spline',
            name: '搁置',
            data: [],
          },
          {
            type: 'spline',
            name: '看过',
            data: [],
          },
          {
            type: 'spline',
            name: '在看',
            data: [],
          },
        ],
        colors: COLORS2,
        lang: {
          thousandsSep: '',
        },
      });
    });

    if (this.UIData && this.UIData.meta && this.UIData.meta.name)
      this._refresh();
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
