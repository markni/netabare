<template>
  <div class="h-full">
    <SubjectScore :bgm-id="329014"/>
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
