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
    balanceData: (state) => {
      if (!state.season) return null;
      let extreme = 0; // Tracks the highest count (either 10 or 1 rating) for scaling

      const limitedSeason = state.season.slice(0, 10);

      // Process positive ratings (10/10 scores)
      const positive = limitedSeason.map((entry) => {
        const lastHistory = entry.history[entry.history.length - 1];
        // Get count of 10/10 ratings, default to 0 if not available
        const count10 = lastHistory?.rating?.count['10'] || 0;
        // Update extreme if this count is higher
        if (count10 > extreme) {
          extreme = count10;
        }
        return {
          name: entry.name_cn || entry.name,
          y: count10 // Use count of 10/10 ratings as the y-value
        };
      });

      // Process negative ratings (1/10 scores)
      const negative = limitedSeason.map((entry) => {
        const lastHistory = entry.history[entry.history.length - 1];
        // Get count of 1/10 ratings, default to 0 if not available
        const count1 = lastHistory?.rating?.count['1'] || 0;
        // Update extreme if this count is higher
        if (count1 > extreme) {
          extreme = count1;
        }
        return {
          name: entry.name_cn || entry.name,
          y: -count1 // Use negative count of 1/10 ratings as the y-value
        };
      });

      // Return an object containing positive and negative data arrays,
      // and the extreme value for scaling the chart
      return { positive, negative, extreme };
    },
    historyData: (state) => {
      if (!state.season) return null;
      const limitedSeason = state.season.slice(0, 10);
      return limitedSeason.map((entry) => {
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
