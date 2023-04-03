<template>
  <div
      class="archive-view h-full flex flex-col  sm:justify-start justify-end items-start pl-[10%] gap-4 pt-12 container ">
    <div class="text-3xl font-bold">
      {{ archiveStore.archives[329014].subject.name }}
    </div>
    <div class="text-xl">
      {{ archiveStore.archives[329014].subject.name_cn }}
    </div>
    <div class="w-[80%] aspect-video">
      <SubjectScore :bgm-id="329014" size="large"/>
    </div>
  </div>

</template>

<script lang="ts" setup>

import SubjectScore from "@/components/charts/SubjectScore.vue";
import {useArchiveStore} from "@/stores/archive";

const archiveStore = useArchiveStore();
await archiveStore.fetchArchive(329014);


</script>


<style scoped>

</style>
