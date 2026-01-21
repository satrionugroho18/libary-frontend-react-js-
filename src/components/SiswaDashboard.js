import React from 'react';
import Swal from 'sweetalert2';

const SiswaDashboard = ({ books }) => {
    const handlePinjam = (book) => {
        Swal.fire({
            title: `Pinjam ${book.judul}?`,
            text: "Buku harus dikembalikan dalam 7 hari.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Pinjam'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Berhasil!', 'Silahkan ambil buku di perpustakaan.', 'success');
            }
        });
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.length > 0 ? (
                books.map((book) => (
                    <div key={book.id} className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all border border-gray-100">
                        <div className="h-48 bg-indigo-50 rounded-xl mb-4 flex items-center justify-center text-5xl">
                            📚
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg truncate">{book.judul}</h3>
                        <p className="text-gray-500 text-sm mb-4 italic">Oleh: {book.penulis}</p>
                        <div className="flex justify-between items-center mt-auto">
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${book.stok > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {book.stok > 0 ? `${book.stok} Tersedia` : 'Habis'}
                            </span>
                            <button 
                                onClick={() => handlePinjam(book)}
                                disabled={book.stok <= 0}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 disabled:bg-gray-300 transition"
                            >
                                PINJAM
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-span-full text-center py-20 text-gray-400">
                    Belum ada koleksi buku untuk saat ini.
                </div>
            )}
        </div>
    );
};

export default SiswaDashboard;