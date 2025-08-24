<template>
  <div
    id="loading2"
    class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
  >
    <div class="text-center">
      <div class="morse-code font-mono mb-4 flex items-center text-4xl">
        <span class="dot">.</span>
        <span class="dash">-</span>
        <span class="dot">.</span>
        <span class="dot">.</span>
        <span class="space"> </span>
        <span class="dash">-</span>
        <span class="dash">-</span>
        <span class="dash">-</span>
        <span class="space"> </span>
        <span class="dot">.</span>
        <span class="dash">-</span>
        <span class="space"> </span>
        <span class="dash">-</span>
        <span class="dot">.</span>
        <span class="dot">.</span>
        <span class="space"> </span>
        <span class="dot">.</span>
        <span class="dot">.</span>
        <span class="space"> </span>
        <span class="dash">-</span>
        <span class="dot">.</span>
        <span class="dash">-</span>
        <span class="dot">.</span>
        <span class="dot">.</span>
        <span class="dash">-</span>
        <span class="dash">-</span>
      </div>
    </div>
  </div>
</template>

<script setup>
// No props or logic needed for this component
</script>

<style scoped>
/* Morse code loading animation */
.morse-code .dot,
.morse-code .dash {
  display: inline-block;
  animation: morseBlink 3s infinite;
  opacity: 0.3;
  margin: 0 1px;
}

.morse-code .space {
  display: inline-block;
  width: 20px;
}

/* Animation delays for each character in "LOADING" */
.morse-code .dot:nth-child(1) {
  animation-delay: 0s;
} /* L */
.morse-code .dash:nth-child(2) {
  animation-delay: 0.2s;
}
.morse-code .dot:nth-child(3) {
  animation-delay: 0.4s;
}
.morse-code .dot:nth-child(4) {
  animation-delay: 0.6s;
}
.morse-code .space:nth-child(5) {
  animation-delay: 0.8s;
}
.morse-code .dash:nth-child(6) {
  animation-delay: 1s;
} /* O */
.morse-code .dash:nth-child(7) {
  animation-delay: 1.2s;
}
.morse-code .dash:nth-child(8) {
  animation-delay: 1.4s;
}
.morse-code .space:nth-child(9) {
  animation-delay: 1.6s;
}
.morse-code .dot:nth-child(10) {
  animation-delay: 1.8s;
} /* A */
.morse-code .dash:nth-child(11) {
  animation-delay: 2s;
}
.morse-code .space:nth-child(12) {
  animation-delay: 2.2s;
}
.morse-code .dash:nth-child(13) {
  animation-delay: 2.4s;
} /* D */
.morse-code .dot:nth-child(14) {
  animation-delay: 2.6s;
}
.morse-code .dot:nth-child(15) {
  animation-delay: 2.8s;
}
.morse-code .space:nth-child(16) {
  animation-delay: 3s;
}
.morse-code .dot:nth-child(17) {
  animation-delay: 3.2s;
} /* I */
.morse-code .dot:nth-child(18) {
  animation-delay: 3.4s;
}
.morse-code .space:nth-child(19) {
  animation-delay: 3.6s;
}
.morse-code .dash:nth-child(20) {
  animation-delay: 3.8s;
} /* N */
.morse-code .dot:nth-child(21) {
  animation-delay: 4s;
}
.morse-code .dash:nth-child(22) {
  animation-delay: 4.2s;
}
.morse-code .dot:nth-child(23) {
  animation-delay: 4.4s;
}
.morse-code .dot:nth-child(24) {
  animation-delay: 4.6s;
}
.morse-code .dash:nth-child(25) {
  animation-delay: 4.8s;
} /* G */
.morse-code .dash:nth-child(26) {
  animation-delay: 5s;
}

@keyframes morseBlink {
  0%,
  15% {
    opacity: 1;
    transform: scale(1.2);
  }
  20%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
}
</style>
