import { GoogleGenAI, Type } from "@google/genai";

export const generateSignatureWish = async (): Promise<string> => {
  // Check for the presence of the API key before proceeding.
  if (!process.env.API_KEY) {
    return "星光静默（缺少API Key）。但愿你的节日依然闪耀。";
  }

  try {
    // Create instance inside function to ensure environment context is current
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Write a short, luxurious, and warm Christmas wish in Simplified Chinese (max 25 words).
    Target Audience: "Little V" (小V).
    Tone: Romantic, cinematic, expensive, brand voice but warmer and more festive.
    Focus: Golden lights, eternity, warmth, and the magic of the moment.
    Output JSON only.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            wish: { 
              type: Type.STRING,
              description: "The Christmas wish text."
            },
          },
        },
      },
    });

    const jsonStr = response.text?.trim() || '{}';
    const json = JSON.parse(jsonStr);
    return json.wish || "金色的流光在翡翠般的夜色中为你闪烁。";
  } catch (error) {
    console.error("Gemini generation failed:", error);
    return "信号消逝在风雪中。圣诞快乐，小V。";
  }
};