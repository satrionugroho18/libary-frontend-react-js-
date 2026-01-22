import React, { useState } from 'react'; // Tambahkan useState
import api from '../services/api';
import Swal from 'sweetalert2';

const SiswaDashboard = ({ books, refresh }) => {
    const [selectedBook, setSelectedBook] = useState(null); // State untuk Modal Detail

    const handlePinjam = async (book) => {
        const result = await Swal.fire({
            title: `Pinjam ${book.judul}?`,
            text: "Pastikan kamu mengembalikan tepat waktu.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4F46E5',
            confirmButtonText: 'Ya, Pinjam'
        });

        if (result.isConfirmed) {
            try {
                await api.post('/pinjam', { book_id: book.id });
                Swal.fire('Berhasil!', 'Silahkan ambil buku di perpus.', 'success');
                if (refresh) refresh();
                setSelectedBook(null); // Tutup modal setelah pinjam
            } catch (err) {
                Swal.fire('Gagal', err.response?.data?.message || 'Error', 'error');
            }
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {books.map((book) => (
                <div key={book.id} className="bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-2xl transition-all border border-gray-100 flex flex-col group relative overflow-hidden">
                    {/* Badge Kategori jika ada */}
                    <span className="absolute top-4 left-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-indigo-600 shadow-sm z-10">
                        {book.kategori || 'UMUM'}
                    </span>

                    <div className="h-48 bg-indigo-50 rounded-2xl mb-5 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-500">
                        📖
                    </div>

                    <h3 className="font-black text-gray-800 text-lg leading-tight mb-1 truncate">{book.judul}</h3>
                    <p className="text-gray-400 text-xs font-bold mb-6 italic uppercase tracking-widest">{book.penulis}</p>
                    
                    <div className="mt-auto space-y-3">
                        {/* Tombol Lihat Detail */}
                        <button 
                            onClick={() => setSelectedBook(book)}
                            className="w-full py-2 text-xs font-black text-indigo-600 border-2 border-indigo-50 rounded-xl hover:bg-indigo-50 transition-colors"
                        >
                            LIHAT DETAIL
                        </button>
                        
                        <button 
                            onClick={() => handlePinjam(book)}
                            disabled={book.stok <= 0}
                            className={`w-full py-3 rounded-xl text-xs font-black transition-all ${
                                book.stok > 0 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700' : 'bg-gray-100 text-gray-400'
                            }`}
                        >
                            {book.stok > 0 ? 'PINJAM SEKARANG' : 'STOK HABIS'}
                        </button>
                    </div>
                </div>
            ))}

            {/* --- MODAL DETAIL BUKU --- */}
            {selectedBook && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-indigo-900/40 backdrop-blur-sm" onClick={() => setSelectedBook(null)}></div>
                    
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
                        {/* Area Visual di Modal */}
                        <div className="md:w-1/2 bg-indigo-600 p-12 flex flex-col items-center justify-center text-white relative">
                            <div className="text-[8rem] mb-4 drop-shadow-2xl">📖</div>
                            <div className="text-center">
                                <p className="text-indigo-200 text-xs font-black uppercase tracking-widest mb-2">ID Buku: #{selectedBook.id}</p>
                                <div className="bg-white/20 px-4 py-1 rounded-full text-[10px] font-bold">Stok: {selectedBook.stok} Unit</div>
                            </div>
                        </div>

                        {/* Area Info di Modal */}
                        <div className="md:w-1/2 p-10 flex flex-col">
                            <button onClick={() => setSelectedBook(null)} className="absolute top-6 right-8 text-gray-400 hover:text-gray-800 font-bold">✕</button>
                            
                            <h2 className="text-3xl font-black text-gray-800 leading-tight mb-2">{selectedBook.judul}</h2>
                            <p className="text-indigo-600 font-bold text-sm mb-6 tracking-wide underline decoration-indigo-200 underline-offset-4">Karya: {selectedBook.penulis}</p>
                            
                            <div className="mb-8">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Sinopsis / Deskripsi</h4>
                                <p className="text-gray-600 text-sm leading-relaxed italic">
                                    {selectedBook.deskripsi || "Belum ada deskripsi untuk buku ini. Silahkan hubungi pustakawan untuk informasi lebih lanjut mengenai isi buku."}
                                </p>
                            </div>

                            <div className="mt-auto pt-6 border-t border-gray-50">
                                <button 
                                    onClick={() => handlePinjam(selectedBook)}
                                    disabled={selectedBook.stok <= 0}
                                    className={`w-full py-4 rounded-2xl font-black text-sm tracking-widest transition-all ${
                                        selectedBook.stok > 0 ? 'bg-indigo-600 text-white hover:bg-indigo-800 shadow-xl shadow-indigo-100' : 'bg-gray-100 text-gray-400'
                                    }`}
                                >
                                    {selectedBook.stok > 0 ? 'KONFIRMASI PINJAM' : 'TIDAK TERSEDIA'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SiswaDashboard;