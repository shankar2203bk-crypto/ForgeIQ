import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import type { Toast as ToastType } from '../types';

interface ToastProps {
  toast: ToastType;
  onClose: (id: string) => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <XCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
  };

  const colors = {
    success: 'bg-green-900/50 border-green-700',
    error: 'bg-red-900/50 border-red-700',
    info: 'bg-blue-900/50 border-blue-700',
  };

  return (
    <div
      className={`${colors[toast.type]} border rounded-lg p-4 flex items-start gap-3 shadow-lg fade-in max-w-md`}
    >
      {icons[toast.type]}
      <p className="flex-1 text-sm text-white">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="text-slate-400 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
