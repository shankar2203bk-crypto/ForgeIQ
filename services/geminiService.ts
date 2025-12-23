import { GoogleGenerativeAI } from '@google/generative-ai';
import type { PromptAnalysis } from '../types';

let genAI: GoogleGenerativeAI | null = null;

export function initializeGemini(apiKey: string) {
  genAI = new GoogleGenerativeAI(apiKey);
}

export function isInitialized(): boolean {
  return genAI !== null;
}

export async function analyzePrompt(prompt: string): Promise<PromptAnalysis> {
  if (!genAI) {
    throw new Error('Gemini API not initialized. Please provide an API key.');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const analysisPrompt = `You are an expert AI prompt engineer. Analyze the following prompt and provide detailed feedback in JSON format.

Original Prompt:
"${prompt}"

Provide a comprehensive analysis in this exact JSON structure:
{
  "qualityScore": <number 0-10>,
  "difficultyLevel": "<Beginner|Intermediate|Advanced>",
  "strengths": ["strength 1", "strength 2", ...],
  "weaknesses": ["weakness 1", "weakness 2", ...],
  "suggestions": ["suggestion 1", "suggestion 2", ...],
  "improvedPrompt": "<complete rewritten improved version>"
}

Guidelines:
- qualityScore: Rate 0-10 where 10 is excellent
- difficultyLevel: Choose from Beginner, Intermediate, or Advanced
- strengths: List 2-4 specific things the prompt does well
- weaknesses: List 2-4 specific areas that need improvement
- suggestions: Provide 3-5 actionable improvement steps
- improvedPrompt: Write a complete, optimized version of the prompt

Focus on clarity, specificity, context, and effectiveness for AI models. Return ONLY valid JSON, no other text.`;

  const result = await model.generateContent(analysisPrompt);
  const response = result.response;
  const text = response.text();
  
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse analysis response');
  }
  
  const analysis: PromptAnalysis = JSON.parse(jsonMatch[0]);
  return analysis;
}

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  if (!genAI) {
    throw new Error('Gemini API not initialized. Please provide an API key.');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const reader = new FileReader();
  const base64Audio = await new Promise<string>((resolve, reject) => {
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(audioBlob);
  });

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: audioBlob.type,
        data: base64Audio,
      },
    },
    'Transcribe this audio recording accurately. Return only the transcribed text without any additional commentary.',
  ]);

  return result.response.text();
}

export async function generateImage(prompt: string): Promise<string> {
  if (!genAI) {
    throw new Error('Gemini API not initialized. Please provide an API key.');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

  const imagePrompt = `Generate a detailed, high-quality image based on this prompt: ${prompt}`;

  const result = await model.generateContent(imagePrompt);
  const response = result.response;
  
  if (response.candidates && response.candidates[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if ('inlineData' in part && part.inlineData) {
        const { mimeType, data } = part.inlineData;
        return `data:${mimeType};base64,${data}`;
      }
    }
  }

  throw new Error('Image generation is not supported by this model. Please note that Gemini API does not currently support image generation. This feature is for demonstration purposes.');
}
