export interface PromptAnalysis {
  qualityScore: number;
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  improvedPrompt: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  originalPrompt: string;
  analysis: PromptAnalysis;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}
