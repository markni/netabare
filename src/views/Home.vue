<template>
  <div class="home">
    <Overlay text="捏他芭蕾 马上回来" />
    <rank bgm-id="218711"></rank>
    <score bgm-id="218711"></score>
  </div>
</template>

<script>
// @ is an alias to /src
import Overlay from "@/components/Overlay.vue";
import Rank from "@/components/Rank.vue";
import Score from "@/components/Score.vue";

export default {
  name: "home",
  components: {
    Overlay,
    Rank,
    Score
  }
};
</script>
