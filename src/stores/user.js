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
    userProfile: (state) => {
      return state?.user?.user || null;
    },
    globalData: (state) => {
      if (!state.user) return null;

      let UIData = state.user;
      let g = [];
      for (let key in UIData.gCount) {
        if (key !== '-1') {
          g.unshift(UIData.gCount[key]);
        }
      }

      return g;
    },
    userData: (state) => {
      return (year) => {
        if (!state.user) return null;

        const history = state.user.history;

        if (year) {
          const yearData = history.find((entry) => entry.year === year);
          if (yearData) {
            let r = [];
            for (let key in yearData.count) {
              if (key !== '-1') {
                r.unshift(yearData.count[key]);
              }
            }
            return {
              data: r,
              total: yearData.total,
              voted: yearData.voted,
              stdev: yearData.stdev,
              median: yearData.median,
              avg: yearData.avg,
              year: year
            };
          }
          return null; // Return null if the year is not found
        }

        // If no year is provided, return data for all years
        let r = [];
        for (let key in state.user.count) {
          if (key !== '-1') {
            r.unshift(state.user.count[key]);
          }
        }
        return {
          data: r,
          total: state.user.total,
          voted: state.user.voted,
          stdev: state.user.stdev,
          median: state.user.median,
          avg: state.user.avg
        };
      };
    },
    availableYears: (state) => {
      if (!state.user || !state.user.history) return [];

      return state.user.history.map((entry) => entry.year).sort((a, b) => a - b);
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
