import React from 'react';
import { FaBook, FaBox, FaChartLine, FaCheckCircle } from 'react-icons/fa';

const AdminHome = ({ books }) => {
    const totalBuku = books.length;
    const totalStok = books.reduce((acc, curr) => acc + parseInt(curr.stok || 0), 0);

    return (
        <div className="p-4 space-y-8 animate-in fade-in duration-500">
            {/* Banner Admin */}
            <div className="bg-indigo-950 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10">
                    <span className="bg-indigo-500 px-4 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-4 inline-block">
                        Admin Central Panel
                    </span>
                    <h1 className="text-5xl font-black mb-2 italic tracking-tighter uppercase leading-none">
                        Control <br /> Dashboard
                    </h1>
                    <p className="text-indigo-300 font-bold tracking-widest uppercase text-[10px] opacity-80">
                        Pantau dan kelola semua aset perpustakaan di sini.
                    </p>
                </div>
                <div className="absolute -right-10 -bottom-10 text-[18rem] opacity-5 rotate-12">
                    <FaChartLine />
                </div>
            </div>

            {/* Statistik Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm group">
                    <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                        <FaBook className="text-blue-500 text-2xl" />
                    </div>
                    <h4 className="font-black text-gray-400 uppercase text-[10px] tracking-widest mb-1">Total Judul</h4>
                    <p className="text-4xl font-black text-gray-800">{totalBuku} Buku</p>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm group">
                    <div className="bg-green-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                        <FaBox className="text-green-500 text-2xl" />
                    </div>
                    <h4 className="font-black text-gray-400 uppercase text-[10px] tracking-widest mb-1">Total Stok Fisik</h4>
                    <p className="text-4xl font-black text-gray-800">{totalStok} Unit</p>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm group">
                    <div className="bg-amber-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                        <FaCheckCircle className="text-amber-500 text-2xl" />
                    </div>
                    <h4 className="font-black text-gray-400 uppercase text-[10px] tracking-widest mb-1">Status Server</h4>
                    <p className="text-4xl font-black text-green-500 italic uppercase">Healthy</p>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;