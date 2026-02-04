/**
 * Floating Element Component
 * Creates subtle floating animation
 */

import React from 'react';
import './FloatingElement.css';

const FloatingElement = ({ 
  children, 
  delay = 0,
  duration = 3,
  distance = 20,
  className = ''
}) => {
  return (
    <div
      className={`floating-element ${className}`}
      style={{
        '--float-delay': `${delay}s`,
        '--float-duration': `${duration}s`,
        '--float-distance': `${distance}px`
      }}
    >
      {children}
    </div>
  );
};

export default FloatingElement;
