/**
 * Header Component
 * Main navigation with theme toggle and user menu
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiSun, FiMoon, FiMenu, FiX, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const userMenuRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className={`header ${isScrolled ? 'is-scrolled' : 'is-transparent'}`}>
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <span className="logo-cross">✝</span>
            <span className="logo-text">ማኅሌታይ ለኦርቶዶክሳዊያን!</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-desktop">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              Home
            </Link>
            <Link to="/download" className={`nav-link ${isActive('/download') ? 'active' : ''}`}>
              Download
            </Link>
            <Link to="/reviews" className={`nav-link ${isActive('/reviews') ? 'active' : ''}`}>
              Reviews
            </Link>
            <Link to="/feedback" className={`nav-link ${isActive('/feedback') ? 'active' : ''}`}>
              Feedback
            </Link>
            <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
              About
            </Link>
            {isAuthenticated && user?.role !== 'user' && (
              <Link to="/admin" className={`nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}>
                Admin
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="header-actions">
            <button 
              onClick={toggleTheme} 
              className="theme-toggle"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {isAuthenticated ? (
              <div className="user-menu-wrapper" ref={userMenuRef}>
                <button 
                  className="user-menu-trigger"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-label="User menu"
                >
                  <div className="user-avatar">
                    {user?.username ? user.username.charAt(0).toUpperCase() : <FiUser />}
                  </div>
                  <span className="user-name">{user?.username}</span>
                </button>

                {userMenuOpen && (
                  <div className="user-menu-dropdown">
                    <div className="user-menu-header">
                      <div className="user-avatar-large">
                        {user?.username ? user.username.charAt(0).toUpperCase() : <FiUser />}
                      </div>
                      <div className="user-info">
                        <div className="user-info-name">{user?.username}</div>
                        <div className="user-info-email">{user?.email}</div>
                      </div>
                    </div>
                    <div className="user-menu-divider"></div>
                    <div className="user-menu-items">
                      <Link to="/reviews" className="user-menu-item" onClick={() => setUserMenuOpen(false)}>
                        <FiUser size={16} />
                        <span>My Reviews</span>
                      </Link>
                      <Link to="/feedback" className="user-menu-item" onClick={() => setUserMenuOpen(false)}>
                        <FiSettings size={16} />
                        <span>My Feedback</span>
                      </Link>
                    </div>
                    <div className="user-menu-divider"></div>
                    <button className="user-menu-item logout-item" onClick={handleLogout}>
                      <FiLogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="login-btn">
                <FiUser size={18} />
                <span>Login</span>
              </Link>
            )}

            <button
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="nav-mobile fade-in-down">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/download" onClick={() => setMobileMenuOpen(false)}>Download</Link>
            <Link to="/reviews" onClick={() => setMobileMenuOpen(false)}>Reviews</Link>
            <Link to="/feedback" onClick={() => setMobileMenuOpen(false)}>Feedback</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
            {isAuthenticated && user?.role !== 'user' && (
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
            )}
            <div className="mobile-menu-divider"></div>
            {isAuthenticated ? (
              <>
                <div className="mobile-user-info">
                  <div className="user-avatar-mobile">
                    {user?.username ? user.username.charAt(0).toUpperCase() : <FiUser />}
                  </div>
                  <span>{user?.username}</span>
                </div>
                <button onClick={handleLogout} className="mobile-logout-btn">
                  <FiLogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="mobile-login-btn">
                <FiUser size={18} />
                <span>Login</span>
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
