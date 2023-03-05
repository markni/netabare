<script>
import {defineComponent} from "vue";
import ColorWaveAnimatedSVG from "@/components/arts/ColorWaveAnimatedSVG.vue";
import SiteTitle from "@/components/SiteTitle.vue";

export default defineComponent({
  components: {SiteTitle, ColorWaveAnimatedSVG}
})
</script>

<template>
  <main class="flex justify-end h-full dark:bg-gray-800 bg-gray-100 flex-col">

    <div class="w-full text-center">
      <SiteTitle/>
    </div>

    <div class="w-full h-1/3 overflow-hidden relative flex">
      <ColorWaveAnimatedSVG class="w-full "/>
    </div>


    <!--    <div class="container bg-gray-100 p-24 text-gray-900">-->
    <!--      <h1 class="text-6xl  shadow-lime-400 font-extrabold tk-myriad-pro">netabare.</h1>-->
    <!--      <div class="mt-4">-->

    <!--      </div>-->
    <!--    </div>-->


  </main>
</template>
