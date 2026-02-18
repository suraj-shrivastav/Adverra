import genAI from "../config/gemini.js"
import { supabase } from "../config/supabase.js";

const createWavHeader = (dataSize, channels = 1, sampleRate = 24000, bitDepth = 16) => {
    const header = Buffer.alloc(44);
    header.write('RIFF', 0);
    header.writeUInt32LE(36 + dataSize, 4);
    header.write('WAVE', 8);
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16);
    header.writeUInt16LE(1, 20); // PCM format
    header.writeUInt16LE(channels, 22);
    header.writeUInt32LE(sampleRate, 24);
    header.writeUInt32LE(sampleRate * channels * (bitDepth / 8), 28);
    header.writeUInt16LE(channels * (bitDepth / 8), 32);
    header.writeUInt16LE(bitDepth, 34);
    header.write('data', 36);
    header.writeUInt32LE(dataSize, 40);
    return header;
};

const saveWaveFile = async (filename, pcmData, userId, script, formData, channels = 1, rate = 24000, sampleWidth = 2) => {
    try {
        const storagePath = `audio/ads/${filename}-${Date.now()}.wav`;
        const header = createWavHeader(pcmData.length, channels, rate, sampleWidth * 8);
        const wavBuffer = Buffer.concat([header, pcmData]);

        console.log("Wave file constructed in memory");

        const { data, error } = await supabase.storage
            .from("brand_audio")
            .upload(storagePath, wavBuffer, {
                upsert: true,
                contentType: 'audio/wav'
            });

        if (error) {
            console.error("Error uploading wave file to Supabase storage:", error);
            return null;
        }

        console.log("Wave file uploaded directly to Supabase storage");

        // getPublicUrl returns an object with a data property containing the publicUrl
        const { data: { publicUrl } } = supabase.storage
            .from("brand_audio")
            .getPublicUrl(storagePath);

        if (publicUrl) {
            const { data: insertedData, error: dbError } = await supabase
                .from("brand_audio")
                .insert({
                    filename,
                    publicUrl: publicUrl,
                    userId: userId,
                    script: script,
                    context: formData
                })
                .select()
                .single();

            if (dbError) {
                console.error("Error inserting data into database:", dbError);
                return null;
            } else {
                console.log("Data inserted into database successfully");
                return insertedData;
            }
        }

    } catch (error) {
        console.error("Error in saveWaveFile:", error);
        return null;
    }
}

const generateAudioScript = async (scriptContext) => {
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
                        text: `BrandContext: ${JSON.stringify(scriptContext)}`
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
        const formData = req.body;
        console.log("Script: ", formData);
        // return;

        // Use a default user ID if req.user is not present, matching campaign controller pattern
        const userId = req.user?.id
        if (!userId) throw new Error("User not found");

        const rawScript = await generateAudioScript(
            JSON.stringify(formData),
        );
        const script = JSON.parse(rawScript);
        console.log("Parsed Script", script);

        const audio = await generateAudioModel(script, formData, userId);
        return res.status(200).send(audio);
    } catch (error) {
        console.error("Error generating audio script:", error);
        return res.status(500).send({ error: "Failed to generate audio script" });
    }
}

const generateAudioModel = async (script, formData, userId) => {
    try {
        const finalScript = script.mode === "Multi Speaker"
            ? script.script_lines.map((line) => `${line.speaker}: ${line.text}`).join("\n")
            : script.script_lines.map((line) => line.text).join("\n");
        const audioConfig = {
            responseModalities: ['AUDIO']
        }
        if (script.mode == "Single Speaker") {
            const voiceName = formData.voice.trim().split(/\s+/)[0];
            audioConfig.speechConfig = {
                prebuiltVoiceConfig: {
                    voiceName: voiceName
                }
            }
        }

        if (script.mode == "Multi Speaker") {
            const speaker1Voice = formData.speaker1Voice.trim().split(/\s+/)[0];
            const speaker2Voice = formData.speaker2Voice.trim().split(/\s+/)[0];
            console.log("voices are: ", speaker1Voice, " ", speaker2Voice);
            audioConfig.speechConfig = {
                multiSpeakerVoiceConfig: {
                    speakerVoiceConfigs: [
                        {
                            speaker: "Speaker1",
                            voiceConfig: {
                                prebuiltVoiceConfig: {
                                    voiceName: speaker1Voice.trim()
                                }
                            }
                        },
                        {
                            speaker: "Speaker2",
                            voiceConfig: {
                                prebuiltVoiceConfig: {
                                    voiceName: speaker2Voice.trim()
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
        // console.log("Audio generated successfully", response.candidates[0].content.parts[0]);
        const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        const audioBuffer = Buffer.from(data, 'base64');
        const fileName = script.filename;
        console.log("--------------------------------------------------------------------------")
        const audio = await saveWaveFile(fileName, audioBuffer, userId, script, formData);
        console.log("Audio saved successfully", audio);
        return audio;
    } catch (error) {
        console.error("Error generating audio:", error);
        return null;
    }
}

export const getAudios = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(403).send({ error: "Unauthorized" });
        }
        const { data, error } = await supabase
            .from("brand_audio")
            .select("*")

        if (error) {
            console.log(error);
            return res.status(404).send({ error: "No Data Found" });
        }
        console.log("Audio data length:", data);
        return res.status(200).send(data)
    } catch (error) {
        console.error("Error getting audio:", error);
        return res.status(500).send({ error: "Failed to get audio" });
    }
}