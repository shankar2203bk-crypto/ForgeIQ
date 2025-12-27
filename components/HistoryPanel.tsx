import { History, Trash2, Clock, FileText } from 'lucide-react';
import type { HistoryItem } from '../types';

interface HistoryPanelProps {
  history: HistoryItem[];
  onLoadHistory: (item: HistoryItem) => void;
  onClearHistory: () => void;
  onLoadExample: (example: string) => void;
}

const EXAMPLE_PROMPTS = [
  'Write a short story about a time-traveling detective',
  'Explain quantum computing to a 10-year-old',
  'Create a recipe for a healthy breakfast smoothie',
  'Generate a business plan for a coffee shop',
  'Write a poem about the ocean at sunset',
];

export default function HistoryPanel({ history, onLoadHistory, onClearHistory, onLoadExample }: HistoryPanelProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg p-6 shadow-lg fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-white">Example Prompts</h3>
          </div>
        </div>
        <div className="space-y-2">
          {EXAMPLE_PROMPTS.map((example, index) => (
            <button
              key={index}
              onClick={() => onLoadExample(example)}
              className="w-full text-left p-3 bg-slate-900/50 hover:bg-slate-700 rounded-lg transition-all text-sm text-slate-300 border border-slate-700 hover:border-orange-600"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 shadow-lg fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-white">History</h3>
            {history.length > 0 && (
              <span className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded-full text-xs">
                {history.length}
              </span>
            )}
          </div>
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No history yet</p>
            <p className="text-slate-500 text-xs mt-1">Your analyzed prompts will appear here</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => onLoadHistory(item)}
                className="w-full text-left p-3 bg-slate-900/50 hover:bg-slate-700 rounded-lg transition-all border border-slate-700 hover:border-orange-600"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm text-slate-300 line-clamp-2 flex-1">
                    {item.originalPrompt}
                  </p>
                  <span className="text-xs text-slate-500 whitespace-nowrap">
                    {formatDate(item.timestamp)}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-orange-500 font-medium">
                    Score: {item.analysis.qualityScore}/10
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-500">
                    {item.analysis.difficultyLevel}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
