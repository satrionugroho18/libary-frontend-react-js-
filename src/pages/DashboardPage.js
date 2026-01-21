import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';

const DashboardPage = () => {
    const role = localStorage.getItem('role');
    const [books, setBooks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newBook, setNewBook] = useState({ judul: '', penulis: '', stok: '' });
    const [loading, setLoading] = useState(false);

    // 1. Ambil Data Buku dari Laravel
    const fetchBooks = async () => {
        try {
            const res = await api.get('/books');
            setBooks(res.data);
        } catch (err) {
            console.error("Gagal mengambil data", err);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    // 2. Simpan Buku Baru
    const handleAddBook = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/books', newBook);
            await Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Buku baru telah ditambahkan.',
                timer: 1500,
                showConfirmButton: false
            });
            setShowModal(false);
            setNewBook({ judul: '', penulis: '', stok: '' });
            fetchBooks(); // Refresh tabel otomatis
        } catch (err) {
            Swal.fire('Error', 'Gagal menambah buku. Cek koneksi backend!', 'error');
        } finally {
            setLoading(false);
        }
    };

    // 3. Hapus Buku
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Apakah anda yakin?',
            text: "Data buku akan dihapus permanen!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus!'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/books/${id}`);
                Swal.fire('Deleted!', 'Buku telah dihapus.', 'success');
                fetchBooks();
            } catch (err) {
                Swal.fire('Error', 'Gagal menghapus buku.', 'error');
            }
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* --- SIDEBAR --- */}
            <div className="w-64 bg-indigo-900 text-white hidden md:block shadow-xl">
                <div className="p-6 text-2xl font-bold border-b border-indigo-800 tracking-wider text-center">
                    LIBRARY <span className="text-yellow-400">PRO</span>
                </div>
                <nav className="p-4 mt-4">
                    <ul className="space-y-2 text-gray-300">
                        <li className="bg-indigo-700 text-white p-3 rounded-xl font-semibold cursor-pointer shadow-md">
                            📊 Dashboard
                        </li>
                        <li className="p-3 hover:bg-indigo-800 hover:text-white rounded-xl transition cursor-pointer">
                            📚 Kelola Buku
                        </li>
                        <li className="p-3 hover:bg-indigo-800 hover:text-white rounded-xl transition cursor-pointer">
                            📋 Peminjaman
                        </li>
                    </ul>
                </nav>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="flex-1 flex flex-col">
                {/* Navbar */}
                <header className="bg-white shadow-sm p-4 px-8 flex justify-between items-center border-b">
                    <h2 className="text-xl font-bold text-gray-700 uppercase tracking-tight">Admin Control Panel</h2>
                    <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-gray-800">{role === 'admin' ? 'Administrator' : 'Student'}</p>
                            <p className="text-xs text-green-500 font-medium">● Online</p>
                        </div>
                        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md transition transform active:scale-95">
                            LOGOUT
                        </button>
                    </div>
                </header>

                <main className="p-8">
                    {/* Statistik Ringkas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-blue-500 hover:shadow-md transition">
                            <p className="text-xs text-gray-400 uppercase font-black tracking-widest">Total Koleksi</p>
                            <p className="text-4xl font-black text-gray-800">{books.length} <span className="text-sm font-normal text-gray-400">Buku</span></p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-green-500 hover:shadow-md transition">
                            <p className="text-xs text-gray-400 uppercase font-black tracking-widest">Stok Tersedia</p>
                            <p className="text-4xl font-black text-gray-800">{books.reduce((acc, curr) => acc + parseInt(curr.stok || 0), 0)}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-yellow-500 hover:shadow-md transition">
                            <p className="text-xs text-gray-400 uppercase font-black tracking-widest">Aktivitas</p>
                            <p className="text-4xl font-black text-gray-800">Live</p>
                        </div>
                    </div>

                    {/* Tabel Buku */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-xl font-bold text-gray-800">Daftar Buku Terbaru</h3>
                            <button 
                                onClick={() => setShowModal(true)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-200 transition transform active:scale-95"
                            >
                                + Tambah Buku
                            </button>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold tracking-widest">
                                    <tr>
                                        <th className="py-4 px-6">Judul Buku</th>
                                        <th className="py-4 px-6">Penulis</th>
                                        <th className="py-4 px-6">Stok</th>
                                        <th className="py-4 px-6 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {books.length > 0 ? (
                                        books.map((book) => (
                                            <tr key={book.id} className="hover:bg-indigo-50/30 transition">
                                                <td className="py-4 px-6 font-bold text-gray-800">{book.judul}</td>
                                                <td className="py-4 px-6 text-gray-600 font-medium">{book.penulis}</td>
                                                <td className="py-4 px-6">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-black ${book.stok > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {book.stok} UNIT
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-center space-x-4">
                                                    <button className="text-indigo-600 font-bold hover:text-indigo-800 transition">Edit</button>
                                                    <button onClick={() => handleDelete(book.id)} className="text-red-500 font-bold hover:text-red-700 transition">Hapus</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="py-20 text-center text-gray-400 font-medium italic">
                                                Tidak ada data buku di perpustakaan...
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {/* --- MODAL TAMBAH BUKU --- */}
            {showModal && (
                <div className="fixed inset-0 bg-indigo-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md transform transition-all scale-100">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-gray-800">Tambah Buku</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <form onSubmit={handleAddBook} className="space-y-5">
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Judul Buku</label>
                                <input 
                                    type="text" required
                                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-0 outline-none transition font-medium"
                                    placeholder="Contoh: Laskar Pelangi"
                                    value={newBook.judul}
                                    onChange={(e) => setNewBook({...newBook, judul: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Nama Penulis</label>
                                <input 
                                    type="text" required
                                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-0 outline-none transition font-medium"
                                    placeholder="Contoh: Andrea Hirata"
                                    value={newBook.penulis}
                                    onChange={(e) => setNewBook({...newBook, penulis: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Jumlah Stok</label>
                                <input 
                                    type="number" required
                                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-indigo-500 focus:ring-0 outline-none transition font-medium"
                                    placeholder="Contoh: 15"
                                    value={newBook.stok}
                                    onChange={(e) => setNewBook({...newBook, stok: e.target.value})}
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition"
                                >
                                    BATAL
                                </button>
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-xl font-black shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition disabled:opacity-50"
                                >
                                    {loading ? 'MENYIMPAN...' : 'SIMPAN'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;