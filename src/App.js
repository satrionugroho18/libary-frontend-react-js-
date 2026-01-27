import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage'; 

import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/admin" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Halaman utama cukup Dashboard saja */}
        {/* Profil sudah ditangani di dalam DashboardPage via state activeTab */}
        <Route path="/dashboard/*" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;