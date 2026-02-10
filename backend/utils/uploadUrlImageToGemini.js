import { GoogleAIFileManager } from "@google/generative-ai/server";
import { imageUrlToBase64 } from "./imageUrlToBase64.js";
import fs from "fs";
import path from "path";
import os from "os";
import dotenv from "dotenv";

dotenv.config();

const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

/**
 * Downloads an image from URL and uploads it to Gemini
 * @param {string} imageUrl - The URL of the image to upload
 * @returns {Promise<{uri: string, mimeType: string, name: string}>}
 */
export const uploadUrlImageToGemini = async (imageUrl) => {
    try {
        // Get base64 and mimeType from URL
        const { data: base64Data, mimeType } = await imageUrlToBase64(imageUrl);

        // Create a temp file
        const fileName = `logo_${Date.now()}.${mimeType.split('/')[1] || 'png'}`;
        const tempFilePath = path.join(os.tmpdir(), fileName);

        // Write base64 to temp file
        const buffer = Buffer.from(base64Data, 'base64');
        fs.writeFileSync(tempFilePath, buffer);

        // Upload to Gemini
        const uploadResponse = await fileManager.uploadFile(tempFilePath, {
            mimeType: mimeType,
            displayName: fileName,
        });

        // Clean up temp file
        fs.unlinkSync(tempFilePath);

        console.log(`Uploaded URL image to Gemini: ${uploadResponse.file.uri}`);

        return {
            uri: uploadResponse.file.uri,
            mimeType: uploadResponse.file.mimeType,
            name: uploadResponse.file.name,
        };
    } catch (error) {
        console.error("Error uploading URL image to Gemini:", error);
        throw error;
    }
};
