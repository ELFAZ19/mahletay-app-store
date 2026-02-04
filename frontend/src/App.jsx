/**
 * Main App Component
 * Root component with routing
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/common/Header';
import Home from './pages/Home';
import './styles/index.css';
import './styles/animations.css';

// Placeholder components (to be fully implemented)
const Download = () => <div className="container" style={{padding: '100px 0', textAlign: 'center'}}><h1>Download Page</h1><p>Coming soon...</p></div>;
const Reviews = () => <div className="container" style={{padding: '100px 0', textAlign: 'center'}}><h1>Reviews Page</h1><p>Coming soon...</p></div>;
const Feedback = () => <div className="container" style={{padding: '100px 0', textAlign: 'center'}}><h1>Feedback Page</h1><p>Coming soon...</p></div>;
const About = () => <div className="container" style={{padding: '100px 0', textAlign: 'center'}}><h1>About Page</h1><p>Coming soon...</p></div>;
const AdminDashboard = () => <div className="container" style={{padding: '100px 0', textAlign: 'center'}}><h1>Admin Dashboard</h1><p>Coming soon...</p></div>;
const AdminLogin = () => <div className="container" style={{padding: '100px 0', textAlign: 'center'}}><h1>Admin Login</h1><p>Coming soon...</p></div>;

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="app">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/download" element={<Download />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/about" element={<About />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/login" element={<AdminLogin />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
