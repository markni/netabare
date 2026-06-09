<template>
  <main v-if="isUiContentVisible" class="ui-showcase">
    <section class="hero-grid">
      <div class="hero-copy">
        <p class="section-kicker">界面谱系</p>
        <h1>
          <GlowTextBlock
            tag="span"
            text="从纸面、夜色与评分曲线里长出来的设计系统"
            glow-rgb="0,167,216"
          />
        </h1>
        <p class="hero-lede">
          将站内的番组数据、竖排导航、扇形色带、微光文字与克制控件整理成可复用的界面样张。
        </p>
      </div>

      <div class="hero-specimen" aria-label="色彩扇面">
        <ColorFan :animated="isUiAnimationEnabled" />
        <div class="hero-specimen__mark">
          <span>10色</span>
          <span>扇面</span>
        </div>
      </div>
    </section>

    <section class="meter-strip" aria-label="核心指标">
      <div v-for="metric in metrics" :key="metric.label" class="metric-cell">
        <span>{{ metric.label }}</span>
        <strong>{{ metric.value }}</strong>
        <DeltaDisplay :delta="metric.delta" :precision="1" :title="metric.title" />
      </div>
    </section>

    <section class="showcase-section">
      <div class="section-heading">
        <p class="section-kicker">色彩</p>
        <h2>高饱和信号，低噪声底色</h2>
      </div>

      <div class="color-layout">
        <div class="palette-field">
          <div
            v-for="swatch in swatches"
            :key="swatch.name"
            class="swatch"
            :style="{ '--swatch-color': swatch.color }"
          >
            <span>{{ swatch.name }}</span>
            <strong>{{ swatch.role }}</strong>
          </div>
        </div>

        <div class="signal-panel" aria-label="色彩信号">
          <div class="signal-panel__number">10</div>
          <div class="signal-panel__rails">
            <span
              v-for="(color, index) in colorSignals"
              :key="color"
              :style="{
                '--signal-color': color,
                '--signal-top': `${14 + index * 3.4}%`,
                '--signal-bottom': `${8 + (9 - index) * 2.4}%`
              }"
            ></span>
          </div>
          <p>同组颜色贯穿线、点、柱和状态，在不同图表密度中保持清晰识别。</p>
        </div>
      </div>
    </section>

    <section class="showcase-section type-section">
      <div class="section-heading">
        <p class="section-kicker">排版</p>
        <h2>中文衬线作为信息的主声部</h2>
      </div>

      <div class="type-grid">
        <div class="vertical-sample vertical-rl">
          <span>当季动画</span>
          <span>评分趋势</span>
          <span>历史分布</span>
          <span>个人评分</span>
        </div>
        <div class="type-stack">
          <p class="type-label">标题</p>
          <p class="type-display">龙争虎斗</p>
          <p class="type-label">正文</p>
          <p class="type-body">
            文字保留纸面感，字号层级明确，留白偏宽，适合承载图表、番组标题与解释性注释。
          </p>
          <p class="type-label">微光</p>
          <GlowTextBlock
            class="type-glow"
            text="悬停、滚动与夜间模式中，文字可以像屏幕余辉那样慢慢亮起。"
            glow-rgb="245,178,27"
          />
        </div>
      </div>
    </section>

    <section class="showcase-section">
      <div class="section-heading">
        <p class="section-kicker">组件</p>
        <h2>状态清楚，边界轻薄</h2>
      </div>

      <div class="component-grid">
        <div class="component-panel control-panel">
          <div class="panel-head">
            <span>明暗切换</span>
            <EclipseToggle
              :mode="themeStore.isDarkMode ? 'dark' : 'light'"
              @toggle="themeStore.toggleDarkMode"
            />
          </div>
          <div class="toggle-row">
            <button class="state-button state-button--active">已选择</button>
            <button class="state-button">可操作</button>
            <button class="state-button state-button--quiet">弱提示</button>
          </div>
          <div class="tag-row">
            <span v-for="tag in tags" :key="tag">{{ tag }}</span>
          </div>
        </div>

        <div class="component-panel ranking-panel">
          <div class="panel-head">
            <span>榜单条目</span>
            <strong>本季</strong>
          </div>
          <ol>
            <li v-for="item in ranking" :key="item.name">
              <span>{{ item.rank }}</span>
              <div>
                <strong>{{ item.name }}</strong>
                <small>{{ item.note }}</small>
              </div>
              <DeltaDisplay :delta="item.delta" :precision="2" :title="item.title" />
            </li>
          </ol>
        </div>

        <div class="component-panel overlay-panel">
          <div class="panel-head">
            <span>读取状态</span>
            <strong>秋色展开</strong>
          </div>
          <div class="fall-preview" aria-label="秋季读取动画预览">
            <span
              v-for="(color, index) in COLORS10_VIVID"
              :key="`fall-preview-${color}`"
              :style="{
                '--preview-color': color,
                '--preview-offset': `${index % 2 === 0 ? 18 : 46}%`
              }"
            ></span>
          </div>
          <p>加载时落色循环，结束时色幕收起，把后面的界面露出来。</p>
        </div>
      </div>
    </section>

    <section class="showcase-section">
      <div class="section-heading">
        <p class="section-kicker">图表</p>
        <h2>让分布、波动与争议快速可辨</h2>
      </div>

      <div class="chart-board">
        <div class="score-bars" aria-label="评分分布">
          <div
            v-for="bar in scoreBars"
            :key="bar.score"
            class="score-bar"
            :style="{ '--bar-height': `${bar.value}%`, '--bar-color': bar.color }"
          >
            <span></span>
            <small>{{ bar.score }}</small>
          </div>
        </div>

        <div class="trend-panel">
          <svg viewBox="0 0 520 220" role="img" aria-label="趋势曲线">
            <path class="grid-line" d="M0 44H520M0 88H520M0 132H520M0 176H520" />
            <path
              v-for="line in trendLines"
              :key="line.color"
              class="trend-line"
              :d="line.path"
              :stroke="line.color"
            />
            <circle
              v-for="point in trendPoints"
              :key="`${point.cx}-${point.cy}-${point.color}`"
              :cx="point.cx"
              :cy="point.cy"
              r="5"
              :fill="point.color"
            />
          </svg>
          <div class="trend-legend">
            <span v-for="line in trendLegend" :key="line.name">
              <i :style="{ backgroundColor: line.color }"></i>{{ line.name }}
            </span>
          </div>
        </div>
      </div>
    </section>
  </main>

  <FallPageLoading
    v-if="showFallLoader"
    :loading="isFallLoaderLoading"
    @after-exit="handleFallLoaderExit"
  />
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import DeltaDisplay from '@/components/DeltaDisplay.vue';
import EclipseToggle from '@/components/ui/EclipseToggle.vue';
import FallPageLoading from '@/components/FallPageLoading.vue';
import GlowTextBlock from '@/components/GlowTextBlock.vue';
import ColorFan from '@/components/ui/ColorFan.vue';
import { BLUE, COLORS10_VIVID, GOLD, IVORY, PINK, RED, TEAL, WHITE } from '@/constants/colors';
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore();
const showFallLoader = ref(true);
const isFallLoaderLoading = ref(true);
const isUiContentVisible = ref(false);
const isUiAnimationEnabled = ref(false);
let fallLoaderTimer = null;

