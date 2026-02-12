import { create } from 'zustand';
import { api } from '../libs/api.js';

export const useDataStore = create((set) => ({
    brands: [],
    campaigns: [],
    assets: [],
    audios: [],

    getAllBrands: async () => {
        try {
            // api interceptor returns response.data directly
            const data = await api.get("/brands");

            set({
                brands: data.data.map(item => ({
                    ...item.brand,
                    id: item.id,
                    userId: item.userId,
                    created_at: item.created_at,
                }))
            });
            console.log("brands: ", data.data);
        } catch (error) {
            console.error('getAllBrands error:', error);
            set({ brands: [] });
        }
    },

    getAllCampaigns: async () => {
        try {
            const data = await api.get("/campaigns");
            set({ campaigns: data ?? [] });
        } catch (error) {
            console.error('getAllCampaigns error:', error);
        }
    },

    getAllAssets: async () => {
        try {
            const data = await api.get("/assets");
            set({ assets: data ?? [] });
        } catch (error) {
            console.error('getAllAssets error:', error);
        }
    },

    handleAssetsGeneration: async (formData) => {
        try {
            const data = await api.post("/assets/generate", formData);
            return data;
        } catch (error) {
            console.error('handleAssetsGeneration error:', error);
            throw error;
        }
    },

    getAllAudios: async () => {
        try {
            const data = await api.get("/audio");
            set({ audios: data ?? [] });
        } catch (error) {
            console.error('getAllAudios error:', error);
        }
    }
}));
