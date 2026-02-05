import { create } from 'zustand';

const API_URL = import.meta.env.VITE_API_URL;

export const useDataStore = create((set) => ({
    brands: [],
    campaigns: [],
    assets: [],

    getAllBrands: async () => {
        try {
            const res = await fetch(`${API_URL}/brands`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!res.ok) throw new Error('Failed to fetch brands');

            const data = await res.json();
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
            const res = await fetch(`${API_URL}/campaigns`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            set({ campaigns: data ?? [] });
        } catch (error) {
            console.error(error);
        }
    },

    getAllAssets: async () => {
        try {
            const res = await fetch(`${API_URL}/assets`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            set({ assets: data ?? [] });
        } catch (error) {
            console.error(error);
        }
    },

    handleAssetsGeneration: async (fromData) => {
        console.log("handleAssetsGeneration: ", fromData);
        try {
            const res = await fetch(`${API_URL}/assets/generate`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                data: fromData
            })
            console.log(res);
        } catch (error) {
            console.error(error);
        }
    }
}));
