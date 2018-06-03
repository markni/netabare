<template>
    <canvas ref="rank"></canvas>
</template>
<script>
  import Chart from "chart.js";

  const raw = [{"collect":{"wish":527,"collect":301,"doing":4013,"on_hold":166,"dropped":195},"rating":{"count":{"1":70,"2":13,"3":16,"4":37,"5":85,"6":207,"7":453,"8":724,"9":260,"10":182},"total":2047,"score":7.37},"bgmId":218711,"rank":1034,"recordedAt":"2018-06-01T16:00:00.000Z","subject":null},{"collect":{"wish":523,"collect":301,"doing":4008,"on_hold":166,"dropped":195},"rating":{"count":{"1":68,"2":14,"3":16,"4":38,"5":85,"6":206,"7":451,"8":721,"9":261,"10":182},"total":2042,"score":7.37},"bgmId":218711,"rank":1019,"recordedAt":"2018-05-31T16:00:00.000Z","subject":null},{"collect":{"wish":522,"collect":299,"doing":4001,"on_hold":167,"dropped":195},"rating":{"count":{"1":68,"2":14,"3":16,"4":38,"5":85,"6":203,"7":450,"8":721,"9":261,"10":182},"total":2038,"score":7.37},"bgmId":218711,"rank":1017,"recordedAt":"2018-05-30T16:00:00.000Z","subject":null},{"collect":{"wish":522,"collect":292,"doing":3993,"on_hold":167,"dropped":195},"rating":{"count":{"1":69,"2":14,"3":16,"4":37,"5":86,"6":203,"7":446,"8":718,"9":261,"10":181},"total":2031,"score":7.37},"bgmId":218711,"rank":1025,"recordedAt":"2018-05-29T16:00:00.000Z","subject":null},{"collect":{"wish":520,"collect":291,"doing":3986,"on_hold":167,"dropped":193},"rating":{"count":{"1":69,"2":14,"3":15,"4":37,"5":85,"6":204,"7":444,"8":717,"9":259,"10":181},"total":2025,"score":7.37},"bgmId":218711,"rank":1003,"recordedAt":"2018-05-28T16:00:00.000Z","subject":null},{"collect":{"wish":521,"collect":291,"doing":3983,"on_hold":166,"dropped":190},"rating":{"count":{"1":68,"2":14,"3":14,"4":37,"5":85,"6":204,"7":442,"8":716,"9":259,"10":181},"total":2020,"score":7.38},"bgmId":218711,"rank":1012,"recordedAt":"2018-05-27T16:00:00.000Z","subject":null},{"collect":{"wish":522,"collect":292,"doing":3972,"on_hold":168,"dropped":190},"rating":{"count":{"1":67,"2":14,"3":14,"4":36,"5":84,"6":201,"7":441,"8":716,"9":259,"10":183},"total":2015,"score":7.39},"bgmId":218711,"rank":960,"recordedAt":"2018-05-26T16:00:00.000Z","subject":null},{"collect":{"wish":520,"collect":291,"doing":3974,"on_hold":166,"dropped":186},"rating":{"count":{"1":68,"2":12,"3":13,"4":36,"5":83,"6":192,"7":441,"8":720,"9":262,"10":181},"total":2008,"score":7.4},"bgmId":218711,"rank":956,"recordedAt":"2018-05-25T16:00:00.000Z","subject":null},{"collect":{"wish":521,"collect":292,"doing":3967,"on_hold":165,"dropped":183},"rating":{"count":{"1":68,"2":12,"3":13,"4":36,"5":84,"6":189,"7":442,"8":716,"9":262,"10":180},"total":2002,"score":7.4},"bgmId":218711,"rank":965,"recordedAt":"2018-05-24T16:00:00.000Z","subject":null},{"collect":{"wish":521,"collect":292,"doing":3964,"on_hold":165,"dropped":180},"rating":{"count":{"1":68,"2":12,"3":13,"4":36,"5":84,"6":188,"7":440,"8":714,"9":262,"10":180},"total":1997,"score":7.4},"bgmId":218711,"rank":956,"recordedAt":"2018-05-23T16:00:00.000Z","subject":null},{"collect":{"wish":519,"collect":293,"doing":3959,"on_hold":164,"dropped":177},"rating":{"count":{"1":68,"2":12,"3":13,"4":37,"5":83,"6":186,"7":437,"8":712,"9":263,"10":179},"total":1990,"score":7.4},"bgmId":218711,"rank":964,"recordedAt":"2018-05-22T16:00:00.000Z","subject":null},{"collect":{"wish":520,"collect":293,"doing":3957,"on_hold":162,"dropped":173},"rating":{"count":{"1":68,"2":11,"3":13,"4":35,"5":83,"6":184,"7":435,"8":712,"9":267,"10":180},"total":1988,"score":7.41},"bgmId":218711,"rank":942,"recordedAt":"2018-05-21T16:00:00.000Z","subject":null},{"collect":{"wish":520,"collect":293,"doing":3955,"on_hold":159,"dropped":171},"rating":{"count":{"1":67,"2":11,"3":13,"4":32,"5":80,"6":186,"7":433,"8":714,"9":265,"10":180},"total":1981,"score":7.42},"bgmId":218711,"rank":911,"recordedAt":"2018-05-20T16:00:00.000Z","subject":null},{"collect":{"wish":520,"collect":291,"doing":3955,"on_hold":158,"dropped":168},"rating":{"count":{"1":66,"2":10,"3":13,"4":30,"5":77,"6":183,"7":430,"8":722,"9":266,"10":182},"total":1979,"score":7.44},"bgmId":218711,"rank":883,"recordedAt":"2018-05-19T16:00:00.000Z","subject":null},{"collect":{"wish":519,"collect":286,"doing":3950,"on_hold":159,"dropped":165},"rating":{"count":{"1":62,"2":9,"3":14,"4":30,"5":77,"6":184,"7":432,"8":718,"9":267,"10":182},"total":1975,"score":7.45},"bgmId":218711,"rank":865,"recordedAt":"2018-05-18T16:00:00.000Z","subject":null},{"collect":{"wish":518,"collect":285,"doing":3946,"on_hold":159,"dropped":164},"rating":{"count":{"1":62,"2":9,"3":13,"4":29,"5":76,"6":185,"7":431,"8":718,"9":268,"10":182},"total":1973,"score":7.46},"bgmId":218711,"rank":838,"recordedAt":"2018-05-17T16:00:00.000Z","subject":null},{"collect":{"wish":518,"collect":285,"doing":3946,"on_hold":158,"dropped":163},"rating":{"count":{"1":61,"2":9,"3":13,"4":29,"5":76,"6":185,"7":430,"8":719,"9":268,"10":182},"total":1972,"score":7.46},"bgmId":218711,"rank":838,"recordedAt":"2018-05-16T16:00:00.000Z","subject":null}];

  const ranks = raw.map(r => {
    let y = r.rank;
    let x = new Date(r.recordedAt);
    return {x, y};
  });

  const scores = raw.map(r => {
    let y = r.rating.score;
    let x = new Date(r.recordedAt);
    return {x, y};
  });
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

  const data = {
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
        data: ranks
      }
    ]
  };

  export default {
    mounted() {
      this.$nextTick(function () {
        const ctx = this.$refs.rank.getContext("2d");
        new Chart(ctx, {type: "line", data, options});
      });
      // Overwriting base render method with actual data.
    }
  };
</script>

<style scoped>
</style>
