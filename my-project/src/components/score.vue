<template>
    <canvas ref="score"></canvas>
</template>
<script>
  import Chart from "chart.js";
  const options = {
    legend: {
      display: false
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        type: 'time',

      }]
    }
  };

  const chartData = {
    datasets: [
      {
        label: false,
        borderColor: "#118AB2",
        fill: false,
        backgroundColor: [
          "#EF476F",
          "#FFD166",
          "#06D6A0",
          "#118AB2",
          "#073B4C",
          "#EF476F",
          "#FFD166",
          "#06D6A0",
          "#118AB2",
          "#073B4C"
        ],
        data: []
      }
    ]
  };

  const updateChart = () => {

  };

  export default {
    data(){
      return {
        chart: null,
      }
    },
    props: ['raw'],
    watch: {
      raw: function(newVal, oldVal) { // watch it
        console.log('Prop changed: ', newVal.length, ' | was: ', oldVal.length);
        console.log(this.raw);
        if (this.raw.length && this.chart) {
          let d = chartData;
          let scores = this.raw.map(r => {
            let y = r.rating.score;
            let x = new Date(r.recordedAt);
            return {x, y};
          });
          this.chart.data.datasets[0].data = scores;
          this.chart.update();
        }
      }
    },
    mounted() {
      console.log('mounted');
      this.$nextTick(function () {
        const ctx = this.$refs.score.getContext("2d");
        this.chart = new Chart(ctx, {type: "line", data:chartData, options});
      });
    },
    updated() {
      console.log('updated');
    },
  };
</script>

<style scoped>
</style>
