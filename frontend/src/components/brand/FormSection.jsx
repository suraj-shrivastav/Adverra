import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const FormSection = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-white/10 last:border-0 pb-4 mb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-2 text-left group"
            >
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors cursor-pointer">
                    {title}
                </label>
                {isOpen ? (
                    <ChevronDown size={16} className="text-gray-500 group-hover:text-white" />
                ) : (
                    <ChevronRight size={16} className="text-gray-500 group-hover:text-white" />
                )}
            </button>

            <div
                className={`grid transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
                    }`}
            >
                <div className="min-h-0 space-y-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default FormSection;
