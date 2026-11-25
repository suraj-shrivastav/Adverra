import genAI, { GEMINI_ENABLED } from "../config/gemini.js";

export const uploadImageToGemini = async (filePath, mimeType, displayName) => {
    try {
        if (!GEMINI_ENABLED || !genAI) {
            throw new Error("GEMINI_API_KEY is not configured");
        }

        const uploadResponse = await genAI.files.upload({
            file: filePath,
            config: {
                mimeType,
                displayName,
            },
        });

        console.log(`Uploaded file ${uploadResponse.displayName} as: ${uploadResponse.uri}`);
        return uploadResponse;
    } catch (error) {
        console.error("Error uploading file to Gemini:", error);
        throw error;
    }
};