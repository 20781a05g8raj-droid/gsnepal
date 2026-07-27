import React, { useState } from 'react';
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
  Menu,
  X,
  ChevronRight,
  Grid,
  Filter,
  Sparkles
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
    setIsConfigModalOpen,
    setIsAuthModalOpen
  } = useApp();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pendingCount = (products || []).filter(p => p && !p.is_approved).length;

  const isSeller = userProfile?.isLoggedIn && userProfile?.role === 'seller';
  const isAdmin = userProfile?.isLoggedIn && userProfile?.role === 'admin';

  // Handle Search Input - resets category to All Categories so search finds all products
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim() !== '' && setSelectedCategory) {
      setSelectedCategory('All Categories');
    }
    if (activeNav !== 'catalog') {
      setActiveNav('catalog');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleNavClick = (navTarget) => {
    setActiveNav(navTarget);
    setIsMenuOpen(false);
  };

  const handleCategorySelect = (catName) => {
    if (setSelectedCategory) {
      setSelectedCategory(catName);
    }
    setSearchQuery(''); // clear query when selecting specific category card
    setActiveNav('catalog');
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          
          {/* Main Top Header Row */}
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
            
            {/* Left: Menu Button & Brand Logo */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Menu Hamburger Button */}
              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-800 font-extrabold text-xs transition-all border border-slate-200 active:scale-95 cursor-pointer shadow-sm"
                title="Open Navigation Menu"
                aria-label="Open Menu"
              >
                <Menu className="w-5 h-5 text-indigo-600 shrink-0" />
                <span className="font-extrabold text-xs">Menu</span>
              </button>

              {/* Brand Logo */}
              <div 
                className="flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none" 
                onClick={() => handleNavClick('catalog')}
              >
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-500 p-0.5 shadow-md shadow-indigo-600/20">
                  <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                    <Store className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900 font-serif">WS NEPAL</span>
                    <span className="text-[9px] sm:text-xs bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.5 rounded-full border border-indigo-200">B2B</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Search Bar (Hidden on small mobile, visible on md+) */}
            <div className="hidden md:flex flex-1 max-w-md items-center gap-2 mx-2">
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search products, suppliers, equipment..."
                  className="w-full pl-10 pr-9 py-2 bg-slate-100/90 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-full p-1 transition-all"
                    title="Clear Search"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80 shrink-0">
              <button
                type="button"
                onClick={() => handleNavClick('catalog')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeNav === 'catalog'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Products Catalog</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('blog')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeNav === 'blog'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Trade Blog</span>
              </button>

              {isSeller && (
                <button
                  type="button"
                  onClick={() => handleNavClick('seller')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeNav === 'seller'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Seller Center</span>
                </button>
              )}

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => handleNavClick('admin')}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeNav === 'admin'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>Admin ERP</span>
                  {pendingCount > 0 && (
                    <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-extrabold ml-1">
                      {pendingCount}
                    </span>
                  )}
                </button>
              )}
            </nav>

            {/* Right: Auth Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              
              {/* Add Product Button */}
              {(isSeller || isAdmin) && (
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Listing</span>
                </button>
              )}

              {/* Auth Profile / Login */}
              {userProfile && userProfile.isLoggedIn ? (
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 pl-2 sm:pl-2.5 rounded-2xl border border-slate-200">
                  <div className="text-right hidden xl:block">
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
                    type="button"
                    onClick={logoutUser}
                    className="p-1.5 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-white transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete your account? This will permanently delete and anonymize all your personal data from ERP & Supabase database.")) {
                        deleteMyAccount();
                      }
                    }}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Account & Purge PII Data"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span className="inline">Login</span>
                </button>
              )}
            </div>

          </div>

          {/* Dedicated Mobile Search Bar Row (Visible on screens < md) */}
          <div className="md:hidden pb-2.5 pt-0.5">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-600" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search products in Nepal B2B..."
                className="w-full pl-9 pr-8 py-2 bg-slate-100/90 border border-indigo-200 rounded-xl text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all font-semibold shadow-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 bg-slate-200 rounded-full p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation Quick Tabs */}
          <div className="lg:hidden flex items-center justify-between py-2 border-t border-slate-100 overflow-x-auto gap-2 text-xs font-semibold scrollbar-none">
            <button
              type="button"
              onClick={() => handleNavClick('catalog')}
              className={`px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1 ${activeNav === 'catalog' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 bg-slate-100'}`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Products Catalog</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('blog')}
              className={`px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1 ${activeNav === 'blog' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 bg-slate-100'}`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Trade Blog</span>
            </button>

            {isSeller && (
              <button
                type="button"
                onClick={() => handleNavClick('seller')}
                className={`px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1 ${activeNav === 'seller' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 bg-slate-100'}`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Seller Center</span>
              </button>
            )}

            {isAdmin && (
              <button
                type="button"
                onClick={() => handleNavClick('admin')}
                className={`px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1 ${activeNav === 'admin' ? 'bg-purple-600 text-white font-bold' : 'text-purple-700 bg-purple-100'}`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin ERP ({pendingCount})</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Global Slide-Over Navigation Menu Drawer (rendered with z-[100] outside sticky header context) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          
          {/* Dark Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Side Drawer Panel */}
          <div className="relative z-[110] w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto transform transition-transform duration-300">
            
            {/* Menu Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900 text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-emerald-400 p-0.5 shadow-md">
                  <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                    <Store className="w-5 h-5 text-indigo-400" />
                  </div>
                </div>
                <div>
                  <h2 className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                    WS NEPAL Menu
                  </h2>
                  <p className="text-[11px] text-slate-400">B2B Wholesale & Product Marketplace</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close Menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Menu Drawer Body Content */}
            <div className="p-5 space-y-6 flex-1 overflow-y-auto">
              
              {/* Drawer Search Input */}
              <div className="space-y-1.5 bg-indigo-50/60 p-3 rounded-2xl border border-indigo-100">
                <label className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Search Products & Suppliers</span>
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Type to search all products..."
                    className="w-full pl-9 pr-8 py-2.5 bg-white border border-indigo-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 font-medium transition-all shadow-sm"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Primary Navigation Buttons */}
              <div className="space-y-2">
                <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Navigation Pages</p>

                <button
                  type="button"
                  onClick={() => handleNavClick('catalog')}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                    activeNav === 'catalog'
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-lg shadow-indigo-600/20'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${activeNav === 'catalog' ? 'bg-indigo-700 text-white' : 'bg-white text-indigo-600 shadow-sm'}`}>
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-extrabold text-sm">Products Catalog</p>
                      <p className={`text-[11px] ${activeNav === 'catalog' ? 'text-indigo-100' : 'text-slate-500'}`}>Explore direct wholesale listings</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 ${activeNav === 'catalog' ? 'text-indigo-200' : 'text-slate-400'}`} />
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick('blog')}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                    activeNav === 'blog'
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-lg shadow-indigo-600/20'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${activeNav === 'blog' ? 'bg-indigo-700 text-white' : 'bg-white text-indigo-600 shadow-sm'}`}>
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-extrabold text-sm">Trade Blog & Sourcing Guides</p>
                      <p className={`text-[11px] ${activeNav === 'blog' ? 'text-indigo-100' : 'text-slate-500'}`}>Supplier directory & market trends</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 ${activeNav === 'blog' ? 'text-indigo-200' : 'text-slate-400'}`} />
                </button>

                {isSeller && (
                  <button
                    type="button"
                    onClick={() => handleNavClick('seller')}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                      activeNav === 'seller'
                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-lg shadow-indigo-600/20'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${activeNav === 'seller' ? 'bg-indigo-700 text-white' : 'bg-white text-indigo-600 shadow-sm'}`}>
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-extrabold text-sm">My Seller Center</p>
                        <p className={`text-[11px] ${activeNav === 'seller' ? 'text-indigo-100' : 'text-slate-500'}`}>Manage products & sales journal</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 ${activeNav === 'seller' ? 'text-indigo-200' : 'text-slate-400'}`} />
                  </button>
                )}

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => handleNavClick('admin')}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                      activeNav === 'admin'
                        ? 'bg-purple-600 text-white border-purple-700 shadow-lg shadow-purple-600/20'
                        : 'bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${activeNav === 'admin' ? 'bg-purple-700 text-white' : 'bg-white text-purple-700 shadow-sm'}`}>
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-extrabold text-sm">Admin ERP Portal</p>
                        <p className={`text-[11px] ${activeNav === 'admin' ? 'text-purple-100' : 'text-purple-600'}`}>Product approvals & ERP records</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-amber-400 text-slate-900 rounded-full text-[10px] font-extrabold">
                      {pendingCount} Pending
                    </span>
                  </button>
                )}
              </div>

              {/* Product Categories Shortcuts */}
              <div className="space-y-2.5 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Grid className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Browse Product Categories</span>
                  </p>
                  <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">Direct Filter</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    'All Categories',
                    'Medical & Healthcare',
                    'Industrial Machinery',
                    'Agriculture & Food',
                    'Electronics & Solar',
                    'Textiles & Apparel',
                    'Construction Materials',
                    'Chemicals & Plastics'
                  ].map(catName => {
                    const isCatActive = selectedCategory === catName && activeNav === 'catalog' && !searchQuery;
                    return (
                      <button
                        key={catName}
                        type="button"
                        onClick={() => handleCategorySelect(catName)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                          isCatActive
                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <span className="line-clamp-1">{catName}</span>
                        <ChevronRight className={`w-3.5 h-3.5 shrink-0 ml-1 ${isCatActive ? 'text-white' : 'text-slate-400'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 space-y-2.5">
                {(isSeller || isAdmin) && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsAddModalOpen(true);
                    }}
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add Product Listing</span>
                  </button>
                )}

                {!userProfile || !userProfile.isLoggedIn ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <User className="w-4 h-4" />
                    <span>Login / Register Account</span>
                  </button>
                ) : (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{userProfile.name}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-extrabold">{userProfile.role}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        logoutUser();
                        setIsMenuOpen(false);
                      }}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold border border-rose-200 flex items-center gap-1 transition-all"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Menu Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500 font-medium shrink-0">
              <p className="font-bold text-slate-700">WS NEPAL B2B Sourcing Platform</p>
              <p className="text-[10px] text-slate-400">Direct Wholesale Sourcing in Nepal & India</p>
            </div>

          </div>
        </div>
      )}
    </>
  );
}


