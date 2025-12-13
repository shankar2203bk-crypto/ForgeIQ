export interface AnalysisResult {
  score: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  improvedPrompt: string;
}

export interface SimulationResult {
  output: string;
  source?: 'text' | 'image';
  groundingUrls?: Array<{ title: string; uri: string }>;
  imageData?: string;
}

export interface HistoryItem {
  id: string;
  prompt: string;
  analysis: AnalysisResult;
  timestamp: number;
}