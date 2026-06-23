import { defineStore } from 'pinia';
import { fetchHistoryGaps } from '@/utils/api.js';
import { useAppStore } from '@/stores/app.js';
import withSmartLoadingUx from '@/utils/withSmartLoadingUx.js';

export const useUnbannedStore = defineStore('unbanned', {
  state: () => ({
    items: []
  }),
  actions: {
    async fetchUnbanned() {
      if (this.items.length > 0) return this.items;
      try {
        const fetchHistoryGapsWithLoading = withSmartLoadingUx(fetchHistoryGaps, {
          delay: 500,
          minimumDisplayTime: 1000,
          setLoadingState: useAppStore().setLongPolling
        });

        const response = await fetchHistoryGapsWithLoading();

        this.items = response.data.data;
      } catch (error) {
        console.error('Failed to fetch unbanned subjects:', error);
      }
      return this.items;
    }
  }
});
