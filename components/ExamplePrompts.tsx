import React from 'react';
import { Lightbulb } from 'lucide-react';

interface ExamplePromptsProps {
  onSelect: (prompt: string) => void;
}

const examples = [
  {
    title: 'Summarize Text',
    prompt: 'Summarize the following article into three key bullet points:\n\n[Paste article text here]',
  },
  {
    title: 'Generate Python Script',
    prompt: 'Write a Python script that takes a directory path as a command-line argument and renames all .jpg files in that directory to have a "vacation-" prefix.',
  },
  {
    title: 'Creative Writing',
    prompt: 'Write a short story about a sentient robot that discovers music for the first time. The story should be set in a futuristic, dystopian city.',
  },
  {
    title: 'Generate an Image',
    prompt: 'A photorealistic image of a majestic red fox wearing a tiny steampunk top hat, sitting in a lush, green forest during golden hour.',
  },
];

const ExamplePrompts: React.FC<ExamplePromptsProps> = ({ onSelect }) => {
  return (
    <div className="px-4 py-3 border-t border-slate-800">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Prompt Starters</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {examples.map((ex, i) => (
          <button
            key={i}
            onClick={() => onSelect(ex.prompt)}
            className="text-left p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors group"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-primary-500/70 flex-shrink-0" />
              <p className="text-sm font-medium text-slate-300 group-hover:text-white truncate">{ex.title}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExamplePrompts;
