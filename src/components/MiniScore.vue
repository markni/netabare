<template>
    <div class="chart-container">
        <canvas ref="score"></canvas>
    </div>
</template>
<script>
import Chart from '@/utils/chartjs';
import { BLUE } from '@/constants/colors';
import moment from 'moment';
import _ from 'lodash';

const options = {
  tooltips: {
    intersect: false,

    callbacks: {
      title: function(tooltipItems, data) {
        //Return value for title
        return moment(data.datasets[0].data[tooltipItems[0].index].x).format(
          'M月DD日'
        );
      }
    }
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

        ticks: {
          display: false
        }
      }
    ],
    yAxes: [
      {
        ticks: {
          display: false,
          stepSize: 0.1
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
        let scores = this.UIData.map(u => u.score);
        let max = Math.max(...scores);
        let min = Math.min(...scores);
        this.chart.options.scales.yAxes[0].ticks.min = min = Math.max(
          0,
          _.round(min - 0.1, 1)
        );
        this.chart.options.scales.yAxes[0].ticks.max = max = Math.min(
          10,
          _.round(max + 0.1, 1)
        );
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
      this.chart = new Chart(ctx, {
        type: 'LineWithLine',
        data: chartData,
        options
      });
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
