<script lang="ts" setup>
import ColorWaveAnimatedSVG from "@/components/arts/ColorWaveAnimatedSVG.vue";
import SiteTitle from "@/components/SiteTitle.vue";</script>

<template>
  <main class="main flex justify-end h-full flex-col ">


    <div class="w-full text-center">
      <SiteTitle/>
    </div>

    <div class="w-full h-1/3 overflow-hidden relative flex">
      <ColorWaveAnimatedSVG class="w-full "/>
    </div>


  </main>
</template>

