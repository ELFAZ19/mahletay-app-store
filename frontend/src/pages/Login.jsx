/**
 * Login Page
 * User authentication
 */

import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import ScrollReveal from '../components/animations/ScrollReveal';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    const result = await login(data.email, data.password);

    if (result.success) {
      // Redirect to previous page or home
      const from = location.state?.from || '/';
      navigate(from, { replace: true });
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container container-sm">
        <ScrollReveal animation="fade-up">
          <Card className="auth-card card-sacred">
            <div className="auth-header">
              <h1>Welcome Back</h1>
              <p>Login to your account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
                {errors.email && <span className="error">{errors.email.message}</span>}
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    {...register('password', {
                      required: 'Password is required'
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
                {errors.password && <span className="error">{errors.password.message}</span>}
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="large"
                className="btn-full"
                magnetic
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <div className="auth-footer">
              <p>
                Don't have an account?{' '}
                <Link to="/register" state={{ from: location.state?.from }}>
                  Register here
                </Link>
              </p>
            </div>
          </Card>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default Login;
