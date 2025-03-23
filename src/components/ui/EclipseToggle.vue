<template>
  <button @click="$emit('toggle')" class="sun">
    <div
      class="moon"
      :class="{ 'moon-dark': mode === 'dark', 'moon-light': mode === 'light' }"
    ></div>
  </button>
</template>

<script setup>
defineEmits(['toggle']);
defineProps({
  lightThemeColor: {
    type: String,
    default: '#fafaf9'
  },
  darkThemeColor: {
    type: String,
    default: '#171717'
  },
  mode: {
    type: String,
    default: 'dark',
    validator: (value) => ['dark', 'light'].includes(value)
  }
});
</script>

<style scoped>
.theme-toggle-transition {
  transition: opacity 10s;
}

.theme-toggle-transition:hover {
  transition: opacity 0.1s;
}

.sun {
  background-color: v-bind(lightThemeColor);
  height: 48px;
  width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border-radius: 9999px;
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 10000ms;
  box-shadow:
    -1.2px 1.2px 1.392px rgba(255, 255, 255, 1),
    -9.5px 9.5px 11.02px rgba(255, 255, 255, 0.2),
    -17.8px 17.8px 20.648px rgba(255, 255, 255, 0.169),
    -26.1px 26.1px 30.276px rgba(255, 255, 255, 0.141),
    -34.4px 34.4px 39.904px rgba(255, 255, 255, 0.117),
    -42.7px 42.7px 49.532px rgba(255, 255, 255, 0.096),
    -51px 51px 59.16px rgba(255, 255, 255, 0.079),
    -59.3px 59.3px 68.788px rgba(255, 255, 255, 0.063),
    -67.6px 67.6px 78.416px rgba(255, 255, 255, 0.05),
    -75.9px 75.9px 88.044px rgba(255, 255, 255, 0.04),
    -84.2px 84.2px 97.672px rgba(255, 255, 255, 0.031),
    -92.5px 92.5px 107.3px rgba(255, 255, 255, 0.023),
    -100.8px 100.8px 116.928px rgba(255, 255, 255, 0.017),
    -109.1px 109.1px 126.556px rgba(255, 255, 255, 0.013),
    -117.4px 117.4px 136.184px rgba(255, 255, 255, 0.009),
    -125.7px 125.7px 145.812px rgba(255, 255, 255, 0.006),
    -134px 134px 155.44px rgba(255, 255, 255, 0.004),
    -142.3px 142.3px 165.068px rgba(255, 255, 255, 0.002),
    -150.6px 150.6px 174.696px rgba(255, 255, 255, 0.001),
    -158.9px 158.9px 184.324px rgba(255, 255, 255, 0.001),
    -167.2px 167.2px 193.952px rgba(255, 255, 255, 0),
    -175.5px 175.5px 203.58px rgba(255, 255, 255, 0),
    -183.8px 183.8px 213.208px rgba(255, 255, 255, 0),
    -192.1px 192.1px 222.836px rgba(255, 255, 255, 0),
    -200.4px 200.4px 232.464px rgba(255, 255, 255, 0);
}

.sun:hover {
  opacity: 1;
  transition-duration: 500ms;
}

.moon {
  background-color: v-bind(darkThemeColor);
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.moon-dark {
  transform: translateX(1px);
}

.moon-light {
  transform: translateX(37px);
}
</style>
