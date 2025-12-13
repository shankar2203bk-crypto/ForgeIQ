import React, { useState, useRef } from 'react';
import { AnalysisResult } from './types';
import { analyzePrompt, transcribeAudio } from './services/geminiService';
import AnalysisView from './components/AnalysisView';
import SimulationView from './components/SimulationView';
import Logo from './components/Logo';
import Toast, { ToastType } from './components/Toast';
import LoginPage from './components/LoginPage';
import ExamplePrompts from './components/ExamplePrompts';
import { Sparkles, Activity, PlayCircle, Trash2, LogOut, Mic, Square, Loader2, Car } from 'lucide-react';

function App() {
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // App State
  const [prompt, setPrompt] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'analysis' | 'simulation'>('analysis');
  
  // Audio State
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Toast State
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  const handleAnalyze = async () => {
    if (!prompt.trim()) {
      showToast("Please enter a prompt to analyze.", "info");
      return;
    }
    setAnalyzing(true);
    setActiveTab('analysis');
    try {
      const result = await analyzePrompt(prompt);
      setAnalysis(result);
      showToast("Analysis complete!", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to analyze prompt. Check your connection or API key.", "error");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSelectExample = (examplePrompt: string) => {
    setPrompt(examplePrompt);
    showToast("Example prompt loaded!", "info");
  };

  // Recording Handlers
  const handleMicToggle = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsTranscribing(true);
        // Default to webm if mimeType not available
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        
        // Stop all tracks to release mic
        stream.getTracks().forEach(track => track.stop());

        try {
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64String = reader.result as string;
            // Remove data URL prefix (e.g., "data:audio/webm;base64,")
            const base64Data = base64String.split(',')[1];
            
            const text = await transcribeAudio(base64Data, mimeType);
            
            setPrompt(prev => {
                const spacer = prev.trim().length > 0 ? ' ' : '';
                return prev + spacer + text;
            });
            showToast("Transcription added!", "success");
            setIsTranscribing(false);
          };
        } catch (error) {
          console.error("Transcription failed", error);
          showToast("Failed to transcribe audio.", "error");
          setIsTranscribing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Microphone error:", error);
      showToast("Could not access microphone.", "error");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Render Login Page if not authenticated
  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-primary-500/30 selection:text-white">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <Logo className="w-12 h-12" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Forge<span className="text-primary-500">IQ</span></span>
          </div>
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-4rem)]">
        
        {/* Left Column: Editor */}
        <div className="flex flex-col gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl flex-grow flex flex-col shadow-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary-500/50 transition-all">
            <div className="bg-slate-950/50 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Prompt Editor</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-600 font-mono">{prompt.length} chars</span>
                
                {/* Dictation Button */}
                <button
                    onClick={handleMicToggle}
                    disabled={isTranscribing}
                    className={`p-1.5 rounded transition-all ${
                        isRecording 
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 animate-pulse' 
                        : 'text-slate-500 hover:text-primary-400 hover:bg-white/5'
                    }`}
                    title={isRecording ? "Stop Recording" : "Dictate Prompt"}
                >
                    {isTranscribing ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-500" />
                    ) : isRecording ? (
                        <Square className="w-3.5 h-3.5 fill-current" />
                    ) : (
                        <Mic className="w-3.5 h-3.5" />
                    )}
                </button>

                {prompt.length > 0 && (
                  <button 
                    onClick={() => setPrompt('')}
                    className="text-slate-500 hover:text-red-400 transition-colors p-1 rounded hover:bg-white/5"
                    title="Clear prompt"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
            <textarea
              className="flex-grow bg-transparent p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed placeholder:text-slate-700"
              placeholder="Enter your prompt here to analyze (or click the mic to dictate)..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <ExamplePrompts onSelect={handleSelectExample} />
          </div>
          
          <button
            onClick={handleAnalyze}
            disabled={analyzing || !prompt.trim()}
            className="w-full py-4 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-primary-500/25 flex items-center justify-center gap-2"
          >
            {analyzing ? (
              <span className="animate-pulse">Analyzing Prompt...</span>
            ) : (
              <>
                <Sparkles className="w-5 h-5" /> Analyze & Improve
              </>
            )}
          </button>
        </div>

        {/* Right Column: Output */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-800">
            <button
              onClick={() => setActiveTab('analysis')}
              className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors relative ${activeTab === 'analysis' ? 'text-primary-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Activity className="w-4 h-4" /> Analysis
              {activeTab === 'analysis' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500" />}
            </button>
            <button
              onClick={() => setActiveTab('simulation')}
              className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors relative ${activeTab === 'simulation' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <PlayCircle className="w-4 h-4" /> Simulation
              {activeTab === 'simulation' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500" />}
            </button>
          </div>

          <div className="flex-grow p-6 overflow-y-auto custom-scrollbar">
            {activeTab === 'analysis' ? (
              analysis ? (
                <AnalysisView 
                  result={analysis} 
                  onApplyImproved={(text) => {
                    setPrompt(text);
                    showToast("Improved prompt applied!", "success");
                  }} 
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4">
                  <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
                    <Car className="w-8 h-8 opacity-50" />
                  </div>
                  <p>Enter a prompt and hit analyze to begin.</p>
                </div>
              )
            ) : (
              <SimulationView prompt={prompt} />
            )}
          </div>
        </div>
      </main>

      {/* Global Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}

export default App;