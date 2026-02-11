import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Check, Plus } from 'lucide-react';
import BrandCard from './BrandCard';

const BrandSidebar = ({
    brands,
    selectedBrandId,
    onBrandChange,
    selectedBrandData,
    title = "Generation Hub",
    subtitle = "Initialize your brand's creative assets."
}) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedBrand = brands.find(b => b.id === selectedBrandId);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleBrandSelect = (brandId) => {
        onBrandChange({ target: { value: brandId } });
        setIsOpen(false);
    };

    return (
        <div className="w-[420px] border-r border-white/5 flex flex-col p-10 gap-8 shrink-0 h-full overflow-y-auto scrollbar-hide bg-[#050505] font-outfit">
            <div className="space-y-2">
                <h1 className="text-3xl font-black text-white tracking-tighter font-space">
                    {title}
                </h1>
                <p className="text-gray-500 text-xs font-medium tracking-wide uppercase">{subtitle}</p>
            </div>

            <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] pl-1">
                    Select Context
                </label>

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 text-white px-6 py-4 pr-12 rounded-2xl outline-none transition-all duration-300 cursor-pointer shadow-2xl font-black text-sm text-left backdrop-blur-3xl font-space"
                    >
                        <span>{selectedBrand?.title || "Choose Brand"}</span>
                    </button>

                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                        <ChevronDown
                            size={16}
                            className={`text-gray-600 transition-all duration-300 ${isOpen ? 'rotate-180 text-white' : ''}`}
                        />
                    </div>

                    {isOpen && (
                        <div className="absolute top-full left-0 right-0 mt-3 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.5)] overflow-hidden z-[100] backdrop-blur-3xl">
                            <div className="py-2 max-h-[320px] overflow-y-auto scrollbar-hide">
                                {brands.map((brand) => (
                                    <button
                                        key={brand.id}
                                        onClick={() => handleBrandSelect(brand.id)}
                                        className="w-full px-5 py-4 text-left hover:bg-white/[0.03] transition-all flex items-center justify-between group"
                                    >
                                        <span className={`text-sm font-black font-space uppercase tracking-tight ${brand.id === selectedBrandId ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
                                            {brand.title}
                                        </span>
                                        {brand.id === selectedBrandId && (
                                            <Check size={14} className="text-white" />
                                        )}
                                    </button>
                                ))}

                                <div className="my-2 mx-4 border-t border-white/5"></div>

                                <button
                                    onClick={() => handleBrandSelect('ADD_NEW_URL')}
                                    className="w-full px-5 py-4 text-left hover:bg-white/[0.03] transition-all flex items-center gap-3 group"
                                >
                                    <Plus size={14} className="text-gray-600 group-hover:text-white" />
                                    <span className="text-sm font-black font-space uppercase tracking-tight text-gray-600 group-hover:text-white">
                                        Add Brand Context
                                    </span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <BrandCard brandData={selectedBrandData} />
        </div>
    );
};

export default BrandSidebar;
