import React from 'react';

const AspectRatioSelector = ({ value, onChange }) => {
    const aspectRatios = [
        { id: '16:9', label: '16:9' },
        { id: '1:1', label: '1:1' },
        { id: '9:16', label: '9:16' },
    ];

    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] pl-1">
                Aspect Ratio
            </label>

            <div className="grid grid-cols-3 gap-3">
                {aspectRatios.map((ratio) => (
                    <button
                        key={ratio.id}
                        onClick={() => onChange(ratio.id)}
                        className={`
              py-3 rounded-2xl border text-xs font-black uppercase tracking-widest
              transition-all duration-300
              ${value === ratio.id
                                ? "bg-white border-white text-black shadow-lg shadow-white/10"
                                : "bg-black/30 border-white/10 text-gray-500 hover:border-white/20 hover:text-white"
                            }
            `}
                    >
                        {ratio.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AspectRatioSelector;