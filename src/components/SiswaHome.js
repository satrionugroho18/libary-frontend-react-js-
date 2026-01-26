import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { FaBookReader, FaClock, FaCheckCircle, FaArrowRight, FaBook } from 'react-icons/fa';

const SiswaHome = ({ user, setMenu }) => {
    const [stats, setStats] = useState({ dipinjam: 0, selesai: 0 });
    const [recentBooks, setRecentBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [resPinjam, resSelesai] = await Promise.all([
                    api.get('/my-peminjaman'),
                    api.get('/riwayat-selesai')
                ]);
                
                setStats({
                    dipinjam: resPinjam.data.length,
                    selesai: resSelesai.data.length
                });
                
                // Ambil 3 buku terbaru yang sedang dipinjam
                setRecentBooks(resPinjam.data.slice(0, 3));
            } catch (err) {
                console.error("Gagal memuat statistik", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="p-4 space-y-8 animate-in fade-in duration-500">
            {/* Banner Utama */}
            <div className="bg-indigo-600 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
                <div className="relative z-10">
                    <span className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-4 inline-block">
                        E-Library Dashboard
                    </span>
                    <h1 className="text-5xl font-black mb-2 italic tracking-tighter uppercase leading-none">
                        Halo, <br /> {user?.name?.split(' ')[0] || 'Siswa'}!
                    </h1>
                    <p className="text-indigo-100 font-bold tracking-widest uppercase text-[10px] opacity-80">
                        Siap untuk menambah wawasan hari ini?
                    </p>
                </div>
                <div className="absolute -right-10 -bottom-10 text-[18rem] opacity-10 rotate-12">
                    <FaBookReader />
                </div>
            </div>

            {/* Statistik Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-xl transition-all group">
                    <div className="bg-amber-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <FaClock className="text-amber-500 text-2xl" />
                    </div>
                    <h4 className="font-black text-gray-400 uppercase text-[10px] tracking-widest mb-1">Sedang Dipinjam</h4>
                    <p className="text-4xl font-black text-indigo-950">{loading ? '...' : `${stats.dipinjam} Buku`}</p>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-xl transition-all group">
                    <div className="bg-green-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <FaCheckCircle className="text-green-500 text-2xl" />
                    </div>
                    <h4 className="font-black text-gray-400 uppercase text-[10px] tracking-widest mb-1">Total Selesai</h4>
                    <p className="text-4xl font-black text-indigo-950">{loading ? '...' : `${stats.selesai} Buku`}</p>
                </div>

                {/* Quick Action Card */}
                <button 
                    onClick={() => setMenu('peminjaman')}
                    className="bg-indigo-950 p-8 rounded-[2.5rem] text-white shadow-lg shadow-indigo-100 hover:bg-indigo-900 transition-all group text-left relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <h4 className="font-black text-indigo-300 uppercase text-[10px] tracking-widest mb-4">Eksplorasi</h4>
                        <p className="text-2xl font-black leading-tight italic mb-4">CARI BUKU <br /> LAINNYA</p>
                        <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                    </div>
                    <FaBook className="absolute -right-4 -bottom-4 text-7xl opacity-10 -rotate-12" />
                </button>
            </div>

            {/* Buku Terakhir Dipinjam */}
            <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                    <h3 className="font-black text-gray-800 uppercase tracking-widest text-xs flex items-center gap-2">
                        <span className="w-8 h-[2px] bg-indigo-600"></span> Sedang Kamu Baca
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {!loading && recentBooks.length > 0 ? (
                        recentBooks.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-[2rem] border border-gray-50 flex items-center gap-4 shadow-sm">
                                <div className="w-16 h-20 bg-indigo-50 rounded-xl overflow-hidden flex-shrink-0">
                                    {item.book?.cover_image ? (
                                        <img src={`http://localhost:8000/storage/${item.book.cover_image}`} className="w-full h-full object-cover" alt="book" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-indigo-200"><FaBook /></div>
                                    )}
                                </div>
                                <div className="overflow-hidden">
                                    <h5 className="font-black text-gray-800 text-sm truncate uppercase tracking-tighter">{item.book?.judul}</h5>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase truncate">{item.book?.penulis}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 py-10 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100">
                            <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]">Belum ada buku yang dipinjam</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SiswaHome;