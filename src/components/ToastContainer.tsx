import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 md:bottom-auto md:top-6 md:left-auto md:right-6 md:translate-x-0 z-[9999] flex flex-col gap-2 w-full max-w-[calc(100vw-2rem)] sm:max-w-md md:max-w-sm pointer-events-none items-center md:items-end">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full shadow-lg border border-slate-200/80 bg-white/95 backdrop-blur-sm text-[#2C3539] text-xs sm:text-sm font-semibold transition-all duration-300 animate-slide-up max-w-full min-w-0"
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#2B080C] shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-slate-500 shrink-0" />}
          <span className="flex-1 min-w-0 truncate" title={toast.message}>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
