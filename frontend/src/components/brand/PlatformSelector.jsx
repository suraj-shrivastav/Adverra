import React from 'react';
import { Instagram, Facebook, Linkedin, Youtube, Globe } from 'lucide-react';

const PlatformSelector = ({ platform, setPlatform }) => {
    const platforms = [
        { id: 'Instagram', icon: <Instagram size={16} /> },
        { id: 'Facebook', icon: <Facebook size={16} /> },
        { id: 'Linkedin', icon: <Linkedin size={16} /> },
        { id: 'Youtube', icon: <Youtube size={16} /> },
        { id: 'Other', icon: <Globe size={16} /> },
    ];

    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] pl-1">Platform</label>
            <div className="grid grid-cols-3 gap-3">
                {platforms.map((p) => (
                    <button
                        key={p.id}
                        onClick={() => setPlatform(p.id)}
                        className={`flex items-center justify-center gap-2 py-3 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all duration-300 ${platform === p.id
                            ? "bg-white border-white text-black shadow-lg shadow-white/10"
                            : "bg-black/30 border-white/10 text-gray-500 hover:border-white/20 hover:text-white"
                            }`}
                    >
                        <span className={platform === p.id ? "text-black" : "text-gray-600"}>{p.icon}</span>
                        <span>{p.id}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PlatformSelector;