import React from 'react';

const PremiumInput = ({ label, value, onChange, placeholder, type = "text", className = "" }) => {
    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.1em] pl-1">
                    {label}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-white/30 
                           rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 
                           outline-none transition-all shadow-inner focus:bg-white/10"
            />
        </div>
    );
};

export default PremiumInput;
