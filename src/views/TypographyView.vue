<template>
  <main class="typography-page">
    <header class="type-hero">
      <p class="type-kicker">Typography</p>
      <h1>文字先于界面</h1>
      <p>
        netabare
        的界面依靠中文衬线、竖排导航、大号数据和克制的说明文字建立秩序。这里先把排版本身调清楚。
      </p>
    </header>

    <section class="type-section type-scale" aria-labelledby="scale-title">
      <div class="section-head">
        <p class="type-kicker">Scale</p>
        <h2 id="scale-title">字号层级</h2>
      </div>

      <div class="scale-list">
        <article v-for="sample in scaleSamples" :key="sample.name" class="scale-row">
          <div>
            <span>{{ sample.name }}</span>
            <code>{{ sample.note }}</code>
          </div>
          <div :class="['heading-lockup', sample.className]">
            <p class="lockup-kicker">{{ sample.kicker }}</p>
            <p class="lockup-title">{{ sample.text }}</p>
            <p class="lockup-subtitle">{{ sample.subtitle }}</p>
          </div>
        </article>
      </div>
    </section>

    <section class="type-section type-reading" aria-labelledby="reading-title">
      <div class="section-head">
        <p class="type-kicker">Reading</p>
        <h2 id="reading-title">正文与说明</h2>
      </div>

      <div class="reading-grid">
        <article>
          <h3>番组数据说明</h3>
          <p>
            趋势图适合使用短段落说明交互方式，行高需要留出呼吸，避免和图表标注抢夺注意力。
            正文不承担装饰任务，只解释用户下一步会怎样读图。
          </p>
          <div class="analysis-copy">
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
        <p class="type-kicker">Navigation</p>
        <h2 id="navigation-title">竖排导航</h2>
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
        <p class="type-kicker">Data</p>
        <h2 id="data-title">数字与标签</h2>
      </div>

      <div class="data-specimen">
        <article v-for="metric in metrics" :key="metric.label">
          <span>{{ metric.label }}</span>
          <strong>{{ metric.value }}</strong>
          <small>{{ metric.note }}</small>
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
    className: 'lockup-display'
  },
  {
    name: 'Page title',
    note: 'Page title + page kicker + page subtitle',
    kicker: 'Season',
    text: '当季动画',
    subtitle: '用于页面主标题，说明当前视图的范围与入口。',
    className: 'lockup-page'
  },
  {
    name: 'Section',
    note: 'Section title + section kicker + section subtitle',
    kicker: 'Score',
    text: '评分趋势',
    subtitle: '用于图表章节标题下方的简短说明，保持低对比度。',
    className: 'lockup-section'
  }
];

const metrics = [
  { label: '均分', value: '8.42', note: 'score' },
  { label: '排名', value: '024', note: 'rank' },
  { label: '收藏', value: '12000', note: 'collections' }
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

.type-kicker {
  color: var(--color-muted-foreground);
  font-family: var(--font-sans);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.type-hero h1 {
  font-size: clamp(3.5rem, 12vw, 8rem);
  font-weight: 700;
  letter-spacing: 0;
  line-height: 0.95;
}

.type-hero p,
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

.section-head h2 {
  font-size: clamp(1.75rem, 4vw, 3rem);
  font-weight: 700;
  line-height: 1.1;
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
  font-family: var(--font-sans);
  font-size: 0.78rem;
}

.heading-lockup {
  display: grid;
  gap: 0.55rem;
  padding-inline: 1rem;
}

.lockup-kicker {
  color: var(--color-muted-foreground);
  font-family: var(--font-sans);
  font-weight: 700;
  line-height: 1.2;
  text-transform: uppercase;
}

.lockup-title {
  font-weight: 700;
  letter-spacing: 0;
}

.lockup-subtitle {
  max-width: 36rem;
  color: var(--color-muted-foreground);
}

.lockup-display .lockup-kicker {
  font-size: 0.8rem;
  letter-spacing: 0.18em;
}

.lockup-display .lockup-title {
  font-size: clamp(3.5rem, 12vw, 8rem);
  line-height: 0.95;
}

.lockup-display .lockup-subtitle {
  font-size: clamp(1.15rem, 2.4cqw, 1.45rem);
  line-height: 1.85;
}

.lockup-page .lockup-kicker {
  font-size: 0.76rem;
  letter-spacing: 0.16em;
}

.lockup-page .lockup-title {
  font-size: clamp(2.5rem, 8vw, 5.5rem);
  line-height: 1;
}

.lockup-page .lockup-subtitle {
  font-size: clamp(1.05rem, 2.2cqw, 1.3rem);
  line-height: 1.85;
}

.lockup-section .lockup-kicker {
  font-size: 0.72rem;
  letter-spacing: 0.14em;
}

.lockup-section .lockup-title {
  font-size: clamp(2.4rem, 7vw, 5rem);
  line-height: 1;
}

.lockup-section .lockup-subtitle {
  font-size: clamp(1rem, 2cqw, 1.2rem);
  line-height: 1.8;
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

.analysis-copy {
  display: grid;
  gap: 0.75rem;
  border-left: 3px solid var(--color-gold);
  padding-left: 1rem;
}

.analysis-copy p {
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

.data-specimen {
  display: grid;
  gap: 1px;
  border: 1px solid color-mix(in srgb, var(--color-foreground) 22%, transparent);
  background: color-mix(in srgb, var(--color-foreground) 22%, transparent);
}

.data-specimen article {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.4rem 1rem;
  align-items: baseline;
  background: var(--color-background);
  padding: 1rem;
}

.data-specimen span,
.data-specimen small {
  color: var(--color-muted-foreground);
}

.data-specimen strong {
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 400;
  line-height: 1;
}

.data-specimen small {
  grid-column: 1 / -1;
  font-family: var(--font-sans);
  font-size: 0.78rem;
}

@container (min-width: 760px) {
  .scale-row {
    grid-template-columns: 14rem minmax(0, 1fr);
    align-items: baseline;
  }

  .reading-grid {
    grid-template-columns: 1.2fr 0.8fr;
  }

  .data-specimen {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
