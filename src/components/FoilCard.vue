<template>
  <div class="container">
    <div class="card" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
      <img src="https://i.imgur.com/pVjGhvs.png" alt="Card Image" class="card-image" />
      <div class="card-glare"></div>
    </div>

    <NumberSlider
      id="tilt-sensitivity"
      label="Tilt Sensitivity"
      v-model="sensitivity"
      :min="5"
      :max="50"
    />
    <NumberSlider id="glare-angle" label="Glare Angle" v-model="glareAngle" :min="0" :max="360" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import NumberSlider from './NumberSlider.vue';

const sensitivity = ref(35); // This now mirrors the CSS default
const glareAngle = ref(264); // Default angle from original CSS

// Calculate mouse position relative to card center (-1 to 1)
const getRelativeMousePosition = (e, rect) => {
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  return {
    x: (x - centerX) / centerX, // -1 to 1
    y: (y - centerY) / centerY, // -1 to 1
    rawX: x,
    rawY: y,
    rect
  };
};

// Calculate rotation based on mouse position
const updateRotation = (card, mousePos) => {
  const currentSensitivity = getComputedStyle(card).getPropertyValue('--sensitivity');
  const rotX = mousePos.y * (currentSensitivity / 2);
  const rotY = mousePos.x * (currentSensitivity / 2);

  card.style.setProperty('--rotation-x', `${rotX}deg`);
  card.style.setProperty('--rotation-y', `${rotY}deg`);
};

// Update glare effect
const updateGlare = (card, mousePos) => {
  const xPercent = (mousePos.rawX / mousePos.rect.width) * 100;
  const yPercent = (mousePos.rawY / mousePos.rect.height) * 100;

  card.style.setProperty('--pointer-x', `${xPercent}%`);
  card.style.setProperty('--pointer-y', `${yPercent}%`);
};

// Main mouse move handler
const handleMouseMove = (e) => {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const mousePos = getRelativeMousePosition(e, rect);

  updateRotation(card, mousePos);
  updateGlare(card, mousePos);
};

const handleMouseLeave = (event) => {
  const card = event.currentTarget;
  card.style.setProperty('--rotation-x', '0deg');
  card.style.setProperty('--rotation-y', '0deg');
};

// Watch for sensitivity changes and update CSS variable
watch(sensitivity, (newValue) => {
  const card = document.querySelector('.card');
  if (card) {
    card.style.setProperty('--sensitivity', newValue);
  }
});

// Watch for glare angle changes and update CSS variable
watch(glareAngle, (newValue) => {
  const card = document.querySelector('.card');
  if (card) {
    card.style.setProperty('--glare-angle', `${newValue}deg`);
  }
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.card {
  --rotation-x: 0deg;
  --rotation-y: 0deg;
  --sensitivity: 35;
  --pointer-x: 50%;
  --pointer-y: 50%;
  --glare-angle: 264deg;
  position: relative;

  width: 300px;
  height: 420px;
  border-radius: 15px;
  transition: transform 0.2s ease-out;
  transform-style: preserve-3d;
  perspective: 1000px;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transform: rotateX(var(--rotation-x)) rotateY(var(--rotation-y));
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
}

.card-glare {
  position: absolute;
  inset: 0;
  transform: translateZ(1px);
  background: linear-gradient(
    var(--glare-angle),
    transparent 20%,
    rgba(255, 255, 255, 0.3) 40%,
    rgba(255, 255, 255, 0.8) 50%,
    rgba(255, 255, 255, 0.3) 60%,
    transparent 80%
  );
  background-position: var(--pointer-x) var(--pointer-y);
  background-size: 200% 200%;
  mix-blend-mode: soft-light;
  pointer-events: none;
  transition: opacity 0.3s ease;
}
</style>
