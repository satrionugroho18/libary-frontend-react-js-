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

            Swal.fire('Berhasil!', 'Selamat datang kembali.', 'success');
            onLoginSuccess(user.role);
        } catch (error) {
            Swal.fire('Error', 'Email atau password salah!', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Login Library</h2>
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
            <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Logging in...' : 'Sign In'}
            </Button>
        </form>
    );
};

export default LoginForm;