const swatches = [
  { name: '赤', role: '争议', color: RED },
  { name: '桃', role: '上升', color: PINK },
  { name: '金', role: '焦点', color: GOLD },
  { name: '青', role: '流动', color: BLUE },
  { name: '碧', role: '平衡', color: TEAL },
  { name: '纸', role: '底色', color: IVORY },
  { name: '白', role: '留白', color: WHITE }
];

const colorSignals = COLORS10_VIVID;

const metrics = [
  { label: '均分', value: '8.42', delta: 0.4, title: '30天内均分变化' },
  { label: '排名', value: '024', delta: -1.2, title: '30天内排名变化' },
  { label: '收藏', value: '12000', delta: 8.5, title: '30天内收藏变化' }
];

const tags = ['新番', '总榜', '在看', '冷门', '争议'];

const ranking = [
  { rank: '1', name: '葬送之旅', note: '高分稳定', delta: 0.18, title: '均分变化' },
  { rank: '2', name: '星间列车', note: '热度上升', delta: 0.31, title: '均分变化' },
  { rank: '3', name: '午夜电波', note: '讨论分化', delta: -0.12, title: '均分变化' }
];

const scoreBars = [
  { score: '1', value: 14, color: '#88cdbd' },
  { score: '2', value: 18, color: '#75cdd6' },
  { score: '3', value: 24, color: '#77c9ef' },
  { score: '4', value: 35, color: '#93c1ff' },
  { score: '5', value: 48, color: '#beb4ff' },
  { score: '6', value: 61, color: '#e9a4ee' },
  { score: '7', value: 78, color: '#ff97ca' },
  { score: '8', value: 92, color: '#ff989f' },
  { score: '9', value: 71, color: '#ff9d6e' },
  { score: '10', value: 44, color: '#e4ae49' }
];

