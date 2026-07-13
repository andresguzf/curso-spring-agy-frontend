import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const config = {
    success: {
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      iconColor: 'text-emerald-400',
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
    error: {
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30',
      iconColor: 'text-rose-400',
      icon: <AlertCircle className="w-5 h-5" />,
    },
    info: {
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/30',
      iconColor: 'text-indigo-400',
      icon: <Info className="w-5 h-5" />,
    },
  }[type];

  return createPortal(
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] animate-slide-down w-full max-w-sm px-4">
      <div className={`flex items-center gap-3 p-4 rounded-xl border ${config.bgColor} ${config.borderColor} backdrop-blur-xl shadow-lg`}>
        <div className={config.iconColor}>{config.icon}</div>
        <div className="flex-1 text-sm font-medium text-slate-200 pr-2">
          {message}
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-white/5 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>,
    document.body
  );
};

export default Toast;
