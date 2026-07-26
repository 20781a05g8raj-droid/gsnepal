import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Store,
  ShieldCheck,
  Database,
  MessageSquare,
  Heart,
  Mail,
  MapPin,
  Award,
  Sparkles,
  ArrowRight,
  Lock,
  Building2,
  CheckCircle2,
  RefreshCw,
  UserCheck
} from 'lucide-react';

export default function Footer() {
  const { setActiveNav, setIsAuthModalOpen, userProfile, role, toggleUserRole } = useApp();

  const currentRole = userProfile?.role || role || 'buyer';
  const isSellerMode = currentRole === 'seller';

  return (
    <footer className="relative bg-slate-950 text-slate-300 mt-20 overflow-hidden border-t border-slate-800/80">
      {/* Top Accent Gradient Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-amber-400 via-emerald-400 to-purple-600"></div>

      {/* Decorative Ambient Background Lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10 space-y-12">
        
        {/* Top Grid Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-xs">
          
          {/* Column 1: Brand & Excellence */}
          <div className="space-y-4 lg:pr-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Store className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl tracking-tight text-white font-serif">WS NEPAL</span>
                  <span className="text-[10px] bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-md shadow-sm">
                    B2B LUXURY
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Cross-Border Wholesale Hub</p>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed">
              Nepal & India’s premier multi-vendor wholesale B2B marketplace connecting verified manufacturers, distributors, and bulk trade buyers.
            </p>

            {/* Trust Tags */}
            <div className="pt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Verified Suppliers
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                RLS Data Security
              </span>
            </div>

            {/* Active Mode Status Badge with Quick Toggle */}
            <div className="pt-3 border-t border-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Active Mode: <strong className="text-white uppercase font-bold">{currentRole}</strong></span>
              </div>

              <button
                onClick={toggleUserRole}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline underline-offset-2 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Change to {isSellerMode ? 'Buyer' : 'Seller'}</span>
              </button>
            </div>
          </div>

          {/* Column 2: Navigation & Hubs */}
          <div className="space-y-3">
            <h3 className="text-white font-bold uppercase tracking-wider text-xs flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-400" />
              Marketplace Hub
            </h3>
            <ul className="space-y-2.5 text-slate-400">
              <li>
                <button
                  onClick={() => setActiveNav('catalog')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5 group text-left"
                >
                  <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                  <span>Wholesale Products Catalog</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveNav('blog')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5 group text-left"
                >
                  <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                  <span>Trade Insights & Market Blog</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (!userProfile?.isLoggedIn) {
                      setIsAuthModalOpen(true);
                    } else {
                      setActiveNav('seller');
                    }
                  }}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5 group text-left"
                >
                  <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                  <span>Seller Onboarding & Registration</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (!userProfile?.isLoggedIn) {
                      setIsAuthModalOpen(true);
                    }
                  }}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5 group text-left"
                >
                  <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                  <span>Buyer Trade Account</span>
                </button>
              </li>

              {/* Instant Role Switcher Button */}
              <li className="pt-2">
                <button
                  onClick={toggleUserRole}
                  className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 border border-indigo-500/40 hover:border-amber-400/80 text-white font-bold text-xs shadow-lg shadow-indigo-900/30 transition-all group cursor-pointer"
                  title="Switch between Buyer and Seller mode"
                >
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-amber-400 group-hover:rotate-180 transition-transform duration-500 shrink-0" />
                    <span className="text-left font-extrabold text-[11px] leading-tight">
                      {isSellerMode ? 'Switch to Buyer Mode' : 'Switch to Seller Mode'}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider shrink-0 border ${
                    isSellerMode 
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/40' 
                      : 'bg-emerald-400/20 text-emerald-300 border-emerald-400/40'
                  }`}>
                    {isSellerMode ? 'Seller ➔ Buyer' : 'Buyer ➔ Seller'}
                  </span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Tech & Security Architecture */}
          <div className="space-y-3">
            <h3 className="text-white font-bold uppercase tracking-wider text-xs flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              Enterprise Architecture
            </h3>
            <ul className="space-y-2.5 text-slate-400">
              <li className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                <Database className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-bold text-[11px]">Supabase PostgreSQL Engine</p>
                  <p className="text-[10px] text-slate-500">Real-time sync, high throughput & storage</p>
                </div>
              </li>
              <li className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-bold text-[11px]">Row Level Security (RLS)</p>
                  <p className="text-[10px] text-slate-500">Strict buyer & seller data isolation</p>
                </div>
              </li>
              <li className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                <MessageSquare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-bold text-[11px]">WhatsApp Instant Lead Dispatch</p>
                  <p className="text-[10px] text-slate-500">Direct pre-populated B2B deal negotiation</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Luxury Trade Desk & Contact */}
          <div className="space-y-4">
            <h3 className="text-white font-bold uppercase tracking-wider text-xs flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Trade Support Desk
            </h3>
            
            <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/20 space-y-3 shadow-xl">
              <div className="flex items-center gap-2 text-amber-400 text-[11px] font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Priority Trade Assistance</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Connect directly with Nepal & India manufacturer desks for custom bulk sourcing & trade verification.
              </p>

              <a
                href="https://wa.me/9779821863885?text=Hello%20WS%20Nepal%20Trade%20Desk,%20I%20have%20a%20wholesale%20trade%20inquiry."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-slate-950" />
                <span>Open Trade WhatsApp</span>
              </a>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>Kathmandu, Nepal & New Delhi, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>trade@wsnepal.b2b</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Divider & Credits */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-center sm:text-left">
            <p>© 2026 WS Nepal B2B Marketplace. All rights reserved.</p>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="hover:text-slate-300 transition-colors cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-slate-300 transition-colors cursor-pointer">Terms of Trade</span>
              <span>•</span>
              <span className="hover:text-slate-300 transition-colors cursor-pointer">Security Standards</span>
            </div>
          </div>

          <p className="flex items-center gap-1.5 text-slate-400 font-medium">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for High-Performance B2B Commerce</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
