/**
 * Feedback Page
 * User bug reports and suggestions
 * Requires authentication for submission
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import ScrollReveal from '../components/animations/ScrollReveal';
import FloatingElement from '../components/animations/FloatingElement';
import { 
  FiAlertCircle, FiZap, FiHeart, FiClock, FiEye, FiCheckCircle, 
  FiMessageSquare, FiEdit2, FiTrash2, FiCalendar 
} from 'react-icons/fi';
import './Feedback.css';

const Feedback = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [myFeedback, setMyFeedback] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyFeedback();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Auto-populate name and email for authenticated users
    if (isAuthenticated && user) {
      setValue('name', user.username || '');
      setValue('email', user.email || '');
    }
  }, [isAuthenticated, user, setValue]);

  const fetchMyFeedback = async () => {
    try {
      const response = await api.get('/feedback/my-feedback');
      setMyFeedback(response.data.data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  const onSubmit = async (data) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/feedback' } });
      return;
    }

    setSubmitting(true);
    try {
      if (editingFeedback) {
        await api.patch(`/feedback/my-feedback/${editingFeedback.id}`, data);
      } else {
        await api.post('/feedback', data);
      }
      
      setSubmitSuccess(true);
      reset();
      setEditingFeedback(null);
      
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowForm(true);
        fetchMyFeedback();
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert(error.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditFeedback = (feedback) => {
    setEditingFeedback(feedback);
    setValue('type', feedback.type);
    setValue('name', feedback.name);
    setValue('email', feedback.email);
    setValue('message', feedback.message);
    setShowForm(true);
  };

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return;
    }

    try {
      await api.delete(`/feedback/my-feedback/${id}`);
      fetchMyFeedback();
    } catch (error) {
      console.error('Error deleting feedback:', error);
      alert('Failed to delete feedback');
    }
  };

  const promptLogin = () => {
    navigate('/login', { state: { from: '/feedback' } });
  };

  return (
    <div className="feedback-page">
      <div className="container">
        {/* My Feedback Section */}
        {isAuthenticated && myFeedback.length > 0 && (
          <section className="my-feedback-section">
            <div className="container-md">
              <ScrollReveal animation="fade-down">
                <div className="section-header">
                  <h2>My Feedback History</h2>
                  <p className="section-subtitle">Track your submissions and admin responses</p>
                </div>
                <div className="feedback-grid">
                  {myFeedback.map((feedback, index) => (
                    <ScrollReveal key={feedback.id} animation="fade-up" delay={index * 0.1}>
                      <Card hoverable className="feedback-item-card">
                        <div className="feedback-card-header">
                          <div className="feedback-meta">
                            <span className={`feedback-type-badge ${feedback.type}`}>
                              <span className="badge-icon">
                                {feedback.type === 'bug' && <FiAlertCircle />}
                                {feedback.type === 'suggestion' && <FiZap />}
                                {feedback.type === 'blessing' && <FiHeart />}
                              </span>
                              <span className="badge-text">{feedback.type}</span>
                            </span>
                            <span className="feedback-date">
                              <FiCalendar className="date-icon" />
                              {new Date(feedback.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          <span className={`status-badge ${feedback.status}`}>
                            <span className="status-icon">
                              {feedback.status === 'pending' && <FiClock />}
                              {feedback.status === 'reviewed' && <FiEye />}
                              {feedback.status === 'resolved' && <FiCheckCircle />}
                            </span>
                            {feedback.status}
                          </span>
                        </div>

                        <div className="feedback-content">
                          <p className="feedback-message">{feedback.message}</p>
                        </div>

                        {feedback.admin_response && (
                          <div className="admin-response">
                            <div className="response-header">
                              <span className="response-icon"><FiMessageSquare /></span>
                              <strong>Admin Response</strong>
                            </div>
                            <p>{feedback.admin_response}</p>
                            <span className="response-date">
                              Responded on {new Date(feedback.responded_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        )}

                        <div className="feedback-actions">
                          <Button 
                            variant="outline" 
                            size="small" 
                            onClick={() => handleEditFeedback(feedback)}
                            className="action-btn"
                          >
                            <FiEdit2 className="btn-icon" /> Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="small" 
                            onClick={() => handleDeleteFeedback(feedback.id)}
                            className="action-btn delete-btn"
                          >
                            <FiTrash2 className="btn-icon" /> Delete
                          </Button>
                        </div>
                      </Card>
                    </ScrollReveal>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </section>
        )}

        <section className="feedback-layout">
          {/* Info Section */}
          <div className="feedback-info">
            <ScrollReveal animation="fade-right">
              <span className="sacred-label">Contact Us</span>
              <h1>We Value Your Voice</h1>
              <p>
                {!isAuthenticated ? (
                  <>
                    <strong>Please log in or create an account to submit feedback.</strong><br/>
                    Your feedback helps us improve the Orthodox Hymn Platform for the entire community.
                  </>
                ) : (
                  <>
                    Your feedback helps us improve the Orthodox Hymn Platform for the entire community. 
                    Whether you've found a bug, have a suggestion, or just want to send blessings, 
                    we're listening.
                  </>
                )}
              </p>

              {!isAuthenticated && (
                <div style={{ marginTop: 'var(--spacing-lg)' }}>
                  <Button onClick={promptLogin} size="large" magnetic>
                    Login to Submit Feedback
                  </Button>
                </div>
              )}

              <div className="contact-methods">
                <FloatingElement delay={0} distance={10}>
                  <Card className="contact-card">
                    <div className="icon">🐛</div>
                    <div>
                      <h3>Report Bugs</h3>
                      <p>Found something not working?</p>
                    </div>
                  </Card>
                </FloatingElement>

                <FloatingElement delay={0.2} distance={10}>
                  <Card className="contact-card">
                    <div className="icon">💡</div>
                    <div>
                      <h3>Suggestions</h3>
                      <p>Ideas to make the app better?</p>
                    </div>
                  </Card>
                </FloatingElement>

                <FloatingElement delay={0.4} distance={10}>
                  <Card className="contact-card">
                    <div className="icon">🙏</div>
                    <div>
                      <h3>Blessings</h3>
                      <p>Words of encouragement?</p>
                    </div>
                  </Card>
                </FloatingElement>
              </div>
            </ScrollReveal>
          </div>

          {/* Form Section */}
          {isAuthenticated && showForm && (
            <div className="feedback-form-container">
              <ScrollReveal animation="fade-left" delay={0.2}>
                <Card className="feedback-form-card card-sacred">
                  {submitSuccess ? (
                    <div className="success-message">
                      <div className="success-icon">✉️</div>
                      <h3>Message Received</h3>
                      <p>Thank you for reaching out. We appreciate your input and will review it carefully.</p>
                      <Button onClick={() => {
                        setSubmitSuccess(false);
                        setShowForm(true);
                      }} variant="outline">Send Another</Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="form-header">
                        <h2>{editingFeedback ? 'Edit Feedback' : 'Send Feedback'}</h2>
                        {editingFeedback && (
                          <Button variant="ghost" onClick={() => {
                            setEditingFeedback(null);
                            reset();
                          }}>Cancel</Button>
                        )}
                      </div>
                      
                      <div className="form-group">
                        <label>Feedback Type</label>
                        <select {...register('type', { required: true })}>
                          <option value="suggestion">💡 Suggestion</option>
                          <option value="bug">🐛 Bug Report</option>
                          <option value="blessing">🙏 Blessing / Comment</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Your Name</label>
                        <input 
                          type="text" 
                          placeholder="Enter your name"
                          {...register('name', { required: 'Name is required' })} 
                        />
                        {errors.name && <span className="error">{errors.name.message}</span>}
                      </div>

                      <div className="form-group">
                        <label>Email Address</label>
                        <input 
                          type="email" 
                          placeholder="name@example.com"
                          {...register('email', { 
                            required: 'Email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address"
                            }
                          })} 
                        />
                        {errors.email && <span className="error">{errors.email.message}</span>}
                      </div>

                      <div className="form-group">
                        <label>Message</label>
                        <textarea 
                          rows="6"
                          placeholder="How can we help or improve?"
                          {...register('message', { 
                            required: 'Message is required',
                            minLength: { value: 3, message: 'Minimum 3 characters' }
                          })} 
                        ></textarea>
                        {errors.message && <span className="error">{errors.message.message}</span>}
                      </div>

                      <Button 
                        type="submit" 
                        variant="primary" 
                        size="large" 
                        className="btn-full"
                        magnetic
                        disabled={submitting}
                      >
                        {submitting ? 'Sending...' : (editingFeedback ? 'Update Feedback' : 'Send Message')}
                      </Button>
                    </form>
                  )}
                </Card>
              </ScrollReveal>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Feedback;
