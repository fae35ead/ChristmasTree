import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateSignatureWish = async (): Promise<string> => {
  if (!apiKey) {
    return "星光静默（缺少API Key）。但愿你的节日依然闪耀。";
  }

  try {
    const prompt = `Write a short, luxurious, and warm Christmas wish in Simplified Chinese (max 25 words).
    Target Audience: "Little V" (小V).
    Tone: Romantic, cinematic, expensive, "Arix Signature" brand voice but warmer and more festive.
    Focus: Golden lights, eternity, warmth, and the magic of the moment.
    Output JSON only.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            wish: { type: Type.STRING },
          },
        },
      },
    });

    const json = JSON.parse(response.text || '{}');
    return json.wish || "金色的流光在翡翠般的夜色中为你闪烁。";
  } catch (error) {
    console.error("Gemini generation failed:", error);
    return "信号消逝在风雪中。圣诞快乐，小V。";
  }
};