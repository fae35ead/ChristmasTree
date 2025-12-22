
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Google GenAI client with the API key from environment variables.
// Use process.env.API_KEY directly as required by the guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSignatureWish = async (): Promise<string> => {
  // Check for the presence of the API key before proceeding.
  if (!process.env.API_KEY) {
    return "星光静默（缺少API Key）。但愿你的节日依然闪耀。";
  }

  try {
    const prompt = `Write a short, luxurious, and warm Christmas wish in Simplified Chinese (max 25 words).
    Target Audience: "Little V" (小V).
    Tone: Romantic, cinematic, expensive, "Arix Signature" brand voice but warmer and more festive.
    Focus: Golden lights, eternity, warmth, and the magic of the moment.
    Output JSON only.`;

    // Always use ai.models.generateContent and the recommended model for basic text tasks.
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

    // Extract text from the response using the .text property (not a method).
    const jsonStr = response.text?.trim() || '{}';
    const json = JSON.parse(jsonStr);
    return json.wish || "金色的流光在翡翠般的夜色中为你闪烁。";
  } catch (error) {
    console.error("Gemini generation failed:", error);
    return "信号消逝在风雪中。圣诞快乐，小V。";
  }
};
