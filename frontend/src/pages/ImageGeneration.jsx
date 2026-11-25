import { useEffect, useRef, useState } from 'react';
import BrandSidebar from '../components/brand/BrandSidebar';
import BrandModal from '../components/brand/BrandModal';
import GenerationControls from '../components/brand/GenerationControls';
import HistoryModal from '../components/brand/HistoryModal';
import ResultModal from '../components/brand/ResultModal';
import { useImageGenerationStore } from '../store/useImageGenerationStore';
import { useWalkthrough } from '../context/WalkthroughContext';
import { WALKTHROUGH_PRESETS } from '../libs/showcaseGenerators.js';
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
    const { isActive, mode, stepIndex } = useWalkthrough();
    const addedWalkthroughAssetRef = useRef(false);
    const wasWalkthroughImageRef = useRef(false);

    // Get the selected brand data
    const selectedBrandData = getSelectedBrand();

    useEffect(() => {
        getAllBrands();
    }, [getAllBrands]);

    useEffect(() => {
        if (!isActive || mode !== 'image') {
            if (wasWalkthroughImageRef.current) {
                wasWalkthroughImageRef.current = false;
                useImageGenerationStore.setState({ isGenerating: false });
            }
            return;
        }

        wasWalkthroughImageRef.current = true;
        const preset = WALKTHROUGH_PRESETS.image;
        const patch = preset.formPatch;

        if (stepIndex === 0) {
            addedWalkthroughAssetRef.current = false;
            setSelectedBrandId(preset.brandId);
            useImageGenerationStore.setState({
                isGenerating: false,
                isResultModalOpen: false,
                isHistoryModalOpen: false,
            });
        } else if (stepIndex === 1) {
            setSelectedBrandId(preset.brandId);
            updateFormData({
                platform: patch.platform,
                aspectRatio: patch.aspectRatio,
                objective: patch.objective,
                contentType: patch.contentType,
                emotion: patch.emotion,
                additionalPrompt: patch.additionalPrompt,
                logoUsage: patch.logoUsage,
            });
            updateFormData({ audience: patch.audience });
            updateFormData({ message: patch.message });
            useImageGenerationStore.setState({
                isGenerating: false,
                isResultModalOpen: false,
                isHistoryModalOpen: false,
            });
        } else if (stepIndex === 2) {
            setSelectedBrandId(preset.brandId);
            updateFormData({ visualStyle: patch.visualStyle });
            useImageGenerationStore.setState({
                isGenerating: false,
                isResultModalOpen: false,
                isHistoryModalOpen: false,
            });
        } else if (stepIndex === 3) {
            useImageGenerationStore.setState({
                isGenerating: true,
                isResultModalOpen: false,
                isHistoryModalOpen: false,
            });
        } else if (stepIndex === 4) {
            useImageGenerationStore.setState((state) => {
                const alreadyInHistory = state.historyImages.some(
                    (img) => img.id === 999101
                );
                const walkthroughAsset = {
                    id: 999101,
                    img_url: preset.outputImage,
                    created_at: new Date().toISOString(),
                };
                return {
                    isGenerating: false,
                    lastGeneratedImage: preset.outputImage,
                    isResultModalOpen: true,
                    isHistoryModalOpen: false,
                    historyImages:
                        alreadyInHistory || addedWalkthroughAssetRef.current
                            ? state.historyImages
                            : [walkthroughAsset, ...state.historyImages],
                };
            });
            addedWalkthroughAssetRef.current = true;
        }
    }, [isActive, mode, stepIndex, setSelectedBrandId, updateFormData]);

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
                pipelineInfo={{
                    title: 'Pipeline & Engineered Prompt',
                    model: 'Gemini 3 Pro Image',
                    steps: [
                        `Brand Kit (${selectedBrandData?.title || 'Lumina Audio'})`,
                        `Platform Rules (${formData.platform || 'Instagram'} · ${formData.aspectRatio || '4:5'})`,
                        `Visual Tone (${formData.visualStyle?.toneId?.replace('_prompt', '').replace(/_/g, ' ') || '3D'})`,
                        '4K Cloud Asset Render',
                    ],
                    promptPreview: [
                        `Brand: ${selectedBrandData?.title || 'Lumina Audio'} — "${selectedBrandData?.slogan || ''}"`,
                        `Format: ${formData.platform || 'Instagram'} (${formData.aspectRatio || '4:5'}) · Objective: ${formData.objective || 'Conversion'}`,
                        `Headline: "${formData.message?.headline || 'PURE SOUND. ZERO NOISE.'}"`,
                        formData.additionalPrompt ? `Art Direction: ${formData.additionalPrompt}` : null,
                    ]
                        .filter(Boolean)
                        .join('\n'),
                }}
            />
        </div>
    );
};

export default ImageGeneration;
