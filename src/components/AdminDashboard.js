import React, { useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';

const AdminDashboard = ({ books, refresh, searchTerm, setSearchTerm }) => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newBook, setNewBook] = useState({ judul: '', penulis: '', stok: '' });
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    const totalBuku = books.length;
    const totalStok = books.reduce((acc, curr) => acc + parseInt(curr.stok || 0), 0);

    const handleSaveBook = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit) {
                await api.put(`/books/${editId}`, newBook);
                Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Buku diperbarui.', timer: 1500, showConfirmButton: false });
            } else {
                await api.post('/books', newBook);
                Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Buku ditambahkan.', timer: 1500, showConfirmButton: false });
            }
            setShowModal(false);
            refresh();
        } catch (err) {
            Swal.fire('Error', 'Gagal menyimpan data.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const res = await Swal.fire({
            title: 'Hapus buku?',
            text: "Data akan hilang permanen!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!'
        });
        if (res.isConfirmed) {
            try {
                await api.delete(`/books/${id}`);
                Swal.fire({ icon: 'success', title: 'Terhapus!', timer: 1500, showConfirmButton: false });
                refresh();
            } catch (err) { console.error(err); }
        }
    };

    return (
        <div>
            {/* Card Statistik */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 text-center">
                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-blue-500">
                    <p className="text-xs text-gray-400 uppercase font-black tracking-widest">Total Koleksi</p>
                    <p className="text-4xl font-black text-gray-800">{totalBuku}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-green-500">
                    <p className="text-xs text-gray-400 uppercase font-black tracking-widest">Stok Tersedia</p>
                    <p className="text-4xl font-black text-gray-800">{totalStok}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-yellow-500">
                    <p className="text-xs text-gray-400 uppercase font-black tracking-widest">Status</p>
                    <p className="text-4xl font-black text-green-500 italic">ACTIVE</p>
                </div>
            </div>

            {/* Container Putih: Search Bar & Tombol Tambah */}
            <div className="bg-white rounded-t-3xl border-x border-t border-gray-100 p-6 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
                <div className="relative w-full md:w-1/2">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">🔍</span>
                    <input 
                        type="text"
                        placeholder="Cari judul buku atau penulis..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button 
                    onClick={() => { setIsEdit(false); setNewBook({judul:'', penulis:'', stok:''}); setShowModal(true); }}
                    className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-indigo-100 transition whitespace-nowrap"
                >
                    + TAMBAH BUKU
                </button>
            </div>

            {/* Tabel */}
            <div className="bg-white rounded-b-3xl shadow-lg border-x border-b border-gray-100 overflow-hidden mb-10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs font-black uppercase text-gray-400 tracking-widest border-b border-gray-100">
                            <tr>
                                <th className="p-5 px-8">Judul Buku</th>
                                <th className="p-5 px-8">Penulis</th>
                                <th className="p-5 px-8 text-center">Stok</th>
                                <th className="p-5 px-8 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {books.map((book) => (
                                <tr key={book.id} className="hover:bg-indigo-50/30 transition">
                                    <td className="p-5 px-8 font-bold text-gray-800">{book.judul}</td>
                                    <td className="p-5 px-8 text-gray-500 font-medium">{book.penulis}</td>
                                    <td className="p-5 px-8 text-center">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black ${book.stok > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {book.stok} UNIT
                                        </span>
                                    </td>
                                    <td className="p-5 px-8 text-center space-x-6">
                                        <button onClick={() => { setIsEdit(true); setEditId(book.id); setNewBook(book); setShowModal(true); }} className="text-indigo-600 font-black hover:text-indigo-900 transition text-xs">EDIT</button>
                                        <button onClick={() => handleDelete(book.id)} className="text-red-500 font-black hover:text-red-800 transition text-xs">HAPUS</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-indigo-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
                        <h2 className="text-2xl font-black mb-6 text-gray-800">{isEdit ? 'Edit Data Buku' : 'Tambah Buku Baru'}</h2>
                        <form onSubmit={handleSaveBook} className="space-y-4">
                            <input type="text" required className="w-full border-2 p-4 rounded-2xl outline-none focus:border-indigo-500" placeholder="Judul Buku" value={newBook.judul} onChange={(e)=>setNewBook({...newBook, judul:e.target.value})} />
                            <input type="text" required className="w-full border-2 p-4 rounded-2xl outline-none focus:border-indigo-500" placeholder="Nama Penulis" value={newBook.penulis} onChange={(e)=>setNewBook({...newBook, penulis:e.target.value})} />
                            <input 
        type="text" 
        placeholder="Kategori (Contoh: Fantasy, Action)" // <--- INPUT BARU
        className="p-3 border rounded-xl"
        onChange={(e) => setNewBook({...newBook, kategori: e.target.value})}
    />
                            <input type="number" required className="w-full border-2 p-4 rounded-2xl outline-none focus:border-indigo-500" placeholder="Jumlah Stok" value={newBook.stok} onChange={(e)=>setNewBook({...newBook, stok:e.target.value})} />
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={()=>setShowModal(false)} className="flex-1 text-gray-400 font-bold hover:bg-gray-50 rounded-2xl py-4 transition">BATAL</button>
                                <button type="submit" className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-200">{loading ? '...' : 'SIMPAN'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;