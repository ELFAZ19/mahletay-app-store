/**
 * Card Component
 * Sacred card design with lift effect
 */

import React from 'react';
import './Card.css';

const Card = ({ 
  children, 
  variant = 'default',
  hoverable = false,
  className = '',
  ...props 
}) => {
  return (
    <div 
      className={`card card-${variant} ${hoverable ? 'card-hoverable' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
