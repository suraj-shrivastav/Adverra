import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
export const GEMINI_ENABLED = Boolean(apiKey);

const genAI = apiKey ? new GoogleGenAI({ apiKey }) : null;

export default genAI;