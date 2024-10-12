import { computed, watch } from 'vue';
import { useThemeStore } from '@/stores/theme';
import _ from 'lodash';

export function useEpisodePlot(chartInstance, epsData) {
  const themeStore = useThemeStore();

  const epPlotLineColor = computed(() => {
    return themeStore.isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.1)';
  });

  const drawPlotLines = () => {
    if (!chartInstance.value) return;

    const epPlotOptions = {
      color: epPlotLineColor.value,
      width: 2,
      dashStyle: 'longdashdot',
      label: {
        verticalAlign: 'bottom',
        textAlign: 'right',
        y: -10,
        x: 5,
        useHTML: true
      }
    };

    chartInstance.value.xAxis[0].plotLinesAndBands.forEach((plotLine) => {
      chartInstance.value.xAxis[0].removePlotLine(plotLine.id);
    });

    Object.entries(epsData.value).forEach(([airdateValue, episodes]) => {
      let epOption = _.cloneDeep(epPlotOptions);
      epOption.value = Number(airdateValue);

      epOption.label.text = episodes
        .map(
          (ep) =>
            `<a target="_blank" href="https://bgm.tv/ep/${ep.id}">ep.${
              ep.sort
            } ${episodes.length > 1 ? '' : ep.name_cn || ep.name}</a>`
        )
        .join(', ');

      chartInstance.value.xAxis[0].addPlotLine(epOption);
    });
  };

  watch(() => themeStore.isDarkMode, drawPlotLines);

  return {
    drawPlotLines
  };
}
