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
    <section
      class="relative isolate bleed-both-to-viewport grid min-h-[96dvh] items-center overflow-hidden border-y border-foreground/20 bg-[#f9dfbd] px-0 py-12 text-[#241c18] before:pointer-events-none before:absolute before:inset-0 before:z-[1] before:bg-[linear-gradient(90deg,rgb(255_248_239_/_0.88)_0%,rgb(255_248_239_/_0.78)_30%,rgb(255_248_239_/_0.38)_58%,rgb(255_248_239_/_0.12)_100%),linear-gradient(0deg,rgb(244_181_158_/_0.78)_0%,rgb(244_181_158_/_0.25)_38%,transparent_72%)] md:py-16"
    >
      <div
        v-if="heroImage"
        class="pointer-events-none absolute inset-x-[-24vw] inset-y-[-6vh] z-0 origin-center scale-[1.06] rotate-[-3deg] opacity-95 contrast-[1.02] saturate-[1.05] md:inset-x-[-5vw] md:scale-[1.08]"
        aria-hidden="true"
      >
        <img class="block size-full object-cover" :src="imageUrl(heroImage.relativePath)" alt="" />
      </div>

      <div class="relative z-[2] mx-auto w-[min(1180px,calc(100%-2rem))]">
        <div class="relative z-[2] max-w-[47rem] md:ml-[clamp(0rem,16vw,13rem)]">
          <p
            class="mb-4 w-fit rounded-full border border-[#241c18]/15 bg-white/60 px-3.5 py-2 text-[clamp(0.78rem,1.7vw,0.98rem)] font-extrabold"
          >
            2026春季动画本季美食
          </p>
          <h1
            class="mb-5 max-w-[48.75rem] text-[clamp(3rem,8vw,7.25rem)] leading-[0.88] font-black"
          >
            动画 x 美食
          </h1>
          <p
            class="mt-5 max-w-[44rem] text-[clamp(1rem,2vw,1.25rem)] leading-loose text-[#47372e]/90"
          >
            这一季的动画把饭菜摆到了叙事前景：有人用甜点制造暧昧，有人靠热汤缓一口气，也有人把一桌饭拍成角色关系的温度计。
          </p>

          <div
            v-if="report"
            class="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4"
            aria-label="核心数字"
          >
            <div class="rounded-lg border border-[#241c18]/15 bg-white/60 p-4">
              <strong class="block text-[clamp(1.8rem,4vw,2.8rem)] leading-none font-black">{{
                formatNumber(stats.verifiedFrames)
              }}</strong>
              <span class="mt-2 block text-sm leading-snug font-extrabold text-[#47372e]/80"
                >入选食物瞬间</span
              >
            </div>
            <div class="rounded-lg border border-[#241c18]/15 bg-white/60 p-4">
              <strong class="block text-[clamp(1.8rem,4vw,2.8rem)] leading-none font-black">{{
                formatNumber(stats.subjectCount)
              }}</strong>
              <span class="mt-2 block text-sm leading-snug font-extrabold text-[#47372e]/80"
                >2026 春季动画</span
              >
            </div>
            <div class="rounded-lg border border-[#241c18]/15 bg-white/60 p-4">
              <strong class="block text-[clamp(1.8rem,4vw,2.8rem)] leading-none font-black">{{
                formatNumber(stats.foodMentionCount)
              }}</strong>
              <span class="mt-2 block text-sm leading-snug font-extrabold text-[#47372e]/80"
                >菜名与饮品</span
              >
            </div>
            <div class="rounded-lg border border-[#241c18]/15 bg-white/60 p-4">
              <strong class="block text-[clamp(1.8rem,4vw,2.8rem)] leading-none font-black">{{
                formatScore(stats.avgScore)
              }}</strong>
              <span class="mt-2 block text-sm leading-snug font-extrabold text-[#47372e]/80"
                >平均评分</span
              >
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="loading" class="state-panel">正在上菜…</section>
    <section v-else-if="error" class="state-panel state-panel--error">{{ error }}</section>

    <template v-else-if="report">
      <section class="flex flex-col gap-8">
        <div>
          <p class="text-xs font-bold tracking-[0.32em] text-muted-foreground uppercase">Ranking</p>
          <h2 class="mt-2.5 max-w-[13em] text-[clamp(2.25rem,6vw,5.4rem)] leading-none font-bold">
            作品排行
          </h2>
          <p
            class="mt-5 max-w-5xl text-[clamp(0.95rem,1.2vw,1.1rem)] leading-8 text-muted-foreground"
          >
            按入选食物画面数量排序，并同步显示作品评分。
          </p>
        </div>

        <div class="overflow-x-auto border border-foreground/25 bg-background">
          <table class="w-full border-collapse">
            <thead>
              <tr>
                <th
                  class="px-5 py-3.5 text-left text-xs font-extrabold tracking-[0.18em] text-muted-foreground uppercase"
                >
                  名次
                </th>
                <th
                  class="px-5 py-3.5 text-left text-xs font-extrabold tracking-[0.18em] text-muted-foreground uppercase"
                >
                  作品
                </th>
                <th
                  class="px-5 py-3.5 text-right text-xs font-extrabold tracking-[0.18em] whitespace-nowrap text-muted-foreground uppercase"
                >
                  食物
                </th>
                <th
                  class="px-5 py-3.5 text-right text-xs font-extrabold tracking-[0.18em] whitespace-nowrap text-muted-foreground uppercase"
                >
                  评分
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(subject, index) in leaderboard" :key="subject.bgmId">
                <td
                  class="w-18 border-t border-foreground/15 px-5 py-4 align-middle text-xl text-muted-foreground"
                >
                  {{ index + 1 }}
                </td>
                <td class="border-t border-foreground/15 px-5 py-4 align-middle">
                  <RouterLink class="grid hover:text-teal" :to="`/subject/${subject.bgmId}`">
                    <strong>{{ subject.title }}</strong>
                    <small class="text-muted-foreground">{{ subject.originalTitle }}</small>
                  </RouterLink>
                </td>
                <td
                  class="border-t border-foreground/15 px-5 py-4 text-right align-middle text-xl font-extrabold whitespace-nowrap text-teal"
                >
                  {{ formatNumber(subject.frames) }}
                </td>
                <td
                  class="border-t border-foreground/15 px-5 py-4 text-right align-middle text-xl font-extrabold whitespace-nowrap text-pink"
                >
                  {{ formatScore(subject.score) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="food-section">
        <div class="section-heading">
          <p class="section-kicker">Highlights</p>
          <h2>亮点排行</h2>
          <p>按画面质量、食物种类、单集密度、饮品和甜点提取前三名。</p>
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
          <p class="section-kicker">Categories</p>
          <h2>食物分类</h2>
          <p>将食物标签归入主要类别后统计分布。</p>
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
          <h2>高频食物</h2>
          <p>统计食物标签出现次数，展示频次最高的代表条目。</p>
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
          <h2>评分关系</h2>
          <p>按食物数量分组，比较各组平均评分。</p>
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

.section-kicker {
  color: var(--color-muted-foreground);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.32em;
  text-transform: uppercase;
}

.section-heading p:last-child {
  max-width: 64rem;
  margin-top: 1.2rem;
  color: var(--color-muted-foreground);
  font-size: clamp(0.95rem, 1.2vw, 1.1rem);
  line-height: 1.8;
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

.taxonomy-grid,
.tag-board,
.most-grid {
  display: grid;
  gap: 1px;
  border: 1px solid color-mix(in srgb, var(--color-foreground) 24%, transparent);
  background: color-mix(in srgb, var(--color-foreground) 24%, transparent);
}

.taxonomy-card,
.food-tag-card,
.most-card,
.density-panel {
  background: var(--color-background);
}

.most-row > span,
.food-tag-card__head span {
  color: var(--color-muted-foreground);
  font-size: 1.35rem;
}

.most-row b {
  display: grid;
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
}
</style>
