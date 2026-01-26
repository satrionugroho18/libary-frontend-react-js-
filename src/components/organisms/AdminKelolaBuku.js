import React, { useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaImage } from 'react-icons/fa';

const AdminKelolaBuku = ({ books, refresh, searchTerm, setSearchTerm }) => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const [bookCoverFile, setBookCoverFile] = useState(null);
    const [previewCover, setPreviewCover] = useState(null);
    const [newBook, setNewBook] = useState({ judul: '', penulis: '', stok: '', kategori: '', deskripsi: '' });

    const handleSaveBook = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        Object.keys(newBook).forEach(key => formData.append(key, newBook[key]));
        if (bookCoverFile) formData.append('cover_image', bookCoverFile);

        try {
            if (isEdit) {
                formData.append('_method', 'PUT');
                await api.post(`/books/${editId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                await api.post('/books', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            Swal.fire({ icon: 'success', title: 'Berhasil!', timer: 1500, showConfirmButton: false });
            setShowModal(false);
            refresh();
        } catch (err) {
            Swal.fire('Error', 'Gagal menyimpan data.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (book = null) => {
        if (book) {
            setIsEdit(true); setEditId(book.id);
            setNewBook({ judul: book.judul, penulis: book.penulis, stok: book.stok, kategori: book.kategori || '', deskripsi: book.deskripsi || '' });
            setPreviewCover(book.cover_image ? `http://localhost:8000/storage/${book.cover_image}` : null);
        } else {
            setIsEdit(false); setNewBook({ judul: '', penulis: '', stok: '', kategori: '', deskripsi: '' });
            setPreviewCover(null);
        }
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        const res = await Swal.fire({ title: 'Hapus?', text: "Data hilang permanen!", icon: 'warning', showCancelButton: true });
        if (res.isConfirmed) {
            await api.delete(`/books/${id}`);
            refresh();
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Kelola */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm">
                <div className="relative w-full md:w-1/2">
                    <FaSearch className="absolute left-4 top-4 text-gray-300" />
                    <input 
                        type="text" placeholder="Cari buku..." 
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 ring-indigo-500/20"
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button onClick={() => openModal()} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-xs tracking-widest flex items-center gap-2">
                    <FaPlus /> TAMBAH BUKU
                </button>
            </div>

            {/* Tabel */}
            <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-50">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                        <tr>
                            <th className="p-6">Buku</th>
                            <th className="p-6">Stok</th>
                            <th className="p-6 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {books.map(book => (
                            <tr key={book.id} className="hover:bg-indigo-50/30 transition">
                                <td className="p-6 flex items-center gap-4">
                                    <div className="w-12 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        {book.cover_image && <img src={`http://localhost:8000/storage/${book.cover_image}`} className="w-full h-full object-cover" />}
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-800 uppercase text-sm leading-tight">{book.judul}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">{book.penulis}</p>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black">{book.stok} UNIT</span>
                                </td>
                                <td className="p-6 text-center space-x-4">
                                    <button onClick={() => openModal(book)} className="text-indigo-600 hover:text-indigo-900"><FaEdit /></button>
                                    <button onClick={() => handleDelete(book.id)} className="text-red-400 hover:text-red-700"><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal - Silahkan masukkan JSX Modal kamu yang lama di sini */}
            {/* ... Modal Code ... */}
        </div>
    );
};

export default AdminKelolaBuku;