import { GoogleAIFileManager } from "@google/generative-ai/server";
import dotenv from "dotenv";

dotenv.config();

const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

export const uploadImageToGemini = async (filePath, mimeType, displayName) => {
    try {
        const uploadResponse = await fileManager.uploadFile(filePath, {
            mimeType: mimeType,
            displayName: displayName,
        });

        console.log(uploadResponse);
        console.log(`Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`);
        return uploadResponse.file;
    } catch (error) {
        console.error("Error uploading file to Gemini:", error);
        throw error;
    }
};