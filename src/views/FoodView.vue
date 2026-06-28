<script setup>
import { computed, onMounted, ref } from 'vue';
import { GOLD, RED, TEAL } from '@/constants/colors.js';

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
const mostListTitles = ['菜单最丰富', '最会出片', '单集最密', '一醉方休', '甜党主场'];
const mostLists = computed(() =>
  (page.value.mostLists || []).map((list, index) => ({
    ...list,
    displayTitle: mostListTitles[index] || ''
  }))
);
const leaderboard = computed(() => subjects.value.slice(0, 10));
const bottomLeaderboard = computed(() => subjects.value.slice(-5));
const topFoods = computed(() => topFoodImages.value.slice(0, 8));
const subjectByName = computed(
  () => new Map(subjects.value.map((subject) => [subject.subjectName, subject]))
);

const imageHref = (item) => {
  if (item?.collage) {
    const subject = subjectByName.value.get(item.subjectName);
    if (subject?.bgmId) return `/subject/${subject.bgmId}`;
  }

  return item?.episodeUrl || 'about:blank';
};

const scoreDensity = computed(() => {
  const rows = subjects.value
    .filter((subject) => subject.episodeCount && Number.isFinite(Number(subject.score)))
    .map((subject) => ({
      ...subject,
      foodPerEpisode: subject.frames / subject.episodeCount
    }));

  if (!rows.length) return [];

  const sorted = rows.sort((a, b) => a.foodPerEpisode - b.foodPerEpisode);
  const minFoodPerEpisode = sorted[0].foodPerEpisode;
  const maxFoodPerEpisode = sorted[sorted.length - 1].foodPerEpisode;
  const groupCount = 3;
  const rangeSize = Math.max((maxFoodPerEpisode - minFoodPerEpisode) / groupCount, 0.01);
  const groups = [];

  for (let index = 0; index < groupCount; index += 1) {
    const rangeStart = minFoodPerEpisode + rangeSize * index;
    const rangeEnd =
      index === groupCount - 1 ? maxFoodPerEpisode : minFoodPerEpisode + rangeSize * (index + 1);
    const displayStart = Math.round(rangeStart);
    const displayEnd = Math.round(rangeEnd);
    const group = sorted.filter((subject) =>
      index === groupCount - 1
        ? subject.foodPerEpisode >= rangeStart && subject.foodPerEpisode <= rangeEnd
        : subject.foodPerEpisode >= rangeStart && subject.foodPerEpisode < rangeEnd
    );
    const avgFoodPerEpisode =
      group.length > 0
        ? group.reduce((sum, subject) => sum + subject.foodPerEpisode, 0) / group.length
        : (rangeStart + rangeEnd) / 2;
    const avgScore =
      group.length > 0
        ? group.reduce((sum, subject) => sum + subject.score, 0) / group.length
        : null;
    const samples = [...group]
      .sort((a, b) => b.frames - a.frames)
      .slice(0, 3)
      .map((subject) => ({
        title: subject.title || subject.subjectName,
        href: `/subject/${subject.bgmId}`
      }));
    groups.push({
      label: ['低密度', '中密度', '高密度'][index],
      count: group.length,
      rangeStart,
      rangeEnd,
      displayStart,
      displayEnd,
      avgFoodPerEpisode,
      avgScore,
      samples
    });
  }

  const scoredGroups = groups.filter((group) => group.avgScore !== null);
  const scoreBase = Math.max(0, Math.min(...scoredGroups.map((group) => group.avgScore)) - 0.2, 5);
  const maxScore = Math.max(...scoredGroups.map((group) => group.avgScore), scoreBase + 1);
  const scoreRange = Math.max(maxScore - scoreBase, 0.8);
  return groups.map((group, index) => ({
    ...group,
    color: [RED, TEAL, GOLD][index],
    scoreBase,
    scoreTop: scoreBase + scoreRange,
    scoreWidth:
      group.avgScore === null
        ? '0%'
        : `${Math.max(8, ((group.avgScore - scoreBase) / scoreRange) * 100)}%`
  }));
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
  <main class="[container-type:inline-size] flex flex-col gap-[clamp(4rem,8vw,7rem)] pb-28">
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
            class="mb-4 w-fit border border-[#241c18]/15 bg-white/60 px-3.5 py-2 text-[clamp(0.78rem,1.7vw,0.98rem)] font-extrabold"
          >
            2026年春季动画
          </p>
          <h1
            class="mb-5 max-w-[48.75rem] text-[clamp(3rem,8vw,7.25rem)] leading-[0.88] font-black"
          >
            本季美食报告
          </h1>
          <div
            v-if="report"
            class="mt-14 grid grid-cols-2 gap-3 md:mt-16 md:grid-cols-4"
            aria-label="核心数字"
          >
            <div class="border border-[#241c18]/15 bg-white/60 p-4">
              <strong class="block text-[clamp(1.8rem,4vw,2.8rem)] leading-none font-black">{{
                formatNumber(stats.verifiedFrames)
              }}</strong>
              <span class="mt-2 block text-sm leading-snug font-extrabold text-[#47372e]/80"
                >入选食物瞬间</span
              >
            </div>
            <div class="border border-[#241c18]/15 bg-white/60 p-4">
              <strong class="block text-[clamp(1.8rem,4vw,2.8rem)] leading-none font-black">{{
                formatNumber(stats.subjectCount)
              }}</strong>
              <span class="mt-2 block text-sm leading-snug font-extrabold text-[#47372e]/80"
                >2026 春季动画</span
              >
            </div>
            <div class="border border-[#241c18]/15 bg-white/60 p-4">
              <strong class="block text-[clamp(1.8rem,4vw,2.8rem)] leading-none font-black">{{
                formatNumber(stats.foodMentionCount)
              }}</strong>
              <span class="mt-2 block text-sm leading-snug font-extrabold text-[#47372e]/80"
                >菜名与饮品</span
              >
            </div>
            <div class="border border-[#241c18]/15 bg-white/60 p-4">
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

    <section v-if="loading" class="border border-foreground/25 p-8 text-muted-foreground">
      正在上菜…
    </section>
    <section v-else-if="error" class="border border-foreground/25 p-8 text-red">
      {{ error }}
    </section>

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
                    <strong class="text-xl">{{ subject.title }}</strong>
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
              <tr v-if="bottomLeaderboard.length">
                <td
                  colspan="4"
                  class="border-t border-foreground/15 px-5 py-4 text-center text-xl tracking-[0.5em] text-muted-foreground"
                >
                  ......
                </td>
              </tr>
              <tr v-for="(subject, index) in bottomLeaderboard" :key="`bottom-${subject.bgmId}`">
                <td
                  class="w-18 border-t border-foreground/15 px-5 py-4 align-middle text-xl text-muted-foreground"
                >
                  {{ subjects.length - bottomLeaderboard.length + index + 1 }}
                </td>
                <td class="border-t border-foreground/15 px-5 py-4 align-middle">
                  <RouterLink class="grid hover:text-teal" :to="`/subject/${subject.bgmId}`">
                    <strong class="text-xl">{{ subject.title }}</strong>
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

      <section class="flex flex-col gap-8">
        <div>
          <p class="text-xs font-bold tracking-[0.32em] text-muted-foreground uppercase">
            Highlights
          </p>
          <h2 class="mt-2.5 max-w-[13em] text-[clamp(2.25rem,6vw,5.4rem)] leading-none font-bold">
            亮点排行
          </h2>
          <p
            class="mt-5 max-w-5xl text-[clamp(0.95rem,1.2vw,1.1rem)] leading-8 text-muted-foreground"
          >
            按画面质量、食物种类、单集密度、饮品和甜点提取前三名。
          </p>
        </div>

        <div
          class="grid grid-cols-1 gap-px border border-foreground/25 bg-foreground/25 min-[720px]:grid-cols-2"
        >
          <article
            v-for="list in mostLists"
            :key="list.displayTitle"
            :class="[
              'grid content-start gap-4 bg-background p-5',
              { 'min-[720px]:col-span-2': list.wide }
            ]"
          >
            <h3 class="text-[1.7rem] leading-tight">{{ list.displayTitle }}</h3>
            <a
              v-if="list.items[0]?.relativePath"
              :class="[
                'group relative block w-full overflow-hidden bg-foreground/10 after:absolute after:inset-x-0 after:top-[30%] after:bottom-0 after:bg-gradient-to-b after:from-transparent after:to-black/80',
                list.wide
                  ? 'aspect-video'
                  : 'aspect-video min-[720px]:aspect-auto min-[720px]:h-[15.75rem] min-[720px]:max-w-[28rem]'
              ]"
              :href="imageHref(list.items[0])"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                class="block size-full object-cover transition-transform duration-200 group-hover:scale-[1.035]"
                :src="imageUrl(list.items[0].relativePath)"
                :alt="list.items[0].title"
              />
              <span
                class="absolute top-3 left-3 z-[1] grid aspect-square w-8 place-items-center bg-white/90 text-lg font-extrabold text-foreground"
                >1</span
              >
              <div class="absolute right-19 bottom-3.5 left-3.5 z-[1] grid gap-1 text-white">
                <b>{{ list.items[0].title }}</b>
                <small class="text-white/75">{{ list.items[0].meta }}</small>
              </div>
              <strong
                class="absolute right-3.5 bottom-3 z-[1] text-[1.7rem] font-black text-teal"
                >{{ list.items[0].value }}</strong
              >
            </a>

            <div
              :class="[
                'grid gap-3.5',
                list.wide ? 'grid-cols-1 min-[720px]:grid-cols-2' : 'grid-cols-2'
              ]"
            >
              <div
                v-for="(item, index) in list.items.slice(1)"
                :key="`${list.displayTitle}-${item.subjectName}`"
                class="relative grid content-start gap-2 border-t border-foreground/15 pt-3.5 max-[720px]:grid-cols-1"
              >
                <span
                  class="absolute top-5 left-2 z-[1] grid aspect-square w-7 place-items-center bg-white/90 text-base font-extrabold text-foreground"
                  >{{ index + 2 }}</span
                >
                <a
                  v-if="item.relativePath"
                  :class="[
                    'group block w-full overflow-hidden bg-foreground/10',
                    list.wide
                      ? 'aspect-video'
                      : 'h-[7.3125rem] max-[720px]:aspect-video max-[720px]:h-auto'
                  ]"
                  :href="imageHref(item)"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    class="block size-full object-cover transition-transform duration-200 group-hover:scale-[1.035]"
                    :src="imageUrl(item.relativePath)"
                    :alt="item.title"
                  />
                </a>
                <div class="grid">
                  <b>{{ item.title }}</b>
                  <small class="text-muted-foreground">{{ item.meta }}</small>
                </div>
                <strong class="text-xl font-bold text-teal">{{ item.value }}</strong>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="flex flex-col gap-8">
        <div>
          <p class="text-xs font-bold tracking-[0.32em] text-muted-foreground uppercase">
            Categories
          </p>
          <h2 class="mt-2.5 max-w-[13em] text-[clamp(2.25rem,6vw,5.4rem)] leading-none font-bold">
            食物分类
          </h2>
          <p
            class="mt-5 max-w-5xl text-[clamp(0.95rem,1.2vw,1.1rem)] leading-8 text-muted-foreground"
          >
            将食物标签归入主要类别后统计分布。
          </p>
        </div>

        <div
          class="grid grid-cols-1 gap-px border border-foreground/25 bg-foreground/25 min-[720px]:grid-cols-2"
        >
          <article
            v-for="group in taxonomyGroups"
            :key="group.name"
            class="grid gap-5 bg-background p-4"
          >
            <div>
              <span class="font-bold text-[#0f9f9a]">{{ formatNumber(group.count) }} 次提及</span>
              <h3 class="mt-1 text-3xl">{{ group.displayName }}</h3>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <a
                v-for="image in group.images"
                :key="image.relativePath"
                class="group relative min-h-34 overflow-hidden"
                :href="imageHref(image)"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  class="block size-full object-cover transition-transform duration-200 group-hover:scale-[1.035]"
                  :src="imageUrl(image.relativePath)"
                  :alt="group.displayName"
                />
                <small
                  class="absolute inset-x-0 bottom-0 bg-gradient-to-b from-transparent to-black/50 px-2 pt-8 pb-2 text-xs leading-tight font-bold text-white/65 transition-colors transition-discrete group-hover:to-black/80 group-hover:text-white group-focus-visible:to-black/80 group-focus-visible:text-white"
                  >{{ image.title || image.subjectName }}</small
                >
              </a>
            </div>
          </article>
        </div>
      </section>

      <section class="flex flex-col gap-8">
        <div>
          <p class="text-xs font-bold tracking-[0.32em] text-muted-foreground uppercase">Tags</p>
          <h2 class="mt-2.5 max-w-[13em] text-[clamp(2.25rem,6vw,5.4rem)] leading-none font-bold">
            高频食物
          </h2>
          <p
            class="mt-5 max-w-5xl text-[clamp(0.95rem,1.2vw,1.1rem)] leading-8 text-muted-foreground"
          >
            统计食物标签出现次数，展示频次最高的代表条目。
          </p>
        </div>

        <div class="grid grid-cols-1 gap-px border border-foreground/25 bg-foreground/25">
          <template v-for="(food, index) in topFoods" :key="food.name">
            <div
              v-if="food.name === 'curry'"
              class="bg-background px-4 py-6 text-center text-xl tracking-[0.35em] text-muted-foreground"
            >
              ......
            </div>
            <article
              class="grid items-start gap-4 bg-background p-4 min-[720px]:grid-cols-[minmax(10rem,0.55fr)_minmax(0,1fr)]"
            >
              <div class="grid grid-cols-[2rem_1fr_auto] items-baseline gap-3">
                <span class="text-xl text-muted-foreground">{{ food.rank || index + 1 }}</span>
                <h3 class="text-3xl">{{ food.displayName }}</h3>
                <b class="text-[#0f9f9a]">{{ formatNumber(food.count) }} 次</b>
              </div>
              <div class="grid grid-cols-2 gap-2 min-[720px]:grid-cols-3">
                <a
                  v-for="image in food.images"
                  :key="image.relativePath"
                  class="group relative aspect-video overflow-hidden"
                  :href="imageHref(image)"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    class="block size-full object-cover transition-transform duration-200 group-hover:scale-[1.035]"
                    :src="imageUrl(image.relativePath)"
                    :alt="food.displayName"
                  />
                  <small
                    class="absolute inset-x-0 bottom-0 bg-gradient-to-b from-transparent to-black/50 px-2 pt-8 pb-2 text-xs leading-tight font-bold text-white/65 transition-colors transition-discrete group-hover:to-black/80 group-hover:text-white group-focus-visible:to-black/80 group-focus-visible:text-white"
                    >{{ image.title || image.subjectName }}</small
                  >
                </a>
              </div>
            </article>
          </template>
        </div>
      </section>

      <section class="flex flex-col gap-8">
        <div>
          <p class="text-xs font-bold tracking-[0.32em] text-muted-foreground uppercase">Score</p>
          <h2 class="mt-2.5 max-w-[13em] text-[clamp(2.25rem,6vw,5.4rem)] leading-none font-bold">
            评分关系
          </h2>
          <p
            class="mt-5 max-w-5xl text-[clamp(0.95rem,1.2vw,1.1rem)] leading-8 text-muted-foreground"
          >
            按单集平均食物数量分组，比较各组平均评分。
          </p>
        </div>

        <div class="border border-foreground/25 bg-background p-5 sm:p-7">
          <div class="grid gap-3">
            <div
              class="grid grid-cols-[6.5rem_1fr_4rem] items-end gap-4 text-sm text-muted-foreground"
            >
              <span>食物密度</span>
              <div class="flex justify-between border-b border-foreground/25 pb-1">
                <span>{{ scoreDensity[0]?.scoreBase.toFixed(1) }}</span>
                <span>评分</span>
                <span>{{ scoreDensity[0]?.scoreTop.toFixed(1) }}</span>
              </div>
              <span class="text-right">均分</span>
            </div>

            <article
              v-for="row in scoreDensity"
              :key="row.label"
              class="grid grid-cols-[6.5rem_1fr_4rem] items-center gap-4 border-b border-foreground/15 py-4 last:border-b-0"
            >
              <div>
                <h3 class="text-2xl leading-tight">{{ row.label }}</h3>
                <p class="mt-1 text-sm text-muted-foreground">
                  {{ row.displayStart }}-{{ row.displayEnd }} / 集
                </p>
                <p class="text-sm font-bold" :style="{ color: row.color }">{{ row.count }} 部</p>
              </div>
              <div class="grid gap-2">
                <div class="h-12 bg-foreground/10">
                  <i
                    class="block h-full"
                    :style="{
                      width: row.scoreWidth,
                      background: row.color
                    }"
                  ></i>
                </div>
                <p class="truncate text-sm text-muted-foreground">
                  <template v-if="row.samples.length">
                    <template v-for="(sample, index) in row.samples" :key="sample.href">
                      <a
                        class="hover:text-foreground"
                        :href="sample.href"
                        target="_blank"
                        rel="noopener noreferrer"
                        >{{ sample.title }}</a
                      ><span v-if="index < row.samples.length - 1"> / </span>
                    </template>
                  </template>
                  <span v-else>该区间暂无作品</span>
                </p>
              </div>
              <strong class="text-right text-3xl leading-none" :style="{ color: row.color }">{{
                row.avgScore === null ? '—' : formatScore(row.avgScore)
              }}</strong>
            </article>
          </div>
        </div>
      </section>
    </template>
  </main>
</template>
