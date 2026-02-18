import React from 'react';
import { X, Download, Calendar, Loader2, Image as ImageIcon } from 'lucide-react';

const HistoryModal = ({ isOpen, onClose, images, isLoading }) => {
    if (!isOpen) return null;

    const handleDownload = async (url, date) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `generated-image-${new Date(date).getTime()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-5xl max-h-[85vh] bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-300">

                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                            <ImageIcon className="text-white" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black tracking-tight text-white uppercase">Generation History</h2>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">Your previous AI creations</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors group"
                    >
                        <X className="text-gray-400 group-hover:text-white" size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                    {isLoading ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="animate-spin text-white/50" size={40} />
                            <p className="text-gray-500 font-medium tracking-wide">Fetching your history...</p>
                        </div>
                    ) : images.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                                <ImageIcon className="text-gray-700" size={32} />
                            </div>
                            <p className="text-gray-500 font-medium tracking-wide">No images generated yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {images.map((img, idx) => (
                                <div
                                    key={img.id || idx}
                                    className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all hover:border-white/30 hover:scale-[1.02]"
                                >
                                    {/* Image Container */}
                                    <div className="aspect-square w-full overflow-hidden bg-white/5">
                                        <img
                                            src={img.img_url}
                                            alt="Generated history"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                            <button
                                                onClick={() => handleDownload(img.img_url, img.created_at)}
                                                className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-90 transition-transform shadow-lg"
                                                title="Download Image"
                                            >
                                                <Download size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Meta Info */}
                                    <div className="p-4 flex items-center justify-between bg-black/40 backdrop-blur-md">
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <Calendar size={14} />
                                            <span className="text-xs font-medium">
                                                {new Date(img.created_at).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">
                                            #{images.length - idx}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer Tip */}
                <div className="p-4 bg-white/[0.02] border-t border-white/5 text-center">
                    <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em] font-bold">
                        Tip: Hover over an image to download it directly
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HistoryModal;
