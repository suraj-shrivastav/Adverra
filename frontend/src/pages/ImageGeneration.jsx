import React, { useState, useEffect } from 'react';
import BrandSidebar from '../components/brand/BrandSidebar';
import BrandModal from '../components/brand/BrandModal';
import GenerationControls from '../components/brand/GenerationControls';
import { useDataStore } from '../store/useDataStore';

const ImageGenerationUI = () => {
    const { brands, getAllBrands, handleAssetsGeneration } = useDataStore();

    // --- State ---
    const [visualTones, setVisualTones] = useState([]);
    const [selectedBrandId, setSelectedBrandId] = useState('');
    const [selectedBrandData, setSelectedBrandData] = useState(null);

    const [controlFormData, setControlFormData] = useState({
        platform: 'Instagram',
        aspectRatio: '1:1',
        additionalContext: '',
        targetAudience: '',
        textOverlay: '',
        uploadedImages: [],
        selectedToneId: null,
    });

    const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
    const [newBrandUrl, setNewBrandUrl] = useState('');
    const [isSubmittingBrand, setIsSubmittingBrand] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);

    // --- Fetch brands on mount ---
    useEffect(() => {
        const fetchBrands = async () => {
            setIsLoadingData(true);
            await getAllBrands();
            setIsLoadingData(false);
            console.log("brands: ", brands);
        };

        fetchBrands();
    }, [getAllBrands]);

    // --- Update selected brand data ---
    useEffect(() => {
        if (!selectedBrandId) {
            setSelectedBrandData(null);
            return;
        }
        console.log(brands);

        const brand = brands.find(
            b => b.id === Number(selectedBrandId)
        );
        console.log("Brand is: ", brand, " selected it is: ", selectedBrandId);
        setSelectedBrandData(brand || null);
    }, [selectedBrandId, brands]);

    // --- Handlers ---
    const handleBrandChange = (e) => {
        const value = e.target.value;
        if (value === 'ADD_NEW_URL') {
            setIsBrandModalOpen(true);
        } else {
            setSelectedBrandId(value);
        }
    };

    const handleAddBrandSubmit = async () => {
        try {
            setIsSubmittingBrand(true);

            // TODO: replace with real API call
            await new Promise(res => setTimeout(res, 1000));

            setNewBrandUrl('');
            setIsBrandModalOpen(false);
        } finally {
            setIsSubmittingBrand(false);
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        setControlFormData(prev => {
            const currentImages = prev.uploadedImages || [];
            const remainingSlots = 4 - currentImages.length;
            if (remainingSlots <= 0) return prev;

            const filesToAdd = files.slice(0, remainingSlots);

            const newImages = filesToAdd.map(file => ({
                id: crypto.randomUUID(),
                url: URL.createObjectURL(file),
                file,
                name: file.name,
            }));

            return {
                ...prev,
                uploadedImages: [...currentImages, ...newImages],
            };
        });

        e.target.value = null;
    };

    const removeImage = (id) => {
        setControlFormData(prev => {
            const imageToRemove = prev.uploadedImages.find(img => img.id === id);
            if (imageToRemove?.url) {
                URL.revokeObjectURL(imageToRemove.url);
            }

            return {
                ...prev,
                uploadedImages: prev.uploadedImages.filter(img => img.id !== id),
            };
        });
    };

    const handleGeneration = async (controlFormData) => {
        console.log("Generation: ", controlFormData);
        handleAssetsGeneration(controlFormData);
    }


    // --- Cleanup object URLs on unmount ---
    useEffect(() => {
        return () => {
            controlFormData.uploadedImages.forEach(img => {
                URL.revokeObjectURL(img.url);
            });
        };
    }, [controlFormData.uploadedImages]);

    return (
        <div className="flex h-screen bg-black text-gray-200 font-sans selection:bg-blue-500/30 overflow-hidden">
            <BrandSidebar
                brands={brands}
                selectedBrandId={selectedBrandId}
                onBrandChange={handleBrandChange}
                selectedBrandData={selectedBrandData}
            />

            <GenerationControls
                formData={controlFormData}
                setFormData={setControlFormData}
                visualTones={visualTones}
                isLoadingData={isLoadingData}
                handlers={{
                    onImageUpload: handleImageUpload,
                    onImageRemove: removeImage,
                    onGenerate: handleGeneration
                }}
            />

            <BrandModal
                isOpen={isBrandModalOpen}
                onClose={() => setIsBrandModalOpen(false)}
                onSubmit={handleAddBrandSubmit}
                url={newBrandUrl}
                setUrl={setNewBrandUrl}
                isSubmitting={isSubmittingBrand}
            />
        </div>
    );
};

export default ImageGenerationUI;
