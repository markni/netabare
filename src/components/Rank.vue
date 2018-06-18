<template>
    <div class="chart-container">

    <canvas ref="rank"></canvas>
    </div>
</template>
<script>
import Chart from 'chart.js';
import { PINK } from '@/constants/colors';
import { fetchRank } from '@/untils/api';

const options = {
  legend: {
    display: false
  },
  maintainAspectRatio: false,
  scales: {
    xAxes: [
      {
        type: 'time',
        time: {
          displayFormats: {
            // 'millisecond': ' DD',
            // 'second': ' DD',
            // 'minute': ' DD',
            // 'hour': ' DD',
            day: 'M-DD'
            // 'week': ' DD',
            // 'month': ' DD',
            // 'quarter': ' DD',
            // 'year': ' DD',
          }
        }
      }
    ],
    yAxes: [
      {
        ticks: {
          reverse: true
        }
      }
    ]
  }
};

const chartData = {
  datasets: [
    {
      label: false,
      borderColor: PINK,
      fill: false,
      data: []
    }
  ]
};

export default {
  data() {
    return {
      chart: null
    };
  },
  methods: {
    _refresh: function() {
      if (this.chart && this.UIData) {
        this.chart.data.datasets[0].data = this.UIData;
        this.chart.update();
      }
    }
  },
  watch: {
    UIData: function() {
      this._refresh();
    }
  },
  props: ['bgmId', 'UIData'],
  mounted() {
    this.$nextTick(function() {
      const ctx = this.$refs.rank.getContext('2d');
      this.chart = new Chart(ctx, { type: 'line', data: chartData, options });
    });
    if (this.bgmId) {
      fetchRank(this.bgmId).then(res => {
        this.raw = res.data.history;
        if (this.raw.length && this.chart) {
          let ranks = this.raw.filter(r => !!r.rank).map(r => {
            let y = r.rank;
            let x = new Date(r.recordedAt);
            return { x, y };
          });
          this.chart.data.datasets[0].data = ranks;
          this.chart.update();
        }
      });
    }
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
}
</style>
