<template>
  <div class="chart-container" ref="container"></div>
</template>

<script>
import { COLORS } from '@/constants/colors';
import _ from 'lodash';
import moment from 'moment';
import Highcharts from 'highcharts';

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
      // Check if the chart and UIData with history exist
      if (this.chart && this.UIData && this.UIData.history) {
        // Update the chart series with new data
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

        // Get the subject data from UIData
        let subject = this.UIData.meta;

        // If the subject has episodes data, add plot lines for episode airdates
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

          // Remove existing plot lines from the chart
          this.chart.xAxis[0].plotLinesAndBands.forEach(plotLine => {
            this.chart.xAxis[0].removePlotLine(plotLine.id);
          });

          // Group episodes by airdate
          const episodesByDate = subject.eps
            .filter(ep => ep.type === 0 && ep.airdate)
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

            // Set the label text to list all episodes for this airdate
            epOption.label.text = episodes
              .map(
                ep =>
                  `<a target="_blank" href="https://bgm.tv/ep/${ep.id}">ep.${
                    ep.sort
                  } ${episodes.length > 1 ? '' : ep.name_cn || ep.name}</a>`
              )
              .join(', ');

            this.chart.xAxis[0].addPlotLine(epOption);
          });
        }
      }
    }
  },
  props: ['bgmId', 'UIData'], // Declare the props
  mounted() {
    this.$nextTick(function() {
      // Set Highcharts options
      Highcharts.setOptions({
        lang: {
          thousandsSep: ''
        }
      });

      // Create the chart instance
      this.chart = Highcharts.chart(this.$refs.container, {
        // Chart configuration options
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
            turboThreshold: 365 * 10
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
        colors: COLORS, // Use the COLORS constant
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

      // Refresh the chart with initial data
      this._refresh();
    });
  },
  beforeDestroy() {
    // Destroy the chart instance when the component is destroyed
    if (this.chart) {
      this.chart.destroy();
    }
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
