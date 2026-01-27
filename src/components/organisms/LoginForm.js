import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../../services/api'; // Sesuaikan path-nya

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Deteksi apakah sedang di path /login/admin
    const isAdminPath = location.pathname === '/login/admin';

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/login', { email, password });
            localStorage.setItem('token', res.data.token);
            
            if (res.data.user.role === 'admin') {
                navigate('/dashboard');
            } else {
                navigate('/siswa/home');
            }
        } catch (err) {
            alert("Email atau password salah!");
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
                <input 
                    type="email" placeholder="Email Address" 
                    className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                    type="password" placeholder="Password" 
                    className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-black shadow-lg shadow-blue-200">
                    Sign In
                </button>
            </form>

            {/* Tombol Daftar hanya muncul jika BUKAN admin */}
            {!isAdminPath && (
                <div className="text-center pt-4 border-t">
                    <p className="text-xs text-gray-400 font-bold mb-2 uppercase">Baru di sini?</p>
                    <Link to="/register" className="inline-block px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-bold text-xs uppercase hover:bg-blue-600 hover:text-white transition-all">
                        Buat Akun Siswa
                    </Link>
                </div>
            )}
        </div>
    );
};

export default LoginForm;