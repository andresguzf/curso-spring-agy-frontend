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
      bgColor: 'bg-emerald-500/10 dark:bg-emerald-500/10',
      borderColor: 'border-emerald-500/35 dark:border-emerald-500/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      icon: <CheckCircle2 className="w-5 h-5" aria-hidden="true" />,
    },
    error: {
      bgColor: 'bg-rose-500/10 dark:bg-rose-500/10',
      borderColor: 'border-rose-500/35 dark:border-rose-500/20',
      iconColor: 'text-rose-600 dark:text-rose-400',
      icon: <AlertCircle className="w-5 h-5" aria-hidden="true" />,
    },
    info: {
      bgColor: 'bg-indigo-500/10 dark:bg-indigo-500/10',
      borderColor: 'border-indigo-500/35 dark:border-indigo-500/20',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      icon: <Info className="w-5 h-5" aria-hidden="true" />,
    },
  }[type];

  return createPortal(
    <div 
      className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] animate-slide-down w-full max-w-sm px-4"
      role="alert"
      aria-live="polite"
    >
      <div className={`flex items-center gap-3 p-4 rounded-xl border ${config.bgColor} ${config.borderColor} backdrop-blur-xl shadow-lg`}>
        <div className={config.iconColor}>{config.icon}</div>
        <div className="flex-1 text-sm font-semibold text-slate-800 dark:text-slate-200 pr-2">
          {message}
        </div>
        <button
          onClick={onClose}
          className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-slate-200/50 dark:hover:bg-white/5 cursor-pointer"
          aria-label="Cerrar notificación"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>,
    document.body
  );
};

export default Toast;
