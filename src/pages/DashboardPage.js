import React, { useEffect, useState } from 'react';
import api from '../services/api';
import AdminDashboard from '../components/AdminDashboard';
import SiswaDashboard from '../components/SiswaDashboard';

const DashboardPage = () => {
    const role = localStorage.getItem('role');
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

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

    // Logika Filter
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
                        <li className="bg-indigo-700 p-3 rounded-xl font-bold shadow-md cursor-default">
                            📊 Dashboard
                        </li>
                    </ul>
                </nav>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="flex-1 flex flex-col">
                {/* --- HEADER --- */}
                <header className="bg-white shadow-sm p-4 px-8 flex justify-between items-center border-b">
                    <h2 className="text-xl font-bold text-gray-700">
                        Library<span className="text-indigo-600">Pro</span>
                    </h2>
                    <button 
                        onClick={handleLogout} 
                        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-bold shadow-md transition transform active:scale-95 text-sm"
                    >
                        LOGOUT
                    </button>
                </header>

                {/* --- MAIN AREA --- */}
                <main className="p-8">
                    {/* Judul Halaman */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
                            Selamat Datang, {role}
                        </h1>
                        <p className="text-gray-500 text-sm italic">Kelola dan temukan buku favoritmu di sini.</p>
                    </div>


                    {/* Konten Dashboard (Admin/Siswa) */}
                    {role === 'admin' ? (
                        <AdminDashboard books={filteredBooks} refresh={fetchBooks} />
                    ) : (
                        <SiswaDashboard books={filteredBooks} />
                    )}

                    {/* Notifikasi jika pencarian kosong */}
                    {filteredBooks.length === 0 && searchTerm !== "" && (
                        <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-200 mt-6">
                            <p className="text-gray-400 font-medium italic text-lg">
                                "Maaf, buku '{searchTerm}' tidak ditemukan..."
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;