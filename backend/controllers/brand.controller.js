import { supabase } from "../config/supabase.js";
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

        console.log("Extracting brand data for:", domain);
        // return;
        const response = await axios.get(BRAND_API_URL, {
            params: { domain },
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_KEY}`,
            },
        });

        const { data, error } = await supabase.from("brand_data").insert([
            {
                brand: response.data.brand,
            },
        ]);

        if (error) throw error;

        console.log("Brand data extracted successfully", response.data.brand);

        return res.status(200).json({
            message: "Brand data extracted successfully",
            data: response.data.brand,
        });
    } catch (error) {
        console.error("extractBrandData error:", error?.response?.data || error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const addCustomBrandData = async (req, res) => {
    try {
        const { data } = req.body;

        if (!req.user?.id) {
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
                    userId: req.user.id,
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
        // const userId = req.user?.id;

        // if (!userId) {
        //     return res.status(401).json({ error: "Unauthorized" });
        // }

        console.log(req.user?.id);
        const { data, error } = await supabase
            .from("brand_data")
            .select("*")
        // .eq("userId", userId);
        // console.log("Brand Data: ", brandData);

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({ message: "No brand data found" });
        }

        return res.status(200).json({ data });
    } catch (error) {
        console.error("getAllBrandData error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
