import { defineStore } from 'pinia';
import { useThemeStore } from '@/stores/theme';
import moment from 'moment/moment';

function sampleData(data: any[], sampleSize: number) {
  const newData = [];

  for (let i = 0; i < data.length; i += sampleSize) {
    newData.push(data[i]);
  }

  return newData;
}

export const useTrendStore = defineStore('archive', {
  state: () => {
    const trend: Trend = { up: [], down: [], done: [] };
    const trendingItems: { [id: number]: TrendingItem } = {};

    return { trend, trendingItems };
  },
  actions: {
    async fetchTrend() {
      const response = await fetch('https://api.netaba.re/trending');
      if (!response.ok) {
        throw new Error('Resource not found'); // or any other error message
      }
      this.trend = await response.json();
    }
  },
  getters: {
    chartOptions() {
      return (config: { interactive?: boolean } = {}) => {
        const { interactive } = config;
        console.log('interactive', interactive);
        return {
          spanGaps: true,
          responsive: true,
          maintainAspectRatio: false,
          elements: {
            point: {
              radius: interactive ? 5 : 0
            }
          },
          scales: {
            x: {
              display: interactive,
              type: 'time',
              time: {
                unit: 'month'
              }
            },
            y: {
              display: interactive,
              min: interactive ? 3 : 0,
              max: interactive ? 9 : 10,
              ticks: {
                // This ensures that the min and max values are included in the ticks
                stepSize: 1,
                precision: 0,
                includeBounds: true
              }
            }
          },
          plugins: {
            tooltip: {
              enabled: interactive
            },
            legend: {
              display: false
            }
          }
        };
      };
    },
    archiveChartData(state) {
      const themeStore = useThemeStore();
      const { secondary } = themeStore;

      return (id: number) => {
        const data = state.trendingItems[id].history
          .map((item: History) => {
            return {
              x: item.recordedAt,
              y: item.score
            };
          })
          .filter((item: any) => {
            return moment(item.x).valueOf() >= moment().subtract(6, 'months').valueOf();
          });

        return {
          datasets: [
            {
              type: 'line',
              label: '评分',
              borderColor: [secondary],
              fill: true,
              backgroundColor: [secondary],
              data: sampleData(data, 7)
            }
          ]
        };
      };
    }
  }
});

export interface Trend {
  done: TrendingItem[];
  down: TrendingItem[];
  up: TrendingItem[];
}

export interface TrendingItem {
  bgmId: number;
  dropped: number;
  history: History[];

  recordedAt: string;

  score: number;

  subject: Subject;

  watching: number;
}

export interface Subject {
  air_weekday: number;
  bgmId: number;
  name: string;
  name_cn: string;
  recordedAt: string;
  type: number;
}

export interface History {
  bgmId: number;
  rank: number;
  rating: {
    total: number;
    count: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
      6: number;
      7: number;
      8: number;
      9: number;
      10: number;
    };
  };
  recordedAt: string;
  score: number;
}
