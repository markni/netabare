<template>
  <div v-if="user" class="flex flex-col gap-2">
    <!-- <UserAvatar :user="user.user" /> -->
    <div class="text-3xl font-bold mb-4">
      {{ user.user.nickname }}
      <span v-if="user.year" class="text-sm text-lightGray whitespace-nowrap">
        ver. {{ user.year }}</span
      >
    </div>

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
