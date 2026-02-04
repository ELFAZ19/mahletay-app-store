/**
 * Reviews Page
 * Displays user reviews and submission form
 */

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../config/api';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import ScrollReveal from '../components/animations/ScrollReveal';
import StarRating from '../components/common/StarRating';
import './Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewsRes, versionsRes] = await Promise.all([
          api.get('/reviews?approved=true&limit=20'),
          api.get('/versions?activeOnly=true')
        ]);
        setReviews(reviewsRes.data.data.reviews);
        setVersions(versionsRes.data.data.versions);
        
        // Set default version for form
        if (versionsRes.data.data.versions.length > 0) {
          setValue('version_id', versionsRes.data.data.versions[0].id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setValue]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await api.post('/reviews', data);
      
      // Also submit rating
      if (data.rating) {
        await api.post('/ratings', {
          version_id: data.version_id,
          rating: data.rating
        });
      }

      setSubmitSuccess(true);
      reset();
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowForm(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <Loading size="large" text="Loading reviews..." />
      </div>
    );
  }

  return (
    <div className="reviews-page">
      {/* Header Section */}
      <section className="reviews-hero">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <div className="text-center">
              <h1>Community Reviews</h1>
              <p className="subtitle">See what others are saying about the Orthodox Hymn App</p>
              
              {!showForm && (
                <Button 
                  size="large" 
                  magnetic 
                  onClick={() => setShowForm(true)}
                  className="write-review-btn"
                >
                  Write a Review
                </Button>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Review Form */}
      {showForm && (
        <section className="review-form-section">
          <div className="container container-md">
            <ScrollReveal animation="scale">
              <Card className="review-form-card card-sacred">
                {submitSuccess ? (
                  <div className="success-message">
                    <div className="success-icon">✨</div>
                    <h3>Thank You!</h3>
                    <p>Your review has been submitted efficiently pending moderation.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-header">
                      <h2>Share Your Experience</h2>
                      <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                    </div>

                    <div className="form-group">
                      <label>App Version</label>
                      <select {...register('version_id', { required: true })}>
                        {versions.map(v => (
                          <option key={v.id} value={v.id}>
                            Version {v.version_number} - {v.version_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Your Name</label>
                      <input 
                        type="text" 
                        placeholder="Enter your name"
                        {...register('reviewer_name', { required: 'Name is required' })} 
                      />
                      {errors.reviewer_name && <span className="error">{errors.reviewer_name.message}</span>}
                    </div>

                    <div className="form-group">
                      <label>Rating</label>
                      <div className="rating-input">
                        <StarRating 
                          interactive 
                          size={32} 
                          onChange={(val) => setValue('rating', val)} 
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Review</label>
                      <textarea 
                        rows="5"
                        placeholder="Share your thoughts about the app..."
                        {...register('review_text', { 
                          required: 'Review text is required',
                          minLength: { value: 10, message: 'Minimum 10 characters' }
                        })} 
                      ></textarea>
                      {errors.review_text && <span className="error">{errors.review_text.message}</span>}
                    </div>

                    <Button 
                      type="submit" 
                      variant="primary" 
                      size="large" 
                      className="btn-full"
                      disabled={submitting}
                    >
                      {submitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </form>
                )}
              </Card>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Reviews List */}
      <section className="reviews-list-section">
        <div className="container">
          <div className="reviews-grid">
            {reviews.length === 0 ? (
              <p className="no-reviews">No reviews yet. Be the first to share your thoughts!</p>
            ) : (
              reviews.map((review, index) => (
                <ScrollReveal 
                  key={review.id} 
                  animation="fade-up" 
                  delay={index * 0.05}
                >
                  <Card hoverable className={`review-card ${review.is_featured ? 'featured-review' : ''}`}>
                    {review.is_featured && <div className="featured-badge">Featured</div>}
                    <div className="review-header">
                      <div className="reviewer-avatar">
                        {review.reviewer_name.charAt(0)}
                      </div>
                      <div>
                        <h3>{review.reviewer_name}</h3>
                        <span className="review-date">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <p className="review-text">{review.review_text}</p>
                    
                    {review.admin_response && (
                      <div className="admin-response">
                        <strong>Response:</strong>
                        <p>{review.admin_response}</p>
                      </div>
                    )}
                  </Card>
                </ScrollReveal>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reviews;
