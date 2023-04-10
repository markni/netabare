import { acceptHMRUpdate, defineStore } from 'pinia';
import { useThemeStore } from '@/stores/theme';
import moment from 'moment';

export interface HistoryItem {
  bgmId: string;
  name: string;
  name_cn: string;
  air_date: string;
  score: number;
  total: number;
  rank: number;
}

function getAverageScoresByYear<T extends { x: string; y: number }>(data: T[]) {
  // Initialize an object to store the sum and count of scores for each year
  const yearStats: {
    [year: number]: {
      sum: number;
      count: number;
    };
  } = {};

  // Loop through the data and update the sum and count of scores for each year
  for (const obj of data) {
    const year = moment(obj.x).year();
    if (!yearStats[year]) {
      yearStats[year] = { sum: 0, count: 0 };
    }
    yearStats[year].sum += obj.y;
    yearStats[year].count++;
  }

  // Compute the average score for each year and store the results in an array
  const result = [];

  for (const year in yearStats) {
    const { sum, count } = yearStats[year];
    result.push({ x: year, y: sum / count });
  }

  // Sort the result array by year (x property)

  return result;
}

export const useHistoryStore = defineStore('history', {
  state: () => {
    const history: HistoryItem[] = [];
    const chartOptions = {
      onClick: (event: any, elements: any) => {
        console.log('hello', event, elements);
      },
      spanGaps: true,
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'year'
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            font: {
              size: 24,
              family: 'source-han-serif-sc'
            }
          }
        },
        tooltip: {
          callbacks: {
            title: () => '',
            label: (context: any) => {
              if (context.datasetIndex === 0) {
                return [
                  context.raw._n,

                  `首播：${moment(context.raw.x).format('YYYY-MM-DD')}`,
                  `均分：${context.raw.y}`,
                  `排名：${context.raw._r}`
                ];
              } else if (context.datasetIndex === 1) {
                return [`年份：${context.raw.x}`, `均分：${context.raw.y.toFixed(2)}`];
              }
            }
          }
        }
      }
    };
    return {
      history,
      chartOptions,
      startingYear: 2015,
      endingYear: moment().year(),
      minScore: 0
    };
  },
  actions: {
    async fetchHistory() {
      if (this.history?.length) return;
      const response = await fetch('https://api.netaba.re/history');
      if (!response.ok) {
        throw new Error('Resource not found'); // or any other error message
      }
      this.history = await response.json();
    }
  },
  getters: {
    chartData(state) {
      const themeStore = useThemeStore();
      const { primary, secondary } = themeStore;
      const data = state.history
        .map((item: HistoryItem) => {
          return {
            x: item.air_date,
            y: item.score,
            r: item.total,
            _n: item.name,
            _id: item.bgmId,
            _r: item.rank
          };
        })
        .filter(
          (item: any) =>
            item.y >= state.minScore &&
            moment(item.x).valueOf() >= moment(state.startingYear.toString(), 'YYYY').valueOf() &&
            moment(item.x).valueOf() <= moment((state.endingYear + 1).toString(), 'YYYY').valueOf()
        );
      //raw data completed here

      const lineData = getAverageScoresByYear(data);

      return {
        datasets: [
          {
            type: 'scatter',
            label: `${data.length}个作品`,
            backgroundColor: [primary],
            data: data
          },
          {
            type: 'line',
            label: '年均分走势',
            borderColor: [secondary],
            fill: true,
            backgroundColor: [secondary],
            data: lineData
          }
        ]
      };
    }
  }
});

// make sure to pass the right store definition, `useAuth` in this case.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useHistoryStore, import.meta.hot));
}