const trendLines = [
  { color: TEAL, path: 'M6 150C70 128 104 104 158 116S250 170 310 124 398 62 514 82' },
  { color: PINK, path: 'M6 98C74 80 120 86 170 72S260 46 322 92 424 158 514 132' },
  { color: GOLD, path: 'M6 178C88 172 120 140 184 148S292 204 352 158 438 112 514 116' }
];

const trendPoints = [
  { cx: 158, cy: 116, color: TEAL },
  { cx: 310, cy: 124, color: TEAL },
  { cx: 170, cy: 72, color: PINK },
  { cx: 322, cy: 92, color: PINK },
  { cx: 184, cy: 148, color: GOLD },
  { cx: 352, cy: 158, color: GOLD }
];

const trendLegend = [
  { name: '均分', color: TEAL },
  { name: '热度', color: PINK },
  { name: '争议', color: GOLD }
];

const handleFallLoaderExit = () => {
  showFallLoader.value = false;
  isUiAnimationEnabled.value = true;
};

onMounted(() => {
  themeStore.initTheme();
  fallLoaderTimer = window.setTimeout(() => {
    isUiContentVisible.value = true;
    isFallLoaderLoading.value = false;
  }, 5000);
});

onUnmounted(() => {
  if (fallLoaderTimer !== null) {
    window.clearTimeout(fallLoaderTimer);
  }
});
</script>

<style scoped>
.ui-showcase {
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  gap: clamp(4rem, 8vw, 8rem);
  padding-bottom: 7rem;
}

.hero-grid {
  display: grid;
  min-height: min(74dvh, 760px);
  grid-template-columns: minmax(0, 1fr);
  gap: 2rem;
  align-items: end;
}

.hero-copy {
  display: flex;
  max-width: 48rem;
  flex-direction: column;
  gap: 1.25rem;
}

.section-kicker {
  color: var(--color-muted-foreground);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.32em;
}

.hero-copy h1 {
  max-width: 13em;
  font-size: clamp(2.5rem, 8vw, 7.6rem);
  font-weight: 700;
  line-height: 0.98;
}

.hero-lede {
  max-width: 42rem;
  color: var(--color-muted-foreground);
  font-size: clamp(1rem, 2vw, 1.35rem);
  line-height: 2;
}

.hero-specimen {
  position: relative;
  height: clamp(18rem, 36vw, 28rem);
  margin-right: calc((100dvw - 100cqw) / -2);
  overflow: hidden;
  border-block: 1px solid color-mix(in srgb, var(--color-foreground) 24%, transparent);
}

.hero-specimen__mark {
  position: absolute;
  right: clamp(1rem, 5vw, 5rem);
  bottom: 1rem;
  display: flex;
  gap: 0.35rem;
  color: white;
  font-size: clamp(2.25rem, 7vw, 6rem);
  font-weight: 700;
  line-height: 0.95;
  mix-blend-mode: difference;
  writing-mode: vertical-rl;
}

.meter-strip {
  display: grid;
  border-block: 1px solid color-mix(in srgb, var(--color-foreground) 28%, transparent);
}

.metric-cell {
  display: grid;
  grid-template-columns: 4.5rem 1fr auto;
  gap: 1rem;
  align-items: baseline;
  padding: 1.4rem 0;
  border-bottom: 1px solid color-mix(in srgb, var(--color-foreground) 18%, transparent);
}

.metric-cell:last-child {
  border-bottom: 0;
}

.metric-cell span {
  color: var(--color-muted-foreground);
  font-size: 0.9rem;
}

.metric-cell strong {
  font-size: clamp(1.8rem, 6vw, 4.6rem);
  line-height: 1;
}

.showcase-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section-heading {
  display: grid;
  gap: 0.7rem;
}

.section-heading h2 {
  max-width: 13em;
  font-size: clamp(2rem, 4.5vw, 4.8rem);
  font-weight: 700;
  line-height: 1.05;
}

.color-layout {
  display: grid;
  gap: 1.5rem;
}

.palette-field {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  background: color-mix(in srgb, var(--color-foreground) 30%, transparent);
}

.swatch {
  min-height: 9rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  background:
    linear-gradient(to bottom, transparent, color-mix(in srgb, black 12%, transparent)),
    var(--swatch-color);
  color: white;
  text-shadow: 0 1px 14px rgba(0, 0, 0, 0.28);
}

.swatch:nth-last-child(-n + 2) {
  color: var(--color-foreground);
  text-shadow: none;
}

