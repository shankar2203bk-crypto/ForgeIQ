import { Copy, CheckCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import type { PromptAnalysis } from '../types';

interface AnalysisViewProps {
  analysis: PromptAnalysis;
  onCopy: (text: string) => void;
  onUseImproved: (text: string) => void;
}

export default function AnalysisView({ analysis, onCopy, onUseImproved }: AnalysisViewProps) {
  const [copiedImproved, setCopiedImproved] = useState(false);

  const handleCopyImproved = () => {
    onCopy(analysis.improvedPrompt);
    setCopiedImproved(true);
    setTimeout(() => setCopiedImproved(false), 2000);
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-900/50 text-green-400 border-green-700';
      case 'Intermediate':
        return 'bg-yellow-900/50 text-yellow-400 border-yellow-700';
      case 'Advanced':
        return 'bg-red-900/50 text-red-400 border-red-700';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  const scorePercentage = (analysis.qualityScore / 10) * 100;

  return (
    <div className="space-y-6 fade-in">
      <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Quality Score</h3>
          <span className="text-2xl font-bold text-orange-500">{analysis.qualityScore}/10</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-orange-600 to-orange-500 h-full transition-all duration-500"
            style={{ width: `${scorePercentage}%` }}
          />
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-3">Difficulty Level</h3>
        <span className={`inline-block px-4 py-2 rounded-lg border ${getDifficultyColor(analysis.difficultyLevel)} font-medium`}>
          {analysis.difficultyLevel}
        </span>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-3">Strengths</h3>
        <ul className="space-y-2">
          {analysis.strengths.map((strength, index) => (
            <li key={index} className="flex items-start gap-2 text-slate-300">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>{strength}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-3">Weaknesses</h3>
        <ul className="space-y-2">
          {analysis.weaknesses.map((weakness, index) => (
            <li key={index} className="flex items-start gap-2 text-slate-300">
              <div className="w-5 h-5 rounded-full bg-red-900/30 border-2 border-red-600 flex-shrink-0 mt-0.5" />
              <span>{weakness}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-3">Improvement Suggestions</h3>
        <ol className="space-y-3">
          {analysis.suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start gap-3 text-slate-300">
              <span className="flex items-center justify-center w-6 h-6 bg-orange-600 text-white rounded-full text-sm font-bold flex-shrink-0">
                {index + 1}
              </span>
              <span>{suggestion}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 shadow-lg border border-orange-600/30">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Improved Prompt</h3>
          <div className="flex gap-2">
            <button
              onClick={handleCopyImproved}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-all"
            >
              {copiedImproved ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
            <button
              onClick={() => onUseImproved(analysis.improvedPrompt)}
              className="flex items-center gap-2 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-all"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Use This</span>
            </button>
          </div>
        </div>
        <p className="text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-lg border border-slate-700">
          {analysis.improvedPrompt}
        </p>
      </div>
    </div>
  );
}
