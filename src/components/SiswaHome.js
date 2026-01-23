import React from 'react';
import { FaBookReader, FaClock, FaCheckCircle } from 'react-icons/fa';

const SiswaHome = ({ user }) => {
    return (
        <div className="p-4 space-y-8">
            <div className="bg-indigo-600 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
                <div className="relative z-10">
                    <h1 className="text-4xl font-black mb-2 italic tracking-tighter uppercase">Halo, {user?.name || 'Siswa'}!</h1>
                    <p className="text-indigo-100 font-bold tracking-widest uppercase text-xs">Selamat datang kembali di LibPro Digital Library.</p>
                </div>
                {/* Dekorasi background */}
                <div className="absolute -right-10 -bottom-10 text-[15rem] opacity-10 rotate-12">
                    <FaBookReader />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <FaClock className="text-yellow-500 text-3xl mb-4" />
                    <h4 className="font-black text-gray-800 uppercase text-xs tracking-widest">Sedang Dipinjam</h4>
                    <p className="text-3xl font-black text-indigo-950">2 Buku</p>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <FaCheckCircle className="text-green-500 text-3xl mb-4" />
                    <h4 className="font-black text-gray-800 uppercase text-xs tracking-widest">Sudah Dikembalikan</h4>
                    <p className="text-3xl font-black text-indigo-950">12 Buku</p>
                </div>
            </div>
        </div>
    );
};

export default SiswaHome;