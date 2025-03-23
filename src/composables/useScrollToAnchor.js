// composables/useScrollToAnchor.js
import { onMounted, onBeforeUnmount } from 'vue';

export default function useScrollToAnchor() {
  const maxAttempts = 20; // Maximum number of attempts to find the element
  const interval = 100; // Interval between attempts in milliseconds
  let pollingInterval = null;
  let attemptCount = 0;

  const scrollToElement = () => {
    const hash = window.location.hash;
    if (!hash) return;

    clearInterval(pollingInterval); // Clear any existing polling
    attemptCount = 0;

    // Start polling for the element
    pollingInterval = setInterval(() => {
      attemptCount++;
      const targetElement = document.querySelector(hash);

      if (targetElement) {
        // Element found, scroll to it
        targetElement.scrollIntoView({ behavior: 'smooth' });
        clearInterval(pollingInterval);
      } else if (attemptCount >= maxAttempts) {
        // Max attempts reached, stop polling
        console.warn(`Element ${hash} not found after ${maxAttempts} attempts`);
        clearInterval(pollingInterval);
      }
    }, interval);
  };

  // Handle initial hash on mount
  onMounted(() => {
    scrollToElement();
  });

  // Clean up event listener and interval when component is unmounted
  onBeforeUnmount(() => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
  });
}
