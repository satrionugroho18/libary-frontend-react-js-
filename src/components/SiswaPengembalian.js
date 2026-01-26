import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';
import { FaHistory, FaCalendarAlt, FaUndoAlt, FaBookOpen, FaCheckCircle, FaClock } from 'react-icons/fa';

const SiswaPengembalian = ({ refreshDashboard }) => {
    const [peminjaman, setPeminjaman] = useState([]);
    const [riwayatSelesai, setRiwayatSelesai] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pinjam'); // 'pinjam' atau 'selesai'

    const fetchData = async () => {
        try {
            setLoading(true);
            const [resPinjam, resSelesai] = await Promise.all([
                api.get('/my-peminjaman'),
                api.get('/riwayat-selesai')
            ]);
            setPeminjaman(resPinjam.data);
            setRiwayatSelesai(resSelesai.data);
        } catch (err) {
            console.error("Gagal ambil data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const hitungSisaHari = (tglPinjam) => {
        const pinjam = new Date(tglPinjam);
        const deadline = new Date(pinjam);
        deadline.setDate(pinjam.getDate() + 7); // Batas 7 hari
        const hariIni = new Date();
        const sisaTime = deadline - hariIni;
        return Math.ceil(sisaTime / (1000 * 60 * 60 * 24));
    };

    const handleKembalikan = async (id, judul) => {
        const result = await Swal.fire({
            title: 'Kembalikan Buku?',
            text: `Yakin ingin mengembalikan "${judul}"?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            confirmButtonText: 'Ya, Kembalikan!'
        });

        if (result.isConfirmed) {
            try {
                await api.post(`/kembalikan/${id}`);
                Swal.fire({ icon: 'success', title: 'Berhasil!', timer: 1500, showConfirmButton: false });
                fetchData();
                if (refreshDashboard) refreshDashboard();
            } catch (err) {
                Swal.fire('Gagal', 'Terjadi kesalahan sistem', 'error');
            }
        }
    };

    return (
        <div className="space-y-6 p-2">
            {/* --- TAB NAVIGATION --- */}
            <div className="flex bg-white p-2 rounded-[2rem] shadow-sm max-w-md mx-auto border border-gray-100">
                <button 
                    onClick={() => setActiveTab('pinjam')}
                    className={`flex-1 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'pinjam' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-indigo-600'}`}
                >
                    Sedang Dipinjam ({peminjaman.length})
                </button>
                <button 
                    onClick={() => setActiveTab('selesai')}
                    className={`flex-1 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'selesai' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-indigo-600'}`}
                >
                    Riwayat Selesai ({riwayatSelesai.length})
                </button>
            </div>

            {/* --- LIST CONTENT --- */}
            {loading ? (
                <div className="py-20 text-center animate-pulse text-indigo-200">
                    <FaBookOpen size={50} className="mx-auto mb-4" />
                    <p className="font-black tracking-[0.3em]">MEMUAT DATA...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {(activeTab === 'pinjam' ? peminjaman : riwayatSelesai).map((item) => {
                        const sisa = hitungSisaHari(item.tanggal_pinjam);
                        return (
                            <div key={item.id} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-transparent hover:border-indigo-100 transition-all flex gap-6 relative overflow-hidden group">
                                {/* Badge Deadline (Hanya untuk yang sedang dipinjam) */}
                                {activeTab === 'pinjam' && (
                                    <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-2xl text-[8px] font-black uppercase tracking-tighter text-white ${sisa < 0 ? 'bg-red-500' : 'bg-amber-500'}`}>
                                        {sisa < 0 ? `Telat ${Math.abs(sisa)} Hari` : `${sisa} Hari Lagi`}
                                    </div>
                                )}

                                <div className="w-28 h-40 bg-gray-50 rounded-2xl flex-shrink-0 overflow-hidden">
                                    {item.book?.cover_image ? (
                                        <img src={`http://localhost:8000/storage/${item.book.cover_image}`} className="w-full h-full object-cover" alt="cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-indigo-100 text-4xl"><FaBookOpen /></div>
                                    )}
                                </div>

                                <div className="flex-grow flex flex-col justify-between py-1">
                                    <div>
                                        <h3 className="font-black text-gray-800 uppercase tracking-tighter text-lg leading-tight line-clamp-1">{item.book?.judul}</h3>
                                        <p className="text-indigo-500 text-[9px] font-black uppercase tracking-widest mb-3">{item.book?.penulis}</p>
                                        
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase">
                                                <FaCalendarAlt className="text-indigo-300" /> Pinjam: {new Date(item.tanggal_pinjam).toLocaleDateString('id-ID')}
                                            </div>
                                            {activeTab === 'selesai' && (
                                                <div className="flex items-center gap-2 text-[9px] font-bold text-green-500 uppercase">
                                                    <FaCheckCircle /> Kembali: {new Date(item.updated_at).toLocaleDateString('id-ID')}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {activeTab === 'pinjam' && (
                                        <button 
                                            onClick={() => handleKembalikan(item.id, item.book?.judul)}
                                            className="w-full py-3 bg-gray-900 text-white rounded-xl font-black text-[9px] tracking-widest hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
                                        >
                                            <FaUndoAlt size={10} /> KEMBALIKAN
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Empty State */}
            {!loading && (activeTab === 'pinjam' ? peminjaman : riwayatSelesai).length === 0 && (
                <div className="text-center py-20 bg-white rounded-[3rem] border-4 border-dashed border-gray-50">
                    <p className="text-gray-300 font-black uppercase tracking-[0.2em]">Tidak ada data ditemukan</p>
                </div>
            )}
        </div>
    );
};

export default SiswaPengembalian;