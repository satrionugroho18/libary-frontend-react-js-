import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaCamera, FaIdCard, FaCheckCircle, FaUserShield } from 'react-icons/fa';
import Swal from 'sweetalert2';
import api from '../services/api'; 

const Profile = ({ user, role, onUpdate }) => { // Tambahkan onUpdate di sini
    const [name, setName] = useState(user?.name || '');
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    // Set preview awal jika user sudah punya foto di database
    useEffect(() => {
        if (user?.photo_path) {
            setPreview(`http://localhost:8000/storage/${user.photo_path}`);
        }
    }, [user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
            Swal.fire({
                icon: 'success',
                title: 'Foto Terpilih',
                text: 'Klik tombol Simpan Perubahan untuk memperbarui profil.',
                timer: 2000,
                showConfirmButton: false,
                customClass: { popup: 'rounded-[2rem]' }
            });
        }
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            
            if (selectedFile) {
                formData.append('photo', selectedFile);
            }

            // Memanggil API Laravel
            const response = await api.post(`/user/update/${user.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // 1. Update data di LocalStorage
            const updatedUser = { 
                ...user, 
                name: response.data.user.name, 
                photo_path: response.data.user.photo_path 
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // 2. Panggil fungsi onUpdate untuk memberitahu DashboardPage agar refresh Header
            if (onUpdate) {
                onUpdate();
            }

            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: response.data.message,
                customClass: { popup: 'rounded-[2rem]' }
            });

        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.message || 'Gagal memperbarui profil';
            Swal.fire({
                icon: 'error',
                title: 'Waduh!',
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
                <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 text-center max-w-md">
                    <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <FaUserShield size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter">Administrator</h2>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mt-2">Level Akses: Tertinggi</p>
                    <div className="mt-8 pt-6 border-t border-gray-50 text-left">
                        <p className="text-[10px] text-gray-400 font-black uppercase">Email Sistem</p>
                        <p className="font-bold text-slate-700">{user?.email}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Visual */}
            <div className="relative mb-12">
                <div className="h-44 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-[3rem] shadow-xl shadow-indigo-100"></div>
                
                <div className="absolute -bottom-10 left-10 flex flex-col md:flex-row items-end gap-6">
                    <div className="relative group">
                        <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-[2.5rem] p-2 shadow-2xl">
                            <div className="w-full h-full bg-slate-100 rounded-[2rem] overflow-hidden flex items-center justify-center border-4 border-slate-50">
                                {preview ? (
                                    <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-6xl font-black text-indigo-200">{name?.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                        </div>
                        <label className="absolute bottom-1 right-1 bg-slate-900 text-white p-3 rounded-2xl cursor-pointer hover:bg-indigo-600 transition-all shadow-lg border-4 border-white">
                            <FaCamera size={16} />
                            <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                        </label>
                    </div>
                    
                    <div className="mb-4 hidden md:block">
                        <h2 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter leading-none">{name}</h2>
                        <p className="text-indigo-500 font-black uppercase text-[10px] tracking-[0.3em] mt-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Siswa Aktif Perpustakaan
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50">
                        <h4 className="font-black text-slate-800 uppercase italic tracking-tighter mb-6 text-sm">Status Keanggotaan</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">ID Anggota</span>
                                <span className="text-xs font-black text-slate-700">#{user?.id || '001'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Peminjaman</span>
                                <span className="text-xs font-black text-indigo-600 uppercase">Aktif</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <div className="bg-white p-8 md:p-10 rounded-[3.5rem] shadow-sm border border-gray-50">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                                <FaIdCard />
                            </div>
                            <h4 className="font-black text-slate-800 uppercase italic tracking-tighter">Informasi Akun</h4>
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            <div>
                                <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest ml-2">Nama Lengkap</label>
                                <div className="mt-2 p-5 bg-gray-50 rounded-2xl border border-transparent font-bold text-slate-700 flex items-center gap-4 transition-all focus-within:bg-white focus-within:border-indigo-100">
                                    <FaUser className="text-indigo-300" />
                                    <input 
                                        type="text" 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)}
                                        className="bg-transparent w-full outline-none capitalize" 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest ml-2">Email Address</label>
                                <div className="mt-2 p-5 bg-gray-50 rounded-2xl border border-transparent font-bold text-slate-700 flex items-center gap-4 transition-all opacity-70">
                                    <FaEnvelope className="text-indigo-300" />
                                    <input type="email" defaultValue={user?.email} className="bg-transparent w-full outline-none" readOnly />
                                </div>
                            </div>

                            <div className="pt-4 flex flex-col sm:flex-row gap-4">
                                <button 
                                    onClick={handleUpdate}
                                    disabled={loading}
                                    className={`flex-1 bg-indigo-600 text-white p-5 rounded-3xl font-black uppercase italic tracking-tighter hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                                <div className="flex-[0.5] bg-green-50 rounded-3xl flex items-center justify-center gap-2 px-6 border border-green-100">
                                    <FaCheckCircle className="text-green-500" />
                                    <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">Verified</span>
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