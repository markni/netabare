// Importing Pinia and other utilities
import { defineStore } from 'pinia';
import { fetchHistory } from '@/utils/api.js';
import { useAppStore } from '@/stores/app.js';
import withSmartLoadingUx from '@/utils/withSmartLoadingUx.js';
import _ from 'lodash';
import dayjs from 'dayjs';

const currentYear = parseInt(dayjs().year());

export const useHistoryStore = defineStore('history', {
  state: () => ({
    history: null,
    dic: {},
    startingYear: currentYear - 5,
    endingYear: currentYear,
    minScore: 0,
    maxScore: 10
  }),
  getters: {
    combinedData: (state) => {
      if (!state.history) return { yearlyData: null, historyData: null };

      let yearlyData = {};
      let historyData = [];

      state.history.forEach(({ score, air_date, rank }) => {
        const year = dayjs(air_date).year();

        // Update historyData without filters
        historyData.push([
          dayjs(air_date).valueOf(),
          parseFloat(score.toFixed(4) + '' + _.padStart(rank, 5, '0'))
        ]);

        // Initialize yearly data for the year if it does not exist
        if (!yearlyData[year]) {
          yearlyData[year] = { score: 0, count: 0 };
        }

        // Update yearlyData
        yearlyData[year].score += score;
        yearlyData[year].count++;
      });

      // Prepare yearlyData output
      let finalYearlyData = Object.keys(yearlyData).map((year) => {
        return {
          x: dayjs().year(year).startOf('year').valueOf(),
          y: parseFloat((yearlyData[year].score / yearlyData[year].count).toFixed(4))
        };
      });

      return { yearlyData: finalYearlyData, historyData: historyData };
    }
  },
  actions: {
    setStartingYear(year) {
      this.startingYear = year;
    },
    setEndingYear(year) {
      this.endingYear = year;
    },
    setMinScore(score) {
      this.minScore = score;
    },
    setMaxScore(score) {
      this.maxScore = score;
    },
    async fetchHistory() {
      if (this.history) return this.history;
      try {
        const fetchHistoryWithLoading = withSmartLoadingUx(fetchHistory, {
          setLoadingState: useAppStore().setLongPolling,
          minimumDisplayTime: 1000,
          delay: 0
        });

        const response = await fetchHistoryWithLoading();

        this.history = response.data;

        this.history.forEach(({ rank, air_date, bgmId, name, name_cn, score }) => {
          this.dic[rank] = { rank, bgmId, name, name_cn, score, air_date };
        });
      } catch (error) {
        console.error('Failed to fetch history:', error);
        // Handle error appropriately
      }
      return this.history;
    }
  }
});
