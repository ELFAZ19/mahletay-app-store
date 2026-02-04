/**
 * Scroll Animation Hook
 * Advanced scroll-triggered animations inspired by antigravity.google
 */

import { useEffect, useRef, useState } from 'react';

export const useScrollAnimation = (options = {}) => {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px'
      }
    );

    observer.observe(element);

    // Track scroll progress for parallax effects
    const handleScroll = () => {
      if (!element) return;
      
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementHeight = rect.height;
      
      // Calculate progress from -1 (above viewport) to 1 (below viewport)
      const progress = (windowHeight - rect.top) / (windowHeight + elementHeight);
      setScrollProgress(Math.max(0, Math.min(1, progress)));
    };

    if (options.trackProgress) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }

    return () => {
      observer.disconnect();
      if (options.trackProgress) {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [options.threshold, options.rootMargin, options.trackProgress]);

  return { elementRef, isVisible, scrollProgress };
};

export const useParallax = (speed = 0.5) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset * speed);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return offset;
};

export const useSmoothScroll = () => {
  const scrollTo = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return scrollTo;
};
