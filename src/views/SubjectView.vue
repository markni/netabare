<template>
  <div v-if="subject"
       class="user-view h-full flex sm:justify-center justify-end items-center gap-4 flex-col-reverse sm:flex-row">
    <div
        class="block sm:w-full w-[90%] h-full sm:ml-[10%] ml-0 pt-8 pb-16 sm:pb-8 h-full ">
      <SubjectScore :bgm-id="subject.id" size="large"/>
    </div>

    <div
        class="flex flex-col shrink-0 gap-4 sm:mb-auto ml-auto mr-[25%] items-end pt-8 w-auto sm:w-2/12 overflow-hidden">

      <div class="text-3xl font-bold">
        <a :href="`https://bgm.tv/subject/${subject.id}`" target="_blank">{{
            subject.name
          }}</a>
      </div>
      <div class="text-xl">
        {{ subject.name_cn }}
      </div>
      <!--      <div  class="flex flex-col items-end gap-0">-->
      <!--        <p class="sm:text-xl  tracking-widest leading-none whitespace-nowrap">{{ item.name }}</p>-->
      <!--        <p class="sm:text-3xl text-xl tracking-widest leading-none whitespace-nowrap">{{ item.value }}</p>-->
      <!--      </div>-->

    </div>


  </div>


</template>

<script lang="ts" setup>

import SubjectScore from "@/components/charts/SubjectScore.vue";
import {useArchiveStore} from "@/stores/archive";

import {useRoute} from "vue-router";

const route = useRoute();

const archiveStore = useArchiveStore();


const bgmId = parseInt(route.params.id as string);
await archiveStore.fetchArchive(bgmId);
const subject = archiveStore.archives[bgmId].subject;

</script>


<style scoped>

</style>
