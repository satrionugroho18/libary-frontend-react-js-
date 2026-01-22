import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';

const RiwayatPinjam = () => {
    const [riwayat, setRiwayat] = useState([]);

    const fetchRiwayat = async () => {
        try {
            const res = await api.get('/riwayat');
            setRiwayat(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchRiwayat(); }, []);

    const handleKembalikan = async (id) => {
        try {
            await api.post(`/kembalikan/${id}`);
            Swal.fire('Berhasil!', 'Buku telah dikembalikan.', 'success');
            fetchRiwayat(); // Refresh list
        } catch (err) { Swal.fire('Error', 'Gagal mengembalikan buku', 'error'); }
    };

    return (
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs font-black uppercase text-gray-400 border-b">
                    <tr>
                        <th className="p-5 px-8">Buku</th>
                        <th className="p-5 px-8">Tgl Pinjam</th>
                        <th className="p-5 px-8 text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {riwayat.length > 0 ? riwayat.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50/50 transition">
                            <td className="p-5 px-8">
                                <div className="font-bold text-gray-800">{item.book?.judul}</div>
                                <div className="text-xs text-gray-400">{item.book?.penulis}</div>
                            </td>
                            <td className="p-5 px-8 text-sm text-gray-600">{item.tanggal_pinjam}</td>
                            <td className="p-5 px-8 text-center">
                                <button 
                                    onClick={() => handleKembalikan(item.id)}
                                    className="bg-orange-100 text-orange-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-orange-600 hover:text-white transition"
                                >
                                    KEMBALIKAN
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="3" className="p-10 text-center text-gray-400 italic">Kamu tidak sedang meminjam buku apapun.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default RiwayatPinjam;