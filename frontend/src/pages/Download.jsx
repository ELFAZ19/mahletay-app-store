/**
 * Download Page
 * App version downloads with smooth animations
 */

import React, { useEffect, useState } from 'react';
import { FiDownload, FiCalendar, FiStar } from 'react-icons/fi';
import api from '../config/api';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import ScrollReveal from '../components/animations/ScrollReveal';
import StarRating from '../components/common/StarRating';
import './Download.css';

const Download = () => {
  const [versions, setVersions] = useState([]);
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const [versionsRes, latestRes] = await Promise.all([
          api.get('/versions?activeOnly=true'),
          api.get('/versions/latest')
        ]);
        setVersions(versionsRes.data.data.versions);
        setLatest(latestRes.data.data);
      } catch (error) {
        console.error('Error fetching versions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVersions();
  }, []);

  const handleDownload = async (versionId) => {
    window.location.href = `${api.defaults.baseURL}/versions/${versionId}/download`;
  };

  if (loading) {
    return (
      <div className="page-loading">
        <Loading size="large" text="Loading versions..." />
      </div>
    );
  }

  return (
    <div className="download-page">
      {/* Latest Version Hero */}
      {latest && (
        <section className="latest-version-hero">
          <div className="container">
            <ScrollReveal animation="fade-up">
              <div className="latest-version-content">
                <span className="version-badge">Latest Version</span>
                <h1 className="version-title">
                  Version {latest.version_number}
                  <span className="version-name">{latest.version_name}</span>
                </h1>
                
                <div className="version-meta">
                  <div className="meta-item">
                    <FiCalendar />
                    <span>{new Date(latest.release_date).toLocaleDateString()}</span>
                  </div>
                  {latest.stats && (
                    <div className="meta-item">
                      <FiStar />
                      <span>{latest.stats.avgRating.toFixed(1)} ({latest.stats.ratingCount} ratings)</span>
                    </div>
                  )}
                </div>

                <Button 
                  size="large" 
                  magnetic 
                  onClick={() => handleDownload(latest.id)}
                  className="download-btn-hero"
                >
                  <FiDownload /> Download Now ({(latest.file_size / 1024 / 1024).toFixed(1)} MB)
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Changelog Section */}
      {latest &&  latest.changelog && (
        <section className="changelog-section">
          <div className="container">
            <ScrollReveal animation="fade-up" delay={0.2}>
              <h2>What's New</h2>
              <Card className="changelog-card">
                <pre className="changelog-text">{latest.changelog}</pre>
              </Card>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Version History */}
      <section className="version-history">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <h2 className="section-title">Version History</h2>
          </ScrollReveal>

          <div className="versions-list">
            {versions.map((version, index) => (
              <ScrollReveal 
                key={version.id} 
                animation="fade-left" 
                delay={index * 0.1}
              >
                <Card hoverable className="version-card">
                  <div className="version-card-header">
                    <div>
                      <h3>Version {version.version_number}</h3>
                      <p className="version-card-name">{version.version_name}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => handleDownload(version.id)}
                    >
                      <FiDownload /> Download
                    </Button>
                  </div>

                  <div className="version-card-meta">
                    <span><FiCalendar /> {new Date(version.release_date).toLocaleDateString()}</span>
                    {version.stats && (
                      <div className="version-rating">
                        <StarRating value={Math.round(version.stats.avgRating)} size={18} />
                        <span>({version.stats.ratingCount})</span>
                      </div>
                    )}
                  </div>

                  {version.changelog && (
                    <details className="version-changelog">
                      <summary>View Changelog</summary>
                      <pre>{version.changelog}</pre>
                    </details>
                  )}
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Download;
