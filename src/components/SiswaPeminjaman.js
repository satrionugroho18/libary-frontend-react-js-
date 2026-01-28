import React, { useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';
import { FaTags, FaSearch, FaInfoCircle, FaBookOpen, FaUserEdit, FaLayerGroup } from 'react-icons/fa';

const SiswaPeminjaman = ({ books, refresh }) => {
    const [selectedBook, setSelectedBook] = useState(null);
    const [filterKategori, setFilterKategori] = useState('Semua');
    const [localSearch, setLocalSearch] = useState(''); // State search di dalam komponen ini

    const daftarKategoriTetap = [
        'Semua', 'Action', 'Horror', 'Isekai', 'Comedy', 'Fantasy', 
        'Romance', 'Mystery', 'Sci-Fi', 'Slice of Life', 'Drama', 'Adventure', 'sejarah'
    ];

    // LOGIKA FILTER (Search Lokal + Kategori)
    const filteredBooks = books.filter(book => {
        const judul = (book.judul || "").toLowerCase();
        const penulis = (book.penulis || "").toLowerCase();
        const cari = localSearch.toLowerCase();

        const matchesSearch = judul.includes(cari) || penulis.includes(cari);
        const matchesCategory = filterKategori === 'Semua' || 
            (book.kategori && book.kategori.toLowerCase().includes(filterKategori.toLowerCase()));

        return matchesSearch && matchesCategory;
    });

    const handlePinjam = async (book) => {
        const result = await Swal.fire({
            title: `Pinjam ${book.judul}?`,
            text: "Pastikan kamu mengembalikan buku tepat waktu.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Ya, Pinjam Sekarang'
        });

        if (result.isConfirmed) {
            try {
                await api.post('/pinjam', { book_id: book.id });
                Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Buku berhasil dipinjam.', timer: 2000, showConfirmButton: false });
                if (refresh) refresh();
                setSelectedBook(null);
            } catch (err) {
                Swal.fire('Gagal', err.response?.data?.message || 'Terjadi kesalahan sistem', 'error');
            }
        }
    };

    return (
        <div className="space-y-6 p-2">
            
            {/* --- FITUR SEARCH BAR (DI ATAS KATEGORI) --- */}
            <div className="relative group max-w-2xl mx-auto">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                    <FaSearch className="text-indigo-400 group-focus-within:text-indigo-600 transition-colors" />
                </div>
                <input 
                    type="text"
                    placeholder="Cari judul buku atau nama penulis..."
                    className="w-full pl-16 pr-8 py-5 bg-white border-2 border-transparent focus:border-indigo-500 rounded-[2rem] shadow-xl shadow-indigo-100/50 outline-none transition-all text-sm font-bold text-gray-700 placeholder:text-gray-300"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                />
            </div>

            {/* --- BAGIAN KATEGORI --- */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6 text-indigo-900 font-black text-[10px] uppercase tracking-[0.2em]">
                    <FaTags className="text-indigo-600" /> Filter Berdasarkan Genre
                </div>
                <div className="flex flex-wrap gap-3">
                    {daftarKategoriTetap.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilterKategori(cat)}
                            className={`px-6 py-3 rounded-2xl text-[10px] font-black transition-all border-2 uppercase tracking-widest ${
                                filterKategori === cat 
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' 
                                : 'bg-white border-gray-50 text-gray-400 hover:border-indigo-200 hover:text-indigo-500 hover:scale-105'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- GRID DAFTAR BUKU --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredBooks.length > 0 ? (
                    filteredBooks.map((book) => (
                        <div key={book.id} className="bg-white rounded-[2.5rem] p-6 shadow-sm hover:shadow-2xl transition-all group border border-transparent hover:border-indigo-100 flex flex-col h-full">
                            <div className="relative mb-6 overflow-hidden rounded-[2rem] h-64 bg-gray-100">
                                {book.cover_image ? (
                                    <img 
                                        src={`http://localhost:8000/storage/${book.cover_image}`} 
                                        alt={book.judul}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-7xl text-indigo-200"><FaBookOpen /></div>
                                )}
                            </div>
                            <div className="flex-grow text-center px-2">
                                <h3 className="font-black text-gray-800 text-lg leading-tight mb-2 line-clamp-2 uppercase tracking-tighter">{book.judul}</h3>
                                <p className="text-indigo-500 text-[10px] font-bold mb-6 tracking-widest uppercase italic">{book.penulis}</p>
                            </div>
                            <div className="space-y-2 mt-auto">
                                <button onClick={() => setSelectedBook(book)} className="w-full py-3 text-[10px] font-black text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors tracking-[0.2em]">LIHAT DETAIL</button>
                                <button onClick={() => handlePinjam(book)} disabled={book.stok <= 0} className={`w-full py-3 rounded-xl text-[10px] font-black transition-all tracking-[0.2em] ${book.stok > 0 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                                    {book.stok > 0 ? 'PINJAM BUKU' : 'STOK HABIS'}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 bg-white rounded-[3rem] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center">
                        <div className="text-6xl mb-4 text-indigo-100"><FaSearch /></div>
                        <p className="text-gray-400 font-black uppercase tracking-widest">Buku tidak ditemukan</p>
                    </div>
                )}
            </div>

            {/* --- MODAL DETAIL (Warna Diperjelas) --- */}
            {selectedBook && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-indigo-950/80 backdrop-blur-sm" onClick={() => setSelectedBook(null)}></div>
                    <div className="bg-white w-full max-w-5xl rounded-[3.5rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row animate-in zoom-in duration-300">
                        <div className="md:w-5/12 bg-indigo-50 flex items-center justify-center relative min-h-[400px]">
                            {selectedBook.cover_image ? (
                                <img src={`http://localhost:8000/storage/${selectedBook.cover_image}`} alt={selectedBook.judul} className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-[10rem] text-indigo-200"><FaBookOpen /></div>
                            )}
                            <div className="absolute top-6 left-6 bg-indigo-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase shadow-xl">Stok: {selectedBook.stok}</div>
                        </div>
                        <div className="md:w-7/12 p-10 md:p-16 flex flex-col bg-white">
                            <button onClick={() => setSelectedBook(null)} className="absolute top-8 right-10 text-gray-400 hover:text-red-500 transition-colors text-2xl">✕</button>
                            <div className="mb-8">
                                <h2 className="text-4xl font-black text-gray-900 leading-tight mb-2 uppercase italic tracking-tighter">{selectedBook.judul}</h2>
                                <div className="flex items-center gap-2 text-indigo-600">
                                    <FaUserEdit size={14} /><p className="font-bold text-sm tracking-widest uppercase">{selectedBook.penulis}</p>
                                </div>
                            </div>
                            <div className="mb-8">
                                <h4 className="text-[10px] font-black  uppercase tracking-widest mb-4 flex items-center gap-2"><FaLayerGroup /> Genre</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedBook.kategori ? selectedBook.kategori.split(',').map((g, i) => (
                                        <span key={i} className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm">{g.trim()}</span>
                                    )) : <span className="text-gray-400 text-xs italic">Umum</span>}
                                </div>
                            </div>
                            <div className="mb-10 bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                                <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest mb-3 flex items-center gap-2"><FaInfoCircle /> Sinopsis Buku</h4>
                                <p className="text-gray-700 text-sm leading-relaxed font-medium italic">"{selectedBook.deskripsi || "Tidak ada sinopsis."}"</p>
                            </div>
                            <button onClick={() => handlePinjam(selectedBook)} disabled={selectedBook.stok <= 0} className="mt-auto w-full py-5 rounded-[1.5rem] font-black text-[11px] tracking-[0.3em] bg-indigo-600 text-white hover:bg-indigo-700 shadow-2xl shadow-indigo-200 disabled:bg-gray-100 disabled:text-gray-400">
                                {selectedBook.stok > 0 ? 'KONFIRMASI PEMINJAMAN' : 'STOK TIDAK TERSEDIA'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SiswaPeminjaman;