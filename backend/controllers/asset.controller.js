import genAI from "../config/gemini.js";
import assetPrompts from "../utils/assets.prompts.js";
import imagePrompts from "../utils/prompts.js";
import { uploadBase64Image } from "../config/cloudinary.js";
import { uploadUrlImageToGemini } from "../utils/uploadUrlImageToGemini.js";
import { uploadImageToGemini } from "../utils/uploadImage.js";
import { supabase } from "../config/supabase.js";
import fs from "fs/promises";
import { buildUserPrompt, systemInstructionModern, visualToneSystemInstructions } from "../utils/imageUserPrompt.js";

export const generateImage = async (req, res) => {
    try {
        const timestamp = Date.now();
        if (!req.user?.id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const data = req.body;

        // console.log(data.brandKit.colors);
        // return res.status(200).json({ success: true, message: "Data received" });

        const processedLogos = await Promise.all(
            data.brandKit.logos.slice(0, 2).map(async (logo) => {
                if (!logo?.url) return null;
                try {
                    const file = await uploadUrlImageToGemini(logo.url);
                    console.log(file);
                    return { fileData: { fileUri: file.uri, mimeType: file.mimeType } };
                } catch (e) {
                    console.error("Logo upload failed:", e);
                    return null;
                }
            })
        );

        const refs = data.references.images.filter(item => item.uri && item.mimeType)
            .map(item => ({
                fileData: {
                    fileUri: item.uri,
                    mimeType: item.mimeType
                }
            }));

        // console.log("refs", refs);

        // console.log("processedLogos", processedLogos);
        // console.log("systemInstruction: ", imagePrompts[hand_drawn_2_prompt]);
        const systemInstruction = visualToneSystemInstructions[data.visualStyle.toneId] || systemInstructionModern;
        console.log("systemInstruction used: ", data.visualStyle.toneId);

        // return;
        // return;
        const userInstruction = buildUserPrompt(data, JSON.stringify(processedLogos), "");

        const response = await genAI.models.generateContent({
            model: "gemini-3-pro-image-preview",
            systemInstruction,
            contents: {
                role: "user",
                parts: [
                    { text: userInstruction },
                    ...processedLogos,
                    ...refs
                ]
            },
            config: {
                imageConfig: {
                    aspectRatio: data.aspectRatio,
                    resolution: "4K",
                },
            },
        });

        const image = response?.candidates?.[0]?.content?.parts?.find(
            p => p.inlineData?.mimeType?.startsWith("image/")
        );

        if (!image) {
            return res.status(400).json({ success: false, message: "No image generated" });
        }

        const uploaded = await uploadBase64Image(
            image.inlineData.data,
            image.inlineData.mimeType
        );

        await supabase.from("brand_assets").insert({
            userId: req.user.id,
            img_url: uploaded.secure_url,
            img_meta_data: {
                publicId: uploaded.public_id,
                width: uploaded.width,
                height: uploaded.height,
                format: uploaded.format,
            },
        });

        console.log("uploaded", {
            success: true,
            imageUrl: uploaded.secure_url,
            timeTaken: (Date.now() - timestamp) / 1000 + " sec",
            // meta: uploaded,
        });
        return res.status(200).json({
            success: true,
            imageUrl: uploaded.secure_url,
            timeTaken: (Date.now() - timestamp) / 1000 + "sec",
            meta: uploaded,
        });
    } catch (err) {
        console.error("generateImage:", err);
        return res.status(500).json({ success: false, message: "Generation failed" });
    }
};

export const uploadReferenceImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file" });
        }

        const file = await uploadImageToGemini(
            req.file.path,
            req.file.mimetype,
            req.file.originalname
        );

        await fs.unlink(req.file.path);

        return res.status(200).json({
            success: true,
            file: {
                uri: file.uri,
                mimeType: file.mimeType,
                name: file.name,
            },
        });
    } catch (err) {
        console.error("uploadReferenceImage:", err);
        return res.status(500).json({ success: false });
    }
};

export const getAssets = async (req, res) => {
    try {
        console.log("Get Assets fetched");
        if (!req.user?.id) {
            return res.status(401).json({ success: false });
        }

        const { data, error } = await supabase
            .from("brand_assets")
            .select("id, img_url, created_at")
            .eq("userId", req.user.id)
            .order("created_at", { ascending: true });

        if (error) throw error;

        return res.status(200).json({ success: true, data });
    } catch (err) {
        console.error("getAssets:", err);
        return res.status(500).json({ success: false });
    }
};


export const deleteAssets = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || !ids.length) {
            return res.status(400).json({ success: false });
        }

        await supabase.from("brand_assets").delete().in("id", ids);

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error("deleteAssets:", err);
        return res.status(500).json({ success: false });
    }
};
