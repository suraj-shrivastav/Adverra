import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenAI({
    apiKey: apiKey,
})

export default genAI;