import { Download, Loader2, ImageIcon } from 'lucide-react';
import type { GeneratedImage } from '../types';

interface ImageGalleryProps {
  images: GeneratedImage[];
  isGenerating: boolean;
  onGenerate: () => void;
  hasPrompt: boolean;
}

export default function ImageGallery({ images, isGenerating, onGenerate, hasPrompt }: ImageGalleryProps) {
  const handleDownload = (image: GeneratedImage) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `generated-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Image Generation</h3>
            <p className="text-sm text-slate-400 mt-1">Generate images from your prompt using AI</p>
          </div>
          <button
            onClick={onGenerate}
            disabled={isGenerating || !hasPrompt}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <ImageIcon className="w-4 h-4" />
                <span>Generate Image</span>
              </>
            )}
          </button>
        </div>

        {!hasPrompt && (
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-8 text-center">
            <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">Enter a prompt to generate images</p>
          </div>
        )}

        {hasPrompt && images.length === 0 && !isGenerating && (
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-8 text-center">
            <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 mb-4">No images generated yet</p>
            <button
              onClick={onGenerate}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-all"
            >
              Generate Your First Image
            </button>
          </div>
        )}

        {isGenerating && (
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-12 text-center">
            <Loader2 className="w-12 h-12 text-orange-500 mx-auto mb-4 spin" />
            <p className="text-slate-300">Creating your image...</p>
            <p className="text-sm text-slate-500 mt-2">This may take a moment</p>
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div key={index} className="bg-slate-800 rounded-lg overflow-hidden shadow-lg fade-in">
              <img src={image.url} alt={image.prompt} className="w-full h-64 object-cover" />
              <div className="p-4">
                <p className="text-sm text-slate-400 mb-3 line-clamp-2">{image.prompt}</p>
                <button
                  onClick={() => handleDownload(image)}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-all w-full justify-center"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
