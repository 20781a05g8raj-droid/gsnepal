import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import BuyerCatalog from './components/BuyerCatalog';
import BlogSection from './components/BlogSection';
import SellerDashboard from './components/SellerDashboard';
import AdminPanel from './components/AdminPanel';
import ProductDetailModal from './components/ProductDetailModal';
import AddProductModal from './components/AddProductModal';
import SupabaseSettingsModal from './components/SupabaseSettingsModal';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import {
  Store,
  ShieldCheck,
  Database,
  MessageSquare,
  Heart
} from 'lucide-react';

function MainContent() {
  const { activeNav, setActiveNav, products, setRole } = useApp();

  const pendingCount = (products || []).filter(p => p && !p.is_approved).length;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white">
      
      {/* Top Header Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Dynamic View rendering with ErrorBoundary */}
        <ErrorBoundary>
          {activeNav === 'catalog' && <BuyerCatalog />}
          {activeNav === 'blog' && <BlogSection />}
          {activeNav === 'seller' && <SellerDashboard />}
          {activeNav === 'admin' && <AdminPanel />}
        </ErrorBoundary>

      </main>

      {/* Modals & Overlays */}
      <ProductDetailModal />
      <AddProductModal />
      <SupabaseSettingsModal />
      <AuthModal />
      <Toast />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-16 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
            
            {/* Brand Info */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-indigo-600" />
                <span className="font-extrabold text-lg text-slate-900 font-serif">WS NEPAL B2B</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Multi-vendor B2B marketplace platform for Nepal & India manufacturers, wholesalers, and trade buyers.
              </p>
            </div>

            {/* Quick Navigation Links */}
            <div className="space-y-2">
              <p className="font-bold uppercase tracking-wider text-slate-400">Navigation</p>
              <ul className="space-y-1.5 text-slate-600">
                <li>
                  <button onClick={() => setActiveNav('catalog')} className="hover:text-indigo-600 transition-colors">
                    Products Catalog & Search
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveNav('blog')} className="hover:text-indigo-600 transition-colors">
                    Trade Insights & B2B Blog
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setActiveNav('seller');
                      setRole('seller');
                    }} 
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Seller Portal & Product Submissions
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setActiveNav('admin');
                      setRole('admin');
                    }} 
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Admin Approvals ({pendingCount} pending)
                  </button>
                </li>
              </ul>
            </div>

            {/* Architecture Specs */}
            <div className="space-y-2">
              <p className="font-bold uppercase tracking-wider text-slate-400">Backend Architecture</p>
              <ul className="space-y-1.5 text-slate-600 font-medium">
                <li className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Supabase PostgreSQL & Auth</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>Row Level Security (RLS)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp Lead Inquiry Generator</span>
                </li>
              </ul>
            </div>

            {/* Direct Inquiry Info */}
            <div className="space-y-3">
              <p className="font-bold uppercase tracking-wider text-slate-400">WhatsApp Inquiry System</p>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="text-slate-900 font-bold">Direct Buyer-Seller Chat</p>
                <p className="text-[11px] text-slate-600">
                  Pre-populates product name, price, MOQ, and link into WhatsApp chat for fast trade negotiation.
                </p>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© 2026 WS Nepal B2B Marketplace. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for High Performance B2B Commerce
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
