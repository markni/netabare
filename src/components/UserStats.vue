<template>
    <transition name="fade-slidein-left">

    <div class="info-card" v-if="UIData.user">

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
    </transition>

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
.fade-slidein-left-enter-active,
.fade-slidein-left-leave-active {
  transition: opacity 1s ease-out, transform 1s ease-out;
}
.fade-slidein-left-enter, .fade-slidein-left-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(-20px);
}
@media only screen and (min-width: 900px) {
  .info-card {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-top: 5vh;
    box-sizing: border-box;
    text-align: right;
    transform: translateX(0px);
  }

  .nickname {
    font-size: 6vh;
    font-weight: bold;
    margin-bottom: 1vh;
    line-height: 1;
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
}
@media only screen and (max-width: 900px) {
  .info-card {
    text-align: center;
  }
  .nickname {
    font-size: 6vw;
    font-weight: bold;
    margin-top: 3vh;
    margin-bottom: 3vh;
  }
  .subtitle {
    font-size: 4vw;
  }

  .score {
    font-size: 6vw;
    line-height: 1;
    margin-bottom: 3vh;
  }

  .percent {
    font-size: 2vw;
  }
}
</style>
