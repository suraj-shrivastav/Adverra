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
            <label className="text-sm font-medium text-gray-300">Platform</label>
            <div className="grid grid-cols-3 gap-3">
                {platforms.map((p) => (
                    <button
                        key={p.id}
                        onClick={() => setPlatform(p.id)}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${platform === p.id
                            ? "bg-[#141414] border-gray-500 text-gray-200"
                            : "bg-[#111] border-gray-800 text-gray-500 hover:border-gray-700"
                            }`}
                    >
                        <span className="text-gray-400">{p.icon}</span>
                        <span>{p.id}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PlatformSelector;