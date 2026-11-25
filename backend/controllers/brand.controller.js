import { supabase, SUPABASE_ENABLED } from "../config/supabase.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BRAND_API_URL = "https://api.brand.dev/v1/brand/retrieve";
const API_KEY = process.env.BRAND_DEV_API_KEY;

export const extractBrandData = async (req, res) => {
    try {
        const { domain } = req.body;

        if (!domain) {
            return res.status(400).json({ error: "Domain is required" });
        }

        let brandPayload;
        if (API_KEY) {
            console.log("Extracting brand data for:", domain);
            const response = await axios.get(BRAND_API_URL, {
                params: { domain },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${API_KEY}`,
                },
            });
            brandPayload = response.data.brand;
        } else {
            const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
            const brandName = cleanDomain.split('.')[0] || 'Brand';
            const title = brandName.charAt(0).toUpperCase() + brandName.slice(1);
            brandPayload = {
                title,
                domain: cleanDomain,
                description: `Brand workspace initialized for ${cleanDomain}.`,
                slogan: `${title} — Crafted for modern audiences.`,
                logos: [],
                colors: [
                    { hex: '#FFFFFF', name: 'Primary Light' },
                    { hex: '#111111', name: 'Primary Dark' },
                ],
                backdrops: [],
            };
        }

        const { error } = await supabase.from("brand_data").insert([
            {
                brand: brandPayload,
                userId: req.user?.id || 'local-dev-user',
            },
        ]);

        if (error) throw error;

        return res.status(200).json({
            message: "Brand data extracted successfully",
            data: brandPayload,
        });
    } catch (error) {
        console.error("extractBrandData error:", error?.response?.data || error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const addCustomBrandData = async (req, res) => {
    try {
        const { data } = req.body;
        const userId = req.user?.id || (!SUPABASE_ENABLED ? 'local-dev-user' : null);

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (!data) {
            return res.status(400).json({ error: "Data is required" });
        }

        const { error } = await supabase
            .from("brand_data")
            .insert([
                {
                    brand: data,
                    userId,
                    created_at: new Date(),
                },
            ]);

        if (error) throw error;

        return res.status(200).json({
            message: "Custom brand data saved successfully",
        });
    } catch (error) {
        console.error("addCustomBrandData error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getAllBrandData = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("brand_data")
            .select("*");

        if (error) throw error;

        const newData = (data || []).map((item) => ({
            id: item.id,
            brand: {
                title: item.brand?.title,
                description: item.brand?.description,
                logos: item.brand?.logos || [],
                colors: item.brand?.colors || [],
                slogan: item.brand?.slogan,
                backdrops: item.brand?.backdrops || [],
                domain: item.brand?.domain,
            },
        }));

        return res.status(200).json({ data: newData });
    } catch (error) {
        console.error("getAllBrandData error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
