import genAI from "../config/gemini.js"
import wav from "wav";
import { supabase } from "../config/supabase.js";
import fs from "fs";

const saveWaveFile = async (filename, pcmData, channels = 1, rate = 24000, sampleWidth = 2) => {
    const promise = new Promise((resolve, reject) => {
        const writer = new wav.FileWriter(`./audio/ads/${filename}-campaign.wav`, {
            channels,
            sampleRate: rate,
            bitDepth: sampleWidth * 8,
        });
        writer.on('finish', resolve);
        writer.on('error', reject);
        writer.write(pcmData);
        console.log("PCM data: ", pcmData);
        writer.end();
    })
        .then(async () => {
            console.log("Wave file saved successfully");
            const { data, error } = await supabase.storage.from("brand_audio").upload(`./audio/ads/${filename}-campaign.wav`, fs.createReadStream(`./audio/ads/${filename}-campaign.wav`));
            if (error) {
                console.error("Error uploading wave file:", error);
            }
            console.log("Wave file uploaded successfully");
            if (data.publicUrl) {
                const { dbData, error } = await supabase.from("brand_audio").insert({
                    filename,
                    publicUrl: data.publicUrl,
                });
                if (error) {
                    console.error("Error inserting data into database:", error);
                }
                console.log("Data inserted into database successfully");
                // return dbData;
            }

            return data;
        })
        .catch((error) => {
            console.error("Error saving wave file:", error);
            return error;
        });
}

const generateAudioScript = async (scriptContext, prompt) => {
    try {
        const systemInstruction = `
You are a senior Audio Copywriter and Brand Voice Director specializing in high-conversion marketing audio for ads, promos, and brand announcements.

Your objective is to generate a single, polished audio advertisement that clearly introduces a Brand and Product to an audience and persuades them within a short listening window.

────────────────────────
CRITICAL TIME CONSTRAINT
────────────────────────
- The final spoken audio MUST be between 15 and 20 seconds when read at a natural speaking pace.
- Prioritize clarity and persuasion over word density.
- Do not include filler, repetition, or unnecessary exposition.

────────────────────────
MODE & STRUCTURE RULES
────────────────────────
Determine the mode based on the user prompt:

1. MULTI-SPEAKER MODE
- Use exactly two speakers: Speaker1 and Speaker2.
- Structure must follow this sequence ONLY:
  Speaker1 → Speaker2 → Speaker1 → Speaker2
- Each speaker should have short, punchy lines.
- The conversation should feel like a natural discovery, recommendation, or realization.
- Avoid sounding like a scripted commercial dialogue.

2. SINGLE-SPEAKER MODE
- Use exactly one speaker labeled: Speaker.
- The script must be returned as a SINGLE PARAGRAPH.
- Structure the paragraph to flow through:
  Hook → Problem → Solution → Brand/Product Name → Call-to-Value
- Sentences should be short, rhythmic, and spoken-language friendly.

────────────────────────
VOICE & DELIVERY CONTROL
────────────────────────
You MUST generate a direction line that controls emotion, energy, and delivery for the AI voice model.

- Single Speaker format:
  "Say in a [adjective] [tone/style] voice:"

- Multi Speaker format:
  "Make Speaker1 sound [emotion/style] and Speaker2 sound [emotion/style]:"

Choose adjectives that enhance persuasion and brand perception.

────────────────────────
FORMATTING RULES (STRICT)
────────────────────────
- Use ONLY the following speaker labels:
  - "Speaker" (single speaker)
  - "Speaker1" and "Speaker2" (multi speaker)
- Tone must remain persuasive, professional, and engaging throughout.
- Do NOT include stage directions, emojis, markdown, or explanations.

────────────────────────
OUTPUT FORMAT (STRICT JSON ONLY)
────────────────────────
Return ONLY valid JSON following this exact schema.
No extra fields. No commentary.

{
  "filename": "one word title generally product name or brand name",
  "direction_line": "The style command string",
  "mode": "Single Speaker" or "Multi Speaker",
  "script_lines": [
    { "speaker": "Speaker1", "text": "First line..." },
    { "speaker": "Speaker2", "text": "Response..." }
  ],
  "ready_for_audio_model": "Combined string with direction line and dialogue formatted exactly for TTS input"
}

────────────────────────
FINAL QUALITY BAR
────────────────────────
- Sounds natural and confident when spoken aloud
- Clearly communicates brand and product value
- Feels premium and non-generic
- Ready for direct use in a Text-to-Speech pipeline

────────────────────────
script_lines EXAMPLES
────────────────────────
Single Speaker:
Say in an spooky whisper:
"By the pricking of my thumbs...
Something wicked this way comes"

Multi Speaker:
Make Speaker1 sound tired and bored, and Speaker2 sound excited and happy:
Speaker1: So... what's on the agenda today?
Speaker2: You're never going to guess!

`;

        const response = await genAI.models.generateContent({
            model: "gemini-3-flash-preview",
            systemInstruction,
            contents: [
                {
                    role: "user",
                    parts: [{
                        text: `BrandContext: ${JSON.stringify(scriptContext)}\n\nPrompt: ${prompt}`
                    }],
                },
            ],
            config: {
                responseSchema: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        filename: {
                            type: "string"
                        },
                        direction_line: {
                            type: "string"
                        },
                        mode: {
                            type: "string",
                            enum: ["Single Speaker", "Multi Speaker"]
                        },
                        script_lines: {
                            type: "array",
                            minItems: 1,
                            items: {
                                type: "object",
                                additionalProperties: false,
                                properties: {
                                    speaker: {
                                        type: "string",
                                        enum: ["Speaker", "Speaker1", "Speaker2"]
                                    },
                                    text: {
                                        type: "string",
                                    }
                                },
                                required: ["speaker", "text"]
                            }
                        },
                        ready_for_audio_model: {
                            type: "string"
                        }
                    },
                    required: ["filename", "direction_line", "mode", "script_lines", "ready_for_audio_model"]
                },
                temperature: 0.5,
            }
        });
        // console.log(response.candidates[0].content.parts[0].text);
        return response.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Error generating audio script:", error);
        throw new Error("Failed to generate audio script");
    }
};

export const generateAudio = async (req, res) => {
    try {
        const { scriptContext, prompt } = req.body;

        const rawScript = await generateAudioScript(
            JSON.stringify(scriptContext),
            prompt
        );
        const script = JSON.parse(rawScript);
        console.log("Parsed Script", script);
        const audio = await generateAudioModel(script);
        return res.status(200).send(audio);
    } catch (error) {
        console.error("Error generating audio script:", error);
        return res.status(500).send({ error: "Failed to generate audio script" });
    }
}

const generateAudioModel = async (script) => {
    try {
        const finalScript = script.script_lines.map((line) => line.text).join("\n");
        const audioConfig = {
            responseModalities: ['AUDIO']
        }
        if (script.mode == "Single Speaker") {
            audioConfig.speechConfig = {
                voiceConfig: {
                    prebuiltVoiceConfig: {
                        voiceName: "Kore"
                    }
                }
            }
        }

        if (script.mode == "Multi Speaker") {
            audioConfig.speechConfig = {
                multiSpeakerVoiceConfig: {
                    speakerVoiceConfigs: [
                        {
                            speaker: "Speaker1",
                            voiceConfig: {
                                prebuiltVoiceConfig: {
                                    voiceName: "Schedar"
                                }
                            }
                        },
                        {
                            speaker: "Speaker2",
                            voiceConfig: {
                                prebuiltVoiceConfig: {
                                    voiceName: "Puck"
                                }
                            }
                        }
                    ]
                }
            }
        }

        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            systemInstruction: script.direction_line,
            contents: [
                {
                    parts: [
                        {
                            text: finalScript
                        }
                    ]
                }
            ],
            config: audioConfig
        });
        console.log("Audio generated successfully", response);
        const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        const audioBuffer = Buffer.from(data, 'base64');
        const fileName = script.filename;
        console.log("--------------------------------------------------------------------------")
        const audio = await saveWaveFile(fileName, audioBuffer);
        console.log("Audio saved successfully", audio);
        return true;
    } catch (error) {
        console.error("Error generating audio:", error);
        return false;
    }
}