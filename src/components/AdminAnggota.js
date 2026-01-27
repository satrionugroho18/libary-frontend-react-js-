import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { FaUsers, FaUserGraduate, FaTrash, FaIdBadge, FaSearch, FaChartLine } from 'react-icons/fa';
import Swal from 'sweetalert2';

const AdminAnggota = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            setLoading(true);
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

    // Filter pencarian berdasarkan nama atau email
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteUser = async (id, name) => {
        const result = await Swal.fire({
            title: `Hapus ${name}?`,
            text: "User ini tidak akan bisa login lagi!",
            icon: 'warning',
            // ... (opsi swal tetap sama)
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
            customClass: {
                popup: 'rounded-[2.5rem]',
                confirmButton: 'rounded-2xl px-6 py-3 font-bold',
                cancelButton: 'rounded-2xl px-6 py-3 font-bold'
            }
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/admin/users/${id}`);
                Swal.fire({
                    title: 'Terhapus!',
                    text: 'Anggota telah berhasil dihapus.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
                fetchUsers();
            } catch (err) {
                Swal.fire('Gagal', 'Terjadi kesalahan saat menghapus data.', 'error');
            }
        }
    };

    return (
        <div className="p-2 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* TOP SECTION: Header & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-[3rem] shadow-xl shadow-indigo-100 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                    <div className="relative z-10 text-center md:text-left">
                        <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2 leading-none">
                            Database <br className="hidden md:block"/> Anggota
                        </h3>
                        <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">
                            Manajemen Akun Perpustakaan
                        </p>
                    </div>
                    
                    <div className="relative w-full md:w-80 z-10">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300" />
                        <input 
                            type="text"
                            placeholder="Cari Nama atau Email..."
                            className="w-full bg-white/10 backdrop-blur-md border border-white/20 pl-11 pr-4 py-4 rounded-2xl text-white placeholder:text-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all font-bold text-sm shadow-inner"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <FaUsers className="absolute -right-8 -bottom-8 text-white/10 text-[12rem] rotate-12" />
                </div>

                <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center group hover:border-indigo-200 transition-all duration-500">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
                        <FaChartLine size={24} />
                    </div>
                    <span className="text-5xl font-black text-slate-800 tracking-tighter mb-1 transition-transform group-hover:scale-110 duration-500">
                        {loading ? '...' : users.length}
                    </span>
                    <h4 className="font-black text-gray-800 uppercase italic tracking-tighter text-sm">Total Anggota</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Siswa Terdaftar</p>
                </div>
            </div>

            {/* GRID KARTU ANGGOTA */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                    [...Array(6)].map((_, i) => (
                        <div key={i} className="bg-gray-50 animate-pulse h-52 rounded-[2.5rem] border border-gray-100"></div>
                    ))
                ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                        <div key={u.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50 hover:shadow-2xl hover:shadow-indigo-100/40 transition-all group relative overflow-hidden">
                            
                            <div className="flex items-start justify-between relative z-10">
                                <div className="flex items-center gap-4">
                                    {/* FOTO PROFIL ANGGOTA */}
                                    <div className="w-16 h-16 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center text-xl font-black shadow-lg shadow-indigo-100 group-hover:bg-indigo-600 transition-all duration-500 overflow-hidden">
                                        {u.photo_path ? (
                                            <img 
                                                src={`http://localhost:8000/storage/${u.photo_path}`} 
                                                alt={u.name} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            u.name.charAt(0).toUpperCase()
                                        )}
                                    </div>

                                    <div>
                                        <h4 className="font-black text-gray-800 uppercase text-base leading-tight group-hover:text-indigo-600 transition-colors">{u.name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate max-w-[140px]">{u.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between relative z-10">
                                <div className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl flex items-center gap-2 border border-indigo-100/50">
                                    <FaIdBadge size={12} />
                                    <span className="text-[10px] font-black uppercase tracking-tighter">ID: {u.id}</span>
                                </div>
                                
                                <button 
                                    onClick={() => handleDeleteUser(u.id, u.name)}
                                    className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-300 shadow-sm border border-red-100/50"
                                    title="Hapus Anggota"
                                >
                                    <FaTrash size={14} />
                                </button>
                            </div>

                            <FaUserGraduate className="absolute -right-6 -bottom-6 text-gray-50 text-8xl -rotate-12 group-hover:rotate-0 group-hover:text-indigo-50/50 transition-all duration-700" />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-24 text-center">
                        <div className="inline-block p-8 bg-gray-50 rounded-[2.5rem] mb-4">
                            <FaSearch size={40} className="text-gray-200" />
                        </div>
                        <h3 className="text-gray-300 font-black uppercase italic text-2xl tracking-tighter">Tidak Ditemukan</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminAnggota;