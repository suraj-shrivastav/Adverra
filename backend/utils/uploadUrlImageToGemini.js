import genAI, { GEMINI_ENABLED } from "../config/gemini.js";
import { imageUrlToBase64 } from "./imageUrlToBase64.js";
import fs from "fs";
import path from "path";
import os from "os";

/**
 * Downloads an image from URL and uploads it to Gemini
 * @param {string} imageUrl - The URL of the image to upload
 * @returns {Promise<{uri: string, mimeType: string, name: string}>}
 */
export const uploadUrlImageToGemini = async (imageUrl) => {
    try {
        if (!GEMINI_ENABLED || !genAI) {
            throw new Error("GEMINI_API_KEY is not configured");
        }

        // Get base64 and mimeType from URL
        const { data: base64Data, mimeType } = await imageUrlToBase64(imageUrl);

        // Create a temp file
        const fileName = `logo_${Date.now()}.${mimeType.split('/')[1] || 'png'}`;
        const tempFilePath = path.join(os.tmpdir(), fileName);

        // Write base64 to temp file
        const buffer = Buffer.from(base64Data, 'base64');
        fs.writeFileSync(tempFilePath, buffer);

        // Upload to Gemini using @google/genai
        const uploadResponse = await genAI.files.upload({
            file: tempFilePath,
            config: {
                mimeType,
                displayName: fileName,
            },
        });

        // Clean up temp file
        fs.unlinkSync(tempFilePath);

        console.log(`Uploaded URL image to Gemini: ${uploadResponse.uri}`);

        return {
            uri: uploadResponse.uri,
            mimeType: uploadResponse.mimeType,
            name: uploadResponse.name,
        };
    } catch (error) {
        console.error("Error uploading URL image to Gemini:", error);
        throw error;
    }
};
