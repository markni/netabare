<template>
    <div class="wrapper">
        <user-rating :bgm-user-id="$route.params.id" />
    </div>
</template>

<script>
import UserRating from '@/components/UserRating';

export default {
  name: 'User',
  components: {
    UserRating
  }
};
</script>

<style scoped>
.wrapper {
  display: flex;
}
</style>
