// Importing Pinia and other utilities
import { defineStore } from 'pinia';
import { fetchHistory } from '@/utils/api.js';
import { useAppStore } from '@/stores/app.js';
import withSmartLoadingUx from '@/utils/withSmartLoadingUx.js';
import _ from 'lodash';
import dayjs from 'dayjs';

const currentYear = parseInt(dayjs().year());
// Add initial filter values as constants
const INITIAL_FILTER_VALUES = {
  startingYear: currentYear - 15,
  endingYear: currentYear,
  minScore: 0,
  maxScore: 10
};

export const useHistoryStore = defineStore('history', {
  state: () => ({
    history: null,
    dic: {},
    // Reference the initial values
    ...INITIAL_FILTER_VALUES
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

      // Only remove the last entry if it's for next year
      const nextYear = currentYear + 1;
      if (yearlyData[nextYear]) {
        finalYearlyData.pop();
      }

      return { yearlyData: finalYearlyData, historyData: historyData };
    },
    filteredYearlyData: (state) => {
      if (!state.history) return null;

      let yearlyData = {};

      // Filter and aggregate data based on year and score ranges
      state.history.forEach(({ score, air_date }) => {
        const year = dayjs(air_date).year();

        // Skip if outside year range or score range
        if (
          year < state.startingYear ||
          year > state.endingYear ||
          score < state.minScore ||
          score > state.maxScore
        ) {
          return;
        }

        // Initialize yearly data for the year if it does not exist
        if (!yearlyData[year]) {
          yearlyData[year] = { score: 0, count: 0 };
        }

        // Update yearlyData
        yearlyData[year].score += score;
        yearlyData[year].count++;
      });

      // Prepare filtered yearly data output with both avg and count
      return Object.keys(yearlyData).map((year) => ({
        x: dayjs().year(year).startOf('year').valueOf(),
        y: parseFloat((yearlyData[year].score / yearlyData[year].count).toFixed(4)),
        count: yearlyData[year].count
      }));
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
    },
    resetFilters() {
      // Reference the same initial values
      this.$patch(INITIAL_FILTER_VALUES);
    }
  }
});
