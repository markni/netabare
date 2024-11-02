// Importing Pinia and other utilities
import { defineStore } from 'pinia';
import { fetchRank } from '@/utils/api.js';
import { useAppStore } from '@/stores/app.js';
import withSmartLoadingUx from '@/utils/withSmartLoadingUx.js';
import dayjs from 'dayjs';
import _ from 'lodash';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Initialize dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

export const useSubjectStore = defineStore('subject', {
  state: () => ({
    subject: null,
    history: []
  }),
  getters: {
    epsData: (state) => {
      if (!state.subject) return null;
      return state.subject.eps
        .filter((ep) => ep.type === 0 && ep.airdate)
        .reduce((acc, ep) => {
          //  todo: remove this after api fix only return UTC time
          const airdateValue = ep.airdate.includes('T')
            ? dayjs(ep.airdate).valueOf()
            : dayjs(ep.airdate).tz('Asia/Shanghai').valueOf();
          if (!acc[airdateValue]) {
            acc[airdateValue] = [];
          }
          acc[airdateValue].push(ep);
          return acc;
        }, {});
    },
    oneWeekBeforeFirstEpTimestamp: (state) => {
      if (state.subject?.eps) {
        // Sorting episodes by airdate
        const sortedEps = [...state.subject.eps]
          .filter((ep) => ep.type === 0 && ep.airdate)
          .sort((a, b) => new Date(a.airdate) - new Date(b.airdate));
        // Get the first episode's airdate and subtract one week
        return sortedEps.length > 0
          ? dayjs(sortedEps[0].airdate).subtract(1, 'weeks').valueOf()
          : 0;
      }
      return 0;
    },
    oneWeekAfterLastEpTimestamp: (state) => {
      if (state.subject?.eps) {
        const currentDate = dayjs();
        // Sorting episodes by airdate and filtering out those more than 10 years from now
        const sortedEps = [...state.subject.eps]
          .filter((ep) => ep.type === 0 && ep.airdate)
          .filter((ep) => dayjs(ep.airdate).isBefore(currentDate.add(10, 'years')))
          .sort((a, b) => new Date(a.airdate) - new Date(b.airdate));
        // Get the last episode's airdate and add one week
        return sortedEps.length > 0
          ? dayjs(sortedEps[sortedEps.length - 1].airdate)
              .add(1, 'weeks')
              .valueOf()
          : Infinity;
      }
      return Infinity;
    },
    delta: (state) => {
      const { history } = state;
      if (!history || history.length < 30) return null;
      let current = _.first(history);
      let before = _.nth(history, 29);
      let score = current.score - before.score;
      let rank = current.rank - before.rank;
      let watching = current.collect?.doing - before.collect?.doing;

      return { score, rank, watching };
    },
    combinedData: (state) => {
      const { history } = state;
      if (!history) return null;
      const rankData = {
        history: []
      };
      const scoreData = {
        history: [],
        one: [],
        ten: []
      };
      const collectionData = {
        history: {}
      };

      // Initialize collection history keys
      history.forEach((h) => {
        if (h.collect) {
          for (let key in h.collect) {
            collectionData.history[key] = collectionData.history[key] || [];
          }
        }
        if (h.rating?.total) {
          collectionData.history['rated'] = collectionData.history['rated'] || [];
        }
      });

      // Process history in one loop
      history.forEach((h) => {
        const x = dayjs(h.recordedAt).valueOf();

        if (h.rank) {
          rankData.history.push([x, h.rank]);
        }

        if (h.score) {
          scoreData.history.push([x, h.score]);
        }

        if (h.collect) {
          for (let key in h.collect) {
            if (!collectionData.history[key]) {
              collectionData.history[key] = [];
            }
            collectionData.history[key].push([x, h.collect[key]]);
          }
        }

        if (h.rating?.total) {
          collectionData.history['rated'].push([x, h.rating.total]);
        }

        if (h.rating?.count) {
          scoreData.ten.push([x, h.rating.count[10] || 0]);
          scoreData.one.push([x, h.rating.count[1] || 0]);
        }
      });

      return { rankData, scoreData, collectionData };
    }
  },

  actions: {
    async fetchSubject(subjectId) {
      try {
        useAppStore().setNotFoundSubjectError(false);
        const fetchSubjectWithLoading = withSmartLoadingUx(fetchRank, {
          delay: 500,
          minimumDisplayTime: 1000,
          setLoadingState: useAppStore().setLongPolling
        });

        const response = await fetchSubjectWithLoading(subjectId);

        this.subject = response.data['subject'];
        this.history = response.data['history'];
      } catch (error) {
        useAppStore().setNotFoundSubjectError(true);
        console.error('Failed to fetch subject:', error);
        // Handle error appropriately
      }
    },
    clearSubject() {
      this.subject = null;
    }
  }
});
