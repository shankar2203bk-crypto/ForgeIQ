import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Trash2, Send, Loader2 } from 'lucide-react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onTranscribe: (blob: Blob) => Promise<void>;
  isAnalyzing: boolean;
}

export default function PromptInput({ value, onChange, onSubmit, onTranscribe, isAnalyzing }: PromptInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (value.trim() && !isAnalyzing) {
          onSubmit();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [value, isAnalyzing, onSubmit]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        
        setIsTranscribing(true);
        try {
          await onTranscribe(blob);
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleClear = () => {
    onChange('');
  };

  const charCount = value.length;

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg fade-in">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-slate-300">Your Prompt</label>
        <span className="text-xs text-slate-500">{charCount} characters</span>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your AI prompt here... (e.g., 'Write a story about a robot')"
        className="w-full h-40 bg-slate-900 text-white rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-slate-600 transition-all"
        disabled={isAnalyzing || isTranscribing}
      />

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isAnalyzing || isTranscribing}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            isRecording
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-slate-700 hover:bg-slate-600 text-white'
          }`}
        >
          {isRecording ? (
            <>
              <MicOff className="w-4 h-4" />
              <span className="text-sm">Stop</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              <span className="text-sm">Record</span>
            </>
          )}
        </button>

        <button
          onClick={handleClear}
          disabled={isAnalyzing || isTranscribing || !value}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-4 h-4" />
          <span className="text-sm">Clear</span>
        </button>

        <button
          onClick={onSubmit}
          disabled={isAnalyzing || isTranscribing || !value.trim()}
          className="flex items-center gap-2 px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 spin" />
              <span className="text-sm">Analyzing...</span>
            </>
          ) : isTranscribing ? (
            <>
              <Loader2 className="w-4 h-4 spin" />
              <span className="text-sm">Transcribing...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span className="text-sm">Analyze</span>
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-slate-500 mt-2">
        Tip: Press <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-slate-300">Ctrl+Enter</kbd> or{' '}
        <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-slate-300">Cmd+Enter</kbd> to analyze
      </p>
    </div>
  );
}
