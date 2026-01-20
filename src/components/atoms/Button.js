import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', disabled = false }) => {
    // Styling sederhana berdasarkan variant
    const baseStyle = "px-4 py-2 rounded-md font-semibold transition duration-200 disabled:opacity-50";
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        danger: "bg-red-600 text-white hover:bg-red-700",
        success: "bg-green-600 text-white hover:bg-green-700",
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