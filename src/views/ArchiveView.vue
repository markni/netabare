<template>
  <div v-if="subject"
       class="user-view h-full flex sm:justify-center justify-end items-center gap-4 flex-col-reverse sm:flex-row">
    <div
        class="block sm:w-full w-[90%] h-full sm:ml-[10%] ml-0 pt-8 pb-16 sm:pb-8 h-full ">
      <SubjectScore :bgm-id="329014" size="large"/>
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

import {useRoute, useRouter} from "vue-router";
import {onErrorCaptured} from "vue";

const route = useRoute();
const router = useRouter();

const archiveStore = useArchiveStore();


if (route?.params?.id && !Array.isArray(route.params.id)) {
  console.log('fetching archive', route.params.id);
  const bgmId = parseInt(route.params.id);
  try {
    await archiveStore.fetchArchive(bgmId);
  } catch (e) {
    console.log(e);
    router.replace('/404')
  }


} else {
  router.replace('/404')
}

let subject;

onErrorCaptured((err, vm, info) => {
  console.log(err, vm, info);
  router.replace('/404')
});

</script>


<style scoped>

</style>
