<template>
    <div class="info-card">
        <avatar :user="UIData.user" v-if="UIData.user" />
        <div v-if="UIData.user" class="nickname typekit-text">{{UIData.user.nickname}}</div>
        <div v-if="UIData.user" class="subtitle typekit-text">看过</div>
        <div v-if="UIData.user" class="score typekit-text">{{UIData.total}}</div>
        <div v-if="UIData.user" class="subtitle typekit-text">已评</div>
        <div v-if="UIData.user" class="score typekit-text">{{(UIData.voted/UIData.total*100).toFixed(0)}}<span class="percent">%</span></div>
        <div v-if="UIData.user" class="subtitle typekit-text">均值</div>
        <div v-if="UIData.user" class="score typekit-text">{{UIData.avg}}</div>
        <div v-if="UIData.user" class="subtitle typekit-text">中值</div>
        <div v-if="UIData.user" class="score typekit-text">{{UIData.median}}</div>
        <div v-if="UIData.user" class="subtitle typekit-text">标准差</div>
        <div v-if="UIData.user" class="score typekit-text">{{UIData.stdev}}</div>
    </div>

</template>
<script>
import Avatar from '@/components/Avatar';

export default {
  components: {
    Avatar
  },
  props: ['UIData']
};
</script>

<style scoped>
.info-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 5vh;
  padding-right: 5vw;
  box-sizing: border-box;
  text-align: right;
}

.nickname {
  font-size: 6vh;
  font-weight: bold;
}

.subtitle {
  font-size: 2vh;
}

.score {
  font-size: 4vh;
  line-height: 1;
  margin-bottom: 1vh;
}

.percent {
  font-size: 2vh;
}
</style>
