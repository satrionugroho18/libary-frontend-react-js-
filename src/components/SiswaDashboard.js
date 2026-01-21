import React from 'react';
import Swal from 'sweetalert2';

const SiswaDashboard = ({ books }) => {
    const handlePinjam = (book) => {
        Swal.fire({
            title: `Pinjam ${book.judul}?`,
            text: "Pastikan dikembalikan tepat waktu ya!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Pinjam'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Berhasil!', 'Silahkan ambil di pustakawan.', 'success');
            }
        });
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map((book) => (
                <div key={book.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all border border-gray-100 group">
                    <div className="h-40 bg-indigo-50 rounded-xl mb-4 flex items-center justify-center text-4xl group-hover:scale-105 transition">
                        📖
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg truncate">{book.judul}</h3>
                    <p className="text-gray-500 text-sm mb-3 font-medium">✍️ {book.penulis}</p>
                    <div className="flex justify-between items-center">
                        <span className={`text-xs font-black px-3 py-1 rounded-full ${book.stok > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {book.stok > 0 ? `${book.stok} TERSEDIA` : 'HABIS'}
                        </span>
                        <button 
                            onClick={() => handlePinjam(book)}
                            disabled={book.stok <= 0}
                            className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-700 disabled:bg-gray-300 transition"
                        >
                            PINJAM
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SiswaDashboard;