import React, { useState } from 'react';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';
import api from '../../services/api';
import Swal from 'sweetalert2';

const LoginForm = ({ onLoginSuccess }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/login', formData);
            const { access_token, user } = response.data;

            // Simpan token ke localStorage
            localStorage.setItem('token', access_token);
            localStorage.setItem('role', user.role);

            await Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Selamat datang kembali.',
                timer: 1500,
                showConfirmButton: false
            });
            
            onLoginSuccess(user.role);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Email atau password salah!',
            });
        } finally {
            setLoading(false);
        }
    };

    // Tadi di sini ada typo 'rreturn', sekarang sudah diperbaiki menjadi 'return'
    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg rounded-xl border border-gray-200 max-w-sm mx-auto mt-10">
            <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-600">Login Library</h2>
            <FormField 
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@mail.com"
            />
            <FormField 
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="******"
            />
            <div className="mt-6">
                <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Logging in...' : 'Sign In'}
                </Button>
            </div>
        </form>
    );
};

export default LoginForm;