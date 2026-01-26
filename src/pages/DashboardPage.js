import React, { useEffect, useState } from 'react';
import api from '../services/api';
import AdminHome from '../components/AdminHome';
import AdminKelolaBuku from '../components/AdminKelolaBuku';
import AdminTransaksi from '../components/AdminTransaksi';
import AdminAnggota from '../components/AdminAnggota';
import SiswaHome from '../components/SiswaHome';
import SiswaPeminjaman from '../components/SiswaPeminjaman';
import SiswaPengembalian from '../components/SiswaPengembalian';

// Icon Imports
import { 
    FaThLarge, FaBook, FaClipboardList, FaSignOutAlt, 
    FaSearch, FaExchangeAlt, FaUsers, FaBookOpen 
} from "react-icons/fa";

const DashboardPage = () => {
    // Ambil role dan data user dari localStorage
    const role = localStorage.getItem('role'); 
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    const [books, setBooks] = useState([]);
    const [transactions, setTransactions] = useState([]); // Tambah ini
const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');

    const fetchDataAdmin = async () => {
    try {
        const [resBooks, resTrans, resUsers] = await Promise.all([
            api.get('/books'),
            api.get('/admin/peminjaman'),
            api.get('/admin/users')
        ]);
        setBooks(resBooks.data);
        setTransactions(resTrans.data);
        setUsers(resUsers.data);
    } catch (err) {
        console.error("Gagal sinkronisasi data admin", err);
    }
};

useEffect(() => {
    if (role === 'admin') {
        fetchDataAdmin();
    } else {
        fetchBooks(); // Fungsi lama untuk siswa
    }
}, [role]);
    

    const fetchBooks = async () => {
        try {
            const res = await api.get('/books');
            setBooks(res.data);
        } catch (err) {
            console.error("Gagal ambil data", err);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    const renderMainContent = () => {
        // Logika tampilan untuk ADMIN
       if (role === 'admin') {
    switch (activeTab) {
       case 'dashboard':
    return (
        <AdminHome 
            books={books} 
            transactions={transactions} 
            users={users} 
        />
    );
        case 'kelola_buku':
            return <AdminKelolaBuku books={books} refresh={fetchBooks} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />;
        
        case 'transaksi': 
            // GANTI BAGIAN INI:
            return <AdminTransaksi />; 

        case 'anggota': return <AdminAnggota />;

        default:
            return <AdminHome books={books} />;
    }
}
        
        // Logika tampilan untuk SISWA
        else {
    switch (activeTab) {
        case 'dashboard': 
            return <SiswaHome user={user} setMenu={setActiveTab} />;
        case 'peminjaman': // Pastikan namanya 'peminjaman'
        case 'pinjam':      // Tambahkan ini sebagai alias agar support tombol dari Home
            return <SiswaPeminjaman books={books} refresh={fetchBooks} searchTerm={searchTerm} />;
        case 'pengembalian': 
            return <SiswaPengembalian refreshDashboard={fetchBooks} />;
        default: 
            return <SiswaHome user={user} setMenu={setActiveTab} />;
    }
}
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
            
            {/* --- SIDEBAR --- */}
            <div className="w-72 bg-indigo-950 text-white hidden md:flex flex-col shadow-2xl z-30">
                <div className="p-8 text-3xl font-black border-b border-indigo-900/50 text-center tracking-tighter uppercase">
                    LIB<span className="text-indigo-500">RARY</span>
                </div>
                
                <nav className="p-6 flex-1">
                    <ul className="space-y-3">
                        <li onClick={() => setActiveTab('dashboard')} className={`p-4 rounded-2xl font-bold cursor-pointer flex items-center gap-4 transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-indigo-300 hover:bg-indigo-900/50'}`}>
                            <FaThLarge /> <span>Dashboard</span>
                        </li>

                        {role === 'admin' && (
                            <>
                                <li onClick={() => setActiveTab('kelola_buku')} className={`p-4 rounded-2xl font-bold cursor-pointer flex items-center gap-4 transition-all ${activeTab === 'kelola_buku' ? 'bg-indigo-600 text-white' : 'text-indigo-300 hover:bg-indigo-900/50'}`}>
                                    <FaBookOpen /> <span>Kelola Buku</span>
                                </li>
                                <li onClick={() => setActiveTab('transaksi')} className={`p-4 rounded-2xl font-bold cursor-pointer flex items-center gap-4 transition-all ${activeTab === 'transaksi' ? 'bg-indigo-600 text-white' : 'text-indigo-300 hover:bg-indigo-900/50'}`}>
                                    <FaExchangeAlt /> <span>Transaksi</span>
                                </li>
                                <li onClick={() => setActiveTab('anggota')} className={`p-4 rounded-2xl font-bold cursor-pointer flex items-center gap-4 transition-all ${activeTab === 'anggota' ? 'bg-indigo-600 text-white' : 'text-indigo-300 hover:bg-indigo-900/50'}`}>
                                    <FaUsers /> <span>Kelola Anggota</span>
                                </li>
                            </>
                        )}

                        {role === 'siswa' && (
                            <>
                                <li onClick={() => setActiveTab('peminjaman')} className={`p-4 rounded-2xl font-bold cursor-pointer flex items-center gap-4 transition-all ${activeTab === 'peminjaman' ? 'bg-indigo-600 text-white' : 'text-indigo-300 hover:bg-indigo-900/50'}`}>
                                    <FaBook /> <span>Peminjaman Buku</span>
                                </li>
                                <li onClick={() => setActiveTab('pengembalian')} className={`p-4 rounded-2xl font-bold cursor-pointer flex items-center gap-4 transition-all ${activeTab === 'pengembalian' ? 'bg-indigo-600 text-white' : 'text-indigo-300 hover:bg-indigo-900/50'}`}>
                                    <FaClipboardList /> <span>Pengembalian Buku</span>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>

                <div className="p-6 border-t border-indigo-900/50">
                    <button onClick={handleLogout} className="w-full p-4 rounded-2xl font-bold flex items-center gap-4 text-red-400 hover:bg-red-500/10 transition-all uppercase text-[10px] tracking-widest">
                        <FaSignOutAlt className="text-xl" /> <span>Logout System</span>
                    </button>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white/80 backdrop-blur-md shadow-sm p-6 px-10 flex justify-between items-center border-b z-20">
                    <h2 className="text-2xl font-black text-gray-800 uppercase italic tracking-tighter">
                        {activeTab.replace('_', ' ')}
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-black text-gray-700 leading-none capitalize">{user?.name || role}</p>
                            <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest mt-1">Status: Online</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-white shadow-lg uppercase shadow-indigo-200">
                            {user?.name?.charAt(0) || role?.charAt(0)}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-10 bg-[#F8FAFC]">
                    {renderMainContent()}
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;