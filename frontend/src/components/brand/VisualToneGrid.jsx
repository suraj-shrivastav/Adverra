import React from 'react';
import { Check } from 'lucide-react';

const VisualToneGrid = ({ tones, selectedToneId, onSelect, isLoading }) => {

    if (isLoading) {
        return (
            <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300">Visual Tone</label>
                <div className="grid grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="aspect-[4/5] bg-[#111] rounded-2xl animate-pulse border border-gray-800" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">Visual Tone</label>
            <div className="grid grid-cols-4 gap-4">
                {tones.map((tone) => {
                    const isSelected = selectedToneId === tone.id;
                    return (
                        <div
                            key={tone.id}
                            onClick={() => onSelect(tone.id)}
                            className={`
                group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border
                ${isSelected
                                    ? 'border-transparent ring-2 ring-white scale-[1.02]'
                                    : 'border-transparent opacity-60 hover:opacity-100 hover:scale-[1.02] hover:border-gray-700'
                                }
              `}
                        >
                            <img
                                src={tone.url}
                                alt={tone.name}
                                className="w-full h-full object-cover"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

                            {/* Text Label */}
                            <div className="absolute bottom-3 left-0 right-0 text-center px-1">
                                <span className={`text-[10px] sm:text-xs font-medium tracking-wide block truncate ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                    {tone.name}
                                </span>
                            </div>

                            {/* Selected Badge */}
                            {isSelected && (
                                <div className="absolute top-2 right-2 bg-blue-500 w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                                    <Check size={12} className="text-white stroke-[3px]" />
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