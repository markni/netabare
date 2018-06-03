<template>
    <div class="chart-container">
        <canvas ref="score"></canvas>
    </div>
</template>
<script>
import Chart from "chart.js";
import axios from "../untils/axios";

const options = {
  legend: {
    display: false
  },
  maintainAspectRatio: false,
  scales: {
    xAxes: [
      {
        type: "time"
      }
    ]
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

export default {
  data() {
    return {
      chart: null,
      raw: []
    };
  },
  props: ["bgmId"],
  mounted() {
    console.log("mounted");
    this.$nextTick(function() {
      const ctx = this.$refs.score.getContext("2d");
      this.chart = new Chart(ctx, { type: "line", data: chartData, options });
      if (this.bgmId) {
        axios.get(`http://api.netaba.re/rank/${this.bgmId}`).then(res => {
          this.raw = res.data;
          if (this.raw.length && this.chart) {
            let scores = this.raw.map(r => {
              let y = r.rating.score;
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
    console.log("updated");
  }
};
</script>

<style scoped>
.chart-container {
  width: 100vw;
  height: 50vh;
}
</style>
