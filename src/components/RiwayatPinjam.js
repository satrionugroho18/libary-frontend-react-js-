import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';

const RiwayatPinjam = () => {
    const [riwayat, setRiwayat] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRiwayat = async () => {
        try {
            setLoading(true);
            const res = await api.get('/riwayat');
            setRiwayat(res.data);
        } catch (err) {
            console.error("Gagal mengambil data riwayat:", err);
            Swal.fire('Error', 'Gagal memuat riwayat peminjaman', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRiwayat();
    }, []);

    const handleKembalikan = async (id, judul) => {
        const result = await Swal.fire({
            title: 'Kembalikan Buku?',
            text: `Apakah kamu ingin mengembalikan buku "${judul}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#F59E0B',
            confirmButtonText: 'Ya, Kembalikan',
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            try {
                await api.post(`/kembalikan/${id}`);
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'Buku telah dikembalikan ke perpustakaan.',
                    timer: 2000,
                    showConfirmButton: false
                });
                fetchRiwayat();
            } catch (err) {
                Swal.fire('Gagal', 'Terjadi kesalahan saat mengembalikan buku.', 'error');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                <span className="ml-3 text-gray-500 font-medium">Memuat data...</span>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100 transition-all">
            {/* Header Riwayat */}
            <div className="p-8 border-b border-gray-50 bg-white">
                <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">Buku Yang Sedang Dipinjam</h3>
                <p className="text-gray-400 text-sm italic">Daftar buku yang harus kamu jaga dan kembalikan tepat waktu.</p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
                        <tr>
                            <th className="p-6 px-8">Informasi Buku</th>
                            <th className="p-6 px-8">Tanggal Pinjam</th>
                            <th className="p-6 px-8">Batas Pengembalian</th>
                            <th className="p-6 px-8 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {riwayat.length > 0 ? (
                            riwayat.map((item) => {
                                // Logika menghitung selisih hari untuk status terlambat
                                const tglPinjam = new Date(item.tanggal_pinjam);
                                const tglBatas = new Date(tglPinjam.getTime() + 7 * 24 * 60 * 60 * 1000);
                                const isTerlambat = new Date() > tglBatas;

                                return (
                                    <tr key={item.id} className="hover:bg-indigo-50/20 transition-colors group">
                                        {/* Kolom 1: Info Buku */}
                                        <td className="p-6 px-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-2xl shadow-inner">
                                                    📖
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                                                        {item.book?.judul || 'Judul tidak ditemukan'}
                                                    </div>
                                                    <div className="text-xs text-gray-400 font-medium tracking-wide">
                                                        {item.book?.penulis || 'Penulis Anonim'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Kolom 2: Tgl Pinjam */}
                                        <td className="p-6 px-8">
                                            <div className="text-sm font-semibold text-gray-600">
                                                {new Date(item.tanggal_pinjam).toLocaleDateString('id-ID', {
                                                    day: '2-digit', month: 'long', year: 'numeric'
                                                })}
                                            </div>
                                        </td>

                                        {/* Kolom 3: Batas Kembali & Status */}
                                        <td className="p-6 px-8">
                                            <div className="flex flex-col">
                                                <span className={`text-[10px] font-black uppercase tracking-tighter ${isTerlambat ? 'text-red-500' : 'text-green-500'}`}>
                                                    {isTerlambat ? '⚠️ Terlambat' : '✅ Aman'}
                                                </span>
                                                <span className={`text-sm font-bold ${isTerlambat ? 'text-red-600' : 'text-indigo-600'}`}>
                                                    {tglBatas.toLocaleDateString('id-ID', {
                                                        day: '2-digit', month: 'short', year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Kolom 4: Tombol Aksi */}
                                        <td className="p-6 px-8 text-center">
                                            <button 
                                                onClick={() => handleKembalikan(item.id, item.book?.judul)}
                                                className="bg-orange-50 text-orange-600 px-6 py-2.5 rounded-xl text-xs font-black hover:bg-orange-600 hover:text-white transition-all shadow-sm active:scale-95"
                                            >
                                                KEMBALIKAN
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-24 text-center">
                                    <div className="text-6xl mb-4 grayscale opacity-50">🍃</div>
                                    <p className="text-gray-400 font-bold italic text-lg">
                                        Kamu sedang tidak meminjam buku apapun.
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RiwayatPinjam;