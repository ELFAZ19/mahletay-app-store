/**
 * StarRating Component
 * Interactive star rating display and input
 */

import React, { useState } from 'react';
import { FiStar } from 'react-icons/fi';
import './StarRating.css';

const StarRating = ({ 
  value = 0, 
  count = 5, 
  size = 20,
  interactive = false, 
  onChange 
}) => {
  const [hoverValue, setHoverValue] = useState(0);

  const handleClick = (rating) => {
    if (interactive && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating) => {
    if (interactive) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverValue(0);
    }
  };

  const stars = [];
  for (let i = 1; i <= count; i++) {
    const filled = i <= (hoverValue || value);
    stars.push(
      <button
        key={i}
        type="button"
        className={`star ${filled ? 'star-filled' : ''} ${interactive ? 'star-interactive' : ''}`}
        onClick={() => handleClick(i)}
        onMouseEnter={() => handleMouseEnter(i)}
        onMouseLeave={handleMouseLeave}
        disabled={!interactive}
        style={{ fontSize: size }}
      >
        <FiStar className="star-icon" fill={filled ? 'currentColor' : 'none'} />
      </button>
    );
  }

  return (
    <div className="star-rating">
      {stars}
    </div>
  );
};

export default StarRating;
