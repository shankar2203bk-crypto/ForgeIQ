import React from 'react';
import { AnalysisResult } from '../types';
import { Check, X, ArrowRight, Copy, Wand2 } from 'lucide-react';

interface AnalysisViewProps {
  result: AnalysisResult;
  onApplyImproved: (text: string) => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ result, onApplyImproved }) => {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-500 border-green-500';
    if (score >= 5) return 'text-yellow-500 border-yellow-500';
    return 'text-red-500 border-red-500';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Score Header */}
      <div className="flex items-center justify-between bg-slate-800/50 p-6 rounded-xl border border-slate-700">
        <div>
          <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Prompt Score</h2>
          <div className="text-3xl font-bold text-white">{result.level}</div>
        </div>
        <div className={`relative w-24 h-24 flex items-center justify-center rounded-full border-4 ${getScoreColor(result.score)}`}>
          <span className="text-4xl font-bold">{result.score}</span>
          <span className="absolute bottom-4 text-xs font-medium opacity-70">/10</span>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-slate-800/30 p-5 rounded-xl border border-slate-700/50">
        <p className="text-slate-300 leading-relaxed">{result.summary}</p>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-900/10 border border-green-500/20 p-5 rounded-xl">
          <h3 className="flex items-center gap-2 text-green-400 font-semibold mb-3">
            <Check className="w-4 h-4" /> Strengths
          </h3>
          <ul className="space-y-2">
            {result.strengths.map((s, i) => (
              <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                <span className="block w-1 h-1 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-red-900/10 border border-red-500/20 p-5 rounded-xl">
          <h3 className="flex items-center gap-2 text-red-400 font-semibold mb-3">
            <X className="w-4 h-4" /> Weaknesses
          </h3>
          <ul className="space-y-2">
            {result.weaknesses.map((w, i) => (
              <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                <span className="block w-1 h-1 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Improved Prompt */}
      <div className="bg-slate-900 border border-primary-500/30 rounded-xl overflow-hidden shadow-lg shadow-black/20">
        <div className="bg-slate-800/80 px-4 py-3 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-primary-400 font-semibold flex items-center gap-2">
            <Wand2 className="w-4 h-4" /> Recommended Version
          </h3>
          <button 
            onClick={() => onApplyImproved(result.improvedPrompt)}
            className="text-xs bg-primary-600 hover:bg-primary-500 text-white px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5"
          >
            Apply to Editor <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="p-4 bg-black/20">
          <pre className="whitespace-pre-wrap font-mono text-sm text-slate-200 leading-relaxed">
            {result.improvedPrompt}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;
