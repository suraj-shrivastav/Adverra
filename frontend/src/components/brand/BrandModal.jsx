import React from 'react';

const BrandModal = ({ isOpen, onClose, onSubmit, url, setUrl, isSubmitting }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[40px] shadow-[0_32px_120px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                {/* Glow Effect */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/5 blur-[80px] rounded-full pointer-events-none" />

                {/* Modal Header */}
                <div className="p-8 pb-4 border-b border-white/5 relative">
                    <h3 className="text-2xl font-black text-white tracking-tighter font-space uppercase">Add Brand Workspace</h3>
                    <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Initialize through domain extraction</p>
                </div>

                {/* Modal Body */}
                <div className="p-8 space-y-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] pl-1">Network Address</label>
                        <input
                            autoFocus
                            className="w-full bg-black/40 border border-white/5 hover:border-white/10 rounded-2xl px-6 py-4 text-sm text-white placeholder:text-gray-800 focus:border-white/20 outline-none transition-all shadow-inner font-outfit"
                            placeholder="https://brand-domain.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && url && !isSubmitting) {
                                    onSubmit();
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-8 pt-4 flex flex-col gap-3 relative">
                    <button
                        onClick={onSubmit}
                        disabled={!url || isSubmitting}
                        className="w-full py-4 rounded-2xl text-sm font-black uppercase tracking-widest text-black bg-white hover:bg-gray-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed font-space shadow-[0_8px_32px_rgba(255,255,255,0.1)]"
                    >
                        {isSubmitting ? 'Extracting Identity...' : 'Initialize Brand'}
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-gray-700 hover:text-white transition-colors font-space"
                    >
                        Cancel Connection
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BrandModal;