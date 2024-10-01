import { computed, watch } from 'vue';
import { useThemeStore } from '@/stores/theme';
import Highcharts from '@/utils/highcharts';

export function useChartTheme(chartInstance) {
  const themeStore = useThemeStore();
  const isDarkMode = computed(() => themeStore.isDarkMode);

  const legendStyle = computed(() => ({
    itemStyle: {
      color: isDarkMode.value ? '#FFFFFF' : '#000000'
    },
    itemHoverStyle: {
      color: Highcharts.color(isDarkMode.value ? '#FFFFFF' : '#000000')
        .brighten(isDarkMode.value ? -0.3 : 0.3)
        .get()
    }
  }));

  watch(isDarkMode, () => {
    if (chartInstance.value) {
      chartInstance.value.update({
        legend: legendStyle.value
      });
    }
  });

  return {
    legendStyle
  };
}
