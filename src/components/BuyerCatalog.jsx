import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Building2,
  MapPin,
  ShieldCheck,
  Eye,
  ArrowUpRight,
  Filter,
  Zap,
  Package,
  Image as ImageIcon
} from 'lucide-react';
import { PRESET_CATEGORIES, DEFAULT_WHATSAPP_NUMBER } from '../lib/supabase';

export default function BuyerCatalog() {
  const {
    products = [],
    userProfile,
    searchQuery,
    selectedCategory,
    setSelectedCategory,
    setSelectedProductModal,
    showToast
  } = useApp();

  // Parallax Scroll Offset State
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Buyer sees ONLY approved products per Supabase RLS documentation policy
  const approvedProducts = (products || []).filter(p => p && p.is_approved);

  const filteredProducts = approvedProducts.filter(p => {
    const matchesCategory = selectedCategory === 'All Categories' || p.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.subcategory && p.subcategory.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.seller_name && p.seller_name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleWhatsAppClick = (e, product) => {
    if (e) e.stopPropagation();
    const phone = (product && product.seller_phone) ? product.seller_phone : DEFAULT_WHATSAPP_NUMBER;
    const prodName = product ? product.name : 'Wholesale Sourcing Inquiry';
    const prodPrice = product ? `Rs. ${(Number(product.price) || 0).toLocaleString()} / ${product.unit}` : 'N/A';
    const prodMoq = product ? product.moq : 'Bulk Order';
    const prodCategory = product ? `${product.category} (${product.subcategory || 'General'})` : 'B2B Catalog';

    // Dynamic Inquirer details based on currently LOGGED-IN user profile
    const buyerName = (userProfile && userProfile.isLoggedIn) ? userProfile.name : 'Guest Visitor';
    const buyerEmail = (userProfile && userProfile.isLoggedIn) ? userProfile.email : 'N/A';
    const buyerId = (userProfile && userProfile.isLoggedIn) ? userProfile.id : 'Guest';
    const buyerRole = (userProfile && userProfile.isLoggedIn) ? userProfile.role.toUpperCase() : 'BUYER';
    const buyerPhone = (userProfile && userProfile.isLoggedIn && userProfile.phone) ? userProfile.phone : 'N/A';

    const message = `Hello WS Nepal B2B Team / ${product?.seller_name || 'Supplier'},\n\n` +
      `I want to inquire about bulk wholesale sourcing:\n\n` +
      `*Product:* ${prodName}\n` +
      `*Category:* ${prodCategory}\n` +
      `*Price:* ${prodPrice}\n` +
      `*MOQ:* ${prodMoq}\n\n` +
      `-----------------------------------\n` +
      `*INQUIRER DETAILS (Logged-In User):*\n` +
      `*Account Name:* ${buyerName}\n` +
      `*User ID / Role:* ${buyerId} (${buyerRole})\n` +
      `*Email:* ${buyerEmail}\n` +
      `*WhatsApp Contact:* +${buyerPhone}\n` +
      `-----------------------------------\n\n` +
      `Please share availability and bulk quotation.`;
    
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    if (showToast) showToast(`WhatsApp inquiry prepared for ${buyerName} (+${phone})`, 'success');
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Bright Hero Section with AI Parallax Background Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 border border-indigo-200 p-5 sm:p-12 shadow-2xl min-h-[360px] sm:min-h-[420px] flex items-center">
        
        {/* Parallax Background Banner Image */}
        <div 
          className="absolute inset-0 w-full h-[135%] -top-[15%] pointer-events-none transition-transform ease-out duration-100 bg-cover bg-center opacity-90"
          style={{
            transform: `translate3d(0, ${scrollY * 0.22}px, 0)`,
            backgroundImage: `url('/b2b_hero_background.png')`
          }}
        />

        {/* Ambient Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/60 to-slate-900/30" />

        {/* Content Box */}
        <div className="relative z-10 max-w-3xl space-y-4 sm:space-y-5 text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-indigo-600/40 text-indigo-200 text-[11px] sm:text-xs font-bold border border-indigo-400/40 backdrop-blur-md shadow-md">
            <Zap className="w-3.5 h-3.5 text-indigo-300" />
            <span>AI Parallax Background • Multi-Vendor B2B Marketplace</span>
          </div>

          <h1 className="text-2xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
            Direct Wholesale & <span className="text-teal-300">Industrial Product Sourcing</span>
          </h1>

          <p className="text-slate-100 text-xs sm:text-base leading-relaxed font-medium drop-shadow">
            Source medical disposables, syringes, industrial machinery, and agricultural produce directly from verified suppliers in Nepal & India.
          </p>

          {/* Clean WhatsApp Logo Icon Button */}
          <div className="pt-1">
            <button
              onClick={(e) => handleWhatsAppClick(e, null)}
              className="p-3 sm:p-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white shadow-xl shadow-emerald-950/60 border border-emerald-300/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              title="Chat on WhatsApp"
            >
              {/* WhatsApp SVG Logo */}
              <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </button>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 pt-2">
            <div className="bg-slate-900/80 backdrop-blur-md p-2.5 sm:p-4 rounded-2xl border border-slate-700/80 shadow-lg">
              <p className="text-lg sm:text-2xl font-extrabold text-white">{approvedProducts.length}+</p>
              <p className="text-[9px] sm:text-xs text-slate-300 font-medium">Approved Products</p>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-md p-2.5 sm:p-4 rounded-2xl border border-slate-700/80 shadow-lg">
              <p className="text-lg sm:text-2xl font-extrabold text-emerald-400">100%</p>
              <p className="text-[9px] sm:text-xs text-slate-300 font-medium">Verified Wholesalers</p>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-md p-2.5 sm:p-4 rounded-2xl border border-slate-700/80 shadow-lg">
              <p className="text-lg sm:text-2xl font-extrabold text-indigo-300">Direct</p>
              <p className="text-[9px] sm:text-xs text-slate-300 font-medium">WhatsApp Leads</p>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-md p-2.5 sm:p-4 rounded-2xl border border-slate-700/80 shadow-lg">
              <p className="text-lg sm:text-2xl font-extrabold text-purple-300">Parallax</p>
              <p className="text-[9px] sm:text-xs text-slate-300 font-medium">AI Banner Active</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills Filter */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm sm:text-base">
            <Filter className="w-4 h-4 text-indigo-600" />
            <span>Product Categories</span>
          </div>
          <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
            Showing {filteredProducts.length} approved products
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none">
          {PRESET_CATEGORIES.map(cat => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Forced Mobile 2-Column Grid via .mobile-2col-grid class */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center space-y-3 border border-slate-200 shadow-sm">
          <Package className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Approved Products Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try resetting your search query or login to submit new products for admin approval.
          </p>
        </div>
      ) : (
        <div className="mobile-2col-grid">
          {filteredProducts.map(product => {
            const imgCount = (product.images && product.images.length > 0) ? product.images.length : 1;
            
            return (
              <div
                key={product.id}
                onClick={() => setSelectedProductModal(product)}
                className="glass-card rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer flex flex-col justify-between min-w-0"
              >
                <div className="min-w-0">
                  {/* Product Cover Image */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = '/b2b_hero_background.png';
                      }}
                    />
                    
                    <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 flex flex-col items-start gap-1">
                      <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded bg-white/90 backdrop-blur-md text-[8px] sm:text-[11px] font-bold text-indigo-700 border border-slate-200 shadow-sm truncate max-w-[80px] sm:max-w-none">
                        {product.category}
                      </span>
                    </div>

                    <span className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded bg-emerald-50 text-[8px] sm:text-[11px] font-bold text-emerald-700 border border-emerald-200 shadow-sm flex items-center gap-0.5">
                      <ShieldCheck className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                      <span className="hidden sm:inline">Verified</span>
                    </span>

                    {imgCount > 1 && (
                      <span className="absolute bottom-1 left-1.5 sm:bottom-2 sm:left-3 text-[8px] sm:text-[11px] text-slate-700 bg-white/90 px-1 py-0.5 rounded backdrop-blur-sm flex items-center gap-0.5 font-bold shadow-sm">
                        <ImageIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-indigo-600" />
                        {imgCount}
                      </span>
                    )}
                  </div>

                  {/* Card Details */}
                  <div className="p-2.5 sm:p-5 space-y-1.5 sm:space-y-3 min-w-0">
                    <div>
                      <h3 className="font-bold text-slate-900 text-[11px] sm:text-base line-clamp-1 group-hover:text-indigo-600 transition-colors">
                        {product.name}
                      </h3>
                      {product.subcategory && (
                        <p className="text-[8px] sm:text-[11px] text-indigo-600 font-semibold truncate pt-0.5">
                          ↳ {product.subcategory}
                        </p>
                      )}
                    </div>

                    <p className="text-slate-600 text-[10px] sm:text-xs line-clamp-2 leading-tight sm:leading-relaxed">
                      {product.description}
                    </p>

                    {/* Price & MOQ Box */}
                    <div className="bg-slate-50 rounded-lg sm:rounded-xl p-1.5 sm:p-3 border border-slate-200 space-y-1 min-w-0">
                      <div>
                        <p className="text-[8px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-400">Wholesale Price</p>
                        <p className="text-xs sm:text-lg font-extrabold text-slate-900 leading-tight">
                          Rs. {(Number(product.price) || 0).toLocaleString()}
                        </p>
                        <p className="text-[8px] sm:text-xs text-slate-500 font-normal">/ {product.unit}</p>
                      </div>
                      <div className="pt-0.5 border-t border-slate-200/60 flex items-center justify-between">
                        <span className="text-[8px] uppercase font-bold text-slate-400">MOQ:</span>
                        <span className="text-[9px] sm:text-xs font-bold text-indigo-700 bg-indigo-50 px-1 py-0.2 rounded border border-indigo-100 truncate max-w-[70px] sm:max-w-none">{product.moq}</span>
                      </div>
                    </div>

                    {/* Seller Details */}
                    <div className="flex items-center justify-between pt-0.5 text-[9px] sm:text-xs text-slate-500 border-t border-slate-100 min-w-0">
                      <div className="flex items-center gap-1 truncate max-w-full">
                        <Building2 className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-indigo-600 shrink-0" />
                        <span className="truncate font-semibold text-slate-700">{product.seller_name}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card WhatsApp Action CTA */}
                <div className="p-2.5 pt-0 sm:p-5 sm:pt-0">
                  <button
                    onClick={(e) => handleWhatsAppClick(e, product)}
                    className="w-full py-1.5 px-2 sm:py-2.5 sm:px-4 rounded-lg sm:rounded-xl font-bold text-[9px] sm:text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1 transition-all group-hover:shadow-emerald-600/30"
                  >
                    <MessageSquare className="w-3 h-3 fill-emerald-200/30 shrink-0" />
                    <span className="truncate">Inquire</span>
                    <ArrowUpRight className="w-3 h-3 opacity-80 shrink-0 hidden sm:inline" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