.swatch span {
  font-size: 2.3rem;
  font-weight: 700;
}

.swatch strong {
  align-self: flex-end;
  font-size: 0.95rem;
}

.signal-panel {
  position: relative;
  display: grid;
  min-height: 24rem;
  grid-template-rows: 1fr auto;
  gap: 1rem;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--color-foreground) 26%, transparent);
  background:
    linear-gradient(
        90deg,
        color-mix(in srgb, var(--color-foreground) 5%, transparent) 1px,
        transparent 1px
      )
      0 0 / 2.2rem 100%,
    linear-gradient(
        0deg,
        color-mix(in srgb, var(--color-foreground) 7%, transparent) 1px,
        transparent 1px
      )
      0 0 / 100% 2.2rem;
}

.signal-panel__number {
  position: absolute;
  right: 0.8rem;
  top: -0.25rem;
  color: color-mix(in srgb, var(--color-foreground) 9%, transparent);
  font-size: clamp(8rem, 26vw, 20rem);
  font-weight: 700;
  line-height: 0.8;
  pointer-events: none;
}

.signal-panel__rails {
  position: relative;
  display: grid;
  grid-template-columns: repeat(10, minmax(0, 1fr));
  gap: 0;
  align-items: stretch;
  min-height: 17rem;
}

.signal-panel__rails::before {
  content: '';
  position: absolute;
  inset: 18% 0 auto;
  height: 1px;
  background: color-mix(in srgb, var(--color-foreground) 30%, transparent);
}

.signal-panel__rails span {
  position: relative;
  min-width: 0;
}

.signal-panel__rails span::before,
.signal-panel__rails span::after {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: var(--signal-color);
}

.signal-panel__rails span::before {
  top: var(--signal-top);
  width: clamp(0.65rem, 1.8vw, 1.1rem);
  height: clamp(0.65rem, 1.8vw, 1.1rem);
  border-radius: 999px;
  box-shadow:
    0 0 0 1px var(--color-background),
    0 0 28px color-mix(in srgb, var(--signal-color) 55%, transparent);
}

.signal-panel__rails span::after {
  top: calc(var(--signal-top) + 5%);
  bottom: var(--signal-bottom);
  width: 0.38rem;
}

.signal-panel p {
  position: relative;
  padding: 0 1rem 1rem;
  color: var(--color-muted-foreground);
  line-height: 1.8;
}

.type-grid {
  display: grid;
  gap: 1.5rem;
}

.vertical-sample {
  min-height: 24rem;
  display: flex;
  gap: 1.4rem;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem;
  border: 1px solid color-mix(in srgb, var(--color-foreground) 26%, transparent);
  font-size: clamp(1.5rem, 5vw, 3rem);
  font-weight: 700;
}

.vertical-sample span {
  border-inline-start: 1px solid color-mix(in srgb, var(--color-foreground) 24%, transparent);
  padding-inline-start: 0.55rem;
}

.type-stack {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.9rem;
  padding-block: 1rem;
}

.type-label {
  color: var(--color-muted-foreground);
  font-size: 0.78rem;
  font-weight: 700;
}

.type-display {
  font-size: clamp(3rem, 8vw, 8rem);
  font-weight: 700;
  line-height: 0.95;
}

.type-body,
.type-glow {
  max-width: 38rem;
  font-size: clamp(1.05rem, 2vw, 1.35rem);
  line-height: 2;
}

.component-grid,
.chart-board {
  display: grid;
  gap: 1px;
  background: color-mix(in srgb, var(--color-foreground) 28%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-foreground) 28%, transparent);
}

.component-panel,
.trend-panel,
.score-bars {
  background: var(--color-background);
}

.component-panel {
  min-height: 20rem;
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  padding: 1.2rem;
}

