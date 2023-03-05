<script lang="ts" setup>
import {RouterView} from 'vue-router'</script>

<template>
  <div>
    <header
        class="text-xl sticky top-0 z-30
        items-center
         w-full border-amber-50 border-b-amber-50 border-b-2 flex justify-between sticky pl-4"
    >
      <div>
        <h1 class="text-4xl sm:block hidden"> netabare.
        </h1>
      </div>
      <div class="flex">
        <div class="p-4 border-l-4">
          个人
          <RouterLink
              class="text-gray-200 underline decoration-dotted underline-offset-4"
              to="/history"
          >评分分布
          </RouterLink>
          :
        </div>
        <div>
          <!--            <user-search font-size="1rem" />-->
        </div>
        <div class="p-4 border-l-4">
          动画
          <RouterLink
              class="text-gray-200 underline decoration-dotted underline-offset-4"
              to="/trending">评分趋势
          </RouterLink>
          :
        </div>
        <div>
          <!--            <subject-search font-size="1rem" />-->
        </div>
      </div>

    </header>

    <RouterView/>
  </div>
</template>

<style scoped></style>
