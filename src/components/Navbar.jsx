import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Store,
  Search,
  PlusCircle,
  User,
  LogOut,
  Trash2,
  BookOpen,
  ShoppingBag,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import { PRESET_CATEGORIES } from '../lib/supabase';

export default function Navbar() {
  const {
    activeNav,
    setActiveNav,
    userProfile,
    logoutUser,
    deleteMyAccount,
    products,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    setIsAddModalOpen,
    setIsAuthModalOpen,
    toggleUserRole,
    role
  } = useApp();

  const pendingCount = (products || []).filter(p => p && !p.is_approved).length;

  const isSeller = userProfile?.isLoggedIn && userProfile?.role === 'seller';
  const isAdmin = userProfile?.isLoggedIn && userProfile?.role === 'admin';

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo: GS NEPAL */}
          <div 
            className="flex items-center gap-3 shrink-0 cursor-pointer group" 
            onClick={() => setActiveNav('catalog')}
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 via-amber-500 to-indigo-600 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-all">
              <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                <Store className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-heading font-extrabold text-xl tracking-tight text-white">GS NEPAL</span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 font-extrabold px-2 py-0.5 rounded border border-amber-400/30 uppercase tracking-widest">
                  B2B
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">Industrial & Trade Sourcing</p>
            </div>
          </div>

          {/* Integrated Professional Search Bar with Category Filter */}
          {activeNav === 'catalog' && (
            <div className="hidden md:flex flex-1 max-w-xl items-center gap-0 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden focus-within:border-amber-400/80 focus-within:ring-1 focus-within:ring-amber-400/30 transition-all shadow-inner">
              
              {/* Category Dropdown Filter inside Search */}
              <div className="relative border-r border-slate-800 bg-slate-900/80 shrink-0">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-transparent pl-3.5 pr-8 py-2.5 text-xs font-semibold text-slate-300 focus:outline-none cursor-pointer hover:text-white"
                >
                  {PRESET_CATEGORIES.map(cat => (
                    <option key={cat} value={cat} className="bg-slate-900 text-slate-200">
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Text Search Input */}
              <div className="relative flex-1 flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search wholesale machinery, medical disposables, spices..."
                  className="w-full pl-10 pr-4 py-2.5 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Main Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800/90">
            <button
              onClick={() => setActiveNav('catalog')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeNav === 'catalog'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Catalog</span>
            </button>

            <button
              onClick={() => setActiveNav('blog')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeNav === 'blog'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Trade Insights</span>
            </button>

            {isSeller && (
              <button
                onClick={() => setActiveNav('seller')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeNav === 'seller'
                    ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Seller Center</span>
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => setActiveNav('admin')}
                className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeNav === 'admin'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-purple-950/80 text-purple-300 hover:bg-purple-900 border border-purple-800/80'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
                <span>Admin ERP</span>
                {pendingCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded-full text-[10px] font-black ml-1">
                    {pendingCount}
                  </span>
                )}
              </button>
            )}
          </nav>

          {/* Action Buttons & Auth */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Prominent "Become a Seller" Button */}
            {!isSeller && (
              <button
                onClick={() => {
                  if (!userProfile?.isLoggedIn) {
                    setIsAuthModalOpen(true);
                  } else {
                    toggleUserRole();
                  }
                }}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 transition-all cursor-pointer group"
              >
                <Sparkles className="w-4 h-4 fill-slate-950 group-hover:scale-110 transition-transform" />
                <span>Become a Seller</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}

            {/* Add Listing if Seller or Admin */}
            {(isSeller || isAdmin) && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-md transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            )}

            {/* User Profile Auth State */}
            {userProfile && userProfile.isLoggedIn ? (
              <div className="flex items-center gap-2 bg-slate-900 p-1 pl-3 rounded-xl border border-slate-800">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-white line-clamp-1">{userProfile.name}</p>
                  <span className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded border ${
                    userProfile.role === 'admin'
                      ? 'bg-purple-950 text-purple-300 border-purple-800'
                      : userProfile.role === 'seller'
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/30'
                      : 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30'
                  }`}>
                    {userProfile.role}
                  </span>
                </div>

                <button
                  onClick={logoutUser}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 shadow-md transition-all"
              >
                <User className="w-4 h-4 text-amber-400" />
                <span>Login / Register</span>
              </button>
            )}

          </div>

        </div>

        {/* Mobile Filter & Tabs */}
        <div className="lg:hidden flex items-center justify-between py-2 border-t border-slate-800 overflow-x-auto gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveNav('catalog')}
            className={`px-3 py-1.5 rounded-lg shrink-0 ${activeNav === 'catalog' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-300 bg-slate-900'}`}
          >
            Catalog
          </button>
          <button
            onClick={() => setActiveNav('blog')}
            className={`px-3 py-1.5 rounded-lg shrink-0 ${activeNav === 'blog' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-300 bg-slate-900'}`}
          >
            Trade Insights
          </button>
          <button
            onClick={() => {
              if (!userProfile?.isLoggedIn) {
                setIsAuthModalOpen(true);
              } else {
                toggleUserRole();
              }
            }}
            className="px-3 py-1.5 rounded-lg shrink-0 bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold"
          >
            Become a Seller
          </button>
        </div>

      </div>
    </header>
  );
}
