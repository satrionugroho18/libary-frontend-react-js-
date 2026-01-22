import React, { useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';
import { FaBookOpen, FaTags } from 'react-icons/fa'; // Import ikon baru

const SiswaDashboard = ({ books, refresh }) => {
    const [selectedBook, setSelectedBook] = useState(null);
    const [filterKategori, setFilterKategori] = useState('Semua');

    // Daftar kategori unik dari data buku yang ada
    const categories = ['Semua', ...new Set(books.map(b => b.kategori).filter(Boolean))];

    // Filter buku berdasarkan kategori yang dipilih
    const filteredBooks = filterKategori === 'Semua' 
        ? books 
        : books.filter(b => b.kategori === filterKategori);

    const handlePinjam = async (book) => {
        // ... fungsi pinjam tetap sama seperti sebelumnya ...
        const result = await Swal.fire({
            title: `Pinjam ${book.judul}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Pinjam'
        });

        if (result.isConfirmed) {
            try {
                await api.post('/pinjam', { book_id: book.id });
                Swal.fire('Berhasil!', 'Buku berhasil dipinjam.', 'success');
                if (refresh) refresh();
                setSelectedBook(null);
            } catch (err) {
                Swal.fire('Gagal', err.response?.data?.message || 'Error', 'error');
            }
        }
    };

    return (
        <div className="space-y-8">
            {/* --- FILTER KATEGORI --- */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 mr-4 text-indigo-900 font-black text-sm uppercase tracking-widest">
                    <FaTags /> Kategori:
                </div>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilterKategori(cat)}
                        className={`px-6 py-2 rounded-full text-xs font-black transition-all border-2 ${
                            filterKategori === cat 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' 
                            : 'bg-white border-gray-100 text-gray-400 hover:border-indigo-200 hover:text-indigo-500'
                        }`}
                    >
                        {cat.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* --- GRID BUKU --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredBooks.map((book) => (
                    <div key={book.id} className="bg-white rounded-[2.5rem] p-6 shadow-sm hover:shadow-2xl transition-all group border border-transparent hover:border-indigo-100">
                        <div className="relative mb-6">
                            <div className="h-48 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-[2rem] flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-500">
                                📖
                            </div>
                            <span className="absolute -bottom-3 right-4 bg-yellow-400 text-indigo-900 px-4 py-1 rounded-full text-[10px] font-black shadow-md">
                                {book.kategori || 'UMUM'}
                            </span>
                        </div>

                        <h3 className="font-black text-gray-800 text-lg leading-tight mb-1 truncate">{book.judul}</h3>
                        <p className="text-gray-400 text-[10px] font-bold mb-6 tracking-widest uppercase">{book.penulis}</p>
                        
                        <div className="flex flex-col gap-2">
                            <button 
                                onClick={() => setSelectedBook(book)}
                                className="w-full py-3 text-[10px] font-black text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors tracking-widest"
                            >
                                DETAIL BUKU
                            </button>
                            <button 
                                onClick={() => handlePinjam(book)}
                                disabled={book.stok <= 0}
                                className={`w-full py-3 rounded-xl text-[10px] font-black transition-all tracking-widest ${
                                    book.stok > 0 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700' : 'bg-gray-100 text-gray-400'
                                }`}
                            >
                                {book.stok > 0 ? 'PINJAM SEKARANG' : 'STOK HABIS'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ... Modal Detail tetap sama seperti kode sebelumnya ... */}
            {selectedBook && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-indigo-950/60 backdrop-blur-sm" onClick={() => setSelectedBook(null)}></div>
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row animate-in zoom-in duration-300">
                         {/* Konten modal detail seperti yang kita buat di fitur ke-3 */}
                         <div className="md:w-1/2 bg-indigo-600 p-12 flex flex-col items-center justify-center text-white">
                            <div className="text-8xl mb-4">📖</div>
                            <div className="bg-white/20 px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                                {selectedBook.kategori}
                            </div>
                         </div>
                         <div className="md:w-1/2 p-10 relative">
                            <button onClick={() => setSelectedBook(null)} className="absolute top-6 right-8 text-gray-400 hover:text-gray-800 font-bold">✕</button>
                            <h2 className="text-3xl font-black text-gray-800 leading-tight mb-2">{selectedBook.judul}</h2>
                            <p className="text-indigo-600 font-bold text-sm mb-6 underline decoration-indigo-100 underline-offset-8 uppercase tracking-widest">{selectedBook.penulis}</p>
                            <p className="text-gray-500 text-sm leading-relaxed mb-8 italic">
                                {selectedBook.deskripsi || "Tidak ada deskripsi tersedia untuk buku ini."}
                            </p>
                            <button 
                                onClick={() => handlePinjam(selectedBook)}
                                disabled={selectedBook.stok <= 0}
                                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs tracking-widest hover:bg-indigo-800 transition-all shadow-xl shadow-indigo-100"
                            >
                                {selectedBook.stok > 0 ? 'KONFIRMASI PINJAM' : 'STOK HABIS'}
                            </button>
                         </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SiswaDashboard;