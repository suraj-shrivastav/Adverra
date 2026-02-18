import { create } from "zustand";
import { api } from "../libs/api.js";

// const API_URL = import.meta.env.VITE_API_URL;

export const useImageGenerationStore = create((set, get) => ({
    // ======================
    // DATA STATE
    // ======================
    brands: [],
    campaigns: [],
    assets: [],
    historyImages: [],

    // ======================
    // UI STATE
    // ======================
    selectedBrandId: null,
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
        // { id: "minimalist_pro_prompt", name: "Minimalist Pro" },
        // { id: "neo_minimalist_prompt", name: "Neo Minimalist" },
        // { id: "risograph_vintage_prompt", name: "Risograph Vintage" },
        { id: "claymorphism_prompt", name: "Claymorphism" },
        { id: "retro_cel_shaded_prompt", name: "Retro Cel Shaded" },
        { id: "cyber_organic_prompt", name: "Cyber Organic" },
        { id: "hand_drawn_prompt", name: "Hand Drawn" },
        // { id: "hand_drawn_2_prompt", name: "Hand Drawn 2" },
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
            toneId: null,
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

    // ======================
    // HISTORY ACTIONS
    // ======================
    setHistoryModalOpen: (isOpen) => set({ isHistoryModalOpen: isOpen }),
    setResultModalOpen: (isOpen) => set({ isResultModalOpen: isOpen }),

    fetchHistory: async () => {
        try {
            set({ isHistoryLoading: true });
            const data = await api.get("/assets");
            // The backend returns { success: true, data: [...] } where data objects have img_url and created_at
            set({ historyImages: data.data || [] });
        } catch (err) {
            console.error("fetchHistory error:", err);
        } finally {
            set({ isHistoryLoading: false });
        }
    },

    // ======================
    // FORM ACTIONS
    // ======================
    updateFormData: (patch) =>
        set((state) => {
            // Check for nested updates
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
    // IMAGE UPLOADS
    // ======================
    uploadImageToServer: async (file) => {
        const formDataPayload = new FormData();
        formDataPayload.append("image", file);

        const response = await api.post("/assets/upload-reference", formDataPayload, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.file; // Expecting { uri, name, mimeType }
    },

    addUploadedImages: async (files) => {
        const { formData } = get();
        const currentCount = formData.uploadedImages.length;
        const remainingSlots = 4 - currentCount;

        if (remainingSlots <= 0) return;

        const filesToProcess = files.slice(0, remainingSlots);

        // 1. Optimistically add images with "uploading" state
        const newImages = filesToProcess.map((file) => ({
            id: crypto.randomUUID(),
            file,
            name: file.name,
            url: URL.createObjectURL(file), // Preview
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

        // 2. Upload in parallel
        await Promise.all(newImages.map(async (img) => {
            try {
                const geminiFile = await get().uploadImageToServer(img.file);

                set((state) => ({
                    formData: {
                        ...state.formData,
                        uploadedImages: state.formData.uploadedImages.map((i) =>
                            i.id === img.id
                                ? { ...i, geminiFile, isUploading: false }
                                : i
                        ),
                    },
                }));
            } catch (error) {
                console.error(`Upload failed for ${img.name}:`, error);
                set((state) => ({
                    formData: {
                        ...state.formData,
                        uploadedImages: state.formData.uploadedImages.map((i) =>
                            i.id === img.id
                                ? { ...i, isUploading: false, uploadError: true }
                                : i
                        ),
                    },
                }));
            }
        }));
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
    // API CALLS
    // ======================
    getAllBrands: async () => {
        try {
            set({ isLoadingBrands: true });

            // api interceptor handles auth
            const data = await api.get("/brands");

            set({
                brands: data.data.map((item) => ({
                    ...item.brand,
                    id: item.id,
                    userId: item.userId,
                    created_at: item.created_at,
                })),
            });
        } catch (err) {
            console.error("getAllBrands error:", err);
            set({ brands: [] });
        } finally {
            set({ isLoadingBrands: false });
        }
    },

    getAllCampaigns: async () => {
        try {
            const data = await api.get("/campaigns");
            set({ campaigns: data ?? [] });
        } catch (err) {
            console.error(err);
        }
    },

    getAllAssets: async () => {
        try {
            const data = await api.get("/assets");
            set({ assets: data ?? [] });
        } catch (err) {
            console.error(err);
        }
    },

    // ======================
    // GENERATION
    // ======================
    handleAssetsGeneration: async () => {
        try {
            set({ isGenerating: true });

            const { formData, selectedBrandId } = get();
            const brandData = get().getSelectedBrand();

            const referenceImages = formData.uploadedImages
                .filter((img) => img.geminiFile && !img.uploadError)
                .map((img) => ({
                    uri: img.geminiFile.uri,
                    mimeType: img.geminiFile.mimeType,
                }));

            // Clean uploaded images for payload (only strings if URLs, or just rely on backend handling)
            // But NormalizedInput expects { images: string[], logoUsage: ... } in references.
            // Current backend seems to expect URI/MimeType objects. 
            // We will stick to the existing pattern for references but map to NormalizedInput structure where possible.

            // Construct Payload adhering to NormalizedInput interface
            const payload = {
                platform: formData.platform,
                aspectRatio: formData.aspectRatio,

                objective: formData.objective,
                contentType: formData.contentType,
                emotion: formData.emotion,

                audience: formData.audience,

                message: formData.message,
                additionalPrompt: formData.additionalPrompt,

                visualStyle: formData.visualStyle,

                brandKit: brandData, // Sending full brand data as brandKit

                references: {
                    images: referenceImages, // Passing the array of {uri, mimeType} objects. Backend might need adjustment if it strictly expects strings.
                    logoUsage: formData.logoUsage,
                },

                // Keep flat simple fields if backend still relies on them temporarily or as fallback
                brandId: Number(selectedBrandId),
            };

            console.log("Generating with payload:", payload);

            const data = await api.post("/assets/generate", payload);

            if (data?.success && data.imageUrl) {
                set({
                    lastGeneratedImage: data.imageUrl,
                    isResultModalOpen: true
                });
                // Refresh history to include the new image
                get().fetchHistory();
            }

            return data;
        } catch (error) {
            console.error("Generation failed", error);
            throw error;
        } finally {
            set({ isGenerating: false });
        }
    },
}));
