import React, { useEffect, useState } from 'react';
import api from '../services/api';
import AdminDashboard from '../components/AdminDashboard';
import SiswaDashboard from '../components/SiswaDashboard';
import RiwayatPinjam from '../components/RiwayatPinjam';

const DashboardPage = () => {
    const role = localStorage.getItem('role');
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard'); // Mengatur konten yang tampil

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
        <div className="min-h-screen bg-gray-50 flex">
            {/* --- SIDEBAR --- */}
            <div className="w-64 bg-indigo-900 text-white hidden md:block shadow-xl">
                <div className="p-6 text-2xl font-bold border-b border-indigo-800 text-center tracking-widest">
                    LIB<span className="text-yellow-400">PRO</span>
                </div>
                <nav className="p-4 mt-4">
                    <ul className="space-y-2">
                        <li 
                            onClick={() => setActiveTab('dashboard')}
                            className={`p-4 rounded-2xl font-bold cursor-pointer transition-all ${activeTab === 'dashboard' ? 'bg-indigo-700 shadow-lg text-white' : 'text-indigo-300 hover:bg-indigo-800'}`}
                        >
                            📊 Dashboard
                        </li>
                        <li 
                            onClick={() => setActiveTab('koleksi')}
                            className={`p-4 rounded-2xl font-bold cursor-pointer transition-all ${activeTab === 'koleksi' ? 'bg-indigo-700 shadow-lg text-white' : 'text-indigo-300 hover:bg-indigo-800'}`}
                        >
                            📚 Koleksi Buku
                        </li>
                        <li 
                            onClick={() => setActiveTab('riwayat')}
                            className={`p-4 rounded-2xl font-bold cursor-pointer transition-all ${activeTab === 'riwayat' ? 'bg-indigo-700 shadow-lg text-white' : 'text-indigo-300 hover:bg-indigo-800'}`}
                        >
                            📋 Riwayat Pinjam
                        </li>
                    </ul>
                </nav>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm p-4 px-8 flex justify-between items-center border-b z-10">
                    <h2 className="text-xl font-black text-gray-700 uppercase tracking-tighter">
                        {activeTab === 'dashboard' ? 'Overview' : activeTab === 'koleksi' ? 'Katalog Buku' : 'Daftar Pinjaman'}
                    </h2>
                    <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-bold text-xs transition shadow-lg shadow-red-100">
                        LOGOUT
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-8">
                    
                    {/* TAB 1: DASHBOARD (Ringkasan) */}
                    {activeTab === 'dashboard' && (
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-10 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
                                <div className="relative z-10">
                                    <h1 className="text-4xl font-black mb-2">Selamat Datang, {role}!</h1>
                                    <p className="text-indigo-100 text-lg">Temukan ilmu baru melalui koleksi buku terbaik kami.</p>
                                </div>
                                <div className="absolute -right-10 -bottom-10 text-[12rem] opacity-10 font-black tracking-tighter italic">LIB</div>
                            </div>

                            {/* Info singkat */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                    <h3 className="text-gray-400 font-bold text-sm uppercase mb-2">Status Login</h3>
                                    <p className="text-2xl font-black text-green-500">Authorized as {role}</p>
                                </div>
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                    <h3 className="text-gray-400 font-bold text-sm uppercase mb-2">Total Buku</h3>
                                    <p className="text-2xl font-black text-gray-800">{books.length} Koleksi</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: KOLEKSI BUKU (Halaman Pinjam) */}
                    {activeTab === 'koleksi' && (
                        <div className="space-y-6">
                            {/* Search Bar di atas konten */}
                            <div className="max-w-md">
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">🔍</span>
                                    <input 
                                        type="text"
                                        placeholder="Cari judul atau penulis..."
                                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-transparent rounded-2xl shadow-sm focus:border-indigo-500 outline-none transition-all font-medium"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            {role === 'admin' ? (
                                <AdminDashboard books={filteredBooks} refresh={fetchBooks} />
                            ) : (
                                <SiswaDashboard books={filteredBooks} refresh={fetchBooks} />
                            )}
                        </div>
                    )}

                    {/* TAB 3: RIWAYAT PINJAM (Halaman Kembali) */}
                    {activeTab === 'riwayat' && (
                        <RiwayatPinjam />
                    )}
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;