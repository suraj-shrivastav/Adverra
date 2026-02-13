import React from 'react';
import { Plus, X, Loader2, AlertCircle } from 'lucide-react';

import PremiumSelect from './PremiumSelect';

const ReferenceUploader = ({ uploadedImages, onUpload, onRemove, logoUsage, onLogoUsageChange }) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] pl-1">
                    Reference Materials <span className="text-gray-800 text-[10px] ml-2">({uploadedImages.length}/4)</span>
                </label>
            </div>

            <PremiumSelect
                label="Logo Usage"
                value={logoUsage}
                onChange={onLogoUsageChange}
                options={[
                    { value: "Corner", label: "Corner" },
                    { value: "Center", label: "Center" },
                    { value: "None", label: "None" },
                ]}
            />

            <div className="flex gap-3 flex-wrap">
                {uploadedImages.length < 4 && (
                    <div className="relative">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={onUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        <div className="w-24 h-24 bg-black/30 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-600 hover:border-white/20 hover:text-white transition-all group">
                            <Plus size={20} className="group-hover:scale-110 transition-transform" />
                            <span className="text-[9px] uppercase font-black tracking-widest">Upload</span>
                        </div>
                    </div>
                )}

                {uploadedImages.map((img) => (
                    <div key={img.id} className="relative w-24 h-24 rounded-2xl overflow-hidden group border border-white/10 animate-in fade-in zoom-in duration-300">
                        <img src={img.url} alt="preview" className="w-full h-full object-cover" />

                        {/* Upload status overlay */}
                        {img.isUploading && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <Loader2 size={20} className="animate-spin text-white" />
                            </div>
                        )}

                        {/* Error indicator */}
                        {img.uploadError && (
                            <div className="absolute inset-0 bg-red-900/60 flex items-center justify-center">
                                <AlertCircle size={20} className="text-red-300" />
                            </div>
                        )}

                        {/* Success indicator (green border) */}
                        {img.geminiFile && !img.isUploading && (
                            <div className="absolute inset-0 border-2 border-green-500 rounded-xl pointer-events-none" />
                        )}

                        <button
                            onClick={() => onRemove(img.id)}
                            className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
                        >
                            <X size={12} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReferenceUploader;