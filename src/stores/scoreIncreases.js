import { defineStore } from 'pinia';
import { fetchScoreIncreases } from '@/utils/api.js';
import { useAppStore } from '@/stores/app.js';
import withSmartLoadingUx from '@/utils/withSmartLoadingUx.js';

export const useScoreIncreasesStore = defineStore('scoreIncreases', {
  state: () => ({
    items: []
  }),
  actions: {
    async fetchScoreIncreases() {
      if (this.items.length > 0) return;

      try {
        const fetchWithLoading = withSmartLoadingUx(fetchScoreIncreases, {
          delay: 500,
          minimumDisplayTime: 1000,
          setLoadingState: useAppStore().setLongPolling
        });

        const response = await fetchWithLoading();
        this.items = response.data;
      } catch (error) {
        console.error('Failed to fetch score increases:', error);
      }
    }
  }
});
