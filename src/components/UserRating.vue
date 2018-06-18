<template>
    <div class="chart-container">
        <canvas ref="bar"></canvas>
    </div>
</template>
<script>
import Chart from '@/utils/chartjs';
import Overlay from '@/components/Overlay';
import Avatar from '@/components/Avatar';

const options = {
  legend: {
    display: false
  },
  maintainAspectRatio: false,
  tooltip: {
    intersect: false
  },
  scales: {
    xAxes: [
      {
        // type: 'time'
      }
    ],
    yAxes: [
      {
        ticks: {
          beginAtZero: true
        }
      }
    ]
  }
};

const chartData = {
  labels: [...Array(10 + 1).keys()].slice(1), //cool trick to get array 1 to 10, https://stackoverflow.com/questions/3746725/create-a-javascript-array-containing-1-n
  datasets: [
    {
      backgroundColor: [
        '#3094FF',
        '#4683EE',
        '#5B73DE',
        '#7162CE',
        '#8652BE',
        '#9C41AE',
        '#B1319E',
        '#C7208E',
        '#DC107E',
        '#F2006E'
      ],
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
  components: {
    Overlay,
    Avatar
  },
  props: ['UIData'],
  methods: {
    _refresh: function() {
      if (this.chart && this.UIData) {
        this.chart.data.datasets[0].data = this.UIData.data;
        this.chart.update();
      }
    }
  },
  watch: {
    UIData: function() {
      this._refresh();
    }
  },
  mounted() {
    this.$nextTick(function() {
      const ctx = this.$refs.bar.getContext('2d');
      this.chart = new Chart(ctx, { type: 'bar', data: chartData, options });
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
}
</style>
