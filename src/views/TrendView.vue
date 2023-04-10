<template>
  <div class="h-[100px] aspect-video">
    <SubjectScore :bgm-id="329014" size="mini" />
  </div>
</template>

<script lang="ts" setup>
import SubjectScore from '@/components/charts/SubjectScore.vue';
import { useArchiveStore } from '@/stores/archive';

const archiveStore = useArchiveStore();
await archiveStore.fetchArchive(329014);
</script>

<style scoped></style>
