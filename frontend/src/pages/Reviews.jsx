/**
 * Reviews Page
 * Displays user reviews and submission form
 * Requires authentication for submission
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import ScrollReveal from '../components/animations/ScrollReveal';
import StarRating from '../components/common/StarRating';
import './Reviews.css';

const Reviews = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [editingReview, setEditingReview] = useState(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      rating: 0
    }
  });

  const currentRating = watch('rating', 0);

  useEffect(() => {
    fetchData();
  }, [isAuthenticated]);

  useEffect(() => {
    // Auto-populate reviewer name for authenticated users
    if (isAuthenticated && user?.username) {
      setValue('reviewer_name', user.username);
    }
  }, [isAuthenticated, user, setValue]);

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

      // Fetch user's reviews if authenticated
      if (isAuthenticated) {
        const myReviewsRes = await api.get('/reviews/my-reviews');
        setMyReviews(myReviewsRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    // Validate rating
    if (!data.rating || data.rating === 0) {
      setSubmitError('Please select a star rating');
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    
    try {
      if (editingReview) {
        // Update existing review
        await api.patch(`/reviews/my-reviews/${editingReview.id}`, data);
      } else {
        // Create new review
        await api.post('/reviews', data);
        
        // Also submit rating
        if (data.rating) {
          await api.post('/ratings', {
            version_id: data.version_id,
            rating: data.rating
          });
        }
      }

      setSubmitSuccess(true);
      reset();
      setValue('rating', 0);
      setEditingReview(null);
      
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowForm(false);
        fetchData(); // Refresh reviews
      }, 2000);
    } catch (error) {
      console.error('Error submitting review:', error);
      setSubmitError(
        error.response?.data?.message || 
        'Failed to submit review. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setValue('version_id', review.version_id);
    setValue('reviewer_name', review.reviewer_name);
    setValue('review_text', review.review_text);
    setShowForm(true);
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await api.delete(`/reviews/my-reviews/${id}`);
      fetchData(); // Refresh reviews
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    }
  };

  const promptLogin = () => {
    navigate('/login', { state: { from: '/reviews' } });
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
                  onClick={() => {
                    if (isAuthenticated) {
                      setShowForm(true);
                      setEditingReview(null);
                    } else {
                      promptLogin();
                    }
                  }}
                  className="write-review-btn"
                >
                  Write a Review
                </Button>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* My Reviews Section */}
      {isAuthenticated && myReviews.length > 0 && !showForm && (
        <section className="my-reviews-section">
          <div className="container">
            <h2>My Reviews</h2>
            <div className="reviews-grid">
              {myReviews.map((review) => (
                <Card key={review.id} hoverable className="review-card my-review-card">
                  <div className="review-header">
                    <div>
                      <h3>{review.reviewer_name}</h3>
                      <span className="review-date">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                      {!review.is_approved && (
                        <span className="pending-badge">Pending Approval</span>
                      )}
                    </div>
                    <div className="review-actions">
                      <Button variant="ghost" size="small" onClick={() => handleEditReview(review)}>
                        Edit
                      </Button>
                      <Button variant="ghost" size="small" onClick={() => handleDeleteReview(review.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                  <p className="review-text">{review.review_text}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

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
                    <p>Your review has been {editingReview ? 'updated' : 'submitted'} successfully.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-header">
                      <h2>{editingReview ? 'Edit Review' : 'Share Your Experience'}</h2>
                      <Button variant="ghost" onClick={() => {
                        setShowForm(false);
                        setEditingReview(null);
                        reset();
                      }}>Cancel</Button>
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
                      <label>Rating *</label>
                      <div className="rating-input">
                        <StarRating 
                          value={currentRating}
                          interactive 
                          size={32} 
                          onChange={(val) => setValue('rating', val)} 
                        />
                        {currentRating > 0 && (
                          <span className="rating-text">{currentRating} out of 5 stars</span>
                        )}
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Review</label>
                      <textarea 
                        rows="5"
                        placeholder="Share your thoughts about the app..."
                        {...register('review_text', { 
                          required: 'Review text is required',
                          minLength: { value: 3, message: 'Minimum 3 characters' }
                        })} 
                      ></textarea>
                      {errors.review_text && <span className="error">{errors.review_text.message}</span>}
                    </div>

                    {submitError && (
                      <div className="error-message">
                        {submitError}
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      variant="primary" 
                      size="large" 
                      className="btn-full"
                      disabled={submitting}
                    >
                      {submitting ? (editingReview ? 'Updating...' : 'Submitting...') : (editingReview ? 'Update Review' : 'Submit Review')}
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
          <h2>All Reviews</h2>
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
