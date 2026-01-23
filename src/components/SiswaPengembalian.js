import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';
import { FaHistory, FaUndo } from 'react-icons/fa';

const SiswaPengembalian = ({ refreshDashboard }) => {
    const [pinjaman, setPinjaman] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await api.get('/my-loans'); // Endpoint untuk ambil buku yang sedang dipinjam
            setPinjaman(res.data);
        } catch (err) {
            console.error("Gagal ambil data pinjaman");
        }
    };

    const handleKembalikan = async (id, judul) => {
        const result = await Swal.fire({
            title: 'Kembalikan Buku?',
            text: `Kamu akan mengembalikan buku "${judul}"`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            confirmButtonText: 'Ya, Kembalikan'
        });

        if (result.isConfirmed) {
            try {
                await api.post(`/kembalikan/${id}`);
                Swal.fire('Sukses', 'Buku berhasil dikembalikan!', 'success');
                fetchData(); // Refresh daftar di sini
                if (refreshDashboard) refreshDashboard();
            } catch (err) {
                Swal.fire('Gagal', 'Terjadi kesalahan', 'error');
            }
        }
    };

    return (
        <div className="p-4">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 mb-8">
                <div className="flex items-center gap-3 text-indigo-900 font-black text-sm uppercase tracking-[0.2em]">
                    <FaHistory className="text-indigo-600" /> Buku Yang Kamu Bawa
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {pinjaman.length > 0 ? pinjaman.map((item) => (
                    <div key={item.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-20 bg-indigo-100 rounded-xl flex items-center justify-center text-2xl">📖</div>
                            <div>
                                <h3 className="font-black text-gray-800 uppercase tracking-tight">{item.book.judul}</h3>
                                <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">Pinjam: {item.tanggal_pinjam}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleKembalikan(item.id, item.book.judul)}
                            className="bg-indigo-50 text-indigo-600 px-6 py-3 rounded-xl font-black text-[10px] tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2"
                        >
                            <FaUndo /> KEMBALIKAN
                        </button>
                    </div>
                )) : (
                    <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 font-black uppercase tracking-widest">Kamu tidak memiliki pinjaman aktif</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SiswaPengembalian;