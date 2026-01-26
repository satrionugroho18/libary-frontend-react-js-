import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { FaUsers, FaUserGraduate, FaTrash, FaIdBadge } from 'react-icons/fa';
import Swal from 'sweetalert2';

const AdminAnggota = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            // Pastikan buat endpoint ini di Laravel: Route::get('/admin/users', ...)
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (err) {
            console.error("Gagal ambil data anggota", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteUser = async (id, name) => {
        const result = await Swal.fire({
            title: `Hapus ${name}?`,
            text: "User ini tidak akan bisa login lagi!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/admin/users/${id}`);
                Swal.fire('Terhapus!', 'Anggota telah dihapus.', 'success');
                fetchUsers();
            } catch (err) {
                Swal.fire('Gagal', 'Tidak bisa menghapus user ini.', 'error');
            }
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-gray-800 uppercase italic tracking-tighter">Database Anggota</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Manajemen akun siswa terdaftar</p>
                </div>
                <div className="bg-green-500 p-4 rounded-2xl text-white shadow-lg shadow-green-100">
                    <FaUsers size={24} />
                </div>
            </div>

            {/* Grid Kartu Anggota */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {loading ? (
                    <div className="col-span-full py-20 text-center font-black text-gray-300 uppercase italic">Sedang Memuat Anggota...</div>
                ) : users.length > 0 ? (
                    users.map((u) => (
                        <div key={u.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl font-black group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    {u.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="font-black text-gray-800 uppercase text-sm leading-tight">{u.name}</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{u.email}</p>
                                </div>
                            </div>
                            
                            <div className="mt-6 flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-2 text-[10px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase italic">
                                    <FaIdBadge /> ID: #{u.id}
                                </div>
                                <button 
                                    onClick={() => handleDeleteUser(u.id, u.name)}
                                    className="p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                                    title="Hapus Anggota"
                                >
                                    <FaTrash size={14} />
                                </button>
                            </div>
                            {/* Background Dekorasi */}
                            <FaUserGraduate className="absolute -right-4 -bottom-4 text-gray-50 text-7xl rotate-12 group-hover:text-indigo-50 transition-colors" />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center text-gray-400 font-bold uppercase italic tracking-widest">Tidak ada anggota terdaftar</div>
                )}
            </div>
        </div>
    );
};

export default AdminAnggota;