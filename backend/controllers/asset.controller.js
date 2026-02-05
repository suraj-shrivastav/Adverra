import genAI from "../config/gemini.js";
import assetPrompts from "../utils/assets.prompts.js";
import { uploadBase64Image } from "../config/cloudinary.js";
import { imageUrlToBase64 } from "../utils/imageUrlToBase64.js";
import { uploadImageToGemini } from "../utils/uploadImage.js";
import { supabase } from "../config/supabase.js";
import fs from "fs";


const constructBrandPrompt = (brandData) => {
    if (!brandData) return "";

    const colors = brandData.colors
        ? brandData.colors.map((c) => `${c.name} (${c.hex})`).join(", ")
        : "Brand colors";

    const industry = brandData.industries?.eic
        ? brandData.industries.eic
            .map((i) => i.subindustry || i.industry)
            .join(", ")
        : "Technology";

    return `
[Brand Identity]:
- Name: ${brandData.title || "Brand"}
- Industry: ${industry}
- Primary Colors: ${colors}
- Brand Voice/Tone: ${brandData.slogan || "Professional, Trustworthy"}
- Context: ${brandData.description || ""}
    `.trim();
};

const buildRawImagePrompt = ({ designType, prompt, brandData }) => {
    const selectedStyle =
        assetPrompts[designType] || assetPrompts["bold_dark_grooming_prompt"];
    const brandContextBlock = constructBrandPrompt(brandData);

    return `
[Design Style]: ${selectedStyle}

[Brand Data Context]:${brandContextBlock}

[Subject]: ${prompt}

[Quality Guidelines]:
- Professional marketing asset, award-winning composition.
- 8k resolution, highly detailed, sharp focus.
- Perfect lighting and color grading matching the Brand Identity colors.
    `.trim();
};

// const generatePrompt = async (rawPrompt) => {
//     try {
//         const response = await genAI.models.generateContent({
//             model: "gemini-3-flash-preview",
//             config: {
//                 responseMimeType: "application/json",
//                 responseSchema: {
//                     type: "OBJECT",
//                     properties: {
//                         prompt: { type: "STRING" },
//                     },
//                 },
//             },
//             systemInstruction: {
//                 parts: [
//                     {
//                         text: `You are an expert Brand Marketing Strategist.
// Write ONE high-quality image generation prompt based on the provided context.

// Output strictly in JSON:
// { "prompt": "Your detailed image description here..." }`,
//                     },
//                 ],
//             },
//             contents: [
//                 {
//                     role: "user",
//                     parts: [{ text: `[Brand Data Context]:\n${rawPrompt}` }],
//                 },
//             ],
//         });

//         const responseText =
//             response.candidates?.[0]?.content?.parts?.[0]?.text;

//         if (!responseText) throw new Error("Empty response from AI");

//         return JSON.parse(responseText).prompt;
//     } catch (error) {
//         console.error("Error optimizing prompt:", error);
//         return null;
//     }
// };


const buildImageParts = async ({ referenceImages, optimizedPrompt }) => {
    try {
        const parts = [];
        if (referenceImages && Array.isArray(referenceImages)) {
            for (const file of referenceImages) {
                // If file is an object with uri and mimeType
                if (file.uri && file.mimeType) {
                    parts.push({
                        fileData: {
                            fileUri: file.uri,
                            mimeType: file?.mimeType,
                        },
                    });
                } else if (typeof file === "string") {
                    // Fallback if it's just a URI string
                    parts.push({
                        fileData: {
                            fileUri: file,
                            // mimeType: "image/png", // Default mimeType
                        },
                    });
                }
            }
        }

        if (optimizedPrompt) {
            parts.push({ text: optimizedPrompt });
        }
        return parts;
    } catch (error) {
        console.error("Error in buildImageParts:", error);
        throw error;
    }
};

// const buildImageParts = async ({ optimizedPrompt, referenceImages }) => {
//     const parts = [];

//     if (referenceImages && Array.isArray(referenceImages)) {
//         for (const item of referenceImages) {
//             if (typeof item === 'string') {
//                 if (item.includes("generativelanguage.googleapis.com")) {
//                     // It's a Gemini File API URI
//                     parts.push({
//                         fileData: {
//                             fileUri: item,
//                             mimeType: "image/jpeg", // We might want to pass this or detect it, usually jpeg/png
//                         }
//                     });
//                 } else {
//                     // It's a standard URL
//                     const referenceImage = await imageUrlToBase64(item);
//                     parts.push({
//                         inlineData: {
//                             data: referenceImage.data,
//                             mimeType: referenceImage.mimeType,
//                         },
//                     });
//                 }
//             } else if (item.uri && item.mimeType) {
//                 // It's an object with uri and mimeType (from our new upload endpoint)
//                 parts.push({
//                     fileData: {
//                         fileUri: item.uri,
//                         mimeType: item.mimeType,
//                     }
//                 });
//             }
//         }
//     }

