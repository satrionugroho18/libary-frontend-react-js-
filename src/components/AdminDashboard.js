import React, { useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';

const AdminDashboard = ({ books, refresh, searchTerm, setSearchTerm }) => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newBook, setNewBook] = useState({ 
        judul: '', 
        penulis: '', 
        stok: '', 
        kategori: '', 
        deskripsi: '' 
    });
    
    // State Baru untuk Gambar
    const [bookCoverFile, setBookCoverFile] = useState(null);
    const [previewCover, setPreviewCover] = useState(null);
    
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    const totalBuku = books.length;
    const totalStok = books.reduce((acc, curr) => acc + parseInt(curr.stok || 0), 0);

    const handleSaveBook = async (e) => {
        e.preventDefault();
        setLoading(true);

        // MENGGUNAKAN FORMDATA (Wajib untuk upload file)
        const formData = new FormData();
        formData.append('judul', newBook.judul);
        formData.append('penulis', newBook.penulis);
        formData.append('stok', newBook.stok);
        formData.append('kategori', newBook.kategori);
        formData.append('deskripsi', newBook.deskripsi);
        
        // Jika ada file gambar yang dipilih, masukkan ke form
        if (bookCoverFile) {
            formData.append('cover_image', bookCoverFile);
        }

        try {
            if (isEdit) {
                // Laravel butuh _method PUT jika mengirim FormData lewat POST
                formData.append('_method', 'PUT');
                await api.post(`/books/${editId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Buku diperbarui.', timer: 1500, showConfirmButton: false });
            } else {
                await api.post('/books', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Buku ditambahkan.', timer: 1500, showConfirmButton: false });
            }
            setShowModal(false);
            setBookCoverFile(null);
            setPreviewCover(null);
            refresh();
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Gagal menyimpan data. Cek ukuran file (max 2MB).', 'error');
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

    const openModal = (book = null) => {
        if (book) {
            setIsEdit(true);
            setEditId(book.id);
            setNewBook({
                judul: book.judul,
                penulis: book.penulis,
                stok: book.stok,
                kategori: book.kategori || '',
                deskripsi: book.deskripsi || ''
            });
            // Tampilkan preview gambar yang sudah ada jika ada
            setPreviewCover(book.cover_image ? `http://localhost:8000/storage/${book.cover_image}` : null);
        } else {
            setIsEdit(false);
            setNewBook({ judul: '', penulis: '', stok: '', kategori: '', deskripsi: '' });
            setPreviewCover(null);
        }
        setBookCoverFile(null);
        setShowModal(true);
    };

    return (
        <div className="p-2">
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
                    <p className="text-xs text-gray-400 uppercase font-black tracking-widest">Status Sistem</p>
                    <p className="text-4xl font-black text-green-500 italic uppercase">Active</p>
                </div>
            </div>

            {/* Kontrol: Search & Add */}
            <div className="bg-white rounded-t-3xl border-x border-t border-gray-100 p-6 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
                <div className="relative w-full md:w-1/2">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 text-lg">🔍</span>
                    <input 
                        type="text"
                        placeholder="Cari judul buku atau penulis..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button 
                    onClick={() => openModal()}
                    className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-indigo-100 transition whitespace-nowrap"
                >
                    + TAMBAH BUKU
                </button>
            </div>

            {/* Tabel Data */}
            <div className="bg-white rounded-b-3xl shadow-lg border-x border-b border-gray-100 overflow-hidden mb-10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs font-black uppercase text-gray-400 tracking-widest border-b border-gray-100">
                            <tr>
                                <th className="p-5 px-8">Cover</th>
                                <th className="p-5 px-8">Judul Buku</th>
                                <th className="p-5 px-8">Penulis</th>
                                <th className="p-5 px-8 text-center">Stok</th>
                                <th className="p-5 px-8 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {books.map((book) => (
                                <tr key={book.id} className="hover:bg-indigo-50/30 transition">
                                    <td className="p-5 px-8">
                                        {book.cover_image ? (
                                            <img src={`http://localhost:8000/storage/${book.cover_image}`} alt="cover" className="w-12 h-16 object-cover rounded-lg shadow-sm" />
                                        ) : (
                                            <div className="w-12 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">No Image</div>
                                        )}
                                    </td>
                                    <td className="p-5 px-8 font-bold text-gray-800">{book.judul}</td>
                                    <td className="p-5 px-8 text-gray-500 font-medium">{book.penulis}</td>
                                    <td className="p-5 px-8 text-center">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black ${book.stok > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {book.stok} UNIT
                                        </span>
                                    </td>
                                    <td className="p-5 px-8 text-center space-x-6">
                                        <button onClick={() => openModal(book)} className="text-indigo-600 font-black hover:text-indigo-900 transition text-xs">EDIT</button>
                                        <button onClick={() => handleDelete(book.id)} className="text-red-500 font-black hover:text-red-800 transition text-xs">HAPUS</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Popup */}
            {showModal && (
                <div className="fixed inset-0 bg-indigo-950/70 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-black mb-6 text-gray-800 tracking-tighter italic uppercase">
                            {isEdit ? '⚡ Edit Data Buku' : '📚 Tambah Buku Baru'}
                        </h2>
                        
                        <form onSubmit={handleSaveBook} className="space-y-4">
                            {/* Input Gambar */}
                            <div className="flex flex-col items-center mb-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Cover Buku</label>
                                <div className="relative group cursor-pointer" onClick={() => document.getElementById('fileInput').click()}>
                                    {previewCover ? (
                                        <img src={previewCover} alt="preview" className="w-32 h-44 object-cover rounded-2xl shadow-md border-4 border-indigo-50" />
                                    ) : (
                                        <div className="w-32 h-44 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-indigo-300 transition-all">
                                            <span className="text-3xl">📸</span>
                                            <span className="text-[10px] font-bold mt-2">UPLOAD</span>
                                        </div>
                                    )}
                                </div>
                                <input 
                                    id="fileInput"
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setBookCoverFile(file);
                                            setPreviewCover(URL.createObjectURL(file));
                                        }
                                    }}
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block tracking-widest">Judul Buku</label>
                                <input required type="text" className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold" placeholder="Masukkan judul..." value={newBook.judul} onChange={(e)=>setNewBook({...newBook, judul:e.target.value})} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block tracking-widest">Penulis</label>
                                    <input required type="text" className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold" placeholder="Nama penulis..." value={newBook.penulis} onChange={(e)=>setNewBook({...newBook, penulis:e.target.value})} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block tracking-widest">Jumlah Stok</label>
                                    <input required type="number" className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold" placeholder="0" value={newBook.stok} onChange={(e)=>setNewBook({...newBook, stok:e.target.value})} />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block tracking-widest">Genre / Kategori</label>
                                <input type="text" className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold" placeholder="Action, Fantasy, etc..." value={newBook.kategori} onChange={(e)=>setNewBook({...newBook, kategori:e.target.value})} />
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-1 block tracking-widest">Sinopsis / Deskripsi</label>
                                <textarea className="w-full bg-gray-50 border-2 border-transparent p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-bold h-32 resize-none" placeholder="Ceritakan singkat isi buku..." value={newBook.deskripsi} onChange={(e)=>setNewBook({...newBook, deskripsi:e.target.value})}></textarea>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={()=>setShowModal(false)} className="flex-1 text-gray-400 font-black hover:bg-gray-50 rounded-2xl py-4 transition uppercase text-xs tracking-widest">Batal</button>
                                <button type="submit" disabled={loading} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition uppercase text-xs tracking-widest">
                                    {loading ? 'Proses...' : 'Simpan Data'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;