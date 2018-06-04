<template>
  <div class="home">
    <Overlay text="捏它芭蕾 马上回来" />
    <rank bgm-id="218711"></rank>
    <score bgm-id="218711"></score>
  </div>
</template>

<script>
// @ is an alias to /src
import Overlay from '@/components/Overlay';
import Rank from '@/components/Rank';
import Score from '@/components/Score';

export default {
  name: 'home',
  components: {
    Overlay,
    Rank,
    Score
  }
};
</script>
