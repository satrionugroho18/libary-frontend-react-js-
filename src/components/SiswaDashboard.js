import React from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';

const SiswaDashboard = ({ books, refresh }) => {

    // Fungsi untuk menangani peminjaman buku
    const handlePinjam = async (book) => {
        const result = await Swal.fire({
            title: `Pinjam ${book.judul}?`,
            text: "Pastikan kamu mengembalikan buku tepat waktu ya!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4F46E5', // Warna Indigo sesuai tema
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Ya, Pinjam Sekarang',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            try {
                // Mengirim request ke API backend (Laravel)
                // Pastikan route /api/pinjam sudah dibuat di Laravel
                await api.post('/pinjam', { book_id: book.id });
                
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Silahkan ambil buku di meja pustakawan.',
                    timer: 2000,
                    showConfirmButton: false
                });
                
                // Memanggil fungsi refresh dari DashboardPage untuk update stok secara real-time
                if (refresh) refresh(); 

            } catch (err) {
                // Menampilkan pesan error dari backend jika ada (misal: stok habis)
                const errorMsg = err.response?.data?.message || 'Gagal memproses peminjaman.';
                Swal.fire('Gagal', errorMsg, 'error');
            }
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.length > 0 ? (
                books.map((book) => (
                    <div key={book.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col group">
                        {/* Area Gambar/Ikon */}
                        <div className="h-48 bg-indigo-50 rounded-xl mb-4 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-300">
                            {book.stok > 0 ? '📚' : '📕'}
                        </div>
                        
                        {/* Info Buku */}
                        <h3 className="font-bold text-gray-800 text-lg truncate" title={book.judul}>
                            {book.judul}
                        </h3>
                        <p className="text-gray-500 text-sm mb-4 font-medium">✍️ {book.penulis}</p>
                        
                        {/* Status & Tombol di Bagian Bawah */}
                        <div className="mt-auto flex justify-between items-center">
                            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                                book.stok > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                                {book.stok > 0 ? `${book.stok} Tersedia` : 'Habis'}
                            </span>
                            
                            <button 
                                onClick={() => handlePinjam(book)}
                                disabled={book.stok <= 0}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                    book.stok > 0 
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-lg shadow-indigo-100' 
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                {book.stok > 0 ? 'PINJAM' : 'KOSONG'}
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                /* Tampilan Jika Tidak Ada Buku */
                <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                    <span className="text-5xl mb-4 block">🔍</span>
                    <p className="text-gray-400 font-medium">
                        Buku tidak ditemukan atau koleksi masih kosong.
                    </p>
                </div>
            )}
        </div>
    );
};

export default SiswaDashboard;