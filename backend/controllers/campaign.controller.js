import genAI from "../config/gemini.js";
import { getPlatformRules } from "../utils/platformRules.js";
import { supabase } from "../config/supabase.js";

export const createCampaign = async (req, res) => {
    try {
        const { campaignData, prompt } = req.body;

        if (!campaignData || !prompt) {
            return res.status(400).json({
                error: "campaignData and prompt are required",
            });
        }

        const systemInstruction = `
You are the Typeface Ads Agent—an expert Social Media Copywriter. 
Your goal is to transform a Campaign Brief and Brand Kit into FINAL, READY-TO-POST content.

────────────────────────
CORE OPERATIONAL PRINCIPLE
────────────────────────
You are NOT a consultant or a strategist. You are a CREATIVE EXECUTOR.
Your output must be "Copy & Paste" ready. 
If a user had to delete a single sentence of "explanation" before posting, you have failed.

────────────────────────
STRICT CONTENT RULES
────────────────────────
1. actualCampaign FIELD: 
   - MUST BE: The exact caption/text for the post.
   - MUST NOT: Include any "meta-talk" (e.g., "This post aims to...", "Here is a campaign...").
   - MUST NOT: Use marketing jargon (e.g., "leveraging," "touchpoints," "synergy").
   - STRUCTURE: Start with a high-impact HOOK, follow with VALUE/BENEFIT, and end with a clear CALL TO ACTION (CTA).

2. TONE & VOICE:
   - Adhere strictly to the Brand Kit provided.
   - Match the platform-specific nuances (emojis, sentence length, and formatting).

────────────────────────
PLATFORM SPECIFICATIONS
────────────────────────
${Array.isArray(campaignData?.platforms)
                ? campaignData.platforms.map(p => `[${p}]: ${getPlatformRules(p)}`).join('\n')
                : getPlatformRules(campaignData?.platform || "Instagram")
            }

────────────────────────
OUTPUT FORMAT
────────────────────────
Return ONLY valid JSON.
{
  "title": "Internal reference title",
  "actualCampaign": "FINAL READY-TO-POST CAPTION ONLY",
  "targetAudience": "Specific segment this copy speaks to",
  "hashtags": ["#tag1", "#tag2"],
  "bestTimeToPost": "Time only (e.g., 9:00 AM EST)"
}
`;

        // Re-structuring the prompt to match Typeface's "Brand Hub" style
        const finalPrompt = `
### CAMPAIGN BRIEF
${typeof prompt === 'string' ? prompt : JSON.stringify(prompt, null, 2)}

### BRAND KIT & CONTEXT
${JSON.stringify(campaignData, null, 2)}

### EXECUTION TASK
Generate the final social media post based on the brief above. 
Ensure the "actualCampaign" field contains zero explanation—only the text to be posted.
`;

        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash", // Updated to a stable production model
            systemInstruction,
            contents: [
                {
                    role: "user",
                    parts: [{ text: finalPrompt }],
                },
            ],
            config: {
                responseJsonSchema: {
                    type: "OBJECT",
                    required: ["campaign"],
                    properties: {
                        campaign: {
                            type: "OBJECT",
                            required: [
                                "title",
                                "actualCampaign",
                                "targetAudience",
                                "hashtags",
                                "bestTimeToPost",
                            ],
                            properties: {
                                title: { type: "STRING" },
                                actualCampaign: {
                                    type: "STRING",
                                    description: "The raw, final text to be posted publicly. No intro/outro text."
                                },
                                targetAudience: { type: "STRING" },
                                hashtags: {
                                    type: "ARRAY",
                                    items: { type: "STRING" },
                                },
                                bestTimeToPost: {
                                    type: "STRING",
                                    description: "Optimized time based on audience (e.g., 7 PM IST)",
                                },
                            },
                        },
                    },
                },
                responseMimeType: "application/json",
            },
        });

        const part = response?.candidates?.[0]?.content?.parts?.[0];

        if (!part) {
            return res.status(500).json({ error: "Empty response from AI" });
        }
        console.log("Resposnse is ", part);
        let responseText;
        try {
            responseText = part.text ? JSON.parse(part.text) : part.data;
        } catch (e) {
            console.error("JSON Parse Error:", part.text);
            return res.status(500).json({ error: "AI returned invalid JSON" });
        }

        console.log("Data saving started....");
        const { data, error } = await supabase
            .from("brand_campaigns")
            .insert({
                userId: req.user?.id || "736ec2b1-9ba6-4ee9-9854-b23cd21d0061",
                campaign: responseText?.campaign
            })
            .select();

        if (error) throw error;

        console.log("Data Saved...");

        return res.status(200).json(data);
    } catch (error) {
        console.error("Error generating campaign:", error.message);
        return res.status(500).json({
            error: "Failed to generate campaign",
            details: error.message,
        });
    }
};


export const getCampaigns = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("brand_campaigns")
            .select()
            .eq("userId", req.user?.id || "736ec2b1-9ba6-4ee9-9854-b23cd21d0061");

        if (error) throw error;

        return res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching campaigns:", error.message);
        return res.status(500).json({
            error: "Failed to fetch campaigns",
            details: error.message,
        });
    }
};