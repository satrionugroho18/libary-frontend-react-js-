import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    // --- TAMBAHKAN INI ---
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    // ---------------------
});

// Bagian ini sangat penting untuk menyisipkan token otomatis
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;