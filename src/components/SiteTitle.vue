<template>
  <h1 class="site-title dark:text-white text-gray-800 text-6xl sm:text-[8rem] lg:text-[12rem] relative">netabare.</h1>
</template>

<script>
export default {
  name: "SiteTitle"
}
</script>

<style lang="scss" scoped>
@keyframes shadow-dance {
  0% {
    text-shadow: .5vmax 0 rgba(242, 0, 110, .4), -.3vmax -.4vmax rgba(49, 148, 255, .5)
  }

  50% {
    text-shadow: -.5vmax -.5vmax rgba(49, 148, 255, .5), .5vmax .5vmax rgba(242, 0, 110, .4)
  }

  to {
    text-shadow: .5vmax 0 rgba(242, 0, 110, .4), -.3vmax -.4vmax rgba(49, 148, 255, .5)
  }
}

.site-title {
  //font-size: 12rem;
  transition: opacity 2s, text-shadow 1s;
  text-shadow: 0.5vmax 0 rgb(49 148 255 / 30%), -0.2vmax -0.5vmax rgb(242 0 110 / 30%);
  cursor: pointer;
  margin-bottom: 1vmax;
  margin-top: 20vh;
  font-family: "myriad-pro", sans-serif;
  animation: shadow-dance 15s infinite;
}
</style>