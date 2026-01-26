import React, { useEffect, useState } from 'react';
import api from '../services/api'; 
import { FaExchangeAlt, FaUser, FaBook, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';

const AdminTransaksi = () => {
    const [transaksi, setTransaksi] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAllTransaksi = async () => {
        try {
            setLoading(true);
            // Endpoint ini harus dibuat di Laravel: GET /api/admin/peminjaman
            const res = await api.get('/admin/peminjaman'); 
            setTransaksi(res.data);
        } catch (err) {
            console.error("Gagal ambil data transaksi", err);
            // Jangan biarkan loading terus jika error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllTransaksi();
    }, []);

    // Fungsi pembantu untuk format tanggal agar tidak crash
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            return new Date(dateString).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* --- HEADER CARD --- */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-gray-800 uppercase italic tracking-tighter">
                        Monitoring Transaksi
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        Daftar semua buku yang sedang dipinjam oleh siswa
                    </p>
                </div>
                <div className="bg-indigo-600 p-4 rounded-2xl text-white shadow-lg shadow-indigo-100">
                    <FaExchangeAlt size={24} />
                </div>
            </div>

            {/* --- TABLE SECTION --- */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden mb-10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-400 tracking-widest border-b border-gray-100">
                            <tr>
                                <th className="p-6 px-8">Data Peminjam</th>
                                <th className="p-6">Informasi Buku</th>
                                <th className="p-6">Waktu Pinjam</th>
                                <th className="p-6 text-center">Status Aktif</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                            <p className="font-black text-gray-300 uppercase text-xs tracking-widest">Sinkronisasi Data...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : transaksi.length > 0 ? (
                                transaksi.map((t) => (
                                    <tr key={t.id} className="hover:bg-indigo-50/30 transition-colors group">
                                        <td className="p-6 px-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-black shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                    {t.user?.name?.charAt(0) || <FaUser />}
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-800 uppercase text-xs leading-none mb-1">
                                                        {t.user?.name || 'User Tidak Dikenal'}
                                                    </p>
                                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
                                                        ID Anggota: #{t.user_id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-10 bg-gray-50 rounded border border-gray-100 flex items-center justify-center text-gray-300">
                                                    <FaBook size={12} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-700 text-xs leading-tight">
                                                        {t.book?.judul || 'Buku Telah Dihapus'}
                                                    </p>
                                                    <p className="text-[9px] text-indigo-500 font-black uppercase italic">
                                                        {t.book?.kategori || 'No Category'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 text-[11px] font-bold text-gray-500 uppercase tracking-tighter">
                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt className="text-gray-300" /> 
                                                {formatDate(t.tanggal_pinjam)}
                                            </div>
                                        </td>
                                        <td className="p-6 text-center">
                                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm ${
                                                t.status === 'dipinjam' 
                                                ? 'bg-amber-50 text-amber-600 border border-amber-100' 
                                                : 'bg-green-50 text-green-600 border border-green-100'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${t.status === 'dipinjam' ? 'bg-amber-500' : 'bg-green-500'}`}></span>
                                                {t.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-20 text-center">
                                        <div className="opacity-20 grayscale mb-4">
                                            <FaExchangeAlt size={48} className="mx-auto" />
                                        </div>
                                        <p className="text-gray-400 font-black uppercase text-xs tracking-[0.3em]">
                                            Database Transaksi Kosong
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminTransaksi;