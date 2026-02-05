import React from 'react';
import { MapPin, Linkedin, Facebook, Instagram, Globe, Twitter } from 'lucide-react';

const BrandCard = ({ brandData }) => {
    console.log("brandData", brandData);
    if (!brandData) return null;

    const getSocialIcon = (type) => {
        switch (type) {
            case 'linkedin': return <Linkedin size={14} />;
            case 'x': return <Twitter size={14} />;
            case 'facebook': return <Facebook size={14} />;
            case 'instagram': return <Instagram size={14} />;
            default: return <Globe size={14} />;
        }
    };

    return (
        <div className="relative bg-[#0b0b0b] border border-gray-800 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-2 max-h-[calc(100vh-220px)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Gradient Header */}
            <div
                className="absolute top-0 inset-x-0 h-16 opacity-20 pointer-events-none sticky top-0 z-0"
                style={{
                    background: `linear-gradient(to bottom, ${brandData.colors?.[0]?.hex || '#3b82f6'}, transparent)`
                }}
            />

            <div className="p-6 relative z-10 space-y-6">
                {/* Header */}
                <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 overflow-hidden shrink-0">
                        {brandData.logos?.find(l => l.type === 'icon')?.url ? (
                            <img src={brandData.logos.find(l => l.type === 'icon').url} alt="icon" className="w-10 h-10 object-contain" />
                        ) : (
                            <span className="font-bold text-xl text-white">{brandData.title?.charAt(0)}</span>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold text-white leading-tight">{brandData.title}</h2>
                        <a href={`https://${brandData.domain}`} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-0.5">
                            {brandData.domain}
                        </a>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                    <div className="space-y-1">
                        <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">About</p>
                        <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">{brandData.description}</p>
                    </div>
                    {brandData.slogan && (
                        <div className="space-y-1">
                            <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">Slogan</p>
                            <p className="text-sm text-gray-400 italic">"{brandData.slogan}"</p>
                        </div>
                    )}
                </div>

                <div className="h-px bg-gray-800 w-full" />

                {/* Colors */}
                {brandData.colors?.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-500">Brand Palette</p>
                        <div className="flex gap-2 flex-wrap">
                            {brandData.colors.map((color, i) => (
                                <div key={i} className="group relative">
                                    <div className="w-8 h-8 rounded-full border border-white/10 shadow-sm cursor-help" style={{ backgroundColor: color.hex }} />
                                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-xs px-2 py-1 rounded whitespace-nowrap z-20 border border-gray-700">
                                        {color.name} ({color.hex})
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Logos Grid */}
                {brandData.logos?.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-500">Logos</p>
                        <div className="grid grid-cols-3 gap-2">
                            {brandData.logos.map((logo, i) => (
                                <div key={i} className="bg-[#1a1a1a] hover:bg-[#222] border border-gray-800 rounded-lg p-2 flex items-center justify-center h-16 transition-colors">
                                    <img src={logo.url} alt="logo" className="max-w-full max-h-full object-contain opacity-90" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Socials & Location */}
                <div className="flex flex-wrap gap-3 pt-2">
                    {brandData.socials?.map((social, i) => (
                        <a key={i} href={social.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1a1a1a] border border-gray-800 text-xs text-gray-400 hover:text-white hover:border-gray-600 transition-all">
                            {getSocialIcon(social.type)}
                            <span className="capitalize">{social.type}</span>
                        </a>
                    ))}
                    {brandData.address?.city && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1a1a1a] border border-gray-800 text-xs text-gray-400">
                            <MapPin size={14} />
                            <span>{brandData.address.city}, {brandData.address.state_code}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BrandCard;