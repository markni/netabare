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
    subjectsData: (state) => {
      console.log(state.season);
      return state.season.map((subject) => {
        // Calculate standard deviation
        let std = 0;
        if (subject.rating?.count) {
          const counts = Object.entries(subject.rating.count).map(([score, count]) => ({
            score: parseInt(score),
            count: count
          }));

          // Calculate mean
          const totalCount = counts.reduce((sum, { count }) => sum + count, 0);
          const mean =
            counts.reduce((sum, { score, count }) => sum + score * count, 0) / totalCount;

          // Calculate variance
          const variance =
            counts.reduce((sum, { score, count }) => {
              return sum + count * Math.pow(score - mean, 2);
            }, 0) / totalCount;

          // Calculate standard deviation
          std = Math.sqrt(variance);
        }

        return {
          bgmId: subject.bgmId,
          name: subject.name,
          name_cn: subject.name_cn,
          score: subject.rating?.score || 0,
          rank: subject.rank,
          air_date: subject.air_date,
          total: subject.rating?.total || 0,
          std: parseFloat(std.toFixed(2)) // Round to 2 decimal places
        };
      });
    },
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
