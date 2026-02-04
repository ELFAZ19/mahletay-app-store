/**
 * Home Page
 * Landing page with sacred hero section
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { FiDownload, FiStar, FiHeart } from 'react-icons/fi';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import InfiniteCarousel from '../components/common/InfiniteCarousel';
import GravityHero from '../components/hero/GravityHero';
import ScrollReveal from '../components/animations/ScrollReveal';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Physics Driven Hero Section */}
      <GravityHero />

      {/* Features Section */}
      <section className="section features-section">
        <div className="container">
          <div className="section-header-wrapper">
            <ScrollReveal animation="fade-up">
            <h2 className="section-title text-center">
              Sacred Features
            </h2>
            <p className="section-description text-center">
              Designed with reverence and care for your spiritual journey
            </p>
          </ScrollReveal>
          </div>

          <div className="features-carousel-wrapper">
            <InfiniteCarousel speed={40}>
              <Card hoverable className="feature-card-compact">
                <div className="feature-icon-wrapper-compact">
                  <div className="feature-icon sacred-glow">🎵</div>
                </div>
                <h3>200+ Sacred Hymns</h3>
                <p>Comprehensive collection of traditional Orthodox hymns</p>
              </Card>

              <Card hoverable className="feature-card-compact">
                <div className="feature-icon-wrapper-compact">
                  <div className="feature-icon sacred-glow">📖</div>
                </div>
                <h3>Multilingual Lyrics</h3>
                <p>Read hymn lyrics in Amharic, Ge'ez and English</p>
              </Card>

              <Card hoverable className="feature-card-compact">
                <div className="feature-icon-wrapper-compact">
                  <div className="feature-icon sacred-glow">🌙</div>
                </div>
                <h3>Dark Mode</h3>
                <p>Beautiful sacred design in light and dark themes</p>
              </Card>

              <Card hoverable className="feature-card-compact">
                <div className="feature-icon-wrapper-compact">
                  <div className="feature-icon sacred-glow">📱</div>
                </div>
                <h3>Offline Access</h3>
                <p>Listen anytime without internet connection</p>
              </Card>

              <Card hoverable className="feature-card-compact">
                <div className="feature-icon-wrapper-compact">
                  <div className="feature-icon sacred-glow">🔔</div>
                </div>
                <h3>Daily Devotionals</h3>
                <p>Gentle notifications for daily prayers</p>
              </Card>

              <Card hoverable className="feature-card-compact">
                <div className="feature-icon-wrapper-compact">
                  <div className="feature-icon sacred-glow">🎨</div>
                </div>
                <h3>Sacred Design</h3>
                <p>Interface crafted with reverence and beauty</p>
              </Card>
            </InfiniteCarousel>
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
