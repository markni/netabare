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
const taxonomyGroups = computed(() => page.value.taxonomyGroups || []);
const topFoodImages = computed(() => page.value.topFoodImages || []);
const mostLists = computed(() => page.value.mostLists || []);
const leaderboard = computed(() => subjects.value.slice(0, 10));
const topFoods = computed(() => topFoodImages.value.slice(0, 8));
const topSubjects = computed(() =>
  [...subjects.value].sort((a, b) => b.score - a.score || b.frames - a.frames).slice(0, 5)
);

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
      <div class="hero-photo-grid" aria-hidden="true">
        <img
          v-for="(image, index) in heroImages.slice(0, 24)"
          :key="`${image.relativePath}-${index}`"
          :src="imageUrl(image.relativePath)"
          alt=""
        />
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
          <p class="section-kicker">排行榜</p>
          <h2>最有食欲的作品</h2>
          <p>有些作品只是让角色吃饭，有些作品则把食物拍成节奏、情绪和生活质感。</p>
        </div>

        <div class="leaderboard-grid">
          <ol class="leaderboard">
            <li v-for="(subject, index) in leaderboard" :key="subject.bgmId">
              <span>{{ index + 1 }}</span>
              <RouterLink :to="`/subject/${subject.bgmId}`">
                <strong>{{ subject.title }}</strong>
                <small>{{ subject.originalTitle }}</small>
              </RouterLink>
              <b>{{ formatNumber(subject.frames) }}</b>
            </li>
          </ol>

          <div class="score-shelf">
            <article v-for="subject in topSubjects" :key="subject.bgmId">
              <span>{{ formatScore(subject.score) }}</span>
              <RouterLink :to="`/subject/${subject.bgmId}`">{{ subject.title }}</RouterLink>
            </article>
          </div>
        </div>
      </section>

      <section class="food-section">
        <div class="section-heading">
          <p class="section-kicker">Most</p>
          <h2>这一季的 Top 3 小榜</h2>
        </div>

        <div class="most-grid">
          <article v-for="list in mostLists" :key="list.title" class="most-card">
            <h3>{{ list.title }}</h3>
            <p>{{ list.note }}</p>
            <div
              v-for="(item, index) in list.items"
              :key="`${list.title}-${item.subjectName}`"
              class="most-row"
            >
              <span>{{ index + 1 }}</span>
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
                <small>{{ image.groupFoodNames?.slice(0, 2).join('、') }}</small>
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
              <span>{{ index + 1 }}</span>
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
      rgb(255 248 239 / 96%) 0%,
      rgb(255 248 239 / 86%) 32%,
      rgb(255 248 239 / 42%) 58%,
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
  inset: -7vh -7vw -7vh 18vw;
  z-index: 0;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 0.625rem;
  transform: rotate(-5deg) scale(1.06);
  transform-origin: center;
  filter: saturate(1.08) contrast(1.02);
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
  flex: 0 0 calc((100% - 4.375rem) / 8);
  aspect-ratio: 1;
  display: block;
  border-radius: 0.45rem;
  object-fit: cover;
  box-shadow: 0 0.9rem 2rem rgb(36 28 24 / 18%);
}

.hero-photo-grid img:nth-child(4n + 1) {
  transform: translateY(1.05rem);
}

.hero-photo-grid img:nth-child(5n + 2) {
  transform: translateY(-0.85rem);
}

.hero-photo-grid img:nth-child(9n) {
  aspect-ratio: 16 / 9;
  flex-basis: calc((100% - 4.375rem) / 4);
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
.leaderboard small,
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

.leaderboard-grid,
.taxonomy-grid,
.tag-board,
.most-grid {
  display: grid;
  gap: 1px;
  border: 1px solid color-mix(in srgb, var(--color-foreground) 24%, transparent);
  background: color-mix(in srgb, var(--color-foreground) 24%, transparent);
}

.leaderboard,
.score-shelf,
.taxonomy-card,
.food-tag-card,
.most-card,
.density-panel {
  background: var(--color-background);
}

.leaderboard {
  display: grid;
  gap: 0;
  padding: 0 1.25rem;
}

.leaderboard li {
  display: grid;
  grid-template-columns: 2.5rem 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1.1rem 0;
  border-bottom: 1px solid color-mix(in srgb, var(--color-foreground) 16%, transparent);
}

.leaderboard li:last-child {
  border-bottom: 0;
}

.leaderboard span,
.most-row > span,
.food-tag-card__head span {
  color: var(--color-muted-foreground);
  font-size: 1.35rem;
}

.leaderboard a,
.most-row b {
  display: grid;
}

.leaderboard a:hover,
.score-shelf a:hover {
  color: var(--color-teal);
}

.leaderboard b,
.most-row strong {
  color: var(--color-teal);
  font-size: 1.25rem;
}

.score-shelf {
  display: grid;
  align-content: stretch;
}

.score-shelf article {
  display: grid;
  grid-template-columns: 4rem 1fr;
  gap: 1rem;
  align-items: center;
  padding: 1.2rem;
  border-bottom: 1px solid color-mix(in srgb, var(--color-foreground) 16%, transparent);
}

.score-shelf span {
  color: var(--color-pink);
  font-size: 2rem;
}

.most-grid {
  grid-template-columns: 1fr;
}

.most-card {
  padding: 1.25rem;
}

.most-card h3 {
  font-size: 1.7rem;
}

.most-card p {
  margin-top: 0.45rem;
  line-height: 1.8;
}

.most-row {
  display: grid;
  grid-template-columns: 2rem 5.5rem 1fr auto;
  gap: 0.8rem;
  align-items: center;
  padding: 1rem 0;
  border-top: 1px solid color-mix(in srgb, var(--color-foreground) 16%, transparent);
}

.most-row img,
.taxonomy-images img,
.food-tag-images img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.most-row a {
  aspect-ratio: 1.2;
  overflow: hidden;
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

.taxonomy-images small {
  position: absolute;
  inset: auto 0 0;
  padding: 2rem 0.55rem 0.45rem;
  background: linear-gradient(transparent, rgb(0 0 0 / 72%));
  color: white;
}

.tag-board {
  grid-template-columns: 1fr;
}

.food-tag-card {
  padding: 1.1rem;
}

.food-tag-card__head {
  display: grid;
  grid-template-columns: 2rem 1fr auto;
  gap: 0.8rem;
  align-items: baseline;
  margin-bottom: 1rem;
}

.food-tag-card__head h3 {
  font-size: 1.5rem;
}

.food-tag-images {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.food-tag-images a {
  aspect-ratio: 1.15;
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
  .leaderboard-grid {
    grid-template-columns: minmax(0, 1.25fr) minmax(16rem, 0.75fr);
  }

  .most-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .taxonomy-grid,
  .tag-board {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@container (min-width: 980px) {
  .most-grid {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  .most-card {
    grid-column: span 2;
  }

  .most-card:nth-last-child(2),
  .most-card:last-child {
    grid-column: span 3;
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
    inset: -2vh -16vw auto -16vw;
    height: 50dvh;
    gap: 0.45rem;
    transform: rotate(-5deg) scale(1.04);
    opacity: 0.95;
  }

  .hero-photo-grid img {
    flex-basis: calc((100% - 3.125rem) / 6);
  }

  .hero-photo-grid img:nth-child(9n) {
    flex-basis: calc((100% - 3.125rem) / 3);
  }

  .hero-photo-grid img:nth-child(n + 19) {
    display: none;
  }

  .hero-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .most-row {
    grid-template-columns: 2rem 4.5rem 1fr;
  }

  .most-row strong {
    grid-column: 3;
  }
}
</style>
