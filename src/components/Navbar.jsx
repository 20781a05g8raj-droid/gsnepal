import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Store,
  Search,
  PlusCircle,
  Database,
  User,
  LogOut,
  Trash2,
  BookOpen,
  ShoppingBag,
  ShieldCheck
} from 'lucide-react';

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
    setIsAddModalOpen,
    setIsConfigModalOpen,
    setIsAuthModalOpen
  } = useApp();

  const pendingCount = (products || []).filter(p => p && !p.is_approved).length;

  const isSeller = userProfile?.isLoggedIn && userProfile?.role === 'seller';
  const isAdmin = userProfile?.isLoggedIn && userProfile?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Clean Brand Logo */}
          <div 
            className="flex items-center gap-3 shrink-0 cursor-pointer" 
            onClick={() => setActiveNav('catalog')}
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-500 p-0.5 shadow-md shadow-indigo-600/20">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Store className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 font-serif">WS NEPAL</span>
                <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full border border-indigo-200">B2B</span>
              </div>
            </div>
          </div>

          {/* Main Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80">
            <button
              onClick={() => setActiveNav('catalog')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeNav === 'catalog'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Products Catalog</span>
            </button>

            <button
              onClick={() => setActiveNav('blog')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeNav === 'blog'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Trade Blog & Guides</span>
            </button>

            {isSeller && (
              <button
                onClick={() => setActiveNav('seller')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeNav === 'seller'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>My Seller Center</span>
              </button>
            )}

            {/* Admin ERP Portal tab - ONLY VISIBLE TO LOGGED IN ADMIN */}
            {isAdmin && (
              <button
                onClick={() => setActiveNav('admin')}
                className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeNav === 'admin'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>Admin ERP Portal</span>
                {pendingCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-extrabold ml-1">
                    {pendingCount}
                  </span>
                )}
              </button>
            )}
          </nav>

          {/* Search Bar */}
          {activeNav === 'catalog' && (
            <div className="hidden md:flex flex-1 max-w-xs items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          )}

          {/* Auth Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Add Product if Seller or Admin */}
            {(isSeller || isAdmin) && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Listing</span>
              </button>
            )}

            {/* Auth Profile / Login */}
            {userProfile && userProfile.isLoggedIn ? (
              <div className="flex items-center gap-2 bg-slate-100 p-1 pl-3 rounded-2xl border border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-900 line-clamp-1">{userProfile.name}</p>
                  <span className={`text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded border ${
                    userProfile.role === 'admin'
                      ? 'bg-purple-100 text-purple-700 border-purple-200'
                      : userProfile.role === 'seller'
                      ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                      : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                  }`}>
                    {userProfile.role}
                  </span>
                </div>

                <button
                  onClick={logoutUser}
                  className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-white transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete your account? This will permanently delete and anonymize all your personal data from ERP & Supabase database.")) {
                      deleteMyAccount();
                    }
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete Account & Purge PII Data"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all"
              >
                <User className="w-4 h-4" />
                <span>Login / Register</span>
              </button>
            )}

            {/* Supabase Config Button */}
            <button
              onClick={() => setIsConfigModalOpen(true)}
              className="p-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"
              title="Supabase Config & SQL Schema"
            >
              <Database className="w-4 h-4 text-indigo-600" />
            </button>
          </div>

        </div>

        {/* Mobile Nav Tabs */}
        <div className="lg:hidden flex items-center justify-between py-2 border-t border-slate-100 overflow-x-auto gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveNav('catalog')}
            className={`px-3 py-1.5 rounded-lg shrink-0 ${activeNav === 'catalog' ? 'bg-indigo-600 text-white' : 'text-slate-600 bg-slate-100'}`}
          >
            Catalog
          </button>
          <button
            onClick={() => setActiveNav('blog')}
            className={`px-3 py-1.5 rounded-lg shrink-0 ${activeNav === 'blog' ? 'bg-indigo-600 text-white' : 'text-slate-600 bg-slate-100'}`}
          >
            Trade Blog
          </button>
          {isSeller && (
            <button
              onClick={() => setActiveNav('seller')}
              className={`px-3 py-1.5 rounded-lg shrink-0 ${activeNav === 'seller' ? 'bg-indigo-600 text-white' : 'text-slate-600 bg-slate-100'}`}
            >
              Seller Center
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => setActiveNav('admin')}
              className={`px-3 py-1.5 rounded-lg shrink-0 ${activeNav === 'admin' ? 'bg-purple-600 text-white' : 'text-purple-700 bg-purple-100'}`}
            >
              Admin ERP ({pendingCount})
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
