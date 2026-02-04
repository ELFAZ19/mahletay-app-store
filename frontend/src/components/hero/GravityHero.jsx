import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiDownload } from 'react-icons/fi';
import Button from '../common/Button';
import './GravityHero.css';

const GravityHero = () => {
    const [hoveredElement, setHoveredElement] = useState(null);

    return (
        <div className="gravity-hero-container">
            {/* Background decorative elements */}
            <div className="hero-decoration">
                {[...Array(10)].map((_, i) => (
                    <div 
                        key={i} 
                        className="floating-particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${15 + Math.random() * 10}s`
                        }}
                    />
                ))}
            </div>

            <div className="hero-content">
                <div 
                    className={`hero-element label-element ${hoveredElement === 'label' ? 'hovered' : ''}`}
                    onMouseEnter={() => setHoveredElement('label')}
                    onMouseLeave={() => setHoveredElement(null)}
                >
                    <span className="sacred-badge">✝ Sacred Hymns</span>
                </div>

                <div 
                    className={`hero-element title-element ${hoveredElement === 'title' ? 'hovered' : ''}`}
                    onMouseEnter={() => setHoveredElement('title')}
                    onMouseLeave={() => setHoveredElement(null)}
                >
                    <h1>
                        Ethiopian Orthodox<br/>
                        <span className="text-gold">Hymn Application</span>
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
