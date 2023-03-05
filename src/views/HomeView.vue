<script>
import {defineComponent} from "vue";
import ColorWaveAnimatedSVG from "@/components/arts/ColorWaveAnimatedSVG.vue";
import SiteTitle from "@/components/SiteTitle.vue";

export default defineComponent({
  components: {SiteTitle, ColorWaveAnimatedSVG}
})
</script>

<template>
  <main class="main flex justify-end h-full flex-col ">
    <div class="mb-auto text-4xl flex flex-col gap-8 p-8 tracking-widest" style="writing-mode: vertical-lr">

      <RouterLink
          aria-label="Review History"
          class="font-bold hover:mt-2 transition-all"
          to="/history">评分分布
      </RouterLink>
      <RouterLink
          aria-label="Trending"
          class="font-bold hover:mt-2 transition-all"
          to="/trending">条目趋势
      </RouterLink>
    </div>

    <div class="w-full text-center">
      <SiteTitle/>
    </div>

    <div class="w-full h-1/3 overflow-hidden relative flex">
      <ColorWaveAnimatedSVG class="w-full "/>
    </div>


  </main>
</template>

