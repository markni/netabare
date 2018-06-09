<template>
  <div class="home">
    <div class="search">
      <search />
    </div>
    <overlay />
    <rank bgm-id="218711"></rank>
    <score bgm-id="218711"></score>
  </div>
</template>

<script>
// @ is an alias to /src
import Search from '@/components/Search';
import Rank from '@/components/Rank';
import Score from '@/components/Score';
import Overlay from '@/components/Overlay';

export default {
  name: 'home',
  components: {
    Search,
    Rank,
    Score,
    Overlay
  }
};
</script>

<style scoped>
.search {
  padding-top: 37vh;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  /*align-items: center;*/
  justify-content: center;

  z-index: 100;
}
</style>
