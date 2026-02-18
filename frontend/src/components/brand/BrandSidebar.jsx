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

    const selectedBrand = brands.find(b => b.id == selectedBrandId);

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
        <div className="w-[85vw] sm:w-[320px] lg:w-[420px] border-r border-white/5 flex flex-col p-6 sm:p-8 lg:p-10 gap-6 sm:gap-8 shrink-0 h-full overflow-y-auto scrollbar-hide bg-[#050505] font-outfit">
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
                    {!selectedBrand && (
                        <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl animate-pulse -z-10" />
                    )}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`w-full bg-white/[0.02] hover:bg-white/[0.04] border ${!selectedBrand ? 'border-white/20 ring-1 ring-white/10' : 'border-white/5'} hover:border-white/10 text-white px-6 py-4 pr-12 rounded-2xl outline-none transition-all duration-300 cursor-pointer shadow-2xl font-black text-sm text-left backdrop-blur-3xl font-space relative overflow-hidden group`}
                    >
                        <span className="relative z-10">{selectedBrand?.title || "Choose Brand"}</span>
                        {!selectedBrand && (
                            <div className="absolute right-12 top-1/2 -translate-y-1/2 flex items-center gap-1 animate-bounce duration-[2000ms]">
                                <div className="w-1 h-1 bg-white rounded-full" />
                                <div className="w-1 h-1 bg-white/50 rounded-full" />
                                <div className="w-1 h-1 bg-white/20 rounded-full" />
                            </div>
                        )}
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

            <div className="flex-1 min-h-0 relative">
                {selectedBrandData ? (
                    <BrandCard brandData={selectedBrandData} />
                ) : (
                    <div className="flex flex-col gap-6 py-10 opacity-40 select-none animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black text-white tracking-tighter uppercase font-space leading-none">
                                Create Your
                            </h2>
                            <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white/50 to-white/10 tracking-tighter uppercase font-space leading-none">
                                Marketing Ready Assets
                            </h3>
                        </div>

                        <div className="h-px w-12 bg-white/10" />

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 group">
                                <span className="text-2xl font-black text-white/40 group-hover:text-white transition-colors duration-500 font-space tracking-tight">BRAND VOICES</span>
                                <div className="h-[2px] w-0 group-hover:w-12 bg-white/20 transition-all duration-700" />
                            </div>

                            <div className="flex items-center gap-4 group">
                                <span className="text-2xl font-black text-white/40 group-hover:text-white transition-colors duration-500 font-space tracking-tight">CAMPAIGNS</span>
                                <div className="h-[2px] w-0 group-hover:w-24 bg-white/20 transition-all duration-700" />
                            </div>

                            <div className="flex items-center gap-4 group">
                                <span className="text-2xl font-black text-white/40 group-hover:text-white transition-colors duration-500 font-space tracking-tight">VISUAL IDENTITIES</span>
                                <div className="h-[2px] w-0 group-hover:w-8 bg-white/20 transition-all duration-700" />
                            </div>
                        </div>

                        <div className="pt-8">
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Experience the Future</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrandSidebar;