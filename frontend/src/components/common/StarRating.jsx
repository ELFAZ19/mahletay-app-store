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
  const [selectedValue, setSelectedValue] = useState(value);

  // Update internal state when value prop changes
  React.useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleClick = (rating) => {
    if (interactive && onChange) {
      setSelectedValue(rating);
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

  // Use hoverValue if hovering, otherwise use selectedValue for interactive or value for display-only
  const displayValue = hoverValue || (interactive ? selectedValue : value);

  const stars = [];
  for (let i = 1; i <= count; i++) {
    const filled = i <= displayValue;
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
        aria-label={`Rate ${i} out of ${count} stars`}
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
