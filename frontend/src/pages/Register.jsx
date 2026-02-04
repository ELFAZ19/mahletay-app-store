import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiEye, FiEyeOff, FiUser, FiMail, FiLock, FiCheck } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import ScrollReveal from '../components/animations/ScrollReveal';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    mode: 'onChange',
  });

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  // Password strength logic
  const getPasswordStrength = (pwd) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password || '');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    const result = await registerUser(data.username, data.email, data.password);

    if (result.success) {
      setRegistrationSuccess(true);
      setTimeout(() => {
        const from = location.state?.from || '/';
        navigate(from, { replace: true });
      }, 1500);
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="auth-page">
        <div className="container container-sm">
          <ScrollReveal animation="fade-up">
            <Card className="auth-card card-sacred success-card">
              <div className="success-animation">
                <FiCheck size={48} />
              </div>
              <div className="auth-header">
                <h1>Account Created!</h1>
                <p>Welcome to the Orthodox Hymn Platform community</p>
              </div>
              <div className="success-message">
                <p>Redirecting you to the platform...</p>
              </div>
            </Card>
          </ScrollReveal>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="container container-sm">
        <ScrollReveal animation="fade-up">
          <Card className="auth-card card-sacred">
            {/* Brand Header */}
            <div className="auth-header">
              <div className="brand-logo">
                <div className="logo-icon">
                  <span className="icon-hymn">✝</span>
                </div>
                <h1>Create Account</h1>
              </div>
              <p>Join our community of Orthodox hymn enthusiasts</p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="auth-form">
              {/* Username */}
              <div className="form-group">
                <label htmlFor="username">
                  <FiUser size={16} />
                  <span>Username</span>
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  className={errors.username ? 'error' : ''}
                  {...register('username', {
                    required: 'Username is required',
                    minLength: { value: 3, message: 'Must be at least 3 characters' },
                    maxLength: { value: 30, message: 'Must be less than 30 characters' },
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message: 'Only letters, numbers, and underscores'
                    }
                  })}
                />
                {errors.username && (
                  <div className="error-message">{errors.username.message}</div>
                )}
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email">
                  <FiMail size={16} />
                  <span>Email Address</span>
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className={errors.email ? 'error' : ''}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Enter a valid email'
                    }
                  })}
                />
                {errors.email && (
                  <div className="error-message">{errors.email.message}</div>
                )}
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password">
                  <FiLock size={16} />
                  <span>Password</span>
                </label>
                <div className="input-wrapper">
                  <div className="password-input-wrapper">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      className={errors.password ? 'error' : ''}
                      {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 6, message: 'At least 6 characters' }
                      })}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>

                  {/* Strength Indicator */}
                  {password && (
                    <div className="password-strength">
                      <div className="strength-bar">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`strength-segment ${
                              passwordStrength >= level ? 'active' : ''
                            }`}
                          />
                        ))}
                      </div>
                      <span className="strength-text">
                        {passwordStrength === 0 && 'Too weak'}
                        {passwordStrength === 1 && 'Weak'}
                        {passwordStrength === 2 && 'Fair'}
                        {passwordStrength === 3 && 'Good'}
                        {passwordStrength === 4 && 'Strong'}
                      </span>
                    </div>
                  )}

                  {/* Requirements */}
                  <div className="password-requirements">
                    <ul>
                      <li className={password?.length >= 6 ? 'valid' : ''}>At least 6 characters</li>
                      <li className={/[A-Z]/.test(password || '') ? 'valid' : ''}>One uppercase letter</li>
                      <li className={/[0-9]/.test(password || '') ? 'valid' : ''}>One number</li>
                      <li className={/[^A-Za-z0-9]/.test(password || '') ? 'valid' : ''}>One special character</li>
                    </ul>
                  </div>

                  {errors.password && (
                    <div className="error-message">{errors.password.message}</div>
                  )}
                </div>
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label htmlFor="confirmPassword">
                  <FiLock size={16} />
                  <span>Confirm Password</span>
                </label>
                <div className="input-wrapper">
                  <div className="password-input-wrapper">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter your password"
                      className={errors.confirmPassword ? 'error' : ''}
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (value) => value === password || 'Passwords do not match'
                      })}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <div className="error-message">{errors.confirmPassword.message}</div>
                  )}
                </div>
              </div>

              {/* Terms */}
              <div className="form-group terms-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    {...register('terms', {
                      required: 'You must accept the terms and conditions'
                    })}
                  />
                  <span className="checkmark"></span>
                  <span className="terms-text">
                    I agree to the{' '}
                    <Link to="/terms">Terms of Service</Link>{' '}
                    and{' '}
                    <Link to="/privacy">Privacy Policy</Link>
                  </span>
                </label>
                {errors.terms && (
                  <div className="error-message">{errors.terms.message}</div>
                )}
              </div>

              {/* Global Error */}
              {error && (
                <div className="error-message global-error">
                  <span className="error-icon">!</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="large"
                className="btn-full auth-submit-btn"
                magnetic
                disabled={loading}
                loading={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            {/* Divider */}
            <div className="divider">
              <span>Already have an account?</span>
            </div>

            {/* Login Link */}
            <div className="auth-footer">
              <Button
                variant="outline"
                size="large"
                className="btn-full"
                as="Link"
                to="/login"
                state={{ from: location.state?.from }}
              >
                Sign In to Your Account
              </Button>
            </div>

            {/* Info Text */}
            <div className="auth-info">
              <p className="info-text">
                By creating an account, you gain access to personalized hymn collections,
                community features, and more.
              </p>
            </div>
          </Card>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default Register;