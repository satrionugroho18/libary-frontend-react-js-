import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { FaEnvelope, FaLock, FaArrowRight, FaUserShield, FaUserGraduate } from 'react-icons/fa';
import Swal from 'sweetalert2'; // Menggunakan SweetAlert agar pesan error lebih cantik

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const isAdminPath = location.pathname === '/login/admin';

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/login', { email, password });
            
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.user.role);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            Swal.fire({
                icon: 'success',
                title: 'Berhasil Masuk!',
                text: `Selamat datang, ${res.data.user.name}`,
                showConfirmButton: false,
                timer: 1500
            });

            navigate('/dashboard'); 
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Login Gagal',
                text: err.response?.data?.message || 'Email atau password salah!',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            {/* Header Badge Role */}
            <div className="flex justify-center mb-6">
                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${
                    isAdminPath ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'
                }`}>
                    {isAdminPath ? <FaUserShield size={12}/> : <FaUserGraduate size={12}/>}
                    {isAdminPath ? 'Akses Administrator' : 'Login Siswa'}
                </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
                {/* Input Email */}
                <div className="group">
                    <div className="relative flex items-center">
                        <FaEnvelope className="absolute left-5 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />
                        <input 
                            required
                            type="email" 
                            placeholder="Email Address" 
                            className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500/20 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none font-bold text-sm"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                {/* Input Password */}
                <div className="group">
                    <div className="relative flex items-center">
                        <FaLock className="absolute left-5 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />
                        <input 
                            required
                            type="password" 
                            placeholder="Password" 
                            className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500/20 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none font-bold text-sm"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <button 
                    disabled={loading}
                    className={`w-full py-4 rounded-2xl font-black text-[11px] tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 ${
                        loading 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-slate-900 text-white shadow-indigo-200'
                    }`}
                >
                    {loading ? 'MEMPROSES...' : (
                        <>MASUK KE AKUN <FaArrowRight /></>
                    )}
                </button>
            </form>

            {/* Footer Section */}
            {!isAdminPath && (
                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-4">
                        Belum punya akses?
                    </p>
                    <Link to="/register" className="inline-flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:text-slate-900 transition-colors">
                        Buat Akun Sekarang <span className="text-lg">→</span>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default LoginForm;