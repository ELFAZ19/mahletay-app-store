/**
 * Home Page
 * Landing page with sacred hero section
 */

import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiDownload, FiStar, FiHeart } from 'react-icons/fi';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import './Home.css';

const Home = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    // Parallax effect on scroll
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.pageYOffset;
        heroRef.current.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background" ref={heroRef}></div>
        <div className="container hero-content">
          <div className="hero-text fade-in-up">
            <span className="hero-label">✝ Sacred Hymns for Your Spiritual Journey</span>
            <h1 className="hero-title">
              Ethiopian Orthodox <br />
              <span className="text-gold">Hymn Application</span>
            </h1>
            <p className="hero-description">
              Experience the divine beauty of traditional Ethiopian Orthodox hymns. 
              Download our mobile application and carry the sacred music with you wherever you go.
            </p>
            <div className="hero-actions">
              <Link to="/download">
                <Button size="large" magnetic variant="primary">
                  <FiDownload /> Download Latest Version
                </Button>
              </Link>
              <Link to="/about">
                <Button size="large" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section features-section">
        <div className="container">
          <h2 className="section-title text-center fade-in-up">
            Sacred Features
          </h2>
          <p className="section-description text-center fade-in-up">
            Designed with reverence and care for your spiritual journey
          </p>

          <div className="features-grid">
            <Card hoverable className="feature-card stagger-item">
              <div className="feature-icon sacred-glow">🎵</div>
              <h3>200+ Sacred Hymns</h3>
              <p>Comprehensive collection of traditional Ethiopian Orthodox hymns in Amharic and Ge'ez</p>
            </Card>

            <Card hoverable className="feature-card stagger-item">
              <div className="feature-icon sacred-glow">📖</div>
              <h3>Multilingual Lyrics</h3>
              <p>Read hymn lyrics in multiple languages with accurate translations</p>
            </Card>

            <Card hoverable className="feature-card stagger-item">
              <div className="feature-icon sacred-glow">🌙</div>
              <h3>Dark Mode</h3>
              <p>Beautiful sacred design in both light and dark themes for any time of day</p>
            </Card>

            <Card hoverable className="feature-card stagger-item">
              <div className="feature-icon sacred-glow">📱</div>
              <h3>Offline Access</h3>
              <p>Listen to hymns anytime, anywhere without internet connection</p>
            </Card>

            <Card hoverable className="feature-card stagger-item">
              <div className="feature-icon sacred-glow">🔔</div>
              <h3>Daily Devotionals</h3>
              <p>Receive gentle notifications for your daily prayer times</p>
            </Card>

            <Card hoverable className="feature-card stagger-item">
              <div className="feature-icon sacred-glow">🎨</div>
              <h3>Sacred Design</h3>
              <p>Interface crafted with reverence, beauty, and spiritual aesthetics</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item fade-in-up">
              <div className="stat-number text-gold">200+</div>
              <div className="stat-label">Sacred Hymns</div>
            </div>
            <div className="stat-item fade-in-up">
              <div className="stat-number text-gold">10K+</div>
              <div className="stat-label">Downloads</div>
            </div>
            <div className="stat-item fade-in-up">
              <div className="stat-number text-gold">
                <FiStar fill="currentColor" style={{ display: 'inline' }} /> 4.9
              </div>
              <div className="stat-label">Average Rating</div>
            </div>
            <div className="stat-item fade-in-up">
              <div className="stat-number text-gold">
                <FiHeart fill="currentColor" style={{ display: 'inline' }} /> 100%
              </div>
              <div className="stat-label">Made with Faith</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <Card className="cta-card card-sacred">
            <div className="cta-content">
              <h2>Begin Your Spiritual Journey Today</h2>
              <p>
                Download the Orthodox Hymn application and immerse yourself in the sacred music 
                of our faith tradition. May these hymns bring you peace, comfort, and closer to God.
              </p>
              <Link to="/download">
                <Button size="large" magnetic variant="primary">
                  <FiDownload /> Download Now
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
