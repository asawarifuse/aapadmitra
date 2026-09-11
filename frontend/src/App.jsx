import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Drishti from './pages/Drishti';
import Sanket from './pages/Sanket';
import Marg from './pages/Marg';
import Sahay from './pages/Sahay';
import Rahat from './pages/Rahat';
import Smriti from './pages/Smriti';
import SetuCore from './pages/SetuCore';
import Chetna from './pages/Chetna';
import Sahayak from './pages/Sahayak';
import Awaaz from './pages/Awaaz';
import Punarvas from './pages/Punarvas';
import Disha from './pages/Disha';
import './App.css';

const menuItems = [
  { path: '/', label: 'Drishti', icon: '🏠' },
  { path: '/sanket', label: 'Sanket', icon: '📊' },
  { path: '/marg', label: 'Marg', icon: '🗺️' },
  { path: '/sahay', label: 'Sahay', icon: '🚁' },
  { path: '/rahat', label: 'Rahat', icon: '📦' },
  { path: '/smriti', label: 'Smriti', icon: '📚' },
  { path: '/setucore', label: 'SetuCore', icon: '⚙️' },
  { path: '/chetna', label: 'Chetna', icon: '📝' },
  { path: '/sahayak', label: 'Sahayak', icon: '👥' },
  { path: '/awaaz', label: 'Awaaz', icon: '📢' },
  { path: '/punarvas', label: 'Punarvas', icon: '🏗️' },
  { path: '/disha', label: 'Disha', icon: '🎯' },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Router>
      <div className="app-shell">
        <nav className="top-nav">
          <div className="nav-brand">
            <span className="brand-icon">🌊</span>
            <span className="brand-name">Aapadmitra</span>
            <span className="brand-badge">TRL-4</span>
          </div>
          
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>

          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            {menuItems.map(m => (
              <NavLink 
                key={m.path} 
                to={m.path} 
                label={m.label} 
                icon={m.icon}
                onClick={() => setMenuOpen(false)}
              />
            ))}
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Drishti />} />
            <Route path="/sanket" element={<Sanket />} />
            <Route path="/marg" element={<Marg />} />
            <Route path="/sahay" element={<Sahay />} />
            <Route path="/rahat" element={<Rahat />} />
            <Route path="/smriti" element={<Smriti />} />
            <Route path="/setucore" element={<SetuCore />} />
            <Route path="/chetna" element={<Chetna />} />
            <Route path="/sahayak" element={<Sahayak />} />
            <Route path="/awaaz" element={<Awaaz />} />
            <Route path="/punarvas" element={<Punarvas />} />
            <Route path="/disha" element={<Disha />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

const NavLink = ({ to, label, icon, onClick }) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`nav-link ${active ? 'active' : ''}`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

export default App;