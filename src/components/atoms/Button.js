import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', disabled = false }) => {
    const baseStyle = "w-full px-4 py-2 rounded-lg font-bold transition duration-200 disabled:opacity-50 text-white";
    const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 shadow-md",
        danger: "bg-red-600 hover:bg-red-700",
        success: "bg-green-600 hover:bg-green-700",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyle} ${variants[variant]}`}
        >
            {children}
        </button>
    );
};

export default Button;