import React from 'react';
import LoginForm from '../components/organisms/LoginForm';

const LoginPage = () => {
    const handleLoginSuccess = (role) => {
        // Nanti kita arahkan ke dashboard berdasarkan role
        window.location.href = '/dashboard';
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="max-w-md w-full">
                <LoginForm onLoginSuccess={handleLoginSuccess} />
            </div>
        </div>
    );
};

export default LoginPage;