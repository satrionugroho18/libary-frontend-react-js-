import React, { useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaImage, FaTimes, FaSave, FaTag } from 'react-icons/fa';

const AdminKelolaBuku = ({ books, refresh, searchTerm, setSearchTerm }) => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const [bookCoverFile, setBookCoverFile] = useState(null);
    const [previewCover, setPreviewCover] = useState(null);
    
    // Daftar genre sesuai foto kamu
    const availableGenres = [
        "ACTION", "HORROR", "ISEKAI", "COMEDY", "FANTASY", 
        "ROMANCE", "MYSTERY", "SCI-FI", "SLICE OF LIFE", "DRAMA"
    ];

    const [newBook, setNewBook] = useState({ 
        judul: '', penulis: '', stok: '', kategori: '', deskripsi: '' 
    });

    // State bantuan untuk menampung pilihan genre sementara (Array)
    const [selectedGenres, setSelectedGenres] = useState([]);

    const handleGenreToggle = (genre) => {
        if (selectedGenres.includes(genre)) {
            setSelectedGenres(selectedGenres.filter(g => g !== genre));
        } else {
            setSelectedGenres([...selectedGenres, genre]);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBookCoverFile(file);
            setPreviewCover(URL.createObjectURL(file));
        }
    };

    const handleSaveBook = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        
        // Gabungkan array genre jadi string dipisah koma untuk database
        const kategoriString = selectedGenres.join(', ');
        
        formData.append('judul', newBook.judul);
        formData.append('penulis', newBook.penulis);
        formData.append('stok', newBook.stok);
        formData.append('kategori', kategoriString); // Simpan string genre
        formData.append('deskripsi', newBook.deskripsi);
        
        if (bookCoverFile) formData.append('cover_image', bookCoverFile);

        try {
            if (isEdit) {
                formData.append('_method', 'PUT');
                await api.post(`/books/${editId}`, formData, { 
                    headers: { 'Content-Type': 'multipart/form-data' } 
                });
            } else {
                await api.post('/books', formData, { 
                    headers: { 'Content-Type': 'multipart/form-data' } 
                });
            }
            
            Swal.fire({ icon: 'success', title: 'Data Tersimpan!', showConfirmButton: false, timer: 1500 });
            closeModal();
            refresh();
        } catch (err) {
            Swal.fire('Error', 'Gagal menyimpan data.', 'error');
        } finally {
            setLoading(false);
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
            // Pecah string kategori dari DB kembali jadi array untuk UI
            const genresFromDb = book.kategori ? book.kategori.split(', ') : [];
            setSelectedGenres(genresFromDb);
            setPreviewCover(book.cover_image ? `http://localhost:8000/storage/${book.cover_image}` : null);
        } else {
            setIsEdit(false);
            setNewBook({ judul: '', penulis: '', stok: '', kategori: '', deskripsi: '' });
            setSelectedGenres([]);
            setPreviewCover(null);
        }
        setBookCoverFile(null);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedGenres([]);
        setPreviewCover(null);
    };

    const handleDelete = async (id) => {
        const res = await Swal.fire({
            title: 'Hapus Buku?',
            text: "Data akan hilang permanen!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Ya, Hapus!'
        });

        if (res.isConfirmed) {
            try {
                await api.delete(`/books/${id}`);
                refresh();
                Swal.fire('Terhapus!', 'Buku telah dihapus.', 'success');
            } catch (err) {
                Swal.fire('Gagal', 'Terjadi kesalahan.', 'error');
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* --- TOP BAR (SEARCH & ADD) --- */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50">
                <div className="relative w-full md:w-1/2 group">
                    <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input 
                        type="text" placeholder="Cari buku..." 
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-indigo-500/20 focus:bg-white transition-all"
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button onClick={() => openModal()} className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black text-[10px] tracking-widest flex items-center justify-center gap-3 shadow-lg transition-all">
                    <FaPlus /> TAMBAH KOLEKSI
                </button>
            </div>

            {/* --- TABLE --- */}
            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                            <tr>
                                <th className="p-6 px-8">Info Buku</th>
                                <th className="p-6">Kategori / Genre</th>
                                <th className="p-6">Inventaris</th>
                                <th className="p-6 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-xs font-bold">
                            {books.map(book => (
                                <tr key={book.id} className="hover:bg-indigo-50/30 transition-colors group">
                                    <td className="p-6 px-8 flex items-center gap-5">
                                        <div className="w-14 h-20 bg-gray-100 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                                            {book.cover_image ? (
                                                <img src={`http://localhost:8000/storage/${book.cover_image}`} className="w-full h-full object-cover" alt="cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300"><FaImage size={20} /></div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-800 uppercase leading-tight mb-1">{book.judul}</p>
                                            <p className="text-[10px] text-gray-400 uppercase italic">Oleh: {book.penulis}</p>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                                            {book.kategori ? book.kategori.split(', ').map((g, i) => (
                                                <span key={i} className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded text-[8px] font-black whitespace-nowrap">
                                                    {g}
                                                </span>
                                            )) : '-'}
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black ${book.stok > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                            {book.stok} UNIT
                                        </span>
                                    </td>
                                    <td className="p-6 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => openModal(book)} className="text-indigo-600 hover:bg-indigo-100 p-2 rounded-lg transition-all"><FaEdit /></button>
                                            <button onClick={() => handleDelete(book.id)} className="text-red-400 hover:bg-red-50 p-2 rounded-lg transition-all"><FaTrash /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODAL --- */}
            {showModal && (
                <div className="fixed inset-0 z-[99] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className="relative bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <form onSubmit={handleSaveBook} className="flex flex-col md:flex-row max-h-[90vh]">
                            {/* Upload Left */}
                            <div className="md:w-1/3 bg-gray-50 p-10 flex flex-col items-center border-r border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Cover Preview</p>
                                <label className="relative group cursor-pointer w-full aspect-[3/4] rounded-[2rem] overflow-hidden border-4 border-white shadow-xl bg-white flex items-center justify-center">
                                    {previewCover ? <img src={previewCover} className="w-full h-full object-cover" /> : <FaImage className="text-gray-200 text-5xl" />}
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                    <div className="absolute inset-0 bg-indigo-600/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-black text-[10px]">UPLOAD</div>
                                </label>
                            </div>

                            {/* Form Right */}
                            <div className="md:w-2/3 p-10 overflow-y-auto">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-black text-gray-800 uppercase italic tracking-tighter">
                                        {isEdit ? 'Update Koleksi' : 'Tambah Koleksi Baru'}
                                    </h2>
                                    <button type="button" onClick={closeModal} className="text-gray-300 hover:text-gray-600"><FaTimes size={20} /></button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2 space-y-1">
                                        <label className="text-[9px] font-black text-indigo-500 uppercase tracking-widest ml-1">Judul Buku</label>
                                        <input required type="text" className="w-full px-5 py-3.5 bg-gray-50 rounded-xl outline-none focus:ring-2 ring-indigo-500/20 font-bold text-sm"
                                            value={newBook.judul} onChange={(e) => setNewBook({...newBook, judul: e.target.value})} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-indigo-500 uppercase tracking-widest ml-1">Penulis</label>
                                        <input required type="text" className="w-full px-5 py-3.5 bg-gray-50 rounded-xl outline-none focus:ring-2 ring-indigo-500/20 font-bold text-sm"
                                            value={newBook.penulis} onChange={(e) => setNewBook({...newBook, penulis: e.target.value})} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-indigo-500 uppercase tracking-widest ml-1">Stok</label>
                                        <input required type="number" className="w-full px-5 py-3.5 bg-gray-50 rounded-xl outline-none focus:ring-2 ring-indigo-500/20 font-bold text-sm"
                                            value={newBook.stok} onChange={(e) => setNewBook({...newBook, stok: e.target.value})} />
                                    </div>

                                    {/* --- GENRE MULTI-SELECT --- */}
                                    <div className="md:col-span-2 space-y-2 mt-2">
                                        <label className="text-[9px] font-black text-indigo-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <FaTag size={10} /> Pilih Genre (Bisa Lebih dari satu)
                                        </label>
                                        <div className="flex flex-wrap gap-2 bg-gray-50 p-4 rounded-[1.5rem] border border-gray-100 shadow-inner">
                                            {availableGenres.map((genre) => (
                                                <button
                                                    key={genre}
                                                    type="button"
                                                    onClick={() => handleGenreToggle(genre)}
                                                    className={`px-4 py-2 rounded-full text-[9px] font-black transition-all border ${
                                                        selectedGenres.includes(genre)
                                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100 scale-105'
                                                            : 'bg-white text-gray-400 border-gray-100 hover:border-indigo-300'
                                                    }`}
                                                >
                                                    {genre}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-1">
                                        <label className="text-[9px] font-black text-indigo-500 uppercase tracking-widest ml-1">Deskripsi</label>
                                        <textarea rows="3" className="w-full px-5 py-4 bg-gray-50 rounded-xl outline-none focus:ring-2 ring-indigo-500/20 font-bold text-sm resize-none"
                                            value={newBook.deskripsi} onChange={(e) => setNewBook({...newBook, deskripsi: e.target.value})}></textarea>
                                    </div>
                                </div>

                                <button 
                                    disabled={loading} type="submit" 
                                    className="w-full mt-8 bg-indigo-600 hover:bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] tracking-widest flex items-center justify-center gap-3 transition-all"
                                >
                                    {loading ? 'SINKRONISASI...' : <><FaSave /> SIMPAN KOLEKSI</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminKelolaBuku;