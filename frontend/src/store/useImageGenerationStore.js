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

    // ======================
    // UI STATE
    // ======================
    selectedBrandId: null,
    isBrandModalOpen: false,
    newBrandUrl: "",
    isSubmittingBrand: false,

    isLoadingBrands: false,
    isGenerating: false,

    // ======================
    // STATIC CONFIG
    // ======================
    visualTones: [
        // { id: "minimalist_pro_prompt", name: "Minimalist Pro" },
        // { id: "neo_minimalist_prompt", name: "Neo Minimalist" },
        { id: "risograph_vintage_prompt", name: "Risograph Vintage" },
        { id: "claymorphism_prompt", name: "Claymorphism" },
        { id: "luxury_noir_prompt", name: "Luxury Noir" },
        { id: "cyber_organic_prompt", name: "Cyber Organic" },
        { id: "hand_drawn_prompt", name: "Hand Drawn" },
        { id: "hand_drawn_2_prompt", name: "Hand Drawn 2" },
        { id: "three_d_prompt", name: "3D" },
        { id: "saas_glass_prompt", name: "Saas Glass" },
    ],

    // ======================
    // FORM STATE
    // ======================
    formData: {
        platform: "Instagram",
        aspectRatio: "1:1",
        additionalContext: "",
        targetAudience: "",
        textOverlay: "",
        selectedToneId: null,
        uploadedImages: [],
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
    // FORM ACTIONS
    // ======================
    updateFormData: (patch) =>
        set((state) => ({
            formData: { ...state.formData, ...patch },
        })),

    // ======================
    // IMAGE UPLOADS
    // ======================
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

            const brandLogos =
                brandData?.logos?.map((logo) => ({
                    url: logo.url,
                    type: logo.type,
                })) || [];

            const payload = {
                platform: formData.platform,
                aspectRatio: formData.aspectRatio,
                additionalContext: formData.additionalContext,
                targetAudience: formData.targetAudience,
                textOverlay: formData.textOverlay,
                selectedToneId: formData.selectedToneId,
                brandId: Number(selectedBrandId),
                brandData,
                referenceImages,
                brandLogos,
            };

            const data = await api.post("/assets/generate", payload);
            return data;
        } catch (error) {
            console.error("Generation failed", error);
            throw error;
        } finally {
            set({ isGenerating: false });
        }
    },
}));
