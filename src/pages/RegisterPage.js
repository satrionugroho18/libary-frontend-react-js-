import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { FaEnvelope, FaLock, FaIdCard, FaBookOpen } from 'react-icons/fa';
import Swal from 'sweetalert2';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/register', formData);
            Swal.fire({
                icon: 'success',
                title: 'Registrasi Berhasil!',
                text: 'Silahkan login dengan akun baru kamu.',
                showConfirmButton: false,
                timer: 2000
            });
            navigate('/login');
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err.response?.data?.message || 'Email sudah terdaftar atau server error.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f9fafb] p-6 relative overflow-hidden">
            
            {/* Background Decorative Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-20"></div>
            
            <div className="w-full max-w-[440px] z-10">
                {/* LOGO TENGAH ATAS (Sama dengan LoginPage) */}
                <div className="flex flex-col items-center mb-10">
                    <div className="bg-white p-5 rounded-[2rem] shadow-xl shadow-indigo-100/50 mb-4">
                        <FaBookOpen size={35} className="text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-[0.4em] uppercase">
                        E-Library
                    </h2>
                    <div className="h-1.5 w-10 bg-indigo-600 rounded-full mt-3"></div>
                </div>

                {/* AREA FORM REGISTER */}
                <div className="relative">
                    {/* Efek kartu bertumpuk di belakang */}
                    <div className="absolute inset-0 bg-indigo-600/5 transform -rotate-2 rounded-[3rem] -z-10"></div>
                    
                    <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 backdrop-blur-sm">
                        
                        {/* Header Text */}
                        <div className="mb-10 text-center relative">
                            <div className="flex justify-center mb-4">
                                <span className="w-8 h-[2px] bg-slate-100 rounded-full"></span>
                            </div>

                            <h3 className="text-3xl font-extrabold tracking-tight text-slate-800 mb-3">
                                Daftar <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">Akun</span>
                            </h3>
                            
                            <p className="text-slate-500 text-sm font-semibold leading-relaxed">
                                Bergabunglah untuk mulai meminjam buku favoritmu.
                            </p>
                        </div>

                        {/* Form Utama */}
                        <form onSubmit={handleRegister} className="space-y-4">
                            {/* Input Nama */}
                            <div className="relative flex items-center group">
                                <FaIdCard className="absolute left-5 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />
                                <input 
                                    required
                                    type="text" 
                                    placeholder="Nama Lengkap" 
                                    className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500/20 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none font-bold text-sm"
                                    onChange={e => setFormData({...formData, name: e.target.value})} 
                                />
                            </div>

                            {/* Input Email */}
                            <div className="relative flex items-center group">
                                <FaEnvelope className="absolute left-5 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />
                                <input 
                                    required
                                    type="email" 
                                    placeholder="Email Address" 
                                    className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500/20 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none font-bold text-sm"
                                    onChange={e => setFormData({...formData, email: e.target.value})} 
                                />
                            </div>

                            {/* Input Password */}
                            <div className="relative flex items-center group">
                                <FaLock className="absolute left-5 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />
                                <input 
                                    required
                                    type="password" 
                                    placeholder="Password" 
                                    className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500/20 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none font-bold text-sm"
                                    onChange={e => setFormData({...formData, password: e.target.value})} 
                                />
                            </div>

                            <button 
                                disabled={loading}
                                className={`w-full py-4 rounded-2xl font-black text-[11px] tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 mt-4 ${
                                    loading 
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                    : 'bg-indigo-600 hover:bg-slate-900 text-white shadow-indigo-100'
                                }`}
                            >
                                {loading ? 'MENDAFTARKAN...' : 'BUAT AKUN SISWA'}
                            </button>
                        </form>

                        {/* Link Kembali ke Login */}
                        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-4">
                                Sudah punya akun?
                            </p>
                            <Link to="/login" className="text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:text-slate-900 transition-colors">
                                Kembali ke Login
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer Minimalis */}
                <div className="mt-12 flex flex-col items-center gap-2">
                    <p className="text-slate-300 text-[10px] font-bold tracking-[0.3em] uppercase">
                        Smart Library System
                    </p>
                    <div className="flex gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-200"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-100"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-50"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;