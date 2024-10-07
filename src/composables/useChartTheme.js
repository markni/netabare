import { computed, watch } from 'vue';
import { useThemeStore } from '@/stores/theme';
import Highcharts from '@/utils/highcharts';
import { BLACK, GRID_LINE_DEFAULT, IVORY, GRID_LINE_DARK } from '@/constants/colors';

export function useChartTheme(chartInstance) {
  const themeStore = useThemeStore();
  const isDarkMode = computed(() => themeStore.isDarkMode);

  const legendStyle = computed(() => ({
    itemStyle: {
      color: isDarkMode.value ? IVORY : BLACK
    },
    itemHoverStyle: {
      color: Highcharts.color(isDarkMode.value ? IVORY : BLACK)
        .brighten(isDarkMode.value ? -0.3 : 0.3)
        .get()
    }
  }));

  const dataLabelStyle = computed(() => ({
    color: isDarkMode.value ? IVORY : BLACK
  }));

  const yAxisStyle = computed(() => ({
    gridLineColor: isDarkMode.value ? GRID_LINE_DARK : GRID_LINE_DEFAULT
  }));

  const updateChartTheme = () => {
    if (chartInstance.value) {
      chartInstance.value.update({
        legend: legendStyle.value,
        plotOptions: {
          series: {
            dataLabels: {
              style: dataLabelStyle.value
            }
          }
        },
        yAxis: yAxisStyle.value
      });

      // Update individual series data labels
      chartInstance.value.series.forEach((series) => {
        if (series.options.dataLabels && series.options.dataLabels.enabled) {
          series.update(
            {
              dataLabels: {
                style: {
                  ...series.options.dataLabels.style,
                  ...dataLabelStyle.value
                }
              }
            },
            false
          );
        }
      });

      chartInstance.value.redraw();
    }
  };

  // Watch for changes in chartInstance
  watch(chartInstance, (newValue) => {
    if (newValue) {
      updateChartTheme();
    }
  });

  // Watch for theme changes
  watch(isDarkMode, updateChartTheme);

  return;
}
