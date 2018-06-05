<template>
    <div class="wrapper">
        <user-rating :bgm-user-id="$route.params.id" />
        <div class="search">
            <search font-size="2vh"/>
        </div>
    </div>
</template>

<script>
import UserRating from '@/components/UserRating';
import Search from '@/components/Search';

export default {
  name: 'User',
  components: {
    UserRating,
    Search
  }
};
</script>

<style scoped>
.wrapper {
  display: flex;
}
.search {
  padding-bottom: 1vh;
  padding-right: 1vw;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  z-index: 100;
}
</style>
