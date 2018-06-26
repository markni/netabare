<template>
    <div class="wrapper">
        <transition name="fade">
            <overlay v-if="loading" text="读取中" float="true"></overlay>
        </transition>
        <div class="user-rating">
            <user-rating :UIData="UIData" />
        </div>
        <div class="user-panel">
            <user-stats :UIData="UIData" />
            <!--<user-search font-size="2vh" />-->
        </div>
    </div>
</template>

<script>
import UserRating from '@/components/UserRatingH';
import UserStats from '@/components/UserStats';
import UserSearch from '@/components/UserSearch';
import Overlay from '@/components/Overlay';
import { fetchUser } from '@/utils/api';

let loadingTimer;

export default {
  name: 'User',
  props: ['id'],
  components: {
    UserStats,
    UserRating,
    UserSearch,
    Overlay
  },
  data: function() {
    return {
      UIData: [],
      loading: false
    };
  },
  mounted: function() {
    this._getData();
  },
  methods: {
    _getData: function() {
      if (this.id) {
        loadingTimer = setTimeout(() => {
          this.loading = true;
        }, 300);
        fetchUser(this.id).then(res => {
          if (res.data['error']) {
            this.$router.replace('/404');
          } else {
            this.UIData = res.data;
            if (this.UIData['user']) {
              let r = [];
              let g = [];
              for (let key in this.UIData.count) {
                if (key !== '-1') {
                  r.push({ x: parseInt(key), y: this.UIData.count[key] });
                }
              }
              for (let key in this.UIData.gCount) {
                if (key !== '-1') {
                  g.push({ x: parseInt(key), y: this.UIData.gCount[key] });
                }
              }

              this.UIData.data = r;
              this.UIData.gData = g;
              if (loadingTimer) clearTimeout(loadingTimer);
              this.loading = false;
            }
          }
        });
      }
    }
  },
  watch: {
    id: function() {
      this._getData();
    }
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
@media only screen and (min-width: 901px) {
  .wrapper {
    display: flex;
    height: 100vh;
    width: 100vw;
    padding: 10px 40px;
    box-sizing: border-box;
  }
  .user-panel {
    display: flex;
    width: 20%;
    flex-direction: column;
    justify-content: space-between;
    padding-bottom: 26px;
  }
  .user-rating {
    display: flex;
    width: 80%;
    height: 95%;
    align-self: flex-end;
  }
}
@media only screen and (max-width: 900px) {
  .wrapper {
    display: flex;
    flex-direction: column-reverse;
  }
}
</style>
