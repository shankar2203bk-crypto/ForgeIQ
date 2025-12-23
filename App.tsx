import { useState, useEffect } from 'react';
import { Key, Loader2 } from 'lucide-react';
import Logo from './components/Logo';
import PromptInput from './components/PromptInput';
import AnalysisView from './components/AnalysisView';
import ImageGallery from './components/ImageGallery';
import HistoryPanel from './components/HistoryPanel';
import Toast from './components/Toast';
import { initializeGemini, isInitialized, analyzePrompt, transcribeAudio, generateImage } from './services/geminiService';
import type { PromptAnalysis, HistoryItem, Toast as ToastType, GeneratedImage } from './types';

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);
  const [prompt, setPrompt] = useState('');
  const [analysis, setAnalysis] = useState<PromptAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const [activeTab, setActiveTab] = useState<'analysis' | 'image'>('analysis');
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini_api_key');
    const savedHistory = localStorage.getItem('prompt_history');

    if (savedApiKey) {
      setApiKey(savedApiKey);
      initializeGemini(savedApiKey);
      setShowApiKeyInput(false);
    }

    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error loading history:', error);
      }
    }
  }, []);

  const addToast = (message: string, type: ToastType['type'] = 'info') => {
    const toast: ToastType = {
      id: Date.now().toString(),
      message,
      type,
    };
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleApiKeySubmit = () => {
    if (!apiKey.trim()) {
      addToast('Please enter a valid API key', 'error');
      return;
    }

    try {
      initializeGemini(apiKey);
      localStorage.setItem('gemini_api_key', apiKey);
      setShowApiKeyInput(false);
      addToast('API key saved successfully!', 'success');
    } catch (error) {
      addToast('Failed to initialize Gemini API', 'error');
    }
  };

  const handleAnalyze = async () => {
    if (!prompt.trim()) {
      addToast('Please enter a prompt', 'error');
      return;
    }

    if (!isInitialized()) {
      addToast('Please configure your API key first', 'error');
      setShowApiKeyInput(true);
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzePrompt(prompt);
      setAnalysis(result);
      setActiveTab('analysis');

      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        originalPrompt: prompt,
        analysis: result,
      };

      const updatedHistory = [historyItem, ...history].slice(0, 50);
      setHistory(updatedHistory);
      localStorage.setItem('prompt_history', JSON.stringify(updatedHistory));

      addToast('Analysis complete!', 'success');
    } catch (error) {
      console.error('Analysis error:', error);
      addToast('Failed to analyze prompt. Check your API key and try again.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTranscribe = async (blob: Blob) => {
    if (!isInitialized()) {
      addToast('Please configure your API key first', 'error');
      setShowApiKeyInput(true);
      return;
    }

    try {
      const transcription = await transcribeAudio(blob);
      setPrompt((prev) => (prev ? `${prev} ${transcription}` : transcription));
      addToast('Transcription complete!', 'success');
    } catch (error) {
      console.error('Transcription error:', error);
      addToast('Failed to transcribe audio. Please try again.', 'error');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast('Copied to clipboard!', 'success');
  };

  const handleUseImproved = (text: string) => {
    setPrompt(text);
    addToast('Improved prompt loaded!', 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadHistory = (item: HistoryItem) => {
    setPrompt(item.originalPrompt);
    setAnalysis(item.analysis);
    setActiveTab('analysis');
    addToast('History item loaded!', 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('prompt_history');
    addToast('History cleared!', 'success');
  };

  const handleLoadExample = (example: string) => {
    setPrompt(example);
    addToast('Example prompt loaded!', 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      addToast('Please enter a prompt', 'error');
      return;
    }

    if (!isInitialized()) {
      addToast('Please configure your API key first', 'error');
      setShowApiKeyInput(true);
      return;
    }

    setIsGeneratingImage(true);
    try {
      const imageUrl = await generateImage(prompt);
      const newImage: GeneratedImage = {
        url: imageUrl,
        prompt: prompt,
        timestamp: Date.now(),
      };
      setGeneratedImages((prev) => [newImage, ...prev]);
      addToast('Image generated successfully!', 'success');
    } catch (error) {
      console.error('Image generation error:', error);
      addToast('Failed to generate image. This feature may not be available.', 'error');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  if (showApiKeyInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Logo />
            <p className="text-slate-400 mt-4">Enter your Gemini API key to get started</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Gemini API Key
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleApiKeySubmit()}
                  placeholder="Enter your API key"
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-slate-600"
                />
              </div>
            </div>

            <button
              onClick={handleApiKeySubmit}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-all"
            >
              Continue
            </button>

            <div className="mt-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
              <p className="text-xs text-slate-400">
                Don't have an API key?{' '}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:text-orange-400 underline"
                >
                  Get one free from Google
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <Logo />
          <button
            onClick={() => setShowApiKeyInput(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm transition-all"
          >
            <Key className="w-4 h-4" />
            <span>Change API Key</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PromptInput
              value={prompt}
              onChange={setPrompt}
              onSubmit={handleAnalyze}
              onTranscribe={handleTranscribe}
              isAnalyzing={isAnalyzing}
            />

            {(analysis || isAnalyzing) && (
              <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
                <div className="flex border-b border-slate-700">
                  <button
                    onClick={() => setActiveTab('analysis')}
                    className={`flex-1 px-6 py-3 font-medium transition-all ${
                      activeTab === 'analysis'
                        ? 'bg-slate-900 text-orange-500 border-b-2 border-orange-500'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Analysis
                  </button>
                  <button
                    onClick={() => setActiveTab('image')}
                    className={`flex-1 px-6 py-3 font-medium transition-all ${
                      activeTab === 'image'
                        ? 'bg-slate-900 text-orange-500 border-b-2 border-orange-500'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Image
                  </button>
                </div>

                <div className="p-6">
                  {isAnalyzing && activeTab === 'analysis' ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Loader2 className="w-12 h-12 text-orange-500 spin mb-4" />
                      <p className="text-slate-300 font-medium">Analyzing your prompt...</p>
                      <p className="text-sm text-slate-500 mt-2">This may take a few seconds</p>
                    </div>
                  ) : activeTab === 'analysis' && analysis ? (
                    <AnalysisView
                      analysis={analysis}
                      onCopy={handleCopy}
                      onUseImproved={handleUseImproved}
                    />
                  ) : activeTab === 'image' ? (
                    <ImageGallery
                      images={generatedImages}
                      isGenerating={isGeneratingImage}
                      onGenerate={handleGenerateImage}
                      hasPrompt={!!prompt.trim()}
                    />
                  ) : null}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <HistoryPanel
              history={history}
              onLoadHistory={handleLoadHistory}
              onClearHistory={handleClearHistory}
              onLoadExample={handleLoadExample}
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </div>
  );
}
