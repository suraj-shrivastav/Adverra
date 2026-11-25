import { create } from 'zustand';
import {
    INITIAL_BRANDS,
    INITIAL_CAMPAIGNS,
    INITIAL_ASSETS,
    buildInitialAudios,
} from '../libs/showcaseGenerators.js';

export const useDataStore = create((set, get) => ({
    brands: INITIAL_BRANDS,
    campaigns: INITIAL_CAMPAIGNS,
    assets: INITIAL_ASSETS,
    audios: buildInitialAudios(),

    getAllBrands: async () => get().brands,

    getAllCampaigns: async () => get().campaigns,

    addCampaign: (campaignRecord) =>
        set((state) => ({
            campaigns: [campaignRecord, ...state.campaigns],
        })),

    getAllAssets: async () => get().assets,

    addAudio: (audioRecord) =>
        set((state) => ({
            audios: [audioRecord, ...state.audios],
        })),

    getAllAudios: async () => get().audios,
}));
