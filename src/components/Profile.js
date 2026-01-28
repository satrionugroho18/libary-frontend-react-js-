import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaCamera, FaIdCard, FaCheckCircle, FaUserShield } from 'react-icons/fa';
import Swal from 'sweetalert2';
import api from '../services/api'; 

const Profile = ({ user, role, onUpdate }) => {
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || ''); // State baru untuk email
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user?.photo_path) {
            setPreview(`http://localhost:8000/storage/${user.photo_path}?t=${new Date().getTime()}`);
        } else {
            setPreview(null);
        }
        if (user?.name) setName(user.name);
        if (user?.email) setEmail(user.email); // Sinkronisasi email awal
    }, [user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
            Swal.fire({
                icon: 'info',
                title: 'Foto Dipilih',
                text: 'Jangan lupa klik Simpan Perubahan ya!',
                timer: 2000,
                showConfirmButton: false,
                customClass: { popup: 'rounded-[2rem]' }
            });
        }
    };

    const handleUpdate = async () => {
        // Validasi Dasar
        if (!name.trim()) return Swal.fire('Opps!', 'Nama tidak boleh kosong', 'warning');
        if (!email.trim() || !email.includes('@')) return Swal.fire('Opps!', 'Masukkan email yang valid', 'warning');
        
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email); // Kirim email baru ke backend
            
            if (selectedFile) {
                formData.append('photo', selectedFile);
            }

            const response = await api.post(`/user/update/${user.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Update LocalStorage dengan data terbaru (Name, Email, dan Photo)
            const updatedUser = { 
                ...user, 
                name: response.data.user.name, 
                email: response.data.user.email,
                photo_path: response.data.user.photo_path 
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            if (onUpdate) onUpdate();

            Swal.fire({
                icon: 'success',
                title: 'Profil Terupdate!',
                text: 'Nama, Email, dan Foto kamu berhasil diperbarui.',
                customClass: { popup: 'rounded-[2rem]' }
            });

        } catch (err) {
            console.error(err);
            // Handle jika email sudah terdaftar di user lain (Unique Constraint)
            const errorMsg = err.response?.data?.errors?.email 
                ? "Email sudah digunakan oleh pengguna lain!" 
                : (err.response?.data?.message || 'Terjadi kesalahan');

            Swal.fire({
                icon: 'error',
                title: 'Gagal Update',
                text: errorMsg,
                customClass: { popup: 'rounded-[2rem]' }
            });
        } finally {
            setLoading(false);
        }
    };

    if (role === 'admin') {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-gray-100 text-center max-w-md">
                    <div className="w-24 h-24 bg-amber-50 text-amber-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <FaUserShield size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter">Administrator</h2>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Level Akses: Full Access</p>
                    <div className="mt-10 pt-8 border-t border-gray-50 text-left">
                        <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Email Official</p>
                        <p className="font-bold text-slate-700 text-lg">{user?.email}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Header Section */}
            <div className="relative mb-20">
                <div className="h-56 bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-800 rounded-[4rem] shadow-2xl shadow-indigo-200/50"></div>
                
                <div className="absolute -bottom-12 left-8 right-8 flex flex-col md:flex-row items-center md:items-end gap-8">
                    <div className="relative group">
                        <div className="w-40 h-40 md:w-48 md:h-48 bg-white rounded-[3.5rem] p-3 shadow-2xl transition-transform hover:scale-105 duration-500">
                            <div className="w-full h-full bg-slate-50 rounded-[2.8rem] overflow-hidden flex items-center justify-center border-4 border-slate-50 shadow-inner">
                                {preview ? (
                                    <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-7xl font-black text-indigo-100">{name?.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                        </div>
                        <label className="absolute bottom-2 right-2 bg-slate-900 text-white p-4 rounded-3xl cursor-pointer hover:bg-indigo-600 transition-all shadow-xl border-4 border-white">
                            <FaCamera size={18} />
                            <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                        </label>
                    </div>
                    
                    <div className="mb-6 text-center md:text-left">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-800 uppercase italic tracking-tighter leading-tight drop-shadow-sm">
                            {name || "User Name"}
                        </h2>
                        <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
                            <span className="px-5 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Siswa Aktif Perpustakaan
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-12">
                {/* Sidebar Status */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 transition-all hover:shadow-xl">
                        <h4 className="font-black text-slate-400 uppercase tracking-widest mb-8 text-[10px]">Status Kartu Digital</h4>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">ID Anggota</span>
                                <span className="text-sm font-black text-slate-700">#{user?.id?.toString().padStart(3, '0') || '001'}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-indigo-50/50 rounded-2xl">
                                <span className="text-[10px] font-bold text-indigo-400 uppercase">Akses Pinjam</span>
                                <span className="text-sm font-black text-indigo-600 uppercase">Aktif</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Editor */}
                <div className="lg:col-span-8">
                    <div className="bg-white p-10 md:p-14 rounded-[4rem] shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                                <FaIdCard size={20} />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-800 uppercase italic tracking-tighter text-xl">Informasi Akun</h4>
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Kamu bisa mengubah nama dan email kamu di sini</p>
                            </div>
                        </div>

                        <div className="space-y-10">
                            {/* Input Nama */}
                            <div className="group">
                                <label className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] ml-6 mb-3 block">Nama Lengkap</label>
                                <div className="p-6 bg-slate-50 rounded-[2rem] border-2 border-transparent font-bold text-slate-700 flex items-center gap-5 transition-all group-focus-within:bg-white group-focus-within:border-indigo-500 group-focus-within:shadow-2xl group-focus-within:shadow-indigo-100">
                                    <FaUser className="text-indigo-300 transition-colors group-focus-within:text-indigo-600" />
                                    <input 
                                        type="text" 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)}
                                        className="bg-transparent w-full outline-none text-lg capitalize"
                                        placeholder="Ubah nama..."
                                    />
                                </div>
                            </div>

                            {/* Input Email (Sekarang Bisa Diedit) */}
                            <div className="group">
                                <label className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] ml-6 mb-3 block">Email Address (Bisa Diubah)</label>
                                <div className="p-6 bg-slate-50 rounded-[2rem] border-2 border-transparent font-bold text-slate-700 flex items-center gap-5 transition-all group-focus-within:bg-white group-focus-within:border-indigo-500 group-focus-within:shadow-2xl group-focus-within:shadow-indigo-100">
                                    <FaEnvelope className="text-indigo-300 transition-colors group-focus-within:text-indigo-600" />
                                    <input 
                                        type="email" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-transparent w-full outline-none text-lg lowercase"
                                        placeholder="Ubah email..."
                                    />
                                </div>
                                <p className="text-[9px] text-amber-500 font-bold uppercase mt-3 ml-6">
                                    *Pastikan email aktif untuk keperluan notifikasi peminjaman.
                                </p>
                            </div>

                            <div className="pt-6 flex flex-col sm:flex-row gap-6">
                                <button 
                                    onClick={handleUpdate}
                                    disabled={loading}
                                    className={`flex-[2] bg-indigo-600 text-white p-6 rounded-[2rem] font-black uppercase italic tracking-widest hover:bg-indigo-700 shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? 'Menyimpan...' : 'Perbarui Profil'}
                                </button>
                                <div className="flex-1 bg-emerald-50 rounded-[2rem] flex items-center justify-center gap-3 px-8 border-2 border-emerald-100">
                                    <FaCheckCircle className="text-emerald-500" />
                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Verified</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;