import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Store,
  ShieldCheck,
  MessageSquare,
  Heart,
  Mail,
  MapPin,
  Building2,
  CheckCircle2,
  UserCheck,
  PhoneCall,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { DEFAULT_WHATSAPP_NUMBER } from '../lib/supabase';

export default function Footer() {
  const { setActiveNav, setIsAuthModalOpen, userProfile, role, toggleUserRole, setSelectedCategory } = useApp();

  const currentRole = userProfile?.role || role || 'buyer';
  const isSellerMode = currentRole === 'seller';

  const handleCategoryClick = (catName) => {
    if (setSelectedCategory) {
      setSelectedCategory(catName);
    }
    setActiveNav('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#090D16] text-slate-300 mt-16 overflow-hidden border-t border-slate-800/80">
      
      {/* Aesthetic Glowing Gradient Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 via-emerald-400 to-amber-400"></div>

      {/* Decorative Ambient Background Glowing Orbs */}
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10 relative z-10 space-y-12">
        
        {/* Top Grid Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-xs">
          
          {/* Column 1: Brand & Excellence */}
          <div className="space-y-4 lg:pr-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20">
                <div className="w-full h-full bg-[#0F172A] rounded-[14px] flex items-center justify-center">
                  <Store className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-2xl tracking-tight text-white font-serif">WS NEPAL</span>
                  <span className="text-[9px] bg-gradient-to-r from-emerald-400 to-indigo-500 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase shadow-md">
                    B2B HUB
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-semibold">Nepal's #1 Wholesale Sourcing Marketplace</p>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed font-medium">
              Nepal & India’s premier B2B marketplace connecting verified manufacturers, distributors, and bulk trade buyers.
            </p>

            {/* Trust Badges */}
            <div className="pt-1 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 text-[11px] font-bold shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Verified Suppliers
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 text-[11px] font-bold shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                100% Quality Guaranteed
              </span>
            </div>

            {/* Active Mode Status Badge with Quick Toggle */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mode: <strong className="text-white uppercase font-bold">{currentRole}</strong></span>
              </div>

              <button
                onClick={toggleUserRole}
                className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-2 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Change to {isSellerMode ? 'Buyer' : 'Seller'}</span>
              </button>
            </div>
          </div>

          {/* Column 2: B2B Sourcing Hubs */}
          <div className="space-y-3">
            <h3 className="text-white font-extrabold uppercase tracking-wider text-xs flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-400" />
              Sourcing Categories
            </h3>
            <ul className="space-y-2 text-slate-400 font-medium">
              <li>
                <button
                  onClick={() => handleCategoryClick('Medical & Healthcare')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Medical & Surgical Supplies</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Industrial Machinery')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Industrial Machinery & Units</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Agriculture & Food')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Agriculture & Himalayan Spices</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Electronics & Solar')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Solar Energy & Electronics</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('Textiles & Apparel')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Textiles & Wholesale Apparel</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Direct WhatsApp */}
          <div className="space-y-3">
            <h3 className="text-white font-extrabold uppercase tracking-wider text-xs flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              Direct Contact
            </h3>
            
            <div className="space-y-2">
              <a
                href={`https://wa.me/${DEFAULT_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/50 hover:bg-emerald-900/50 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
                  <MessageSquare className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <p className="text-[10px] text-emerald-300 font-extrabold uppercase">WhatsApp Helpline</p>
                  <p className="text-xs text-white font-extrabold group-hover:text-emerald-300 transition-colors">
                    +977 9821863885
                  </p>
                </div>
              </a>

              <a
                href="mailto:support@wsnepal.com"
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/70 border border-slate-800 hover:bg-slate-900 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Official Support</p>
                  <p className="text-xs text-white font-extrabold truncate group-hover:text-indigo-300 transition-colors">
                    support@wsnepal.com
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* Column 4: Office Location */}
          <div className="space-y-3">
            <h3 className="text-white font-extrabold uppercase tracking-wider text-xs flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#F7805D]" />
              Nepal Office Location
            </h3>
            
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 shadow-inner">
              <p className="font-extrabold text-white text-xs">WS Nepal Pvt. Ltd.</p>
              <p className="text-slate-400 leading-relaxed text-[11px] font-medium">
                Ward No. 11, Ranighat<br />
                Mahanagarpalika Birgunj, Parsa<br />
                <strong className="text-emerald-400 font-bold">Nepal 🇳🇵</strong>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Pulsing Green Status */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>© 2026 WS NEPAL. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-300 font-semibold">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> in Nepal
            </span>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Online & Live</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
