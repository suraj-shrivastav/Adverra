import React from 'react';
import { X, Download, Share2, Sparkles, Check } from 'lucide-react';

const ResultModal = ({ isOpen, onClose, imageUrl, onDownload }) => {
    const [copied, setCopied] = React.useState(false);

    if (!isOpen || !imageUrl) return null;

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(imageUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy URL:', err);
        }
    };

    const handleDownloadClick = async () => {
        if (onDownload) {
            onDownload(imageUrl);
        } else {
            // Default download behavior
            try {
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const blobUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = `generated-image-${Date.now()}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(blobUrl);
            } catch (error) {
                console.error('Download failed:', error);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-4xl bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-500">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-20 p-2.5 bg-black/40 hover:bg-black/60 rounded-full text-gray-500 hover:text-white border border-white/5 transition-all group"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col md:flex-row h-full">
                    {/* Image Section */}
                    <div className="flex-1 bg-neutral-900 flex items-center justify-center p-8 md:p-12 relative group">
                        <div className="relative aspect-square w-full max-w-[500px] rounded-2xl overflow-hidden shadow-2xl border border-white/5">
                            <img
                                src={imageUrl}
                                alt="AI Generated Result"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* Decorative badge */}
                            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
                                <Sparkles size={12} className="text-white fill-white" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white">AI Generated</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions Section */}
                    <div className="w-full md:w-80 p-8 border-l border-white/5 flex flex-col justify-center gap-8 bg-white/[0.02]">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Magic Done.</h2>
                            <p className="text-gray-500 text-sm font-medium">Your brand asset is ready for the world. Preview and download it below.</p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleDownloadClick}
                                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-200 text-black px-6 py-4 rounded-2xl font-black transition-all active:scale-95 shadow-lg shadow-white/5"
                            >
                                <Download size={20} />
                                <span>DOWNLOAD ASSET</span>
                            </button>

                            <button
                                onClick={handleCopyUrl}
                                className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white px-6 py-4 rounded-2xl font-bold border border-white/10 transition-all active:scale-95"
                            >
                                {copied ? (
                                    <>
                                        <Check size={20} className="text-green-500" />
                                        <span className="text-green-500">LINK COPIED</span>
                                    </>
                                ) : (
                                    <>
                                        <Share2 size={20} />
                                        <span>SHARE LINK</span>
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                                Tip: You can find all your previous generations in the History tab.
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="mt-auto text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
                        >
                            Return to Canvas
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultModal;
