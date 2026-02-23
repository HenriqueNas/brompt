
import { GoogleGenerativeAI } from "@google/generative-ai";
import { LLMProvider } from "../types";

export class GeminiProvider implements LLMProvider {
  async generate(apiKey: string, promptPayload: string): Promise<string> {
    if (!apiKey) {
      throw new Error("API Key is missing.");
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      // Using gemini-1.5-flash for speed and efficiency
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await model.generateContent(promptPayload);
      const response = await result.response;
      return response.text();
    } catch (error: unknown) {
      console.error("Gemini API Error:", error);
      
      const errorMessage = error instanceof Error ? error.message : String(error);

      if (errorMessage.includes("429")) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      
      if (errorMessage.includes("401") || errorMessage.includes("INVALID_ARGUMENT")) {
        throw new Error("Invalid API Key. Please check your settings.");
      }

      throw new Error("Failed to generate prompt. Please try again.");
    }
  }
}

export const geminiProvider = new GeminiProvider();
