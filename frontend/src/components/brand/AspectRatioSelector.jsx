import React from 'react';

const AspectRatioSelector = ({ value, onChange }) => {
    const aspectRatios = [
        { id: '16:9', label: '16:9' },
        { id: '1:1', label: '1:1' },
        { id: '9:16', label: '9:16' },
    ];

    return (
        <div className="space-y-3">
            <label className="text-sm font-medium text-gray-300">
                Aspect Ratio
            </label>

            <div className="grid grid-cols-3 gap-3">
                {aspectRatios.map((ratio) => (
                    <button
                        key={ratio.id}
                        onClick={() => onChange(ratio.id)}
                        className={`
              py-3 rounded-xl border text-sm font-medium
              transition-all duration-200
              ${value === ratio.id
                                ? "bg-[#141414] border-gray-500 text-gray-200 shadow-sm"
                                : "bg-[#111] border-gray-800 text-gray-500 hover:border-gray-700 hover:text-gray-400"
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