/**
 * Feedback Page
 * User bug reports and suggestions
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../config/api';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import ScrollReveal from '../components/animations/ScrollReveal';
import FloatingElement from '../components/animations/FloatingElement';
import './Feedback.css';

const Feedback = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await api.post('/feedback', data);
      setSubmitSuccess(true);
      reset();
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="feedback-page">
      <div className="container">
        <section className="feedback-layout">
          {/* Info Section */}
          <div className="feedback-info">
            <ScrollReveal animation="fade-right">
              <span className="scared-label">Contact Us</span>
              <h1>We Value Your Voice</h1>
              <p>
                Your feedback helps us improve the Orthodox Hymn Platform for the entire community. 
                Whether you've found a bug, have a suggestion, or just want to send blessings, 
                we're listening.
              </p>

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
                      <p>ideas to make the app better?</p>
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
          <div className="feedback-form-container">
            <ScrollReveal animation="fade-left" delay={0.2}>
              <Card className="feedback-form-card card-sacred">
                {submitSuccess ? (
                  <div className="success-message">
                    <div className="success-icon">✉️</div>
                    <h3>Message Received</h3>
                    <p>Thank you for reaching out. We appreciate your input and will review it meticulously.</p>
                    <Button onClick={() => setSubmitSuccess(false)} variant="outline">Send Another</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <h2>Send Feedback</h2>
                    
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
                          minLength: { value: 10, message: 'Minimum 10 characters' }
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
                      {submitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                )}
              </Card>
            </ScrollReveal>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Feedback;
