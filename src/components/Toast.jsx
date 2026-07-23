import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';

export default function Toast() {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  const { message, type } = toastMessage;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 pointer-events-none">
      <div className={`px-4 py-3 rounded-2xl glass-panel shadow-2xl border flex items-center gap-3 text-xs font-semibold max-w-md ${
        type === 'success'
          ? 'border-emerald-500/40 text-emerald-300 bg-emerald-950/80'
          : type === 'warning'
          ? 'border-rose-500/40 text-rose-300 bg-rose-950/80'
          : 'border-indigo-500/40 text-indigo-300 bg-indigo-950/80'
      }`}>
        {type === 'success' ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        ) : type === 'warning' ? (
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
        ) : (
          <Info className="w-5 h-5 text-indigo-400 shrink-0" />
        )}
        <span>{message}</span>
      </div>
    </div>
  );
}