//     parts.push({ text: optimizedPrompt });

//     return parts;
// };


export const generateImage = async (req, res) => {
    try {
        const { designType, prompt, brandData, referenceImages } = req.body;
        const start = Date.now();

        const rawPrompt = buildRawImagePrompt({
            designType,
            prompt,
            brandData,
        });

        // const optimizedPrompt = await generatePrompt(rawPrompt);
        const optimizedPrompt = rawPrompt;

        // console.log("Image Parts: ", referenceImages);
        // console.log("Final Prompt Sent to Model:", optimizedPrompt);

        const imgParts = await buildImageParts({ referenceImages, optimizedPrompt });

        console.log("Image Parts: ", imgParts);

        const systemInstruction = `
You are an expert brand marketing strategist and designer. Your goal is to create High Quality Marketing Assets for Brands.
DO NOT generate text, watermarks, or logos inside the image.
DO NOT include blurry or distorted elements.
Ensure the image is strictly safe for work and follows brand safety guidelines.
        `;

        console.log("Image Generation started.");

        const response = await genAI.models.generateContent({
            model: "gemini-3-pro-image-preview",
            contents: { role: "user", parts: imgParts },
            systemInstruction: systemInstruction,
            config: {
                imageConfig: {
                    aspectRatio: '16:9',
                    resolution: '2K',
                },
                tools: [{ googleSearch: {} }],
            }
        });

        const parts = response.candidates?.[0]?.content?.parts || [];
        const imagePart = parts.find((p) =>
            p.inlineData?.mimeType?.startsWith("image/")
        );

        if (!imagePart) {
            return res.status(400).json({
                success: false,
                message: "No image returned from Gemini",
            });
        }

        const base64Image = imagePart.inlineData.data;
        const mimeType = imagePart.inlineData.mimeType;

        const uploadedImage = await uploadBase64Image(base64Image, mimeType);

        const timeTaken = (Date.now() - start) / 1000;
        console.log(`Image Generated in: ${timeTaken} seconds`)

        const { data, error } = await supabase
            .from("brand_assets")
            .insert({
                userId: req.user?.id || "736ec2b1-9ba6-4ee9-9854-b23cd21d0061",
                img_url: uploadedImage.secure_url,
                img_meta_data: {
                    publicId: uploadedImage.public_id,
                    width: uploadedImage.width,
                    height: uploadedImage.height,
                    format: uploadedImage.format,
                }
            })
        if (error) throw error;
        console.log("data: ", {
            imageUrl: uploadedImage.secure_url,
            publicId: uploadedImage.public_id,
            width: uploadedImage.width,
            height: uploadedImage.height,
            format: uploadedImage.format,
            timeTaken: `Image Generated in ${timeTaken} seconds`,
        });
        return res.status(200).json({
            success: true,
            imageUrl: uploadedImage.secure_url,
            publicId: uploadedImage.public_id,
            width: uploadedImage.width,
            height: uploadedImage.height,
            format: uploadedImage.format,
            timeTaken: `Image Generated in ${timeTaken} seconds`,
        });
    } catch (error) {
        console.error("generateImage error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const getAssets = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { data, error } = await supabase
            .from("brand_assets")
            .select("img_url")
            .eq("userId", userId);
        if (error) throw error;

        return res.status(200).json({ success: true, data: data });
    } catch (error) {
        console.error("Error at getAssets: ", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const uploadReferenceImage = async (req, res) => {
    try {
        const { file } = req;
        console.log(file);
        const geminiFile = await uploadImageToGemini(file.path, file.mimetype, file.originalname);
        return res.status(200).json({
            success: true,
            message: "File uploaded to Gemini successfully",
            file: {
                uri: geminiFile.uri,
                name: geminiFile.name,
                mimeType: geminiFile.mimeType,
            }
        });
    } catch (error) {

    }
};

export const deleteAssets = async (req, res) => {
    try {
        const { ids } = req.body;
        for (const id of ids) {
            const { data, error } = await supabase
                .from("brand_assets")
                .delete()
                .eq("id", id);
            if (error) throw error;
        }
        return res.status(200).json({ success: true, message: "Assets deleted successfully" });
    } catch (error) {
        console.error("Error at deleteAssets: ", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}