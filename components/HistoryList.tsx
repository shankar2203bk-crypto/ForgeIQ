import React from 'react';
import { HistoryItem } from '../types';
import { Clock, Trash2, ChevronRight, Star } from 'lucide-react';

interface HistoryListProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onClear: () => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect, onDelete, onClear }) => {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (history.length === 0) {
    return (
      <div className="px-6 py-8 flex flex-col items-center justify-center text-slate-500 gap-2 border-t border-slate-800">
        <Clock className="w-8 h-8 opacity-20" />
        <p className="text-sm">No history yet.</p>
        <p className="text-xs opacity-50">Analyze a prompt to save it here.</p>
      </div>
    );
  }

  return (
    <div className="border-t border-slate-800 flex flex-col h-full overflow-hidden">
      <div className="px-4 py-3 flex justify-between items-center bg-slate-900/50 border-b border-slate-800/50">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-3 h-3" /> Recent Analysis
        </h3>
        <button 
            onClick={onClear}
            className="text-xs text-slate-500 hover:text-red-400 transition-colors"
        >
            Clear All
        </button>
      </div>
      
      <div className="overflow-y-auto custom-scrollbar max-h-[250px] p-2 space-y-2">
        {history.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            className="group relative bg-slate-800/30 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-700 rounded-lg p-3 cursor-pointer transition-all"
          >
            <div className="flex justify-between items-start gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                    <Star className={`w-3 h-3 ${getScoreColor(item.analysis.score)}`} fill="currentColor" />
                    <span className={`text-xs font-bold ${getScoreColor(item.analysis.score)}`}>
                        {item.analysis.score}/10
                    </span>
                    <span className="text-xs text-slate-500">• {item.analysis.level}</span>
                </div>
                <span className="text-[10px] text-slate-600 font-mono whitespace-nowrap">
                    {formatTime(item.timestamp)}
                </span>
            </div>
            
            <p className="text-sm text-slate-300 line-clamp-2 font-mono leading-relaxed mb-1 pr-6">
                {item.prompt}
            </p>

            <button
                onClick={(e) => onDelete(item.id, e)}
                className="absolute right-2 bottom-2 p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-900/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                title="Remove from history"
            >
                <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;