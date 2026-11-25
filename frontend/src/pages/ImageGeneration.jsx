import { useEffect, useState } from 'react';
import BrandSidebar from '../components/brand/BrandSidebar';
import BrandModal from '../components/brand/BrandModal';
import GenerationControls from '../components/brand/GenerationControls';
import HistoryModal from '../components/brand/HistoryModal';
import ResultModal from '../components/brand/ResultModal';
import { useImageGenerationStore } from '../store/useImageGenerationStore';
import { Menu, X } from 'lucide-react';

const ImageGeneration = () => {
    const {
        // data
        brands,
        getSelectedBrand,
        selectedBrandId,
        historyImages,

        // ui + form
        formData,
        visualTones,
        isBrandModalOpen,
        newBrandUrl,
        isSubmittingBrand,
        isLoadingBrands,
        isGenerating,
        isHistoryLoading,
        isHistoryModalOpen,
        isResultModalOpen,
        lastGeneratedImage,

        // actions
        getAllBrands,
        setSelectedBrandId,
        openBrandModal,
        closeBrandModal,
        setNewBrandUrl,
        addBrandFromUrl,
        updateFormData,
        addUploadedImages,
        removeUploadedImage,
        handleAssetsGeneration,
        setHistoryModalOpen,
        setResultModalOpen,
    } = useImageGenerationStore();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Get the selected brand data
    const selectedBrandData = getSelectedBrand();

    useEffect(() => {
        getAllBrands();
    }, [getAllBrands]);

    // ------------------
    // Handlers
    // ------------------
    const handleBrandChange = (e) => {
        const value = e.target.value;
        if (value === 'ADD_NEW_URL') {
            openBrandModal();
        } else {
            setSelectedBrandId(value);
            setIsSidebarOpen(false);
        }
    };

    const handleAddBrandSubmit = async () => {
        if (!newBrandUrl.trim()) return;
        await addBrandFromUrl(newBrandUrl);
    };

    const handleImageUpload = (e) => {
        addUploadedImages(Array.from(e.target.files));
        e.target.value = null;
    };

    const handleGenerate = async () => {
        try {
            await handleAssetsGeneration();
        } catch (err) {
            console.error('Generation failed:', err);
        }
    };

    // ------------------
    // Render
    // ------------------
    return (
        <div className="flex h-full bg-black text-gray-200 font-outfit overflow-hidden relative">

            {/* Mobile sidebar toggle */}
            <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-40 p-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all backdrop-blur-md"
            >
                <Menu size={20} />
            </button>

            {/* Sidebar overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar wrapper */}
            <div className={`
                fixed lg:relative z-50 h-full
                transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Mobile close button */}
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="lg:hidden absolute top-4 right-4 z-50 p-2 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
                >
                    <X size={18} />
                </button>

                <BrandSidebar
                    brands={brands}
                    selectedBrandId={selectedBrandId}
                    selectedBrandData={selectedBrandData}
                    onBrandChange={handleBrandChange}
                    title='Image Generation'
                    isLoading={isLoadingBrands}
                />
            </div>

            <div className="flex-1 flex flex-col h-full overflow-hidden relative">

                {/* Controls Area */}
                <div className="flex-1 overflow-hidden">
                    <GenerationControls
                        formData={formData}
                        setFormData={updateFormData}
                        visualTones={visualTones}
                        isLoadingData={isLoadingBrands}
                        isGenerating={isGenerating}
                        handlers={{
                            onImageUpload: handleImageUpload,
                            onImageRemove: removeUploadedImage,
                            onGenerate: handleGenerate,
                        }}
                    />
                </div>
            </div>

            <BrandModal
                isOpen={isBrandModalOpen}
                onClose={closeBrandModal}
                onSubmit={handleAddBrandSubmit}
                url={newBrandUrl}
                setUrl={setNewBrandUrl}
                isSubmitting={isSubmittingBrand}
            />

            <HistoryModal
                isOpen={isHistoryModalOpen}
                onClose={() => setHistoryModalOpen(false)}
                images={historyImages}
                isLoading={isHistoryLoading}
            />

            <ResultModal
                isOpen={isResultModalOpen}
                onClose={() => setResultModalOpen(false)}
                imageUrl={lastGeneratedImage}
            />
        </div>
    );
};

export default ImageGeneration;
