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
            <user-search font-size="2vh" />
        </div>
    </div>
</template>

<script>
import UserRating from '@/components/UserRating';
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
              for (let key in this.UIData.count) {
                if (key !== '-1') {
                  r.push({ x: key, y: this.UIData.count[key] });
                }
              }

              this.UIData.data = r;
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
.wrapper {
  display: flex;
  height: 100vh;
  width: 100vw;
}
.user-panel {
  display: flex;
  width: 20vw;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 26px;
}
.user-rating {
  display: flex;
  width: 80vw;
  height: 95vh;
  align-self: flex-end;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
