import React from 'react';
import { X, Loader2, History, ChevronLeft } from 'lucide-react';

const HistoryModal = ({
    isOpen,
    onClose,
    items,
    onItemClick,
    selectedItem,
    setSelectedItem,
    renderListItem,
    renderDetails,
    icon,
    title = "History",
    isLoading = false,
    emptyMessage = "No history found."
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-xl">
            <div className={`bg-black border border-white/20 rounded-2xl sm:rounded-[2.5rem] ${selectedItem
                ? 'w-full max-w-6xl h-[95vh] sm:h-[90vh]'
                : 'w-full max-w-xl h-[95vh] sm:max-h-[85vh]'
                } overflow-hidden shadow-2xl flex flex-col`}>
                <div className="p-4 sm:p-8 md:p-10 h-full flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8 flex-shrink-0">
                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                            {selectedItem && (
                                <button
                                    onClick={() => setSelectedItem(null)}
                                    className="p-2 sm:p-2.5 bg-white/5 hover:bg-white/10 rounded-xl sm:rounded-2xl text-gray-400 hover:text-white transition-all border border-white/10 flex-shrink-0"
                                >
                                    <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
                                </button>
                            )}
                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                {icon && (
                                    <div className="p-1.5 sm:p-2 rounded-lg bg-white/10 border border-white/20 text-gray-300 flex-shrink-0">
                                        {React.cloneElement(icon, {
                                            size: typeof window !== 'undefined' && window.innerWidth < 640 ? 18 : 20
                                        })}
                                    </div>
                                )}
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white truncate">
                                    {selectedItem ? (typeof title === 'string' ? "Details" : title) : title}
                                </h2>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 sm:p-2.5 bg-white/5 hover:bg-white/10 rounded-xl sm:rounded-2xl text-gray-400 hover:text-white transition-all ml-2 sm:ml-4 border border-white/10 flex-shrink-0"
                        >
                            <X size={18} className="sm:w-5 sm:h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
                        {isLoading ? (
                            <div className="h-64 flex flex-col items-center justify-center space-y-4">
                                <Loader2 size={32} className="animate-spin text-gray-400" />
                                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Loading...</p>
                            </div>
                        ) : selectedItem ? (
                            <div className="h-full">
                                {renderDetails(selectedItem)}
                            </div>
                        ) : items && items.length > 0 ? (
                            <div className="space-y-2 sm:space-y-3 pr-1 sm:pr-2 pb-4">
                                {items.map((item) => (
                                    <div key={item.id || item._id} onClick={() => onItemClick(item)}>
                                        {renderListItem(item)}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-64 flex flex-col items-center justify-center text-gray-400 space-y-4 px-4">
                                <History size={48} className="opacity-30" />
                                <p className="text-sm sm:text-base text-center whitespace-pre-line">{emptyMessage}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoryModal;