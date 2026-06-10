<template>
  <div v-if="user" class="flex flex-col items-center gap-2 p-4 sm:items-start sm:p-0">
    <!-- <UserAvatar :user="user.user" /> -->
    <div class="mb-12 text-3xl font-bold sm:mb-4">
      {{ user.user.nickname }}
      <span v-if="user.year" class="text-lightGray text-sm whitespace-nowrap">
        ver. {{ user.year }}</span
      >
    </div>

    <div class="grid w-full gap-y-4 sm:flex sm:w-auto sm:flex-col sm:gap-y-6">
      <div :class="styles.stat">
        <div>看过</div>
        <div :class="styles.score">{{ user.total }}</div>
      </div>

      <div :class="styles.stat">
        <div>已评</div>
        <div :class="styles.score">
          {{ ((user.voted / user.total) * 100).toFixed(0) }}<span class="percent">%</span>
        </div>
      </div>

      <div :class="styles.stat">
        <div>均值</div>
        <div :class="styles.score">{{ user.avg }}</div>
      </div>

      <div :class="styles.stat">
        <div>中值</div>
        <div :class="styles.score">{{ user.median }}</div>
      </div>

      <div :class="styles.stat">
        <div>标准差</div>
        <div :class="styles.score">{{ user.stdev }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  user: {
    type: Object,
    required: true
  }
});

const styles = {
  subtitle: '',
  stat: 'grid grid-cols-[4rem_1fr] items-baseline gap-4 sm:block',
  score: 'text-6xl'
};
</script>
