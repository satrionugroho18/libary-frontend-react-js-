import React from 'react';
import LoginForm from '../components/organisms/LoginForm';
import { FaBookOpen } from 'react-icons/fa';

const LoginPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f9fafb] p-6 relative overflow-hidden">
            
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-20"></div>
            
            <div className="w-full max-w-[440px] z-10">
                {/* LOGO TETAP */}
                <div className="flex flex-col items-center mb-12">
                    <div className="bg-white p-5 rounded-[2rem] shadow-xl shadow-blue-100/50 mb-4">
                        <FaBookOpen size={35} className="text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-[0.4em] uppercase">
                        E-Library
                    </h2>
                    <div className="h-1.5 w-10 bg-blue-600 rounded-full mt-3"></div>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 bg-blue-600/5 transform rotate-2 rounded-[3rem] -z-10"></div>
                    
                    <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 backdrop-blur-sm">
                        
                        {/* BAGIAN TEXT YANG DIPERBAGUS */}
                        <div className="mb-10 text-center relative">
                            {/* Aksen garis halus di atas text */}
                            <div className="flex justify-center mb-4">
                                <span className="w-8 h-[2px] bg-slate-100 rounded-full"></span>
                            </div>

                            <h3 className="text-3xl font-extrabold tracking-tight text-slate-800 mb-3">
                                Selamat <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Datang</span>
                            </h3>
                            
                            <div className="flex flex-col items-center">
                                <p className="text-slate-500 text-sm font-semibold leading-relaxed max-w-[240px]">
                                    Silahkan masukkan akses akun kamu untuk menjelajahi koleksi.
                                </p>
                                {/* Aksen titik pemisah */}
                                <div className="flex gap-1 mt-4">
                                    <span className="w-1 h-1 rounded-full bg-blue-400"></span>
                                    <span className="w-3 h-1 rounded-full bg-blue-200"></span>
                                    <span className="w-1 h-1 rounded-full bg-blue-400"></span>
                                </div>
                            </div>
                        </div>

                        {/* Form Utama */}
                        <LoginForm />
                    </div>
                </div>

                {/* Footer Minimalis */}
                <div className="mt-12 flex flex-col items-center gap-2">
                    <p className="text-slate-300 text-[10px] font-bold tracking-[0.3em] uppercase">
                        Smart Library System
                    </p>
                    <div className="flex gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-200"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-100"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-50"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;