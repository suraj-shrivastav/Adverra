import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import BrandCard from './BrandCard';

const BrandSidebar = ({ brands, selectedBrandId, onBrandChange, selectedBrandData }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="w-[420px] border-r border-gray-900 flex flex-col p-8 gap-6 shrink-0 h-full overflow-y-auto custom-scrollbar">
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold text-white tracking-tight">Image Generation</h1>
                    <p className="text-sm text-gray-500">Manage brand context and generate assets</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-sm font-medium hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
                    title="Logout"
                >
                    <LogOut size={14} />
                    <span>Logout</span>
                </button>
            </div>

            <div className="space-y-2.5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider pl-1">Select Brand</label>
                <div className="relative group">
                    <select
                        value={selectedBrandId}
                        onChange={onBrandChange}
                        className="w-full bg-[#0a0a0a] hover:bg-[#111111] border border-gray-800/60 hover:border-gray-700 text-white px-5 py-3.5 pr-12 rounded-xl appearance-none outline-none focus:border-gray-600 focus:bg-[#141414] transition-all duration-300 cursor-pointer shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] font-medium text-[15px]"
                        style={{
                            backgroundImage: 'none'
                        }}
                    >
                        {brands.map(item => (
                            <option key={item.id} value={item.id} className="bg-[#0a0a0a] text-white py-3">{item.title}</option>
                        ))}
                        <option disabled className="bg-[#0a0a0a]"></option>
                        <option value="ADD_NEW_URL" className="bg-[#0a0a0a] text-gray-400 font-medium">+ Add Brand via URL</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <ChevronDown
                            size={18}
                            className="text-gray-600 group-hover:text-gray-400 transition-colors duration-300"
                        />
                    </div>
                </div>
            </div>

            <BrandCard brandData={selectedBrandData} />
        </div>
    );
};

export default BrandSidebar;