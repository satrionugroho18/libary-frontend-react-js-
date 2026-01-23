import React, { useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';
import { FaTags, FaSearch, FaInfoCircle, FaBookOpen } from 'react-icons/fa';

const SiswaPeminjaman = ({ books, refresh, searchTerm }) => {
    const [selectedBook, setSelectedBook] = useState(null);
    const [filterKategori, setFilterKategori] = useState('Semua');

    const daftarKategoriTetap = ['Semua', 'Action', 'Horror', 'Isekai', 'Comedy', 'Fantasy', 'Romance', 'Mystery', 'Sci-Fi', 'Slice of Life', 'Drama'];

    const filteredBooks = books.filter(book => {
        const judul = (book.judul || "").toLowerCase();
        const penulis = (book.penulis || "").toLowerCase();
        const cari = (searchTerm || "").toLowerCase();
        const matchesSearch = judul.includes(cari) || penulis.includes(cari);
        const matchesCategory = filterKategori === 'Semua' || (book.kategori && book.kategori.toLowerCase().includes(filterKategori.toLowerCase()));
        return matchesSearch && matchesCategory;
    });

    const handlePinjam = async (book) => {
        const result = await Swal.fire({
            title: `Pinjam ${book.judul}?`,
            text: "Pastikan kamu mengembalikan buku tepat waktu.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
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
        <div className="space-y-8 p-2">
            {/* --- KATEGORI --- */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6 text-indigo-900 font-black text-sm uppercase tracking-[0.2em]">
                    <FaTags className="text-indigo-600" /> Pilih Genre Favorit
                </div>
                <div className="flex flex-wrap gap-3">
                    {daftarKategoriTetap.map((cat) => (
                        <button key={cat} onClick={() => setFilterKategori(cat)} className={`px-6 py-2.5 rounded-2xl text-[10px] font-black transition-all border-2 uppercase tracking-widest ${filterKategori === cat ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 scale-105' : 'bg-white border-gray-50 text-gray-400 hover:border-indigo-200 hover:text-indigo-500'}`}>{cat}</button>
                    ))}
                </div>
            </div>

            {/* --- GRID BUKU --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredBooks.map((book) => (
                    <div key={book.id} className="bg-white rounded-[2.5rem] p-6 shadow-sm hover:shadow-2xl transition-all group border border-transparent hover:border-indigo-100 flex flex-col h-full">
                        <div className="relative mb-6 overflow-hidden rounded-[2rem]">
                            {book.cover_image ? <img src={`http://localhost:8000/storage/${book.cover_image}`} alt={book.judul} className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" /> : <div className="h-64 bg-indigo-50 flex items-center justify-center text-7xl text-indigo-200"><FaBookOpen /></div>}
                        </div>
                        <div className="flex-grow text-center">
                            <h3 className="font-black text-gray-800 text-lg leading-tight mb-1 line-clamp-2">{book.judul}</h3>
                            <p className="text-gray-400 text-[10px] font-bold mb-6 tracking-widest uppercase italic">{book.penulis}</p>
                        </div>
                        <div className="space-y-2 mt-auto">
                            <button onClick={() => setSelectedBook(book)} className="w-full py-3 text-[10px] font-black text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors tracking-[0.2em]">DETAIL</button>
                            <button onClick={() => handlePinjam(book)} disabled={book.stok <= 0} className={`w-full py-3 rounded-xl text-[10px] font-black transition-all tracking-[0.2em] ${book.stok > 0 ? 'bg-indigo-600 text-white shadow-lg hover:bg-indigo-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                                {book.stok > 0 ? 'PINJAM BUKU' : 'HABIS'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- MODAL DETAIL (Sama seperti sebelumnya) --- */}
            {/* ... kodingan modal detail kamu taruh di sini ... */}
        </div>
    );
};

export default SiswaPeminjaman;