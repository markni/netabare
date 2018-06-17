<template>
    <div class="chart-container">
        <canvas ref="score"></canvas>
    </div>
</template>
<script>
import Chart from 'chart.js';
import { BLUE } from '@/constants/colors';
import { fetchRank } from '@/untils/api';

const options = {
  layout: {
    padding: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }
  },
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
          display: true
        }
      }
    ]
  }
};

export default {
  data() {
    return {
      chart: null,
      raw: []
    };
  },
  watch: {
    UIData: function() {
      console.log('UIData updated');
      this._refresh();
    }
  },
  methods: {
    _refresh: function() {
      if (this.chart && this.UIData) {
        console.log('refreshing...', this.UIData);
        this.chart.data.datasets[0].data = this.UIData;
        this.chart.update();
      }
    }
  },
  props: ['bgmId', 'UIData'],
  mounted() {
    this.$nextTick(function() {
      const ctx = this.$refs.score.getContext('2d');
      const chartData = {
        datasets: [
          {
            label: false,
            borderColor: BLUE,
            backgroundColor: BLUE,
            fill: false,
            data: []
          }
        ]
      };
      this.chart = new Chart(ctx, { type: 'line', data: chartData, options });
      if (this.bgmId) {
        fetchRank(this.bgmId).then(res => {
          this.raw = res.data.history;
          if (this.raw.length && this.chart) {
            let scores = this.raw.filter(r => !!r.score).map(r => {
              let y = r.score;
              let x = new Date(r.recordedAt);
              return { x, y };
            });
            this.chart.data.datasets[0].data = scores;
            this.chart.update();
          }
        });
      }
    });
  },
  updated() {
    console.log('updated');
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
