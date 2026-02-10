import { useEffect } from 'react';
import BrandSidebar from '../components/brand/BrandSidebar';
import BrandModal from '../components/brand/BrandModal';
import GenerationControls from '../components/brand/GenerationControls';
import { useImageGenerationStore } from '../store/useImageGenerationStore';

const ImageGeneration = () => {
    const {
        // data
        brands,
        getSelectedBrand,
        selectedBrandId,

        // ui + form
        formData,
        visualTones,
        isBrandModalOpen,
        newBrandUrl,
        isSubmittingBrand,
        isLoadingBrands,
        isGenerating,

        // actions
        getAllBrands,
        setSelectedBrandId,
        openBrandModal,
        closeBrandModal,
        setNewBrandUrl,
        setSubmittingBrand,
        updateFormData,
        addUploadedImages,
        removeUploadedImage,
        handleAssetsGeneration,
    } = useImageGenerationStore();

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
        }
    };

    const handleAddBrandSubmit = async () => {
        try {
            setSubmittingBrand(true);

            // TODO: replace with real API call
            await new Promise((res) => setTimeout(res, 1000));

            setNewBrandUrl('');
            closeBrandModal();
            await getAllBrands();
        } finally {
            setSubmittingBrand(false);
        }
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
        <div className="flex h-screen bg-black text-gray-200 font-sans overflow-hidden">
            <BrandSidebar
                brands={brands}
                selectedBrandId={selectedBrandId}
                selectedBrandData={selectedBrandData}
                onBrandChange={handleBrandChange}
                isLoading={isLoadingBrands}
            />

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

            <BrandModal
                isOpen={isBrandModalOpen}
                onClose={closeBrandModal}
                onSubmit={handleAddBrandSubmit}
                url={newBrandUrl}
                setUrl={setNewBrandUrl}
                isSubmitting={isSubmittingBrand}
            />
        </div>
    );
};

export default ImageGeneration;
