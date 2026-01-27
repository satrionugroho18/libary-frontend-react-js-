import React, { useEffect, useState } from 'react';
import api from '../services/api'; 
import { 
    FaExchangeAlt, FaBook, FaCalendarAlt, 
    FaSearch, FaHashtag, FaInfoCircle 
} from 'react-icons/fa';

const AdminTransaksi = () => {
    const [transaksi, setTransaksi] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchAllTransaksi = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/peminjaman'); 
            setTransaksi(res.data);
        } catch (err) {
            console.error("Gagal ambil data transaksi", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllTransaksi();
    }, []);

    const filteredTransaksi = transaksi.filter(t => 
        t.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.book?.judul?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        total: transaksi.length,
        dipinjam: transaksi.filter(t => t.status === 'dipinjam').length,
        kembali: transaksi.filter(t => t.status === 'kembali').length
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    };

    // Fungsi Helper untuk URL Foto User
    const getUserPhoto = (photoPath) => {
        return photoPath 
            ? `http://localhost:8000/storage/${photoPath}` 
            : null;
    };

    // Fungsi Helper untuk URL Foto Buku
    const getBookCover = (book) => {
        if (!book?.foto) return null;
        const baseUrl = "http://localhost:8000";
        const pathParts = book.foto.split('/');
        const fileName = pathParts[pathParts.length - 1];
        return `${baseUrl}/storage/covers/${fileName}`;
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            
            {/* --- STATS SECTION --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Transaksi', value: stats.total, color: 'bg-indigo-600', icon: <FaExchangeAlt /> },
                    { label: 'Masih Dipinjam', value: stats.dipinjam, color: 'bg-amber-500', icon: <FaInfoCircle /> },
                    { label: 'Sudah Kembali', value: stats.kembali, color: 'bg-emerald-500', icon: <FaHashtag /> },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-5">
                        <div className={`${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{stat.label}</p>
                            <p className="text-2xl font-black text-gray-800">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- TOOLBAR SECTION --- */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600">
                        <FaExchangeAlt size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-gray-800 uppercase italic tracking-tighter leading-none">Log Transaksi</h3>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Arsip peminjaman & pengembalian</p>
                    </div>
                </div>

                <div className="relative w-full md:w-72">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input 
                        type="text"
                        placeholder="Cari peminjam / buku..."
                        className="w-full pl-12 pr-6 py-3 bg-gray-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* --- TABLE SECTION --- */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] border-b">
                            <tr>
                                <th className="p-8">Peminjam</th>
                                <th className="p-8">Buku</th>
                                <th className="p-8">Tgl Pinjam</th>
                                <th className="p-8 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="p-20 text-center">
                                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="font-black text-gray-300 uppercase text-[10px] tracking-widest">Sinkronisasi...</p>
                                    </td>
                                </tr>
                            ) : filteredTransaksi.length > 0 ? (
                                filteredTransaksi.map((t) => (
                                    <tr key={t.id} className="hover:bg-indigo-50/20 transition-all group">
                                        
                                        {/* KOLOM PEMINJAM (DENGAN FOTO PROFIL) */}
                                        <td className="p-6 px-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-sm overflow-hidden shadow-md border border-gray-100">
                                                    {t.user?.photo_path ? (
                                                        <img 
                                                            src={getUserPhoto(t.user.photo_path)} 
                                                            alt="user" 
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span>{t.user?.name?.charAt(0).toUpperCase()}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-800 uppercase text-xs tracking-tight group-hover:text-indigo-600 transition-colors">
                                                        {t.user?.name || 'Unknown'}
                                                    </p>
                                                    <p className="text-[9px] text-gray-400 font-bold tracking-widest uppercase">Member ID: #{t.user_id}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* KOLOM BUKU (DENGAN FOTO SAMPUL) */}
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-10 h-14 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden shadow-sm border border-gray-100">
                                                    {t.book?.foto ? (
                                                        <img 
                                                            src={getBookCover(t.book)} 
                                                            alt="cover" 
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                            onError={(e) => {
                                                                e.target.onerror = null; 
                                                                e.target.src = "https://placehold.co/400x600/e2e8f0/64748b?text=No+Cover";
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <FaBook size={16} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="max-w-[200px]">
                                                    <p className="font-bold text-gray-800 text-xs truncate uppercase tracking-tight">{t.book?.judul || 'Buku Dihapus'}</p>
                                                    <p className="text-[9px] text-indigo-500 font-black italic uppercase">{t.book?.penulis || 'No Author'}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-6">
                                            <div className="flex items-center gap-2 text-gray-500 font-bold text-[11px]">
                                                <FaCalendarAlt className="text-indigo-300" />
                                                {formatDate(t.tanggal_pinjam)}
                                            </div>
                                        </td>

                                        <td className="p-6 text-center">
                                            <span className={`px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest border-2 ${
                                                t.status === 'dipinjam' 
                                                ? 'bg-amber-50 text-amber-600 border-amber-100' 
                                                : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                            }`}>
                                                {t.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-20 text-center text-gray-300 font-black uppercase text-xs tracking-widest opacity-50">
                                        Data tidak ditemukan
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