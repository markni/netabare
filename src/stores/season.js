// Importing Pinia and other utilities
import { defineStore } from 'pinia';
import { fetchSeason } from '@/utils/api.js';
import { useAppStore } from '@/stores/app.js';
import withSmartLoadingUx from '@/utils/withSmartLoadingUx.js';
import dayjs from 'dayjs';

export const useSeasonStore = defineStore('season', {
  state: () => ({
    season: []
  }),
  getters: {
    rateData: (state) => {
      if (!state.season) return null;
      let extreme = 0;
      const positive = state.season.map((entry) => {
        const lastHistory = entry.history[entry.history.length - 1];
        const count10 = lastHistory?.rating?.count['10'] || 0;
        if (count10 > extreme) {
          extreme = count10;
        }
        return {
          name: entry.name_cn || entry.name,
          y: count10
        };
      });
      const negative = state.season.map((entry) => {
        const lastHistory = entry.history[entry.history.length - 1];
        const count1 = lastHistory?.rating?.count['1'] || 0;
        if (count1 > extreme) {
          extreme = count1;
        }
        return {
          name: entry.name_cn || entry.name,
          y: -count1
        };
      });

      return { positive, negative, extreme };
    },
    historyData: (state) => {
      if (!state.season) return null;
      return state.season.map((entry) => {
        return {
          airDate: dayjs(entry.air_date).valueOf(),
          name: entry.name_cn || entry.name,
          bgmId: entry.bgmId,
          scoreHistory: entry.history
            .map((h) => [dayjs(h.recordedAt).valueOf(), h.score])
            .filter((h) => h[1]),
          rankHistory: entry.history
            .map((h) => [dayjs(h.recordedAt).valueOf(), h.rank])
            .filter((h) => h[1])
        };
      });
    }
  },

  actions: {
    async fetchSeason(year, month) {
      try {
        const fetchSeasonWithLoading = withSmartLoadingUx(() => fetchSeason(year, month), {
          delay: 500,
          minimumDisplayTime: 1000,
          setLoadingState: useAppStore().setLongPolling
        });

        const response = await fetchSeasonWithLoading();

        this.season = response.data;
      } catch (error) {
        console.error('Failed to fetch season:', error);
        // Handle error appropriately
      }
    },
    clearSeason() {
      this.season = null;
    }
  }
});
