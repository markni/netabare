// Importing Pinia and other utilities
import { defineStore } from 'pinia';
import { fetchUser } from '@/utils/api.js';
import { useAppStore } from '@/stores/app.js';
import withSmartLoadingUx from '@/utils/withSmartLoadingUx.js';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null
  }),
  getters: {
    username: (state) => {
      return state?.user?.user?.username || state?.user?.user?.id || '';
    },
    globalData: (state) => {
      if (!state.user) return null;

      let UIData = state.user;
      let g = [];
      for (let key in UIData.gCount) {
        if (key !== '-1') {
          g.push({ x: parseInt(key), y: UIData.gCount[key] });
        }
      }

      return g;
    },
    userData: (state) => {
      if (!state.user) return null;

      let UIData = state.user;
      let r = [];
      for (let key in UIData.count) {
        if (key !== '-1') {
          r.push({ x: parseInt(key), y: UIData.count[key] });
        }
      }

      return r;
    }
  },
  actions: {
    async fetchUser(userId) {
      try {
        useAppStore().setNotFoundUserError(false);
        const fetchUserWithLoading = withSmartLoadingUx(fetchUser, {
          delay: 500,
          minimumDisplayTime: 1000,
          setLoadingState: useAppStore().setLongPolling
        });

        const response = await fetchUserWithLoading(userId);

        this.user = response.data;
      } catch (error) {
        console.error('Failed to fetch user:', error);
        useAppStore().setNotFoundUserError(true);
        // Handle error appropriately
      }
      return this.user;
    },
    clearUser() {
      this.user = null;
    }
  }
});
