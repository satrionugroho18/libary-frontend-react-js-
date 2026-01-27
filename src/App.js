import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman Awal: Langsung lempar ke login siswa kalau buka alamat utama */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Route Siswa */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Route Admin (Pintu Rahasia) */}
        <Route path="/login/admin" element={<LoginPage />} />
        
        {/* Route Dashboard Admin */}
        <Route path="/dashboard/*" element={<DashboardPage />} />

        {/* Route untuk Siswa Home (Bisa kamu buat nanti) */}
        <Route path="/siswa/home" element={<div className="p-10 text-center font-black uppercase"><h1>Selamat Datang Siswa!</h1></div>} />
      </Routes>
    </Router>
  );
}

export default App;