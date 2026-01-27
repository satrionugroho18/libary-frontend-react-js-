import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage'; // Di sini lokasi Sidebar kamu kan?

import './index.css';

function App() {
  return (
    <Router>
      <Routes>
  <Route path="/" element={<Navigate to="/login" />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/login/admin" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  
  {/* Pintu utama hanya ini */}
  <Route path="/dashboard/*" element={<DashboardPage />} />
</Routes>
    </Router>
  );
}

export default App;