import { create } from "zustand";
import {
    INITIAL_BRANDS,
    INITIAL_ASSETS,
    createBrandFromDomain,
    selectMockAssetImage,
} from "../libs/showcaseGenerators.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const useImageGenerationStore = create((set, get) => ({
    // ======================
    // DATA STATE
    // ======================
    brands: INITIAL_BRANDS,
    campaigns: [],
    assets: INITIAL_ASSETS,
    historyImages: INITIAL_ASSETS,

    // ======================
    // UI STATE
    // ======================
    selectedBrandId: INITIAL_BRANDS[0]?.id || null,
    isBrandModalOpen: false,
    newBrandUrl: "",
    isSubmittingBrand: false,

    isLoadingBrands: false,
    isGenerating: false,
    isHistoryLoading: false,
    isHistoryModalOpen: false,
    isResultModalOpen: false,
    lastGeneratedImage: null,

    // ======================
    // STATIC CONFIG
    // ======================
    visualTones: [
        { id: "claymorphism_prompt", name: "Claymorphism" },
        { id: "retro_cel_shaded_prompt", name: "Retro Cel Shaded" },
        { id: "cyber_organic_prompt", name: "Cyber Organic" },
        { id: "hand_drawn_prompt", name: "Hand Drawn" },
        { id: "three_d_prompt", name: "3D" },
        { id: "hyper_realistic_prompt", name: "Hyper Realistic" },
    ],

    // ======================
    // FORM STATE
    // ======================
    formData: {
        platform: "Instagram",
        aspectRatio: "1:1",

        // Objective
        objective: "Brand Awareness",
        contentType: "Product Photography",
        emotion: "Sophisticated",

        // Audience
        audience: {
            ageRange: "",
            mindset: ""
        },

        // Message
        message: {
            headline: "",
            supportingText: "",
            language: "English"
        },
        additionalPrompt: "",

        // Visual Style
        visualStyle: {
            toneId: "hyper_realistic_prompt",
            layout: "Minimal",
            brandExpression: "Balanced"
        },

        // References
        uploadedImages: [],
        logoUsage: "Corner",
    },

    // ======================
    // DERIVED STATE
    // ======================
    getSelectedBrand: () => {
        const { brands, selectedBrandId } = get();
        if (!selectedBrandId) return null;
        return brands.find((b) => b.id === Number(selectedBrandId)) || null;
    },

    // ======================
    // BRAND ACTIONS
    // ======================
    setSelectedBrandId: (id) => set({ selectedBrandId: id }),

    openBrandModal: () => set({ isBrandModalOpen: true }),
    closeBrandModal: () => set({ isBrandModalOpen: false }),

    setNewBrandUrl: (url) => set({ newBrandUrl: url }),
    setSubmittingBrand: (val) => set({ isSubmittingBrand: val }),

    addBrandFromUrl: async (domain) => {
        set({ isSubmittingBrand: true });
        try {
            await delay(800);
            const nextId = Date.now();
            const newBrand = createBrandFromDomain(domain, nextId);
            set((state) => ({
                brands: [newBrand, ...state.brands],
                selectedBrandId: newBrand.id,
                newBrandUrl: "",
                isBrandModalOpen: false,
            }));
            return newBrand;
        } finally {
            set({ isSubmittingBrand: false });
        }
    },

    // ======================
    // HISTORY ACTIONS
    // ======================
    setHistoryModalOpen: (isOpen) => set({ isHistoryModalOpen: isOpen }),
    setResultModalOpen: (isOpen) => set({ isResultModalOpen: isOpen }),

    fetchHistory: async () => {
        set({ isHistoryLoading: false });
        return get().historyImages;
    },

    // ======================
    // FORM ACTIONS
    // ======================
    updateFormData: (patch) =>
        set((state) => {
            if (patch.audience) {
                return {
                    formData: {
                        ...state.formData,
                        audience: { ...state.formData.audience, ...patch.audience }
                    }
                };
            }
            if (patch.message) {
                return {
                    formData: {
                        ...state.formData,
                        message: { ...state.formData.message, ...patch.message }
                    }
                };
            }
            if (patch.visualStyle) {
                return {
                    formData: {
                        ...state.formData,
                        visualStyle: { ...state.formData.visualStyle, ...patch.visualStyle }
                    }
                };
            }

            return {
                formData: { ...state.formData, ...patch },
            };
        }),

    // ======================
    // IMAGE UPLOADS (MOCKED FOR SHOWCASE)
    // ======================
    addUploadedImages: async (files) => {
        const { formData } = get();
        const currentCount = formData.uploadedImages.length;
        const remainingSlots = 4 - currentCount;

        if (remainingSlots <= 0) return;

        const filesToProcess = files.slice(0, remainingSlots);

        const newImages = filesToProcess.map((file) => ({
            id: crypto.randomUUID(),
            file,
            name: file.name,
            url: URL.createObjectURL(file),
            geminiFile: null,
            isUploading: true,
            uploadError: false,
        }));

        set((state) => ({
            formData: {
                ...state.formData,
                uploadedImages: [...state.formData.uploadedImages, ...newImages],
            },
        }));

        await Promise.all(
            newImages.map(async (img) => {
                await delay(450);
                set((state) => ({
                    formData: {
                        ...state.formData,
                        uploadedImages: state.formData.uploadedImages.map((i) =>
                            i.id === img.id
                                ? {
                                    ...i,
                                    geminiFile: {
                                        uri: `showcase://reference/${img.name}`,
                                        mimeType: img.file.type || "image/png",
                                        name: img.name,
                                    },
                                    isUploading: false,
                                }
                                : i
                        ),
                    },
                }));
            })
        );
    },

    removeUploadedImage: (id) =>
        set((state) => {
            const img = state.formData.uploadedImages.find((i) => i.id === id);
            if (img?.url) URL.revokeObjectURL(img.url);

            return {
                formData: {
                    ...state.formData,
                    uploadedImages: state.formData.uploadedImages.filter((i) => i.id !== id),
                },
            };
        }),

    resetUploadedImages: () =>
        set((state) => {
            state.formData.uploadedImages.forEach((img) => {
                if (img.url) URL.revokeObjectURL(img.url);
            });
            return {
                formData: { ...state.formData, uploadedImages: [] },
            };
        }),

    // ======================
    // SHOWCASE DATA FETCHERS
    // ======================
    getAllBrands: async () => get().brands,
    getAllCampaigns: async () => get().campaigns,
    getAllAssets: async () => get().assets,

    // ======================
    // GENERATION (MOCKED FOR SHOWCASE)
    // ======================
    handleAssetsGeneration: async () => {
        try {
            set({ isGenerating: true });

            await delay(1100);

            const { formData, historyImages } = get();
            const imageUrl = selectMockAssetImage(
                formData.visualStyle?.toneId,
                historyImages.length
            );

            const createdAsset = {
                id: Date.now(),
                img_url: imageUrl,
                created_at: new Date().toISOString(),
            };

            set((state) => ({
                lastGeneratedImage: imageUrl,
                isResultModalOpen: true,
                historyImages: [createdAsset, ...state.historyImages],
                assets: [createdAsset, ...state.assets],
            }));

            return {
                success: true,
                imageUrl,
            };
        } finally {
            set({ isGenerating: false });
        }
    },
}));
