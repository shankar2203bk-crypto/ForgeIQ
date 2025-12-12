import { GoogleGenAI, Schema, Type } from "@google/genai";
import { AnalysisResult, SimulationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Robust JSON cleaner to handle potential Markdown wrapping from the model
const cleanJson = (text: string): string => {
  let clean = text.trim();
  if (clean.startsWith('```json')) {
    clean = clean.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (clean.startsWith('```')) {
    clean = clean.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return clean;
};

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.INTEGER },
    level: { type: Type.STRING, enum: ["Beginner", "Intermediate", "Advanced"] },
    summary: { type: Type.STRING },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
    suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
    improvedPrompt: { type: Type.STRING },
  },
  required: ["score", "level", "summary", "strengths", "weaknesses", "suggestions", "improvedPrompt"],
};

export const analyzePrompt = async (prompt: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an expert Prompt Engineer. Analyze the following LLM prompt.
      
      Prompt: "${prompt}"
      
      Provide a score (0-10), difficulty level, critique, and a concrete improved version.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from model");

    return JSON.parse(cleanJson(text)) as AnalysisResult;
  } catch (error) {
    console.error("Analysis Error:", error);
    throw new Error("Failed to analyze prompt. Please try again.");
  }
};

export const runSimulation = async (prompt: string): Promise<SimulationResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const urls = groundingChunks
      .map(c => c.web)
      .filter((w): w is { title: string; uri: string } => !!w);

    return {
      output: response.text || "No output generated.",
      source: 'text',
      groundingUrls: urls
    };
  } catch (error) {
    console.error("Simulation Error:", error);
    return { output: "Error running simulation.", source: 'text' };
  }
};

export const runImageGeneration = async (prompt: string): Promise<SimulationResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    let imageData = "";
    const parts = response.candidates?.[0]?.content?.parts || [];
    
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        imageData = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      }
    }

    if (!imageData) {
        // Occasionally the model might refuse or just return text if it fails to generate an image
        const text = response.text;
        if (text) {
             return { output: text, source: 'image' };
        }
        throw new Error("No image data returned from API");
    }

    return {
      output: "Image generated successfully",
      source: 'image',
      imageData: imageData
    };
  } catch (error) {
    console.error("Image Generation Error:", error);
    // Provide specific error message to the user
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { 
        output: `Failed to generate image. Details: ${errorMessage}. Check API key permissions for 'gemini-2.5-flash-image'.`, 
        source: 'image' 
    };
  }
};

export const transcribeAudio = async (audioBase64: string, mimeType: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: audioBase64
            }
          },
          { text: "Please transcribe the following audio. Return only the transcribed text, no additional commentary or description." }
        ]
      }
    });
    return response.text || "";
  } catch (error) {
    console.error("Transcription Error:", error);
    throw new Error("Failed to transcribe audio.");
  }
};