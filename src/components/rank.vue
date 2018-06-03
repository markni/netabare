<template>
    <div class="chart-container">

    <canvas ref="rank"></canvas>
    </div>
</template>
<script>
import Chart from "chart.js";
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
      borderColor: "#EF476F",

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
      chart: null
    };
  },
  props: ["raw"],
  watch: {
    raw: function(newVal, oldVal) {
      // watch it
      console.log("!Prop changed: ", newVal.length, " | was: ", oldVal.length);
      console.log(this.raw);
      if (this.raw.length && this.chart) {
        let ranks = this.raw.map(r => {
          let y = r.rank;
          let x = new Date(r.recordedAt);
          return { x, y };
        });
        this.chart.data.datasets[0].data = ranks;
        this.chart.update();
      }
    }
  },
  mounted() {
    console.log("mounted");
    this.$nextTick(function() {
      const ctx = this.$refs.rank.getContext("2d");
      this.chart = new Chart(ctx, { type: "line", data: chartData, options });
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
