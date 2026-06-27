<script setup>
import { computed, onMounted, ref } from 'vue';
import { BLUE, GOLD, PINK, TEAL } from '@/constants/colors.js';

const DATA_PATH = `${import.meta.env.BASE_URL}assets/anime-food-spring-2026/data.json`;
const ASSET_BASE_PATH = `${import.meta.env.BASE_URL}assets/anime-food-spring-2026/`;

const report = ref(null);
const loading = ref(true);
const error = ref('');

const formatter = new Intl.NumberFormat('zh-CN');

const formatNumber = (value) => formatter.format(Number(value) || 0);
const formatScore = (value) => (Number.isFinite(Number(value)) ? Number(value).toFixed(2) : '0.00');
const imageUrl = (relativePath) => `${ASSET_BASE_PATH}${relativePath || ''}`.replace(/\/+/g, '/');

const subjects = computed(() => report.value?.subjects || []);
const stats = computed(() => report.value?.stats || {});
const page = computed(() => report.value?.page || {});
const heroImages = computed(() => page.value.heroImages?.slice(0, 30) || []);
const heroImage = computed(() => heroImages.value[0] || null);
const taxonomyGroups = computed(() => page.value.taxonomyGroups || []);
const topFoodImages = computed(() => page.value.topFoodImages || []);
const mostLists = computed(() => page.value.mostLists || []);
const leaderboard = computed(() => subjects.value.slice(0, 10));
const topFoods = computed(() => topFoodImages.value.slice(0, 8));

const scoreDensity = computed(() => {
  const sorted = [...subjects.value].sort((a, b) => a.frames - b.frames);
  if (!sorted.length) return [];

  const size = Math.ceil(sorted.length / 4);
  const rows = [];
  for (let index = 0; index < 4; index += 1) {
    const group = sorted.slice(index * size, (index + 1) * size);
    if (!group.length) continue;
    const avgFood = group.reduce((sum, subject) => sum + subject.frames, 0) / group.length;
    const avgScore = group.reduce((sum, subject) => sum + subject.score, 0) / group.length;
    rows.push({
      label: ['少量', '偏少', '偏多', '很多'][index],
      avgFood,
      avgScore
    });
  }

  const maxScore = Math.max(...rows.map((row) => row.avgScore), 1);
  return rows.map((row) => ({ ...row, width: `${Math.max(6, (row.avgScore / maxScore) * 100)}%` }));
});