.panel-head {
  display: flex;
  min-height: 3rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.panel-head span {
  font-size: 1.2rem;
  font-weight: 700;
}

.panel-head strong {
  color: var(--color-muted-foreground);
  font-size: 0.85rem;
}

.toggle-row,
.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.state-button {
  min-height: 2.75rem;
  border: 1px solid color-mix(in srgb, var(--color-foreground) 38%, transparent);
  padding: 0.65rem 1rem;
  cursor: pointer;
  transition:
    background-color 180ms ease,
    color 180ms ease,
    transform 180ms ease;
}

.state-button:hover {
  transform: translateY(-2px);
  background: var(--color-foreground);
  color: var(--color-background);
}

.state-button--active {
  border-color: var(--color-teal);
  background: var(--color-teal);
  color: white;
}

.state-button--quiet {
  color: var(--color-muted-foreground);
}

.tag-row span {
  border: 1px solid color-mix(in srgb, var(--color-foreground) 26%, transparent);
  padding: 0.35rem 0.7rem;
  color: var(--color-muted-foreground);
  font-size: 0.9rem;
}

.ranking-panel ol {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.ranking-panel li {
  display: grid;
  grid-template-columns: 2rem 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem 0;
  border-top: 1px solid color-mix(in srgb, var(--color-foreground) 18%, transparent);
}

.ranking-panel li > span {
  color: var(--color-muted-foreground);
  font-size: 1.35rem;
}

.ranking-panel li strong {
  display: block;
  font-size: 1.08rem;
}

.ranking-panel li small {
  color: var(--color-muted-foreground);
}

.fall-preview {
  position: relative;
  min-height: 7rem;
  overflow: hidden;
  border-block: 1px solid color-mix(in srgb, var(--color-foreground) 18%, transparent);
  background:
    linear-gradient(
        90deg,
        color-mix(in srgb, var(--color-foreground) 7%, transparent) 1px,
        transparent 1px
      )
      0 0 / 1.7rem 100%,
    color-mix(in srgb, var(--color-background) 88%, var(--color-foreground) 12%);
}

.fall-preview span {
  position: absolute;
  top: -1rem;
  left: calc(5% + var(--preview-offset));
  width: 1rem;
  height: 1.55rem;
  border-radius: 80% 12% 72% 16%;
  background: var(--preview-color);
  box-shadow: 0 12px 22px rgba(0, 0, 0, 0.14);
  transform: translateY(calc((var(--preview-offset) * 1.5))) rotate(22deg);
}

.fall-preview span:nth-child(3n) {
  border-radius: 12% 80% 18% 72%;
  transform: translateY(calc((var(--preview-offset) * 1.1))) rotate(-28deg);
}

.fall-preview span:nth-child(4n) {
  width: 1.45rem;
  height: 2rem;
}

.overlay-panel p {
  margin-top: auto;
  color: var(--color-muted-foreground);
  line-height: 1.8;
}

.score-bars {
  min-height: 22rem;
  display: grid;
  grid-template-columns: repeat(10, minmax(0, 1fr));
  gap: 0.45rem;
  align-items: end;
  padding: 1.25rem;
}

.score-bar {
  display: grid;
  height: 100%;
  grid-template-rows: 1fr auto;
  gap: 0.8rem;
  align-items: end;
}

.score-bar span {
  height: var(--bar-height);
  min-height: 1.5rem;
  background: var(--bar-color);
  transition: height 240ms ease;
}

.score-bar:hover span {
  height: min(100%, calc(var(--bar-height) + 6%));
}

.score-bar small {
  color: var(--color-muted-foreground);
  text-align: center;
}

.trend-panel {
  min-height: 22rem;
  display: grid;
  grid-template-rows: 1fr auto;
  gap: 1rem;
  padding: 1.25rem;
}

.trend-panel svg {
  width: 100%;
  height: 100%;
  min-height: 16rem;
  overflow: visible;
}

.grid-line {
  fill: none;
  stroke: color-mix(in srgb, var(--color-foreground) 16%, transparent);
  stroke-width: 1;
}

.trend-line {
  fill: none;
  stroke-width: 5;
  stroke-linecap: round;
  filter: drop-shadow(0 8px 18px color-mix(in srgb, currentColor 24%, transparent));
}

.trend-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  color: var(--color-muted-foreground);
}

.trend-legend span {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.trend-legend i {
  width: 0.8rem;
  height: 0.8rem;
  display: inline-block;
}

@container (min-width: 760px) {
  .hero-grid {
    grid-template-columns: minmax(0, 0.9fr) minmax(18rem, 0.75fr);
  }

  .meter-strip {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .metric-cell {
    grid-template-columns: 1fr;
    border-right: 1px solid color-mix(in srgb, var(--color-foreground) 18%, transparent);
    border-bottom: 0;
  }

  .metric-cell:last-child {
    border-right: 0;
  }

  .color-layout,
  .type-grid,
  .chart-board {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }

  .component-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@container (min-width: 980px) {
  .palette-field {
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }

  .swatch {
    min-height: 22rem;
  }

  .swatch span {
    writing-mode: vertical-rl;
  }
}

@media (prefers-reduced-motion: reduce) {
  .score-bar span,
  .state-button {
    animation: none;
    transition: none;
  }
}
</style>
