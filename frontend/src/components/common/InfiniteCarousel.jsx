import React, { useEffect, useRef } from 'react';
import './InfiniteCarousel.css';

const InfiniteCarousel = ({
  children,
  speed = 30, // Slightly increased default speed
  pauseOnHover = true
}) => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const rafRef = useRef(null);
  const isDragging = useRef(false);
  const isHovered = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const lastTime = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const groupWidth = track.scrollWidth / 3;
    // Start at the second group for seamless bidirectional scroll
    if (container.scrollLeft === 0) {
      container.scrollLeft = groupWidth;
    }

    const loop = (time) => {
      if (!lastTime.current) lastTime.current = time;
      const delta = time - lastTime.current;
      lastTime.current = time;

      // Only scroll if not dragging AND (not paused OR not hovered)
      const shouldScroll = !isDragging.current && (!pauseOnHover || !isHovered.current);

      if (shouldScroll) {
        // Smooth natural scroll with easing integration
        const pxPerFrame = (speed * delta) / 1000;
        container.scrollLeft += pxPerFrame;
      }

      // Circular loop logic
      if (container.scrollLeft >= groupWidth * 2) {
        container.scrollLeft -= groupWidth;
      }
      if (container.scrollLeft <= 0) {
        container.scrollLeft += groupWidth;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafRef.current);
  }, [children, speed, pauseOnHover]);

  /* Drag support */
  const onMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX;
    scrollStart.current = containerRef.current.scrollLeft;
    containerRef.current.style.cursor = 'grabbing';
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault(); // Prevent text selection
    const dx = e.pageX - startX.current;
    containerRef.current.scrollLeft = scrollStart.current - dx;
  };

  const onMouseUp = () => {
    isDragging.current = false;
    containerRef.current.style.cursor = 'grab';
  };

  const onMouseEnter = () => {
    isHovered.current = true;
  };

  const onMouseLeave = () => {
    isHovered.current = false;
    isDragging.current = false; // Safety release
    containerRef.current.style.cursor = 'grab';
  };

  return (
    <div
      ref={containerRef}
      className="infinite-carousel-container"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      onMouseEnter={onMouseEnter}
    >
      <div ref={trackRef} className="infinite-carousel-track">
        {/* 3 copies for seamless loop */}
        <div className="carousel-group">{children}</div>
        <div className="carousel-group">{children}</div>
        <div className="carousel-group">{children}</div>
      </div>
    </div>
  );
};

export default InfiniteCarousel;
