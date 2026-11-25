import React from 'react';
import { Check } from 'lucide-react';

const VisualToneGrid = ({ tones, selectedToneId, onSelect, isLoading }) => {

    if (isLoading) {
        return (
            <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] pl-1">Visual Tone</label>
                <div className="grid grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="aspect-[4/5] bg-black/30 rounded-[2rem] animate-pulse border border-white/5" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] pl-1">Visual Tone</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {tones.map((tone) => {
                    const isSelected = selectedToneId === tone.id;
                    return (
                        <div
                            key={tone.id}
                            onClick={() => onSelect(tone.id)}
                            className={`
                group relative aspect-[4/5] rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-300 border-2
                ${isSelected
                                    ? 'border-white scale-[1.02] shadow-[0_0_30px_rgba(255,255,255,0.1)]'
                                    : 'border-transparent opacity-40 hover:opacity-100 hover:scale-[1.02] hover:border-white/20'
                                }
              `}
                        >
                            <img
                                src={`/${tone.id}.jpg`}
                                alt={tone.name}
                                className="w-full h-full object-cover"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

                            {/* Text Label */}
                            <div className="absolute bottom-4 left-0 right-0 text-center px-2">
                                <span className={`text-[10px] font-black uppercase tracking-widest block truncate ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                                    {tone.name}
                                </span>
                            </div>

                            {/* Selected Badge */}
                            {isSelected && (
                                <div className="absolute top-3 right-3 bg-white w-6 h-6 rounded-full flex items-center justify-center shadow-xl animate-in zoom-in-50 duration-300">
                                    <Check size={14} className="text-black stroke-[4px]" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default VisualToneGrid;