import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route untuk Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Jika akses ke root (/), arahkan otomatis ke login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Nanti kita tambah route Dashboard di sini */}
        <Route path="/dashboard" element={<div className="p-10 text-center"><h1>Dashboard (Coming Soon)</h1></div>} />
      </Routes>
    </Router>
  );
}

export default App;