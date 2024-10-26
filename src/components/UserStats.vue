<template>
  <div v-if="user" class="flex flex-col items-center gap-2 sm:items-start">
    <!-- <UserAvatar :user="user.user" /> -->
    <div class="mb-4 text-3xl font-bold">
      {{ user.user.nickname }}
      <span v-if="user.year" class="whitespace-nowrap text-sm text-lightGray">
        ver. {{ user.year }}</span
      >
    </div>

    <div class="flex flex-row flex-wrap gap-x-16 gap-y-4 sm:flex-col sm:gap-x-2 sm:gap-y-2">
      <div>
        <div>看过</div>
        <div :class="styles.score">{{ user.total }}</div>
      </div>

      <div>
        <div>已评</div>
        <div :class="styles.score">
          {{ ((user.voted / user.total) * 100).toFixed(0) }}<span class="percent">%</span>
        </div>
      </div>

      <div>
        <div>均值</div>
        <div :class="styles.score">{{ user.avg }}</div>
      </div>

      <div>
        <div>中值</div>
        <div :class="styles.score">{{ user.median }}</div>
      </div>

      <div>
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
  score: 'text-4xl'
};
</script>
