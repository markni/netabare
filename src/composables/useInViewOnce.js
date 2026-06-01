import { onMounted, onUnmounted, ref } from 'vue';

export const useInViewOnce = (targetRef, options = {}) => {
  const { enabled = true, threshold = 0.2, root = null, rootMargin = '0px' } = options;
  const isInViewOnce = ref(!enabled);
  let observer = null;

  const stop = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  };

  onMounted(() => {
    if (!enabled) {
      isInViewOnce.value = true;
      return;
    }

    if (typeof window === 'undefined') {
      isInViewOnce.value = true;
      return;
    }

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      isInViewOnce.value = true;
      return;
    }

    if (!('IntersectionObserver' in window)) {
      isInViewOnce.value = true;
      return;
    }

    const element = targetRef.value;
    if (!element) {
      isInViewOnce.value = true;
      return;
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!isInViewOnce.value && entry.isIntersecting) {
            isInViewOnce.value = true;
            stop();
          }
        });
      },
      { root, rootMargin, threshold }
    );

    observer.observe(element);
  });

  onUnmounted(() => {
    stop();
  });

  return {
    isInViewOnce
  };
};
