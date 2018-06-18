<template>
    <div class="chart-container">
        <canvas ref="collection"></canvas>
    </div>
</template>
<script>
import Chart from '@/utils/chartjs';
import { COLORS } from '@/constants/colors';
import moment from 'moment';

const options = {
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
    display: true,
    position: 'bottom'
  },
  maintainAspectRatio: false,
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
        this.chart.data.datasets[0].data = this.UIData.dropped || 0;
        this.chart.data.datasets[1].data = this.UIData.wish || 0;
        this.chart.data.datasets[2].data = this.UIData.on_hold || 0;
        this.chart.data.datasets[3].data = this.UIData.collect || 0;
        this.chart.data.datasets[4].data = this.UIData.doing || 0;

        this.chart.update();
      }
    }
  },
  props: ['UIData'],
  mounted() {
    this.$nextTick(function() {
      const ctx = this.$refs.collection.getContext('2d');
      const chartData = {
        datasets: [
          {
            label: '抛弃',
            borderColor: COLORS[0],
            backgroundColor: COLORS[0],
            fill: false,
            data: []
          },
          {
            label: '想看',
            borderColor: COLORS[2],
            backgroundColor: COLORS[2],
            fill: false,
            data: []
          },
          {
            label: '搁置',
            borderColor: COLORS[4],
            backgroundColor: COLORS[4],
            fill: false,
            data: []
          },
          {
            label: '看过',
            borderColor: COLORS[6],
            backgroundColor: COLORS[6],
            fill: false,
            data: []
          },
          {
            label: '在看',
            borderColor: COLORS[8],
            backgroundColor: COLORS[8],
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
      // this._refresh();
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
