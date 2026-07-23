import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Database, CheckCircle2, Key, Link2, RefreshCw } from 'lucide-react';

export default function SupabaseSettingsModal() {
  const {
    isConfigModalOpen,
    setIsConfigModalOpen,
    supabaseConfig,
    saveConfig,
    resetData,
    showToast
  } = useApp();

  const [url, setUrl] = useState(supabaseConfig.url || '');
  const [key, setKey] = useState(supabaseConfig.key || '');

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
              <h3 className="font-bold text-slate-900 text-lg">Supabase Backend Configuration</h3>
              <p className="text-xs text-slate-500">Documentation Step 1 & 3 Backend Integration</p>
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
              <CheckCircle2 className="w-4 h-4" />
              <span>Hybrid Client-Side Fallback Active</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              This application works instantly using <strong>Client-Side Local Storage Seed Mode</strong> so you can test all features (Buyer Catalog, WhatsApp Link Generator, Seller RLS isolation, and Admin Approvals) without configuring API keys first.
            </p>
            <p className="text-slate-500">
              Enter your live Supabase credentials below anytime to connect your remote PostgreSQL database.
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
