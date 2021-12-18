<template>
  <div>user data</div>
</template>

<script>
import { defineComponent } from "vue";

import { fetchUser } from "@/utils/api";

export default defineComponent({
  name: "User",
  components: {},
  props: ["id"],
  data: function () {
    return {};
  },
  async mounted() {
    await this.getData();
  },
  methods: {
    getData: async function () {
      let { data } = await fetchUser(this.id);
    },
  },
});
</script>

<style scoped lang="sass"></style>
