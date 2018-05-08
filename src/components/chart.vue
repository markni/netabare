<template>
    <canvas ref="chart"></canvas>
</template>
<script>
import Chart from "chart.js";

const options = {
  legend: {
    display: false
  },
  maintainAspectRatio: false
};

const data = {
  labels: Array.from(Array.from(Array(10).keys(), n => n + 1)),
  datasets: [
    {
      label: false,
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
      data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
    }
  ]
};

export default {
  mounted() {
    this.$nextTick(function() {
      const ctx = this.$refs.chart.getContext("2d");
      new Chart(ctx, { type: "bar", data, options });
    });
    // Overwriting base render method with actual data.
  }
};
</script>

<style scoped>
</style>
