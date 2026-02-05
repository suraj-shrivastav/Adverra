import React from 'react';

const BrandModal = ({ isOpen, onClose, onSubmit, url, setUrl, isSubmitting }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-[#0f0f0f] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">

                {/* Modal Header */}
                <div className="p-5 border-b border-gray-800 bg-[#0f0f0f]">
                    <h3 className="text-lg font-semibold text-white">Add Brand via URL</h3>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs text-gray-500 font-medium ml-1">Website URL</label>
                        <input
                            autoFocus
                            className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-blue-500 outline-none transition-all"
                            placeholder="https://example.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            // Allow pressing Enter to submit
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && url && !isSubmitting) {
                                    onSubmit();
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-5 border-t border-gray-800 bg-[#0a0a0a] flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-900 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        disabled={!url || isSubmitting}
                        className="px-6 py-2.5 rounded-xl text-sm font-medium text-black bg-white hover:bg-gray-200 transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? 'Processing...' : 'Add Brand'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BrandModal;