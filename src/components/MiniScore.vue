<template>
    <div class="chart-container">
        <canvas ref="score"></canvas>
    </div>
</template>
<script>
import Chart from 'chart.js';
import { BLUE } from '@/constants/colors';

const options = {
  tooltips: {
    enabled: false
  },
  layout: {
    padding: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }
  },

  elements: { point: { radius: 0 } },
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
        },
        ticks: {
          display: false
        }
      }
    ],
    yAxes: [
      {
        ticks: {
          display: false,
          stepSize: 0.25
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
    UIData: {
      handler: function() {
        this._refresh();
      },
      deep: true
    }
  },
  methods: {
    _refresh: function() {
      if (this.chart && this.UIData) {
        // this.chart.data.datasets[0].data = this.UIData;
        let data = [];
        this.UIData.forEach(u => {
          data.push({ x: new Date(u.recordedAt), y: u.score });
        });
        this.chart.data.datasets[0].data = data;
        this.chart.update();
      }
    }
  },
  props: ['UIData', 'color'],
  mounted() {
    this.$nextTick(function() {
      const ctx = this.$refs.score.getContext('2d');
      const chartData = {
        datasets: [
          {
            label: false,
            borderColor: this.color || BLUE,
            fill: false,
            data: []
          }
        ]
      };
      this.chart = new Chart(ctx, { type: 'line', data: chartData, options });
      if (this.UIData) this._refresh();
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
