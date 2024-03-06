<template>
  <div class="chart-container" ref="container"></div>
</template>
<script>
import { COLORS } from '@/constants/colors';

import Highcharts from 'highcharts';

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
      console.log(this.UIData);
      if (this.chart && this.UIData.data) {
        this.chart.series[0].setData(this.UIData.data);
      }
      if (this.chart && this.UIData.data && this.chart.series[1].visible) {
        this.chart.series[1].setData(this.UIData.gData);
      }
    },
  },
  props: ['bgmId', 'UIData'],
  mounted() {
    this.$nextTick(function () {
      Highcharts.setOptions({
        lang: {
          thousandsSep: '',
        },
      });
      this.chart = Highcharts.chart(this.$refs.container, {
        chart: {
          type: 'column',
          backgroundColor: null,
        },
        title: {
          text: '',
          enabled: false,
        },
        tooltip: {
          backgroundColor: 'black',
          borderColor: 'none',
          style: {
            color: 'white',
          },
          formatter: function () {
            return `${this.x}分：<b>${this.y}</b>`;
          },
        },
        subtitle: {
          enabled: false,
        },
        plotOptions: {
          column: {
            colorByPoint: true,
            pointPadding: 0,
            dataLabels: {
              enabled: false,
            },
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
        xAxis: {},
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
            name: '个人评分',
            data: [],
            colors: COLORS,
          },
          {
            name: '全站评分',
            data: [],
            colors: ['rgba(0, 0, 0, 0.2)'],
            visible: false,
          },
        ],
        colors: COLORS,
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
      if (this.UIData.data) this._refresh();
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
