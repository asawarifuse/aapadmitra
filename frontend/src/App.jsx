import React from 'react';
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

const MENU_ITEMS = [
  { path: '/',         icon: '🏠', label: 'Drishti' },
  { path: '/sanket',   icon: '📊', label: 'Sanket' },
  { path: '/marg',     icon: '🗺️', label: 'Marg' },
  { path: '/sahay',    icon: '🚁', label: 'Sahay' },
  { path: '/rahat',    icon: '📦', label: 'Rahat' },
  { path: '/smriti',   icon: '📚', label: 'Smriti' },
  { path: '/setucore', icon: '⚙️', label: 'SetuCore' },
  { path: '/chetna',   icon: '📝', label: 'Chetna' },
  { path: '/sahayak',  icon: '👥', label: 'Sahayak' },
  { path: '/awaaz',    icon: '📢', label: 'Awaaz' },
  { path: '/punarvas', icon: '🏗️', label: 'Punarvas' },
  { path: '/disha',    icon: '🎯', label: 'Disha' },
];

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="app-sidebar">
      <Link to="/" className="sidebar-brand">
        <span className="sidebar-brand-icon">🌊</span>
        <span className="sidebar-brand-text">Aapadmitra</span>
      </Link>

      <nav className="sidebar-nav">
        {MENU_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span className="sidebar-link-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <span>Synthetic TRL-4</span>
      </div>
    </aside>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Home — Drishti without sidebar */}
        <Route
          path="/"
          element={
            <div className="app-shell-no-sidebar">
              <main className="main-content-full">
                <Drishti />
              </main>
            </div>
          }
        />

        {/* All other modules — WITH sidebar */}
        <Route
          path="/*"
          element={
            <div className="app-shell">
              <Sidebar />
              <main className="main-content">
                <Routes>
                  <Route path="/drishti" element={<Drishti />} />
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
          }
        />
      </Routes>
    </Router>
  );
}

export default App;