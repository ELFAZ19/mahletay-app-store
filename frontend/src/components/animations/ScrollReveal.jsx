/**
 * Scroll Reveal Component
 * Wrapper for scroll-triggered animations
 */

import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import './ScrollReveal.css';

const ScrollReveal = ({ 
  children, 
  animation = 'fade-up',
  delay = 0,
  duration = 0.8,
  className = ''
}) => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <div
      ref={elementRef}
      className={`scroll-reveal ${animation} ${isVisible ? 'is-visible' : ''} ${className}`}
      style={{
        '--animation-delay': `${delay}s`,
        '--animation-duration': `${duration}s`
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
