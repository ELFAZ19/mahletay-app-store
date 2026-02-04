/**
 * Header Component
 * Main navigation with theme toggle
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <span className="logo-cross">✝</span>
            <span className="logo-text">Orthodox Hymn</span>
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
            {isAuthenticated && (
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

            {isAuthenticated && (
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
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
            {isAuthenticated && (
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
