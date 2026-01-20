import React from 'react';
import Input from '../atoms/Input';

const FormField = ({ label, type, name, value, onChange, placeholder }) => {
    return (
        <div className="form-field-group mb-4">
            <Input 
                label={label}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    );
};

export default FormField;