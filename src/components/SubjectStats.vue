<template>
    <div class="stats-container">
        <h1 class="typekit-text title">{{UIData.name}}</h1>
        <h2 class="typekit-text subtitle" v-if="UIData.name_cn">{{UIData.name_cn}}</h2>
        <!--<div class="typekit-text minititle">当前评分</div>-->
        <!--<div class="typekit-text score">{{UIData.score || "n/a"}}</div>-->
        <!--<div class="typekit-text minititle">评分变化</div>-->
        <!--<div class="typekit-text score" v-if="UIData.deltaScore">{{(UIData.deltaScore >= 0 ? '+':'' ) +UIData.deltaScore.toFixed(2)}}</div>-->
        <!--<div class="typekit-text minititle">当前排名</div>-->
        <!--<div class="typekit-text score">{{UIData.rank || "n/a"}}</div>-->
        <!--<div class="typekit-text minititle">排名变化</div>-->
        <!--<div class="typekit-text score">{{(UIData.deltaRank >= 0 ? '+':'' ) +UIData.deltaRank}}</div>-->
    </div>
</template>

<script>
export default {
  name: 'SubjectStats',
  props: ['UIData']
};
</script>

<style scoped>
.stats-container > * {
  text-align: left;
}
.title {
  font-size: 3vmax;
  line-height: 1.2;
  margin: 0;
}
.subtitle {
  font-size: 1.5vmax;
  line-height: 1.2;
  margin: 0;
  margin-top: 2vh;
  margin-bottom: 2vh;
  padding-left: 5px;
}
.minititle {
  font-size: 1vmax;
}
.score {
  font-size: 2vmax;
  line-height: 1;
  margin-bottom: 2vh;
}
</style>
