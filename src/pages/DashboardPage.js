import React, { useEffect, useState } from 'react';
import api from '../services/api';
import AdminDashboard from '../components/AdminDashboard';
import SiswaDashboard from '../components/SiswaDashboard';
import RiwayatPinjam from '../components/RiwayatPinjam';

// Perbaikan Import: FaThLarge menggantikan FaLayout
import { FaThLarge, FaBook, FaClipboardList, FaSignOutAlt, FaSearch } from "react-icons/fa";

const DashboardPage = () => {
    const role = localStorage.getItem('role');
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');

    const fetchBooks = async () => {
        try {
            const res = await api.get('/books');
            setBooks(res.data);
        } catch (err) {
            console.error("Gagal ambil data", err);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const filteredBooks = books.filter(book => 
        book.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.penulis.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* --- SIDEBAR --- */}
            <div className="w-72 bg-indigo-950 text-white hidden md:flex flex-col shadow-2xl">
                <div className="p-8 text-3xl font-black border-b border-indigo-900/50 text-center tracking-tighter uppercase">
                    Lib<span className="text-yellow-400">Pro</span>
                </div>
                
                <nav className="p-6 flex-1">
                    <ul className="space-y-3">
                        {/* Tab Dashboard - Menggunakan FaThLarge */}
                        <li 
                            onClick={() => setActiveTab('dashboard')}
                            className={`p-4 rounded-2xl font-bold cursor-pointer flex items-center gap-4 transition-all duration-300 ${
                                activeTab === 'dashboard' 
                                ? 'bg-indigo-600 shadow-lg shadow-indigo-500/30 text-white scale-105' 
                                : 'text-indigo-300 hover:bg-indigo-900/50 hover:pl-6'
                            }`}
                        >
                            <FaThLarge className="text-xl" />
                            <span>Dashboard</span>
                        </li>

                        {/* Tab Koleksi */}
                        <li 
                            onClick={() => setActiveTab('koleksi')}
                            className={`p-4 rounded-2xl font-bold cursor-pointer flex items-center gap-4 transition-all duration-300 ${
                                activeTab === 'koleksi' 
                                ? 'bg-indigo-600 shadow-lg shadow-indigo-500/30 text-white scale-105' 
                                : 'text-indigo-300 hover:bg-indigo-900/50 hover:pl-6'
                            }`}
                        >
                            <FaBook className="text-xl" />
                            <span>Katalog Buku</span>
                        </li>

                        {/* Tab Riwayat */}
                        <li 
                            onClick={() => setActiveTab('riwayat')}
                            className={`p-4 rounded-2xl font-bold cursor-pointer flex items-center gap-4 transition-all duration-300 ${
                                activeTab === 'riwayat' 
                                ? 'bg-indigo-600 shadow-lg shadow-indigo-500/30 text-white scale-105' 
                                : 'text-indigo-300 hover:bg-indigo-900/50 hover:pl-6'
                            }`}
                        >
                            <FaClipboardList className="text-xl" />
                            <span>Riwayat Pinjam</span>
                        </li>
                    </ul>
                </nav>

                {/* Footer Sidebar (Logout) */}
                <div className="p-6 border-t border-indigo-900/50">
                    <button 
                        onClick={handleLogout}
                        className="w-full p-4 rounded-2xl font-bold flex items-center gap-4 text-red-400 hover:bg-red-500/10 transition-all"
                    >
                        <FaSignOutAlt className="text-xl" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white/80 backdrop-blur-md shadow-sm p-6 px-10 flex justify-between items-center border-b z-20">
                    <div>
                        <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">
                            {activeTab === 'dashboard' ? 'Overview' : activeTab === 'koleksi' ? 'Katalog Perpustakaan' : 'Daftar Pinjaman'}
                        </h2>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
                            Akses: <span className="text-indigo-600">{role}</span>
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col text-right hidden sm:block">
                            <span className="text-sm font-black text-gray-700 leading-none capitalize">{role} Account</span>
                            <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Online</span>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center font-black text-white shadow-lg">
                            {role?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-10 bg-[#F8FAFC]">
                    
                    {/* DASHBOARD TAB */}
                    {activeTab === 'dashboard' && (
                        <div className="space-y-10">
                            <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 p-12 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                                <div className="relative z-10">
                                    <h1 className="text-5xl font-black mb-4 tracking-tighter">Halo, {role}! 👋</h1>
                                    <p className="text-indigo-100 text-xl max-w-xl leading-relaxed font-medium">
                                        Senang melihatmu kembali. Jelajahi koleksi buku terbaru atau cek status pinjamanmu di sini.
                                    </p>
                                </div>
                                <div className="absolute -right-20 -bottom-20 text-[20rem] opacity-10 font-black italic tracking-tighter select-none">LIB</div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-2xl mb-6">
                                        <FaBook />
                                    </div>
                                    <h3 className="text-gray-400 font-black text-xs uppercase mb-2 tracking-widest">Total Koleksi</h3>
                                    <p className="text-4xl font-black text-gray-800">{books.length} <span className="text-lg text-gray-300 font-bold italic">Buku</span></p>
                                </div>
                                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center text-2xl mb-6">
                                        <FaClipboardList />
                                    </div>
                                    <h3 className="text-gray-400 font-black text-xs uppercase mb-2 tracking-widest">Status Akun</h3>
                                    <p className="text-3xl font-black text-green-500 uppercase tracking-tighter italic">Verified</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* KOLEKSI TAB */}
                    {activeTab === 'koleksi' && (
                        <div className="space-y-8">
                            <div className="max-w-md relative group">
                                <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                                <input 
                                    type="text"
                                    placeholder="Cari judul atau penulis buku..."
                                    className="w-full pl-14 pr-6 py-4 bg-white border-2 border-transparent rounded-2xl shadow-sm focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-gray-700"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {role === 'admin' ? (
                                <AdminDashboard books={filteredBooks} refresh={fetchBooks} />
                            ) : (
                                <SiswaDashboard books={filteredBooks} refresh={fetchBooks} />
                            )}
                        </div>
                    )}

                    {/* RIWAYAT TAB */}
                    {activeTab === 'riwayat' && (
                        <RiwayatPinjam />
                    )}
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;