/**
 * About Page
 * Mission and information about the platform
 */

import React from 'react';
import ScrollReveal from '../components/animations/ScrollReveal';
import FloatingElement from '../components/animations/FloatingElement';
import Card from '../components/common/Card';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <div className="about-hero-content">
              <FloatingElement delay={0} distance={15}>
                <div className="hero-icon">✝</div>
              </FloatingElement>
              <h1>Our Sacred Mission</h1>
              <p className="hero-subtitle">
                Preserving and sharing the rich tradition of Ethiopian Orthodox hymns 
                for the faithful around the world
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <Card className="mission-card card-sacred">
              <h2>Our Purpose</h2>
              <p>
                The Orthodox Hymn Platform was created with deep reverence and dedication 
                to serve the Ethiopian Orthodox Christian community. Our mission is to make 
                sacred hymns accessible to believers wherever they are, helping them maintain 
                their spiritual connection through the timeless melodies of our faith.
              </p>
              <p>
                Each hymn in our collection has been carefully curated to ensure authenticity 
                and spiritual depth. We believe that these sacred songs are not just music, 
                but prayers that uplift the soul and draw us closer to God.
              </p>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      {/* Values Section */}
      <section className="section values-section">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <h2 className="section-title text-center">Our Core Values</h2>
          </ScrollReveal>

          <div className="values-grid">
            <ScrollReveal animation="fade-up" delay={0.1}>
              <Card hoverable className="value-card">
                <div className="value-icon">🙏</div>
                <h3>Faithfulness</h3>
                <p>
                  We honor the ancient traditions of the Ethiopian Orthodox Church, 
                  ensuring every hymn reflects the true spirit of our faith.
                </p>
              </Card>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={0.2}>
              <Card hoverable className="value-card">
                <div className="value-icon">🌍</div>
                <h3>Accessibility</h3>
                <p>
                  Making sacred hymns available to all believers, regardless of 
                  location, helping diaspora communities stay connected to their roots.
                </p>
              </Card>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={0.3}>
              <Card hoverable className="value-card">
                <div className="value-icon">📖</div>
                <h3>Authenticity</h3>
                <p>
                  Every hymn is verified for theological accuracy and adherence 
                  to Orthodox tradition by knowledgeable clergy.
                </p>
              </Card>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={0.4}>
              <Card hoverable className="value-card">
                <div className="value-icon">💫</div>
                <h3>Excellence</h3>
                <p>
                  We strive for the highest quality in audio, translations, and 
                  user experience to honor the sacred nature of our content.
                </p>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="section community-section">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <h2 className="section-title text-center">Join Our Community</h2>
            <Card className="community-card">
              <p className="text-center">
                We invite you to be part of this blessed journey. Download the app, 
                share your feedback, and help us grow this sacred resource for future 
                generations. Together, we preserve the beautiful heritage of Ethiopian 
                Orthodox hymns.
              </p>
              <div className="community-stats">
                <div className="stat">
                  <div className="stat-number text-gold">200+</div>
                  <div className="stat-label">Sacred Hymns</div>
                </div>
                <div className="stat">
                  <div className="stat-number text-gold">10K+</div>
                  <div className="stat-label">Faithful Users</div>
                </div>
                <div className="stat">
                  <div className="stat-number text-gold">50+</div>
                  <div className="stat-label">Countries Reached</div>
                </div>
              </div>
            </Card>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default About;
