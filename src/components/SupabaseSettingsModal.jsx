import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Database, CheckCircle2, Key, Link2, RefreshCw, Zap } from 'lucide-react';
import { DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_KEY, DEFAULT_SUPABASE_PROJECT } from '../lib/supabase';

export default function SupabaseSettingsModal() {
  const {
    isConfigModalOpen,
    setIsConfigModalOpen,
    supabaseConfig,
    saveConfig,
    resetData,
    showToast
  } = useApp();

  const [url, setUrl] = useState(supabaseConfig.url || DEFAULT_SUPABASE_URL);
  const [key, setKey] = useState(supabaseConfig.key || DEFAULT_SUPABASE_KEY);

  if (!isConfigModalOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    saveConfig(url, key);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Supabase Backend Integration</h3>
              <p className="text-xs text-slate-500">Live PostgreSQL Database Connected • Project: {DEFAULT_SUPABASE_PROJECT}</p>
            </div>
          </div>

          <button
            onClick={() => setIsConfigModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-xs">
          
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Live Supabase Credentials Configured ({DEFAULT_SUPABASE_PROJECT})</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Active Supabase URL: <code className="bg-white px-2 py-0.5 rounded border border-emerald-300 font-mono text-[11px] text-emerald-900">{DEFAULT_SUPABASE_URL}</code>
            </p>
            <p className="text-slate-600">
              Public Anon API Key: <code className="bg-white px-2 py-0.5 rounded border border-emerald-300 font-mono text-[10px] text-emerald-900 truncate block max-w-full">{DEFAULT_SUPABASE_KEY}</code>
            </p>
          </div>

          {/* Configuration Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-indigo-600" />
                Supabase Project URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono text-[11px] focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-indigo-600" />
                Supabase Anon Public API Key
              </label>
              <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono text-[11px] focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  resetData();
                  showToast('Reset seed data restored.', 'info');
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
                Reset Mock Seeds
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsConfigModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all"
                >
                  Save Supabase Credentials
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
