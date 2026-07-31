import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Database, CheckCircle2, Key, Link2, RefreshCw, Zap, AlertCircle, Loader2, Shield, HardDrive } from 'lucide-react';
import { DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_KEY, DEFAULT_SUPABASE_PROJECT, testSupabaseConnection, isValidSupabaseKey } from '../lib/supabase';

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
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isConfigModalOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    saveConfig(url, key);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const result = await testSupabaseConnection(url, key);
      setTestResult(result);
      if (result.db && result.storage) {
        showToast('✅ Supabase connection successful! DB + Storage both working.', 'success');
      } else if (!result.keyValid) {
        showToast('❌ Invalid Anon Key! Please paste the real key from Supabase Dashboard.', 'error');
      } else {
        showToast('⚠️ Partial connection. Check details below.', 'warning');
      }
    } catch (err) {
      setTestResult({ db: false, storage: false, dbError: err.message, storageError: err.message, keyValid: false });
      showToast('❌ Connection test failed: ' + err.message, 'error');
    }
    setIsTesting(false);
  };

  const currentKeyValid = isValidSupabaseKey(key);

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
        <div className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
          
          {/* Key Status Banner */}
          {!currentKeyValid ? (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
              <div className="flex items-center gap-2 text-rose-800 font-bold">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>⚠️ Invalid Supabase Anon Key Detected!</span>
              </div>
              <p className="text-rose-700 leading-relaxed">
                Your current key (<code className="bg-white px-1.5 py-0.5 rounded border border-rose-300 font-mono text-[10px]">{key?.substring(0, 25)}...</code>) is <strong>NOT a valid JWT token</strong>. 
                Images will NOT upload to Supabase Storage and products will NOT save to the database.
              </p>
              <div className="p-3 bg-white rounded-xl border border-rose-200 text-[11px] space-y-1">
                <p className="font-bold text-slate-900">How to get the real key:</p>
                <ol className="list-decimal list-inside text-slate-700 space-y-0.5">
                  <li>Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline font-bold">supabase.com/dashboard</a></li>
                  <li>Select your project</li>
                  <li>Go to <strong>Project Settings → API</strong></li>
                  <li>Copy the <strong>anon public</strong> key (starts with <code className="bg-slate-100 px-1 rounded">eyJhbGci...</code>)</li>
                  <li>Paste it in the field below</li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Valid Supabase Credentials Configured</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                Active Supabase URL: <code className="bg-white px-2 py-0.5 rounded border border-emerald-300 font-mono text-[11px] text-emerald-900">{url}</code>
              </p>
            </div>
          )}

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
                onChange={(e) => { setUrl(e.target.value); setTestResult(null); }}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono text-[11px] focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-indigo-600" />
                Supabase Anon Public API Key
                {currentKeyValid ? (
                  <span className="text-emerald-600 text-[10px] font-bold ml-1">✓ Valid JWT</span>
                ) : (
                  <span className="text-rose-600 text-[10px] font-bold ml-1">✗ Invalid format</span>
                )}
              </label>
              <input
                type="text"
                value={key}
                onChange={(e) => { setKey(e.target.value); setTestResult(null); }}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-slate-800 font-mono text-[11px] focus:outline-none ${
                  currentKeyValid ? 'border-emerald-300 focus:border-emerald-500' : 'border-rose-300 focus:border-rose-500'
                }`}
              />
              <p className="text-[10px] text-slate-400 mt-1">Real anon key is 200+ characters long, starts with eyJhbGciOi...</p>
            </div>

            {/* Test Connection Button */}
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                isTesting 
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md cursor-pointer'
              }`}
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Testing Connection...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Test Supabase Connection
                </>
              )}
            </button>

            {/* Test Results */}
            {testResult && (
              <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="font-extrabold text-slate-900 text-sm">Connection Test Results</h4>
                
                {!testResult.keyValid && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold text-rose-800">Invalid Anon Key Format</p>
                      <p className="text-rose-700 text-[11px] mt-0.5">{testResult.dbError}</p>
                    </div>
                  </div>
                )}

                {testResult.keyValid && (
                  <>
                    <div className={`p-3 rounded-xl flex items-start gap-2 ${
                      testResult.db ? 'bg-emerald-50 border border-emerald-200' : 'bg-rose-50 border border-rose-200'
                    }`}>
                      {testResult.db ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <p className={`font-bold ${testResult.db ? 'text-emerald-800' : 'text-rose-800'}`}>
                          <Database className="w-3 h-3 inline mr-1" />
                          Database: {testResult.db ? '✅ Connected' : '❌ Failed'}
                        </p>
                        {testResult.dbError && <p className="text-rose-700 text-[11px] mt-0.5">{testResult.dbError}</p>}
                      </div>
                    </div>

                    <div className={`p-3 rounded-xl flex items-start gap-2 ${
                      testResult.storage ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'
                    }`}>
                      {testResult.storage ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <p className={`font-bold ${testResult.storage ? 'text-emerald-800' : 'text-amber-800'}`}>
                          <HardDrive className="w-3 h-3 inline mr-1" />
                          Storage Bucket: {testResult.storage ? '✅ product-images bucket accessible' : '⚠️ Bucket issue'}
                        </p>
                        {testResult.storageError && (
                          <div className="text-[11px] mt-0.5">
                            <p className="text-amber-700">{testResult.storageError}</p>
                            {testResult.storageError.includes('not found') && (
                              <p className="text-slate-600 mt-1 font-bold">Fix: Run the storage bucket SQL from supabase_schema.sql in Supabase SQL Editor.</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

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
