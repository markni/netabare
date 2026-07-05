<template>
  <main class="typography-page">
    <header class="type-hero">
      <p class="type-display-kicker">Typography</p>
      <h1 class="type-display-title">文字先于界面</h1>
      <p class="type-display-subtitle">
        netabare
        的界面依靠中文衬线、竖排导航、大号数据和克制的说明文字建立秩序。这里先把排版本身调清楚。
      </p>
    </header>

    <section class="type-section type-scale" aria-labelledby="scale-title">
      <div class="section-head">
        <p class="type-section-kicker">Scale</p>
        <h2 id="scale-title" class="type-section-title">字号层级</h2>
      </div>

      <div class="scale-list">
        <article v-for="sample in scaleSamples" :key="sample.name" class="scale-row">
          <div>
            <span>{{ sample.name }}</span>
            <code>{{ sample.note }}</code>
          </div>
          <div :class="['heading-lockup', sample.className]">
            <p :class="sample.kickerClass">{{ sample.kicker }}</p>
            <p :class="sample.titleClass">{{ sample.text }}</p>
            <p :class="sample.subtitleClass">{{ sample.subtitle }}</p>
          </div>
        </article>
      </div>
    </section>

    <section class="type-section type-reading" aria-labelledby="reading-title">
      <div class="section-head">
        <p class="type-section-kicker">Reading</p>
        <h2 id="reading-title" class="type-section-title">正文与说明</h2>
      </div>

      <div class="reading-grid">
        <article>
          <h3>番组数据说明</h3>
          <p>
            趋势图适合使用短段落说明交互方式，行高需要留出呼吸，避免和图表标注抢夺注意力。
            正文不承担装饰任务，只解释用户下一步会怎样读图。
          </p>
          <div class="type-analysis-copy">
            <p>
              《葬送之旅》在高分段保持稳定，《星间列车》的排名曲线更陡，适合作为本季热度上升的观察样本。
            </p>
            <p>
              这种文字用于图表后的自动分析：短段落、明显左侧标记、正文仍然克制，不抢走图表本身的注意力。
            </p>
          </div>
        </article>

        <article class="link-sample">
          <h3>链接状态</h3>
          <a href="#reading-title">默认链接</a>
          <a href="#reading-title" class="accent-gold">高亮锚点</a>
          <a href="#reading-title" class="accent-blue">图表入口</a>
        </article>
      </div>
    </section>

    <section class="type-section type-navigation" aria-labelledby="navigation-title">
      <div class="section-head">
        <p class="type-section-kicker">Navigation</p>
        <h2 id="navigation-title" class="type-section-title">竖排导航</h2>
      </div>

      <div class="nav-strip">
        <span class="is-active vertical-rl">当季</span>
        <span class="vertical-rl">趋势</span>
        <span class="vertical-rl">历史</span>
        <span class="vertical-rl">用户</span>
        <span class="vertical-rl">实验</span>
      </div>
    </section>

    <section class="type-section type-data" aria-labelledby="data-title">
      <div class="section-head">
        <p class="type-section-kicker">Data</p>
        <h2 id="data-title" class="type-section-title">数字与标签</h2>
      </div>

      <div class="metric-specimen">
        <article v-for="metric in metrics" :key="metric.name" :class="metric.className">
          <div>
            <span>{{ metric.name }}</span>
            <code>{{ metric.note }}</code>
          </div>
          <strong :class="metric.valueClass">{{ metric.value }}</strong>
          <small>{{ metric.label }}</small>
        </article>
      </div>

      <div class="control-specimen">
        <article>
          <div>
            <span>Control label</span>
            <code>0.78rem / 700</code>
          </div>
          <label for="type-control-example" class="type-control-label">开始年份</label>
          <select id="type-control-example" class="metric-value" aria-label="开始年份示例">
            <option>2026</option>
          </select>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup>
const scaleSamples = [
  {
    name: 'Display',
    note: 'Display + display kicker + display subtitle',
    kicker: 'Netabare',
    text: '龙争虎斗',
    subtitle: '用于首页或专题开场，只在页面需要强主视觉时使用。',
    className: 'lockup-display',
    kickerClass: 'type-display-kicker',
    titleClass: 'type-display-title',
    subtitleClass: 'type-display-subtitle'
  },
  {
    name: 'Page title',
    note: 'Page title + page kicker + page subtitle',
    kicker: 'Season',
    text: '当季动画',
    subtitle: '用于页面主标题，说明当前视图的范围与入口。',
    className: 'lockup-page',
    kickerClass: 'type-page-kicker',
    titleClass: 'type-page-title',
    subtitleClass: 'type-page-subtitle'
  },
  {
    name: 'Section',
    note: 'Section title + section kicker + section subtitle',
    kicker: 'Score',
    text: '评分趋势',
    subtitle: '用于图表章节标题下方的简短说明，保持低对比度。',
    className: 'lockup-section',
    kickerClass: 'type-section-kicker',
    titleClass: 'type-section-title',
    subtitleClass: 'type-section-subtitle'
  },
  {
    name: 'List heading',
    note: 'List heading + compact note',
    kicker: 'Trending',
    text: '排名上升',
    subtitle: '用于列表、榜单或双栏内容组的标题。',
    className: 'lockup-list-heading',
    kickerClass: 'type-list-heading-kicker',
    titleClass: 'type-list-heading-title',
    subtitleClass: 'type-list-heading-subtitle'
  },
  {
    name: 'Item title',
    note: 'Item title + item subtitle',
    kicker: 'Subject',
    text: '葬送之旅',
    subtitle: 'Sousou no Frieren',
    className: 'lockup-item-title',
    kickerClass: 'type-item-kicker',
    titleClass: 'type-item-title',
    subtitleClass: 'type-item-subtitle'
  }
];

