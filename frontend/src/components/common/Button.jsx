/**
 * Button Component
 * Sacred styled button with magnetic effect
 */

import React, { useRef } from 'react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  magnetic = false,
  className = '',
  ...props 
}) => {
  const buttonRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!magnetic || !buttonRef.current) return;

    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    button.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  };

  const handleMouseLeave = () => {
    if (!buttonRef.current) return;
    buttonRef.current.style.transform = 'translate(0, 0)';
  };

  return (
    <button
      ref={buttonRef}
      className={`btn btn-${variant} btn-${size} ${magnetic ? 'magnetic-button' : ''} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
