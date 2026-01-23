import React, { useEffect, useState } from 'react';
import api from '../services/api';
import AdminDashboard from '../components/AdminDashboard';
import SiswaHome from '../components/SiswaHome';
import SiswaPeminjaman from '../components/SiswaPeminjaman';
import SiswaPengembalian from '../components/SiswaPengembalian';

// Icon Imports
import { 
    FaThLarge, FaBook, FaClipboardList, FaSignOutAlt, 
    FaSearch, FaExchangeAlt, FaUsers, FaBookOpen 
} from "react-icons/fa";

const DashboardPage = () => {
    const role = localStorage.getItem('role'); // 'admin' atau 'siswa'
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

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    const renderMainContent = () => {
        // Logika tampilan untuk ADMIN
        if (role === 'admin') {
            switch (activeTab) {
                case 'dashboard': return <SiswaHome role={role} totalBooks={books.length} />;
                case 'kelola_buku': return <AdminDashboard books={books} refresh={fetchBooks} searchTerm={searchTerm} />;
                case 'transaksi': return <div className="p-10 font-bold">Halaman Transaksi (Coming Soon)</div>;
                case 'anggota': return <div className="p-10 font-bold">Halaman Kelola Anggota (Coming Soon)</div>;
                default: return <SiswaHome role={role} />;
            }
        } 
        
        // Logika tampilan untuk SISWA
        else {
            switch (activeTab) {
                case 'dashboard': return <SiswaHome role={role} totalBooks={books.length} />;
                case 'peminjaman': return <SiswaPeminjaman books={books} refresh={fetchBooks} searchTerm={searchTerm} />;
                case 'pengembalian': return <SiswaPengembalian refreshDashboard={fetchBooks} />;
                default: return <SiswaHome role={role} />;
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
            
            {/* --- SIDEBAR --- */}
            <div className="w-72 bg-indigo-950 text-white hidden md:flex flex-col shadow-2xl z-30">
                <div className="p-8 text-3xl font-black border-b border-indigo-900/50 text-center tracking-tighter uppercase">
                    LIB<span className="text-indigo-500">PRO</span>
                </div>
                
                <nav className="p-6 flex-1">
                    <ul className="space-y-3">
                        {/* Menu yang muncul di KEDUA role */}
                        <li onClick={() => setActiveTab('dashboard')} className={`p-4 rounded-2xl font-bold cursor-pointer flex items-center gap-4 transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-indigo-300 hover:bg-indigo-900/50'}`}>
                            <FaThLarge /> <span>Dashboard</span>
                        </li>

                        {/* --- MENU KHUSUS ADMIN --- */}
                        {role === 'admin' && (
                            <>
                                <li onClick={() => setActiveTab('kelola_buku')} className={`p-4 rounded-2xl font-bold cursor-pointer flex items-center gap-4 transition-all ${activeTab === 'kelola_buku' ? 'bg-indigo-600 text-white' : 'text-indigo-300 hover:bg-indigo-900/50'}`}>
                                    <FaBookOpen /> <span>Kelola Buku</span>
                                </li>
                                <li onClick={() => setActiveTab('transaksi')} className={`p-4 rounded-2xl font-bold cursor-pointer flex items-center gap-4 transition-all ${activeTab === 'transaksi' ? 'bg-indigo-600 text-white' : 'text-indigo-300 hover:bg-indigo-900/50'}`}>
                                    <FaExchangeAlt /> <span>Transaksi</span>
                                </li>
                                <li onClick={() => setActiveTab('anggota')} className={`p-4 rounded-2xl font-bold cursor-pointer flex items-center gap-4 transition-all ${activeTab === 'anggota' ? 'bg-indigo-600 text-white' : 'text-indigo-300 hover:bg-indigo-900/50'}`}>
                                    <FaUsers /> <span>Kelola Anggota</span>
                                </li>
                            </>
                        )}

                        {/* --- MENU KHUSUS SISWA --- */}
                        {role === 'siswa' && (
                            <>
                                <li onClick={() => setActiveTab('peminjaman')} className={`p-4 rounded-2xl font-bold cursor-pointer flex items-center gap-4 transition-all ${activeTab === 'peminjaman' ? 'bg-indigo-600 text-white' : 'text-indigo-300 hover:bg-indigo-900/50'}`}>
                                    <FaBook /> <span>Peminjaman Buku</span>
                                </li>
                                <li onClick={() => setActiveTab('pengembalian')} className={`p-4 rounded-2xl font-bold cursor-pointer flex items-center gap-4 transition-all ${activeTab === 'pengembalian' ? 'bg-indigo-600 text-white' : 'text-indigo-300 hover:bg-indigo-900/50'}`}>
                                    <FaClipboardList /> <span>Pengembalian Buku</span>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>

                <div className="p-6 border-t border-indigo-900/50">
                    <button onClick={handleLogout} className="w-full p-4 rounded-2xl font-bold flex items-center gap-4 text-red-400 hover:bg-red-500/10 transition-all uppercase text-xs">
                        <FaSignOutAlt className="text-xl" /> <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white/80 backdrop-blur-md shadow-sm p-6 px-10 flex justify-between items-center border-b">
                    <h2 className="text-2xl font-black text-gray-800 uppercase italic">
                        {activeTab.replace('_', ' ')}
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-black text-gray-700 leading-none">{role} Account</p>
                            <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Online</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-white shadow-lg uppercase">
                            {role?.charAt(0)}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-10">
                    {renderMainContent()}
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;