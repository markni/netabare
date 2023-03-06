<template>
  <div class="user-view h-full flex justify-center items-center">
    <form :class="{ 'fixed bottom-4 right-4': !!route.params.id, 'bottom-1/2 right-1/2': !route.params.id }"
          class="duration-1000 transition-br ease-in-out"
          @submit.prevent="submit">
      <!--      <label for="user-id">User ID {{ useUserStore().user.bgmId }}</label>-->
      <input id="user-id" v-model="bgmId"

             aria-label="User's bangumi.tv username or uid"
             class="dark:bg-gray-800 bg-gray-100 border-b dark:border-b-amber-50 border-gray-900 pl-1 pb-1 outline-11y "
             placeholder="uid / username"
             type="text"/>
    </form>
  </div>
</template>


<script lang="ts" setup>
import {useRoute, useRouter} from "vue-router";
// import {useUserStore} from "@/stores/user";
import {ref} from "vue";
//
const bgmId = ref('');
// const loading = ref(false);
//
const route = useRoute();
const router = useRouter();
//
//
// if (route.params.id && !Array.isArray(route.params.id)) {
//   await useUserStore().fetchUser(route.params.id);
// }
//
function submit() {

  if (route.params.id) {
    router.push({name: 'user', params: {id: bgmId.value}})
  } else {
    router.replace({name: 'user', params: {id: bgmId.value}})
  }


}

//
// watch(() => route.params.id, (id) => {
//   console.log('watch', id);
//   if (id && !Array.isArray(id)) {
//     useUserStore().fetchUser(id);
//     bgmId.value = '';
//   }
// });


</script>

<style scoped>

</style>