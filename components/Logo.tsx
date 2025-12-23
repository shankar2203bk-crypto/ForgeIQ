import { Sparkles } from 'lucide-react';

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-lg">
        <Sparkles className="w-6 h-6 text-white" />
      </div>
      <div>
        <h1 className="text-xl font-bold text-white">Prompt Improver</h1>
        <p className="text-xs text-slate-400">AI-Powered Enhancement</p>
      </div>
    </div>
  );
}
