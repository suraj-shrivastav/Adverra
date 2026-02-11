import genAI from "../config/gemini.js";
import assetPrompts from "../utils/assets.prompts.js";
import imagePrompts from "../utils/prompts.js";
import { uploadBase64Image } from "../config/cloudinary.js";
import { uploadUrlImageToGemini } from "../utils/uploadUrlImageToGemini.js";
import { uploadImageToGemini } from "../utils/uploadImage.js";
import { supabase } from "../config/supabase.js";
import fs from "fs/promises";

const buildPrompt = ({ selectedToneId, text, brand }) => {
    const style = imagePrompts[selectedToneId] || imagePrompts.retro_cel_shaded_prompt;

    if (!brand) {
        return `${style}\n\n${text}`;
    }

    const colors = brand.colors?.map(c => `${c.name} (${c.hex})`).join(", ");
    const industry =
        brand.industries?.eic?.map(i => i.subindustry || i.industry).join(", ") ||
        "Technology";

    return `
[Design Style]
${style}

[Brand Identity]
Name: ${brand.title}
Industry: ${industry}
Colors: ${colors || "Brand aligned"}
Voice: ${brand.slogan || "Professional"}

[Creative Brief]
${text}

[Rules]
No text, no logos, no watermarks.
High-quality, realistic, professional.
`.trim();
};

const buildImageParts = (images, prompt) => [
    ...(images || []).map(img => ({
        fileData: { fileUri: img.uri, mimeType: img.mimeType },
    })),
    { text: prompt },
];

export const generateImage = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const {
            selectedToneId,
            prompt,
            additionalContext,
            brandData,
            referenceImages = [],
            brandLogos = [],
            aspectRatio = "1:1",
        } = req.body;

        // const text = additionalContext || prompt;
        // if (!text) {
        //     return res.status(400).json({ success: false, message: "Prompt required" });
        // }

        console.log(req.body);
        // return true;

        // Process logos concurrently
        const processedLogos = await Promise.all(
            brandLogos.slice(0, 2).map(async (logo) => {
                if (!logo?.url) return null;
                try {
                    const file = await uploadUrlImageToGemini(logo.url);
                    return { uri: file.uri, mimeType: file.mimeType };
                } catch (e) {
                    console.error("Logo upload failed:", e);
                    return null;
                }
            })
        );


        // merge references (max 4)
        const refs = [
            ...referenceImages,
            ...processedLogos.filter(Boolean)
        ].slice(0, 4);

        const finalPrompt = buildPrompt({
            selectedToneId,
            text: prompt,
            brand: brandData,
        });

        const optimizedFinalPrompt = buildImageParts(refs, finalPrompt);

        console.log(optimizedFinalPrompt);
        // return;

        const response = await genAI.models.generateContent({
            model: "gemini-3-pro-image-preview",
            contents: {
                role: "user",
                parts: optimizedFinalPrompt,
            },
            config: {
                imageConfig: {
                    aspectRatio,
                    resolution: "2K",
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
            // meta: uploaded,
        });
        return res.status(200).json({
            success: true,
            imageUrl: uploaded.secure_url,
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
        if (!req.user?.id) {
            return res.status(401).json({ success: false });
        }

        const { data, error } = await supabase
            .from("brand_assets")
            .select("id, img_url, img_meta_data, created_at")
            .eq("userId", req.user.id)
            .order("created_at", { ascending: false });

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
