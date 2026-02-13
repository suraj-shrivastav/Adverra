import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const PremiumSelect = ({ label, value, onChange, options, placeholder = "Select...", className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (val) => {
        onChange(val);
        setIsOpen(false);
    };

    return (
        <div className={`space-y-2 ${className}`} ref={dropdownRef}>
            {label && (
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full bg-white/5 border ${isOpen ? 'border-white/20 ring-1 ring-white/10' : 'border-white/10'} 
                               hover:border-white/20 text-white px-4 py-3 rounded-xl outline-none 
                               transition-all duration-300 cursor-pointer shadow-inner 
                               flex items-center justify-between group`}
                >
                    <span className={`text-sm font-medium ${selectedOption ? 'text-gray-200' : 'text-gray-500'}`}>
                        {selectedOption?.label || placeholder}
                    </span>
                    <ChevronDown
                        size={16}
                        className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-white' : ''}`}
                    />
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0a] border border-white/10 rounded-xl 
                                  shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="py-1 max-h-[240px] overflow-y-auto scrollbar-hide">
                            {options.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleSelect(opt.value)}
                                    className="w-full px-4 py-3 text-left hover:bg-white/5 transition-all flex items-center justify-between group"
                                >
                                    <span className={`text-sm font-medium ${opt.value === value ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                        {opt.label}
                                    </span>
                                    {opt.value === value && (
                                        <Check size={14} className="text-white" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PremiumSelect;
