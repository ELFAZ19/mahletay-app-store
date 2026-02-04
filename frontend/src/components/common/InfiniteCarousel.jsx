const InfiniteCarousel = ({ children, speed = 30, direction = 'left', pauseOnHover = true }) => {
  const [contentWidth, setContentWidth] = useState(0);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      setContentWidth(contentRef.current.scrollWidth);
    }
  }, [children]);

  // We duplicate children to create a seamless loop
  const duplicatedChildren = [children, children, children]; 

  return (
    <div 
      className={`infinite-carousel-container ${pauseOnHover ? 'pause-hover' : ''}`} 
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="infinite-carousel-track" 
        ref={contentRef}
        style={{
          '--animation-duration': `${contentWidth / speed}s`,
          '--animation-direction': direction === 'left' ? 'normal' : 'reverse',
          animationPlayState: isHovered ? 'paused' : 'running'
        }}
      >
        {duplicatedChildren.map((childSet, index) => (
          <div key={index} className="carousel-group">
            {childSet}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteCarousel;
