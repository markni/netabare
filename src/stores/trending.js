// Importing Pinia and other utilities
import { defineStore } from 'pinia';
import { fetchTrending, fetchTrendingActionsDaily } from '@/utils/api.js';
import { useAppStore } from '@/stores/app.js';
import withSmartLoadingUx from '@/utils/withSmartLoadingUx.js';

export const useTrendingStore = defineStore('trending', {
  state: () => ({
    up: [],
    down: [],
    done: [],
    popular: [],
    actionsDaily: null,
    actionsDailySeries: []
  }),
  getters: {},
  actions: {
    async fetchTrending() {
      if (this.up.length > 0) return;
      try {
        const fetchTrendingWithLoading = withSmartLoadingUx(fetchTrending, {
          delay: 500,
          minimumDisplayTime: 1000,
          setLoadingState: useAppStore().setLongPolling
        });

        const response = await fetchTrendingWithLoading();

        this.up = response.data.up;
        this.down = response.data.down;
        this.done = response.data.done;

        // const popular = await fetchPopular()
        //
        // this.popular = popular.data
      } catch (error) {
        console.error('Failed to fetch trending:', error);
        // Handle error appropriately
      }
    },
    async fetchTrendingActionsDaily() {
      if (this.actionsDailySeries.length > 0) return;
      try {
        const fetchTrendingActionsDailyWithLoading = withSmartLoadingUx(fetchTrendingActionsDaily, {
          delay: 500,
          minimumDisplayTime: 1000,
          setLoadingState: useAppStore().setLongPolling
        });

        const response = await fetchTrendingActionsDailyWithLoading();
        const payload = response.data || {};
        const rows = Array.isArray(payload.series) ? payload.series : [];
        const actionKeys = ['wish', 'collect', 'doing', 'on_hold', 'dropped'];
        const chartSeries = actionKeys.map((key) => ({
          key,
          data: []
        }));

        this.actionsDaily = payload;

        rows
          .map((item) => ({
            x: new Date(item.date).getTime(),
            actions: item.actions || {}
          }))
          .filter((row) => Number.isFinite(row.x))
          .sort((a, b) => a.x - b.x)
          .forEach((row) => {
            actionKeys.forEach((key, index) => {
              const value = Number(row.actions[key] || 0);
              chartSeries[index].data.push([row.x, Number.isFinite(value) ? value : 0]);
            });
          });

        this.actionsDailySeries = chartSeries;
      } catch (error) {
        console.error('Failed to fetch trending actions daily:', error);
      }
    }
  }
});
