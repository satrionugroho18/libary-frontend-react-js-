import React from 'react';
import { FaBook, FaBox, FaExchangeAlt, FaUsers, FaArrowRight, FaChartBar, FaShieldAlt } from 'react-icons/fa';

const AdminHome = ({ books, transactions = [], users = [] }) => {
    const totalBuku = books.length;
    const totalStok = books.reduce((acc, curr) => acc + parseInt(curr.stok || 0), 0);
    const pinjamAktif = transactions.filter(t => t.status === 'dipinjam').length;

    return (
        <div className="p-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* --- HEADER BANNER --- */}
            <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-black rounded-[3.5rem] p-10 text-white relative overflow-hidden shadow-2xl border border-white/5">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase backdrop-blur-md">
                                Core Command Center
                            </span>
                            <span className="flex items-center gap-1.5 text-green-400 text-[10px] font-black uppercase tracking-widest">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span> Live System
                            </span>
                        </div>
                        <h1 className="text-6xl font-black mb-3 italic tracking-tighter uppercase leading-none">
                            ADMIN <br /> <span className="text-indigo-500 text-5xl not-italic">CENTRAL</span>
                        </h1>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 w-full md:w-72">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4 text-center">System Integrity</p>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs font-bold uppercase">
                                <span className="text-slate-400">Database</span>
                                <span className="text-green-400">Synced</span>
                            </div>
                            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-indigo-500 h-full w-[95%]"></div>
                            </div>
                            <div className="flex justify-between items-center text-xs font-bold uppercase pt-1">
                                <span className="text-slate-400">Security</span>
                                <span className="text-indigo-400 font-black italic">Level 01</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Decorative Icon */}
                <div className="absolute -right-16 -bottom-16 text-[25rem] opacity-10 rotate-12 text-indigo-500 pointer-events-none">
                    <FaShieldAlt />
                </div>
            </div>

            {/* --- STATS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Koleksi Buku', val: totalBuku, sub: 'Judul Terdaftar', icon: <FaBook />, col: 'text-blue-500', bg: 'bg-blue-50' },
                    { label: 'Total Inventaris', val: totalStok, sub: 'Unit Fisik', icon: <FaBox />, col: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { label: 'Pinjaman Aktif', val: pinjamAktif, sub: 'Sedang Dibawa', icon: <FaExchangeAlt />, col: 'text-amber-500', bg: 'bg-amber-50' },
                    { label: 'Total Anggota', val: users.length || 0, sub: 'Siswa Terdaftar', icon: <FaUsers />, col: 'text-purple-500', bg: 'bg-purple-50' },
                ].map((item, idx) => (
                    <div key={idx} className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                        <div className={`${item.bg} ${item.col} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform`}>
                            {item.icon}
                        </div>
                        <h4 className="font-black text-slate-400 uppercase text-[10px] tracking-widest mb-1">{item.label}</h4>
                        <p className="text-4xl font-black text-slate-800 tracking-tighter">{item.val}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-2 italic">{item.sub}</p>
                    </div>
                ))}
            </div>

            {/* --- BOTTOM SECTION --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                                <FaChartBar />
                            </div>
                            <h3 className="font-black text-slate-800 uppercase italic tracking-tighter text-lg">System Insights</h3>
                        </div>
                        <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-2">
                            Detail Laporan <FaArrowRight />
                        </button>
                    </div>
                    
                    {/* Visual Bar Chart Simpel */}
                    <div className="space-y-6">
                        {books.slice(0, 3).map((book, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-xs font-black uppercase tracking-tight text-slate-600">
                                    <span>{book.judul}</span>
                                    <span className="text-indigo-600">Stok: {book.stok}</span>
                                </div>
                                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                    <div 
                                        className="bg-indigo-500 h-full rounded-full transition-all duration-1000" 
                                        style={{ width: `${(book.stok / 50) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Message */}
                <div className="bg-indigo-600 p-8 rounded-[3rem] text-white shadow-lg shadow-indigo-100 relative overflow-hidden group">
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <h3 className="font-black text-xl uppercase italic leading-tight">
                            Pastikan <br /> Inventaris <br /> Selalu Akurat.
                        </h3>
                        <p className="text-indigo-100 text-xs font-medium opacity-80 leading-relaxed mb-6 mt-4">
                            Lakukan pengecekan stok fisik secara berkala untuk menghindari selisih data pada sistem.
                        </p>
                        <button className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest group-hover:bg-slate-900 group-hover:text-white transition-all shadow-xl">
                            Cetak Laporan Bulanan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;