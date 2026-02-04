/**
 * Loading Component
 * Sacred loading animation
 */

import React from 'react';
import './Loading.css';

const Loading = ({ size = 'medium', text = '' }) => {
  return (
    <div className="loading-container">
      <div className={`loading-spinner loading-${size}`}>
        <div className="spinner-cross">✝</div>
      </div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default Loading;
