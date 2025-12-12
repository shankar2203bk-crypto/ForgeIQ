import React, { useState, useEffect } from 'react';
import { runSimulation, runImageGeneration } from '../services/geminiService';
import { SimulationResult } from '../types';
import { Play, Loader2, Globe, ExternalLink, Image as ImageIcon, MessageSquare, Download } from 'lucide-react';

interface SimulationViewProps {
  prompt: string;
}

const SimulationView: React.FC<SimulationViewProps> = ({ prompt }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [mode, setMode] = useState<'text' | 'image'>('text');

  const handleRun = async () => {
    if (!prompt) return;
    setLoading(true);
    // Clear previous result specific to the other mode or to show loading
    setResult(null); 
    
    try {
      let data: SimulationResult;
      if (mode === 'text') {
        data = await runSimulation(prompt);
      } else {
        data = await runImageGeneration(prompt);
      }
      setResult(data);
    } catch (e) {
      setResult({ output: "Error running simulation.", source: mode });
    } finally {
      setLoading(false);
    }
  };

  // Reset result when switching modes to avoid confusion
  useEffect(() => {
    setResult(null);
  }, [mode]);

  return (
    <div className="h-full flex flex-col animate-fade-in">
      {/* Controls Container */}
      <div className="flex flex-col gap-3 mb-4">
        {/* Mode Switcher */}
        <div className="bg-slate-800 p-1 rounded-lg flex self-start">
            <button
                onClick={() => setMode('text')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'text' ? 'bg-slate-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
                <MessageSquare className="w-3.5 h-3.5" /> Text
            </button>
            <button
                onClick={() => setMode('image')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === 'image' ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
                <ImageIcon className="w-3.5 h-3.5" /> Image
            </button>
        </div>

        {/* Context Bar */}
        <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 flex justify-between items-center">
            <div className="text-xs text-slate-400 font-mono truncate max-w-[60%]">
            {prompt || "Enter a prompt..."}
            </div>
            <button 
            onClick={handleRun}
            disabled={loading || !prompt}
            className={`text-xs px-3 py-1.5 rounded flex items-center gap-2 transition-colors font-medium ${loading || !prompt ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/20'}`}
            >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
            {mode === 'text' ? 'Run Simulation' : 'Generate Image'}
            </button>
        </div>
      </div>

      {/* Output Area */}
      <div className="flex-grow bg-black/20 rounded-xl border border-slate-700 p-6 overflow-y-auto min-h-[400px] flex flex-col relative">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-3 bg-slate-900/50 backdrop-blur-sm z-10 rounded-xl">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            <p className="text-sm font-medium">{mode === 'text' ? 'Simulating response...' : 'Dreaming up pixels...'}</p>
          </div>
        ) : result ? (
           mode === 'image' && result.source === 'image' && result.imageData ? (
               <div className="flex flex-col items-center justify-center h-full gap-4 animate-fade-in">
                   <div className="relative group rounded-lg overflow-hidden shadow-2xl border border-slate-700 max-w-full max-h-[500px]">
                       <img src={result.imageData} alt="Generated" className="max-w-full max-h-[500px] object-contain" />
                       <a 
                         href={result.imageData} 
                         download={`forge-iq-${Date.now()}.png`}
                         className="absolute bottom-4 right-4 bg-black/70 hover:bg-black/90 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md"
                         title="Download Image"
                       >
                           <Download className="w-5 h-5" />
                       </a>
                   </div>
                   <div className="text-center">
                     {/* If the model returned text along with the image (unlikely but possible), show it */}
                     {result.output !== "Image generated successfully" && (
                         <p className="text-slate-400 text-xs italic max-w-md">{result.output}</p>
                     )}
                   </div>
               </div>
           ) : (
               // Text logic
               <div className="space-y-6 animate-fade-in">
                <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                  {result.output}
                </div>
                
                {result.groundingUrls && result.groundingUrls.length > 0 && (
                  <div className="pt-4 border-t border-slate-700/50">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase mb-3 flex items-center gap-2">
                      <Globe className="w-3 h-3" /> Sources
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.groundingUrls.map((url, i) => (
                        <a 
                          key={i} 
                          href={url.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-2 py-1.5 rounded border border-slate-700 transition-colors"
                        >
                          {url.title} <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
               </div>
           )
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-2">
             {mode === 'text' ? <MessageSquare className="w-12 h-12 opacity-20" /> : <ImageIcon className="w-12 h-12 opacity-20" />}
            <p className="text-sm">Ready to {mode === 'text' ? 'simulate conversation' : 'generate imagery'}.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationView;