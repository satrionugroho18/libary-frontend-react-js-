import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post('/register', formData);
            alert("Pendaftaran Berhasil!");
            navigate('/login');
        } catch (err) {
            alert("Email sudah terdaftar atau server error.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-10 rounded-[2rem] shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-black text-center text-indigo-600 mb-6 italic">Join Us!</h2>
                <form onSubmit={handleRegister} className="space-y-4">
                    <input type="text" placeholder="Nama" className="w-full p-4 bg-gray-50 rounded-xl" 
                        onChange={e => setFormData({...formData, name: e.target.value})} />
                    <input type="email" placeholder="Email" className="w-full p-4 bg-gray-50 rounded-xl" 
                        onChange={e => setFormData({...formData, email: e.target.value})} />
                    <input type="password" placeholder="Password" className="w-full p-4 bg-gray-50 rounded-xl" 
                        onChange={e => setFormData({...formData, password: e.target.value})} />
                    <button className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold">Daftar</button>
                </form>
                <p className="text-center mt-4 text-sm text-gray-500">
                    Sudah punya akun? <Link to="/login" className="text-indigo-600 font-bold">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;