const metrics = [
  {
    name: 'Metric display',
    note: 'clamp(2.5rem, 8vw, 5rem) / 400',
    value: '12,000',
    label: '专题页主数字、核心统计',
    className: 'metric-display-sample',
    valueClass: 'metric-display'
  },
  {
    name: 'Metric value',
    note: 'clamp(1.35rem, 3vw, 2rem) / 700',
    value: '8.42',
    label: '表格数值、卡片数值、筛选当前值',
    className: 'metric-value-sample',
    valueClass: 'metric-value'
  },
  {
    name: 'Metric delta',
    note: 'clamp(0.95rem, 1.8vw, 1.2rem) / 700',
    value: '▴0.31',
    label: '变化值、小型评分、趋势行内数字',
    className: 'metric-delta-sample',
    valueClass: 'metric-delta text-pink'
  }
];
</script>

<style scoped>
.typography-page {
  container-type: inline-size;
  display: grid;
  gap: clamp(3.5rem, 8vw, 6rem);
  padding-bottom: 6rem;
}

.type-hero {
  display: grid;
  max-width: 56rem;
  gap: 1.1rem;
  padding-top: clamp(2rem, 5vw, 4rem);
}

.reading-grid p {
  color: var(--color-muted-foreground);
  font-size: 1.08rem;
  line-height: 1.9;
}

.type-section {
  display: grid;
  gap: 1.5rem;
  border-top: 1px solid color-mix(in srgb, var(--color-foreground) 22%, transparent);
  padding-top: 1.2rem;
}

.section-head {
  display: grid;
  gap: 0.35rem;
}

.scale-list {
  display: grid;
  border: 1px solid color-mix(in srgb, var(--color-foreground) 22%, transparent);
}

.scale-row {
  display: grid;
  gap: 1rem;
  padding: 1rem 0;
  border-top: 1px solid color-mix(in srgb, var(--color-foreground) 16%, transparent);
}

.scale-row:first-child {
  border-top: 0;
}

.scale-row > div {
  display: grid;
  gap: 0.25rem;
  padding-inline: 1rem;
}

.scale-row span {
  font-weight: 700;
}

.scale-row code {
  color: var(--color-muted-foreground);
  font-size: 0.78rem;
}

.heading-lockup {
  display: grid;
  gap: 0.55rem;
  padding-inline: 1rem;
}

.heading-lockup p:last-child {
  max-width: 36rem;
}

.lockup-item-title {
  gap: 0.35rem;
}

.reading-grid {
  display: grid;
  gap: 1px;
  border: 1px solid color-mix(in srgb, var(--color-foreground) 22%, transparent);
  background: color-mix(in srgb, var(--color-foreground) 22%, transparent);
}

.reading-grid article {
  display: grid;
  gap: 1rem;
  background: var(--color-background);
  padding: 1.25rem;
}

.reading-grid h3 {
  font-size: 1.35rem;
  font-weight: 700;
}

.type-analysis-copy p {
  margin: 0;
}

.link-sample a {
  width: fit-content;
  color: var(--color-foreground);
  text-decoration-line: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 0.35em;
}

.link-sample .accent-gold {
  text-decoration-color: var(--color-gold);
}

.link-sample .accent-blue {
  text-decoration-color: var(--color-blue);
}

.nav-strip {
  display: flex;
  min-height: 12rem;
  align-items: stretch;
  gap: 0.75rem;
  border-bottom: 1px solid color-mix(in srgb, var(--color-foreground) 22%, transparent);
}

.nav-strip span {
  border: 1px solid transparent;
  border-bottom: 0;
  padding: 2.5rem 0.75rem 0.75rem;
  color: var(--color-foreground);
  font-weight: 700;
}

.nav-strip .is-active {
  border-color: var(--color-foreground);
  color: var(--color-muted-foreground);
}

.metric-specimen {
  display: grid;
  gap: 1px;
  border: 1px solid color-mix(in srgb, var(--color-foreground) 22%, transparent);
  background: color-mix(in srgb, var(--color-foreground) 22%, transparent);
}

.metric-specimen article,
.control-specimen article {
  display: grid;
  gap: 0.4rem 1rem;
  align-items: baseline;
  background: var(--color-background);
  padding: 1rem;
}

.metric-specimen article > div {
  display: grid;
  gap: 0.2rem;
}

.metric-specimen span,
.metric-specimen code,
.metric-specimen small {
  color: var(--color-muted-foreground);
}

.metric-specimen code,
.metric-specimen small {
  font-size: 0.78rem;
}

.control-specimen {
  display: grid;
  border: 1px solid color-mix(in srgb, var(--color-foreground) 22%, transparent);
}

.control-specimen article > div {
  display: grid;
  gap: 0.2rem;
}

.control-specimen span,
.control-specimen code {
  color: var(--color-muted-foreground);
}

.control-specimen code {
  font-size: 0.78rem;
}

.control-specimen select {
  width: fit-content;
  appearance: none;
  border: 0;
  background: transparent;
  color: var(--color-foreground);
}

@container (min-width: 760px) {
  .scale-row {
    grid-template-columns: 14rem minmax(0, 1fr);
    align-items: baseline;
  }

  .reading-grid {
    grid-template-columns: 1.2fr 0.8fr;
  }

  .metric-specimen {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