const fetchReport = async () => {
  loading.value = true;
  error.value = '';
  try {
    const response = await fetch(`${DATA_PATH}?v=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    report.value = await response.json();
  } catch (fetchError) {
    error.value = `食物报告读取失败：${fetchError.message}`;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchReport);
</script>

<template>
  <main class="food-page">
    <section class="food-hero bleed-both-to-viewport">
      <div v-if="heroImage" class="hero-photo-grid" aria-hidden="true">
        <img :src="imageUrl(heroImage.relativePath)" alt="" />
      </div>

      <div class="hero-inner">
        <div class="hero-copy">
          <p class="hero-stamp">2026 春季动画 · 食物、甜点与热气</p>
          <h1>动画 x 食物</h1>
          <p>
            这一季的动画把饭菜摆到了叙事前景：有人用甜点制造暧昧，有人靠热汤缓一口气，也有人把一桌饭拍成角色关系的温度计。
          </p>

          <div v-if="report" class="hero-stats" aria-label="核心数字">
            <div>
              <strong>{{ formatNumber(stats.verifiedFrames) }}</strong>
              <span>入选食物瞬间</span>
            </div>
            <div>
              <strong>{{ formatNumber(stats.subjectCount) }}</strong>
              <span>2026 春季动画</span>
            </div>
            <div>
              <strong>{{ formatNumber(stats.foodMentionCount) }}</strong>
              <span>菜名与饮品</span>
            </div>
            <div>
              <strong>{{ formatScore(stats.avgScore) }}</strong>
              <span>平均评分</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="loading" class="state-panel">正在上菜…</section>
    <section v-else-if="error" class="state-panel state-panel--error">{{ error }}</section>

    <template v-else-if="report">
      <section class="food-section">
        <div class="section-heading">
          <p class="section-kicker">Leaderboard</p>
          <h2>最有食欲的作品</h2>
          <p>有些作品只是让角色吃饭，有些作品则把食物拍成节奏、情绪和生活质感。</p>
        </div>

        <div class="leaderboard-table-wrap">
          <table class="leaderboard-table">
            <thead>
              <tr>
                <th>名次</th>
                <th>作品</th>
                <th>食物</th>
                <th>评分</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(subject, index) in leaderboard" :key="subject.bgmId">
                <td>{{ index + 1 }}</td>
                <td>
                  <RouterLink :to="`/subject/${subject.bgmId}`">
                    <strong>{{ subject.title }}</strong>
                    <small>{{ subject.originalTitle }}</small>
                  </RouterLink>
                </td>
                <td>{{ formatNumber(subject.frames) }}</td>
                <td>{{ formatScore(subject.score) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="food-section">
        <div class="section-heading">
          <p class="section-kicker">Most</p>
          <h2>这一季的 Top 3 小榜</h2>
        </div>

        <div class="most-grid">
          <article
            v-for="list in mostLists"
            :key="list.title"
            :class="['most-card', { 'most-card--wide': list.wide }]"
          >
            <h3>{{ list.title }}</h3>
            <a
              v-if="list.items[0]?.relativePath"
              class="most-feature"
              :href="list.items[0].episodeUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img :src="imageUrl(list.items[0].relativePath)" :alt="list.items[0].title" />
              <span>1</span>
              <div>
                <b>{{ list.items[0].title }}</b>
                <small>{{ list.items[0].meta }}</small>
              </div>
              <strong>{{ list.items[0].value }}</strong>
            </a>

            <div class="most-runner-list">
              <div
                v-for="(item, index) in list.items.slice(1)"
                :key="`${list.title}-${item.subjectName}`"
                class="most-row"
              >
                <span>{{ index + 2 }}</span>
                <a
                  v-if="item.relativePath"
                  :href="item.episodeUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img :src="imageUrl(item.relativePath)" :alt="item.title" />
                </a>
                <div>
                  <b>{{ item.title }}</b>
                  <small>{{ item.meta }}</small>
                </div>
                <strong>{{ item.value }}</strong>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="food-section">
        <div class="section-heading">
          <p class="section-kicker">Taxonomy</p>
          <h2>食物家族</h2>
        </div>

        <div class="taxonomy-grid">
          <article v-for="group in taxonomyGroups" :key="group.name" class="taxonomy-card">
            <div>
              <span>{{ formatNumber(group.count) }} 次提及</span>
              <h3>{{ group.displayName }}</h3>
            </div>
            <div class="taxonomy-images">
              <a
                v-for="image in group.images"
                :key="image.relativePath"
                :href="image.episodeUrl"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img :src="imageUrl(image.relativePath)" :alt="group.displayName" />
                <small>{{ image.title || image.subjectName }}</small>
              </a>
            </div>
          </article>
        </div>
      </section>

      <section class="food-section">
        <div class="section-heading">
          <p class="section-kicker">Tags</p>
          <h2>高频食物标签</h2>
        </div>

        <div class="tag-board">
          <article v-for="(food, index) in topFoods" :key="food.name" class="food-tag-card">
            <div class="food-tag-card__head">
              <span>{{ food.rank || index + 1 }}</span>
              <h3>{{ food.displayName }}</h3>
              <b>{{ formatNumber(food.count) }} 次</b>
            </div>
            <div class="food-tag-images">
              <a
                v-for="image in food.images"
                :key="image.relativePath"
                :href="image.episodeUrl"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img :src="imageUrl(image.relativePath)" :alt="food.displayName" />
                <small>{{ image.title || image.subjectName }}</small>
              </a>
            </div>
          </article>
        </div>
      </section>

      <section class="food-section score-section">
        <div class="section-heading">
          <p class="section-kicker">Score</p>
          <h2>食物越多，评分越高吗？</h2>
          <p>把作品按食物数量分成四组，再看每组的平均评分。</p>
        </div>

        <div class="density-panel">
          <div v-for="row in scoreDensity" :key="row.label" class="density-row">
            <span>{{ row.label }}</span>
            <i><b :style="{ width: row.width }"></b></i>
            <strong>{{ formatScore(row.avgScore) }}</strong>
            <small>平均 {{ formatNumber(Math.round(row.avgFood)) }} 个食物瞬间</small>
          </div>
        </div>
      </section>
    </template>
  </main>
</template>

<style scoped>
.food-page {
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  gap: clamp(4rem, 8vw, 7rem);
  padding-bottom: 7rem;
}

.food-hero {
  position: relative;
  min-height: 96dvh;
  display: grid;
  align-items: end;
  overflow: hidden;
  isolation: isolate;
  padding: 4rem 0 2.875rem;
  border-block: 1px solid color-mix(in srgb, var(--color-foreground) 22%, transparent);
  color: #241c18;
  background:
    repeating-linear-gradient(90deg, rgb(36 28 24 / 8%) 0 1px, transparent 1px 74px) 0 100% / 100%
      48% no-repeat,
    linear-gradient(
      115deg,
      rgb(255 248 239 / 98%) 0%,
      rgb(255 237 205 / 90%) 45%,
      rgb(244 181 158 / 78%) 100%
    ),
    #f9dfbd;
}

.food-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(
      90deg,
      rgb(255 248 239 / 88%) 0%,
      rgb(255 248 239 / 78%) 30%,
      rgb(255 248 239 / 38%) 58%,
      rgb(255 248 239 / 12%) 100%
    ),
    linear-gradient(0deg, rgb(244 181 158 / 78%) 0%, rgb(244 181 158 / 25%) 38%, transparent 72%);
  pointer-events: none;
}

.hero-inner {
  position: relative;
  z-index: 2;
  width: min(1180px, calc(100% - 2rem));
  margin: auto;
}

.hero-photo-grid {
  position: absolute;
  inset: -6vh -5vw -6vh -5vw;
  z-index: 0;
  transform: rotate(-3deg) scale(1.08);
  transform-origin: center;
  filter: saturate(1.05) contrast(1.02);
  pointer-events: none;
}

.hero-photo-grid::before {
  content: '';
  position: absolute;
  inset: 8% -8% -10% 18%;
  z-index: -1;
  background: rgb(255 255 255 / 20%);
  filter: blur(28px);
}

.hero-photo-grid img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.hero-copy {
  position: relative;
  z-index: 2;
  max-width: 47rem;
  margin-inline: clamp(0rem, 16vw, 13rem) auto;
}

.hero-stamp {
  width: fit-content;
  border: 1px solid rgb(36 28 24 / 14%);
  border-radius: 999px;
  background: rgb(255 255 255 / 58%);
  padding: 0.6rem 0.9rem;
  font-size: clamp(0.78rem, 1.7vw, 0.98rem);
  font-weight: 800;
}

.section-kicker {
  color: var(--color-muted-foreground);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.32em;
  text-transform: uppercase;
}

.hero-copy h1 {
  max-width: 48.75rem;
  margin: 0 0 1.25rem;
  font-size: clamp(3rem, 8vw, 7.25rem);
  font-weight: 950;
  line-height: 0.88;
}

.hero-copy > p:not(.hero-stamp),
.section-heading p:last-child {
  max-width: 44rem;
  margin-top: 1.2rem;
  color: rgb(71 55 46 / 92%);
  font-size: clamp(1rem, 2vw, 1.25rem);
  line-height: 2;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.9rem;
  margin-top: 2rem;
}

.hero-stats div {
  border: 1px solid rgb(36 28 24 / 14%);
  border-radius: 0.5rem;
  background: rgb(255 255 255 / 62%);
  padding: 1rem;
}

.hero-stats strong {
  display: block;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 900;
  line-height: 1;
}

.hero-stats span {
  display: block;
  margin-top: 0.45rem;
  color: rgb(71 55 46 / 78%);
  font-size: 0.88rem;
  font-weight: 800;
  line-height: 1.35;
}

.state-panel {
  border: 1px solid color-mix(in srgb, var(--color-foreground) 24%, transparent);
  padding: 2rem;
  color: var(--color-muted-foreground);
}

.state-panel--error {
  color: var(--color-red);
}

.density-row small,
.leaderboard-table small,
.most-card p,
.most-row small,
.taxonomy-card span {
  color: var(--color-muted-foreground);
}

.food-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section-heading h2 {
  max-width: 13em;
  margin-top: 0.6rem;
  font-size: clamp(2.25rem, 6vw, 5.4rem);
  font-weight: 700;
  line-height: 1.02;
}

.leaderboard-table-wrap,
.taxonomy-grid,
.tag-board,
.most-grid {
  display: grid;
  gap: 1px;
  border: 1px solid color-mix(in srgb, var(--color-foreground) 24%, transparent);
  background: color-mix(in srgb, var(--color-foreground) 24%, transparent);
}

.leaderboard-table-wrap,
.taxonomy-card,
.food-tag-card,
.most-card,
.density-panel {
  background: var(--color-background);
}

.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
}

.leaderboard-table th {
  padding: 0.85rem 1.25rem;
  color: var(--color-muted-foreground);
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-align: left;
  text-transform: uppercase;
}

.leaderboard-table th:nth-child(3),
.leaderboard-table th:nth-child(4),
.leaderboard-table td:nth-child(3),
.leaderboard-table td:nth-child(4) {
  text-align: right;
  white-space: nowrap;
}

.leaderboard-table td {
  padding: 1.05rem 1.25rem;
  border-top: 1px solid color-mix(in srgb, var(--color-foreground) 16%, transparent);
  vertical-align: middle;
}

.leaderboard-table td:first-child {
  width: 4.5rem;
  color: var(--color-muted-foreground);
  font-size: 1.35rem;
}

.leaderboard-table td:nth-child(3) {
  color: var(--color-teal);
  font-size: 1.3rem;
  font-weight: 800;
}

.leaderboard-table td:nth-child(4) {
  color: var(--color-pink);
  font-size: 1.3rem;
  font-weight: 800;
}

.most-row > span,
.food-tag-card__head span {
  color: var(--color-muted-foreground);
  font-size: 1.35rem;
}

.leaderboard-table a,
.most-row b {
  display: grid;
}

.leaderboard-table a:hover {
  color: var(--color-teal);
}

.most-row strong {
  color: var(--color-teal);
  font-size: 1.25rem;
}

.most-grid {
  grid-template-columns: 1fr;
}

.most-card {
  display: grid;
  align-content: start;
  gap: 1rem;
  padding: 1.25rem;
}

.most-card--wide {
  grid-column: 1 / -1;
}

.most-card--wide .most-feature,
.most-card--wide .most-runner-list {
  width: 100%;
}

.most-card--wide .most-feature {
  height: auto;
  aspect-ratio: 16 / 9;
}

.most-card--wide .most-runner-list {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.most-card--wide .most-row a {
  height: auto;
  aspect-ratio: 16 / 9;
}

.most-card h3 {
  font-size: 1.7rem;
}

.most-card p {
  margin-top: -0.45rem;
  line-height: 1.8;
}

.most-feature {
  position: relative;
  display: block;
  width: min(100%, 28rem);
  height: 15.75rem;
  overflow: hidden;
  background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
}

.most-feature::after {
  content: '';
  position: absolute;
  inset: 30% 0 0;
  background: linear-gradient(transparent, rgb(0 0 0 / 78%));
}

.most-feature img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: transform 220ms ease;
}

.most-feature:hover img {
  transform: scale(1.035);
}

.most-feature > span {
  position: absolute;
  top: 0.7rem;
  left: 0.7rem;
  z-index: 1;
  display: grid;
  width: 2.1rem;
  aspect-ratio: 1;
  place-items: center;
  background: rgb(255 255 255 / 88%);
  color: var(--color-foreground);
  font-size: 1.1rem;
  font-weight: 800;
}

.most-feature div {
  position: absolute;
  inset: auto 4.75rem 0.85rem 0.9rem;
  z-index: 1;
  display: grid;
  gap: 0.2rem;
  color: white;
}

.most-feature small {
  color: rgb(255 255 255 / 74%);
}

.most-feature strong {
  position: absolute;
  right: 0.9rem;
  bottom: 0.8rem;
  z-index: 1;
  color: var(--color-teal);
  font-size: 1.7rem;
  font-weight: 900;
}

.most-runner-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 13rem));
  gap: 0.85rem;
}

.most-row {
  position: relative;
  display: grid;
  gap: 0.55rem;
  align-content: start;
  padding: 0;
  border-top: 1px solid color-mix(in srgb, var(--color-foreground) 16%, transparent);
  padding-top: 0.85rem;
}

.taxonomy-images img,
.food-tag-images img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.most-row a {
  width: 100%;
  height: 7.3125rem;
  overflow: hidden;
  background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
}

.most-row img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.most-row > span {
  position: absolute;
  top: 1.3rem;
  left: 0.45rem;
  z-index: 1;
  display: grid;
  width: 1.8rem;
  aspect-ratio: 1;
  place-items: center;
  background: rgb(255 255 255 / 88%);
  color: var(--color-foreground);
  font-size: 0.95rem;
  font-weight: 800;
}

.taxonomy-grid {
  grid-template-columns: 1fr;
}

.taxonomy-card {
  display: grid;
  gap: 1.2rem;
  padding: 1.1rem;
}

.taxonomy-card h3 {
  margin-top: 0.35rem;
  font-size: 2rem;
}

.taxonomy-images,
.food-tag-images {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
}

.taxonomy-images a {
  position: relative;
  min-height: 8.5rem;
  overflow: hidden;
}

.taxonomy-images small,
.food-tag-images small {
  position: absolute;
  inset: auto 0 0;
  padding: 2rem 0.55rem 0.45rem;
  background: linear-gradient(transparent, rgb(0 0 0 / 48%));
  color: rgb(255 255 255 / 62%);
  font-size: 0.76rem;
  font-weight: 700;
  line-height: 1.25;
  transition:
    background 180ms ease,
    color 180ms ease;
}

.taxonomy-images a:hover small,
.taxonomy-images a:focus-visible small,
.food-tag-images a:hover small,
.food-tag-images a:focus-visible small {
  background: linear-gradient(transparent, rgb(0 0 0 / 78%));
  color: white;
}

.tag-board {
  grid-template-columns: 1fr;
}

.food-tag-card {
  display: grid;
  grid-template-columns: minmax(10rem, 0.55fr) minmax(0, 1fr);
  gap: 1rem;
  align-items: start;
  padding: 1.1rem;
}

.food-tag-card__head {
  display: grid;
  grid-template-columns: 2rem 1fr auto;
  gap: 0.8rem;
  align-items: baseline;
}

.food-tag-card__head h3 {
  font-size: 2rem;
}

.food-tag-images {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.food-tag-images a {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.density-panel {
  display: grid;
  gap: 0;
  border: 1px solid color-mix(in srgb, var(--color-foreground) 24%, transparent);
  padding: 0 1.25rem;
}

.density-row {
  display: grid;
  grid-template-columns: 4rem 1fr 4rem;
  gap: 1rem;
  align-items: center;
  padding: 1.1rem 0;
  border-bottom: 1px solid color-mix(in srgb, var(--color-foreground) 16%, transparent);
}

.density-row:last-child {
  border-bottom: 0;
}

.density-row i {
  height: 0.9rem;
  background: color-mix(in srgb, var(--color-foreground) 10%, transparent);
}

.density-row b {
  display: block;
  height: 100%;
  background: linear-gradient(
    90deg,
    v-bind('TEAL'),
    v-bind('GOLD'),
    v-bind('PINK'),
    v-bind('BLUE')
  );
}

.density-row small {
  grid-column: 2 / 4;
}

@container (min-width: 720px) {
  .most-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .most-card--wide {
    grid-template-columns: 1fr;
  }

  .taxonomy-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@container (min-width: 980px) {
  .most-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .food-hero {
    min-height: 94dvh;
    padding-top: 2.875rem;
  }

  .hero-inner {
    align-self: end;
  }

  .hero-copy {
    margin-inline: 0;
  }

  .hero-photo-grid {
    inset: -3vh -24vw -3vh -24vw;
    transform: rotate(-3deg) scale(1.06);
    opacity: 0.95;
  }

  .hero-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .most-row {
    grid-template-columns: 1fr;
  }

  .most-row strong {
    grid-column: auto;
  }

  .most-feature {
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
  }

  .most-runner-list {
    grid-template-columns: 1fr;
  }

  .most-card--wide {
    grid-column: auto;
  }

  .most-row a {
    height: auto;
    aspect-ratio: 16 / 9;
  }

  .food-tag-card {
    grid-template-columns: 1fr;
  }

  .food-tag-images {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .leaderboard-table-wrap {
    overflow-x: auto;
  }

  .leaderboard-table {
    min-width: 34rem;
  }

  .leaderboard-table th,
  .leaderboard-table td {
    padding-inline: 0.85rem;
  }

  .leaderboard-table td:first-child {
    width: 3rem;
  }
}
</style>
