import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiDownload } from 'react-icons/fi';
import Button from '../common/Button';
import './GravityHero.css';

const GravityHero = () => {
    const [hoveredElement, setHoveredElement] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const particlesRef = useRef([]);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setMousePos({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Calculate particle position based on cursor attraction
    const getParticleStyle = (index, baseLeft, baseTop) => {
        const baseX = parseFloat(baseLeft);
        const baseY = parseFloat(baseTop);
        
        // Calculate distance and direction to cursor
        const dx = mousePos.x - (baseX * containerRef.current?.offsetWidth / 100 || 0);
        const dy = mousePos.y - (baseY * containerRef.current?.offsetHeight / 100 || 0);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Stronger attraction (increased radius and pull strength for amazing effect)
        const maxDistance = 350; // Increased from 200px for wider reach
        const strength = distance < maxDistance ? (maxDistance - distance) / maxDistance : 0;
        const pullStrength = strength * 80; // Increased from 40px to 80px for dramatic movement
        
        // Calculate pull direction
        const moveX = (dx / distance) * pullStrength || 0;
        const moveY = (dy / distance) * pullStrength || 0;

        return {
            left: baseLeft,
            top: baseTop,
            transform: `translate(${moveX}px, ${moveY}px)`,
            transition: 'transform 0.25s ease-out' // Slightly faster response
        };
    };

    const particlePositions = [
        // Original positions
        { left: '10%', top: '15%' },
        { left: '85%', top: '20%' },
        { left: '15%', top: '70%' },
        { left: '90%', top: '75%' },
        { left: '50%', top: '10%' },
        { left: '25%', top: '40%' },
        { left: '75%', top: '50%' },
        { left: '40%', top: '85%' },
        { left: '60%', top: '30%' },
        { left: '30%', top: '60%' },
        // Additional scattered particles
        { left: '5%', top: '45%' },
        { left: '95%', top: '35%' },
        { left: '20%', top: '25%' },
        { left: '80%', top: '65%' },
        { left: '45%', top: '55%' },
        { left: '65%', top: '15%' },
        { left: '35%', top: '80%' },
        { left: '70%', top: '25%' },
        { left: '12%', top: '90%' },
        { left: '88%', top: '10%' },
        { left: '55%', top: '70%' },
        { left: '42%', top: '20%' },
        { left: '78%', top: '85%' },
        { left: '18%', top: '35%' },
        { left: '92%', top: '55%' }
    ];

    return (
        <div className="gravity-hero-container" ref={containerRef}>
            {/* Background decorative particles that follow cursor */}
            <div className="hero-decoration">
                {particlePositions.map((pos, i) => (
                    <div 
                        key={i} 
                        className="floating-particle"
                        style={getParticleStyle(i, pos.left, pos.top)}
                    />
                ))}
            </div>

            <div className="hero-content">
                <div 
                    className={`hero-element label-element ${hoveredElement === 'label' ? 'hovered' : ''}`}
                    onMouseEnter={() => setHoveredElement('label')}
                    onMouseLeave={() => setHoveredElement(null)}
                >
                    <span className="sacred-badge">✝ Spritual Hymns</span>
                </div>

                <div 
                    className={`hero-element title-element ${hoveredElement === 'title' ? 'hovered' : ''}`}
                    onMouseEnter={() => setHoveredElement('title')}
                    onMouseLeave={() => setHoveredElement(null)}
                >
                    <h1>
                        ማኅሌታይ የኦርቶዶክሳዊ የመዝሙር<br/>
                        <span className="text-gold"> Application</span>
                    </h1>
                </div>

                <div 
                    className={`hero-element desc-element ${hoveredElement === 'desc' ? 'hovered' : ''}`}
                    onMouseEnter={() => setHoveredElement('desc')}
                    onMouseLeave={() => setHoveredElement(null)}
                >
                    <p>Experience the divine beauty of traditional Ethiopian Orthodox hymns.</p>
                </div>

                <div className="hero-actions">
                    <Link to="/download">
                        <Button size="large" variant="primary" magnetic>
                            <FiDownload /> Download App
                        </Button>
                    </Link>
                    <Link to="/about">
                        <Button size="large" variant="outline" magnetic>
                            Learn More
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default GravityHero;
