import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';

const DashboardPage = () => {
    const role = localStorage.getItem('role');
    const [books, setBooks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // State untuk Form (Tambah & Edit)
    const [newBook, setNewBook] = useState({ judul: '', penulis: '', stok: '' });
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    // 1. Fungsi Ambil Data Buku
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

    // 2. Fungsi Buka Modal Edit
    const openEditModal = (book) => {
        setIsEdit(true);
        setEditId(book.id);
        setNewBook({ judul: book.judul, penulis: book.penulis, stok: book.stok });
        setShowModal(true);
    };

    // 3. Fungsi Buka Modal Tambah
    const openAddModal = () => {
        setIsEdit(false);
        setEditId(null);
        setNewBook({ judul: '', penulis: '', stok: '' });
        setShowModal(true);
    };

    // 4. Fungsi Simpan (Bisa Tambah atau Update)
    const handleSaveBook = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit) {
                // Jika sedang Mode EDIT
                await api.put(`/books/${editId}`, newBook);
                Swal.fire('Berhasil!', 'Data buku telah diperbarui.', 'success');
            } else {
                // Jika sedang Mode TAMBAH
                await api.post('/books', newBook);
                Swal.fire('Berhasil!', 'Buku baru telah ditambahkan.', 'success');
            }
            
            setShowModal(false);
            fetchBooks(); // Refresh tabel
        } catch (err) {
            Swal.fire('Error', 'Terjadi kesalahan pada server.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // 5. Fungsi Hapus
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Yakin hapus?',
            text: "Data tidak bisa dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/books/${id}`);
                Swal.fire('Terhapus!', 'Buku telah dihapus.', 'success');
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
                <div className="p-6 text-2xl font-bold border-b border-indigo-800 text-center tracking-widest">
                    LIB<span className="text-yellow-400">PRO</span>
                </div>
                <nav className="p-4 mt-4 text-gray-300">
                    <ul className="space-y-2">
                        <li className="bg-indigo-700 text-white p-3 rounded-xl font-bold cursor-pointer shadow-md">📊 Dashboard</li>
                        <li className="p-3 hover:bg-indigo-800 hover:text-white rounded-xl transition cursor-pointer">📚 Koleksi Buku</li>
                        <li className="p-3 hover:bg-indigo-800 hover:text-white rounded-xl transition cursor-pointer">📋 Peminjaman</li>
                    </ul>
                </nav>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="flex-1 flex flex-col">
                <header className="bg-white shadow-sm p-4 px-8 flex justify-between items-center border-b">
                    <h2 className="text-xl font-bold text-gray-700 uppercase tracking-tight">Admin Dashboard</h2>
                    <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md">LOGOUT</button>
                </header>

                <main className="p-8">
                    {/* Statistik */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 text-center">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-blue-500">
                            <p className="text-xs text-gray-400 uppercase font-black tracking-widest">Total Buku</p>
                            <p className="text-4xl font-black text-gray-800">{books.length}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-green-500">
                            <p className="text-xs text-gray-400 uppercase font-black tracking-widest">Tersedia</p>
                            <p className="text-4xl font-black text-gray-800">{books.reduce((acc, curr) => acc + parseInt(curr.stok || 0), 0)}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-yellow-500">
                            <p className="text-xs text-gray-400 uppercase font-black tracking-widest">Status</p>
                            <p className="text-4xl font-black text-green-500 uppercase italic">Active</p>
                        </div>
                    </div>

                    {/* Tabel */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800 tracking-tighter">Katalog Buku Perpustakaan</h3>
                            <button 
                                onClick={openAddModal}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg transition transform active:scale-95"
                            >
                                + Tambah Buku
                            </button>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold tracking-widest">
                                    <tr>
                                        <th className="py-4 px-6">Judul</th>
                                        <th className="py-4 px-6">Penulis</th>
                                        <th className="py-4 px-6">Stok</th>
                                        <th className="py-4 px-6 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {books.length > 0 ? (
                                        books.map((book) => (
                                            <tr key={book.id} className="hover:bg-indigo-50/30 transition duration-150">
                                                <td className="py-4 px-6 font-bold text-gray-800">{book.judul}</td>
                                                <td className="py-4 px-6 text-gray-600 font-medium">{book.penulis}</td>
                                                <td className="py-4 px-6">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-black ${book.stok > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {book.stok} UNIT
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-center space-x-4 font-bold text-sm">
                                                    <button onClick={() => openEditModal(book)} className="text-indigo-600 hover:text-indigo-800">EDIT</button>
                                                    <button onClick={() => handleDelete(book.id)} className="text-red-500 hover:text-red-700">HAPUS</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="py-20 text-center text-gray-400 font-medium italic">Data buku kosong...</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {/* --- MODAL (TAMBAH & EDIT) --- */}
            {showModal && (
                <div className="fixed inset-0 bg-indigo-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
                        <div className="flex justify-between items-center mb-6">
                            {/* Judul Modal Berubah Sesuai State */}
                            <h2 className="text-2xl font-black text-gray-800">
                                {isEdit ? 'Edit Data Buku' : 'Tambah Buku Baru'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                        </div>
                        <form onSubmit={handleSaveBook} className="space-y-5">
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Judul Buku</label>
                                <input 
                                    type="text" required
                                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition font-medium"
                                    value={newBook.judul}
                                    onChange={(e) => setNewBook({...newBook, judul: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Nama Penulis</label>
                                <input 
                                    type="text" required
                                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition font-medium"
                                    value={newBook.penulis}
                                    onChange={(e) => setNewBook({...newBook, penulis: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Jumlah Stok</label>
                                <input 
                                    type="number" required
                                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition font-medium"
                                    value={newBook.stok}
                                    onChange={(e) => setNewBook({...newBook, stok: e.target.value})}
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 text-gray-400 font-bold hover:bg-gray-50 rounded-xl transition">BATAL</button>
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-xl font-black shadow-lg hover:bg-indigo-700 transition disabled:opacity-50"
                                >
                                    {/* Teks Tombol Berubah Sesuai State */}
                                    {loading ? 'MENYIMPAN...' : (isEdit ? 'UPDATE' : 'SIMPAN')}
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