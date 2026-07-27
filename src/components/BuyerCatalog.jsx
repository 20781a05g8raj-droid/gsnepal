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
  Image as ImageIcon,
  Grid,
  CheckCircle2,
  X
} from 'lucide-react';
import { PRESET_CATEGORIES, DEFAULT_WHATSAPP_NUMBER } from '../lib/supabase';

// Visual Image Category Cards Definition
const CATEGORY_CARDS_DATA = [
  {
    name: 'All Categories',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    subtitle: 'Explore Full B2B Catalog'
  },
  {
    name: 'Medical & Healthcare',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    subtitle: 'Syringes & Surgical Supplies'
  },
  {
    name: 'Industrial Machinery',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    subtitle: 'Paper Cup & Plastic Units'
  },
  {
    name: 'Agriculture & Food',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    subtitle: 'Himalayan Spices & Herbs'
  },
  {
    name: 'Electronics & Solar',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    subtitle: 'Solar Panels & Controllers'
  },
  {
    name: 'Textiles & Apparel',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
    subtitle: 'Fabrics, Shawls & Garments'
  },
  {
    name: 'Construction Materials',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    subtitle: 'Steel, Cement & Roofing'
  },
  {
    name: 'Chemicals & Plastics',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
    subtitle: 'Polymers & Industrial Solvents'
  }
];

export default function BuyerCatalog() {
  const {
    products = [],
    userProfile,
    searchQuery,
    setSearchQuery,
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

  const cleanSearchQuery = (searchQuery || '').trim().toLowerCase();

  const filteredProducts = approvedProducts.filter(p => {
    if (!p) return false;
    
    // Check search query match
    const matchesSearch = !cleanSearchQuery || 
      (p.name && p.name.toLowerCase().includes(cleanSearchQuery)) ||
      (p.description && p.description.toLowerCase().includes(cleanSearchQuery)) ||
      (p.category && p.category.toLowerCase().includes(cleanSearchQuery)) ||
      (p.subcategory && p.subcategory.toLowerCase().includes(cleanSearchQuery)) ||
      (p.seller_name && p.seller_name.toLowerCase().includes(cleanSearchQuery));

    // If search query is entered, prioritize search match over category filter
    if (cleanSearchQuery) {
      return matchesSearch;
    }

    // Normal category filter when no search query
    const matchesCategory = selectedCategory === 'All Categories' || p.category === selectedCategory;
    return matchesCategory;
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
    <div className="space-y-4 sm:space-y-8 pb-16">
      
      {/* Compact Responsive Hero Section for Mobile & Desktop */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-900 border border-indigo-200 p-3.5 sm:p-10 shadow-2xl min-h-0 sm:min-h-[380px] flex items-center">
        
        {/* Parallax Background Banner Image */}
        <div 
          className="absolute inset-0 w-full h-[135%] -top-[15%] pointer-events-none transition-transform ease-out duration-100 bg-cover bg-center opacity-90"
          style={{
            transform: `translate3d(0, ${scrollY * 0.22}px, 0)`,
            backgroundImage: `url('/b2b_hero_background.png')`
          }}
        />

        {/* Ambient Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-900/40" />

        {/* Content Box */}
        <div className="relative z-10 max-w-3xl space-y-2 sm:space-y-5 text-white">
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3.5 sm:py-1.5 rounded-full bg-indigo-600/40 text-indigo-200 text-[9px] sm:text-xs font-bold border border-indigo-400/40 backdrop-blur-md shadow-md">
              <Package className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-300" />
              <span>{approvedProducts.length}+ Products</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3.5 sm:py-1.5 rounded-full bg-emerald-600/40 text-emerald-200 text-[9px] sm:text-xs font-bold border border-emerald-400/40 backdrop-blur-md shadow-md">
              <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-300" />
              <span>Verified Wholesalers</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3.5 sm:py-1.5 rounded-full bg-slate-800/60 text-slate-200 text-[9px] sm:text-xs font-bold border border-slate-700/60 backdrop-blur-md shadow-md hidden sm:inline-flex">
              <Building2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-300" />
              <span>Multi-Vendor B2B Marketplace</span>
            </span>
          </div>

          <h1 className="text-base sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
            Direct Wholesale & <span className="text-teal-300">Industrial Product Sourcing</span>
          </h1>

          <p className="text-slate-100 text-[10px] sm:text-base leading-snug sm:leading-relaxed font-medium drop-shadow line-clamp-1 sm:line-clamp-none">
            Source medical disposables, syringes, industrial machinery, and agricultural produce directly from verified suppliers in Nepal & India.
          </p>

          {/* Compact WhatsApp Logo Icon Button */}
          <div className="pt-0.5 flex items-center gap-2">
            <button
              onClick={(e) => handleWhatsAppClick(e, null)}
              className="px-3 py-1.5 sm:px-4 sm:py-3.5 rounded-xl sm:rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-950/60 border border-emerald-300/40 flex items-center justify-center gap-1.5 transition-all hover:scale-105 active:scale-95 text-[11px] sm:text-xs font-bold"
              title="Chat on WhatsApp"
            >
              {/* WhatsApp SVG Logo */}
              <svg className="w-4 h-4 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>Direct WhatsApp Sourcing</span>
            </button>
          </div>
        </div>
      </section>

      {/* Visual Category Cards Section */}
      <section className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2 text-slate-900 font-extrabold text-sm sm:text-xl">
            <Grid className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
            <span>Product Categories</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-xs text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-indigo-100 flex items-center gap-1">
              <span>Slide Cards</span> &rarr;
            </span>
          </div>
        </div>

        {/* Category Visual Cards Single-Row Slider */}
        <div className="flex items-center gap-2.5 sm:gap-4 overflow-x-auto pb-2 sm:pb-3 pt-0.5 scrollbar-none snap-x snap-mandatory scroll-smooth">
          {CATEGORY_CARDS_DATA.map(cat => {
            const isActive = selectedCategory === cat.name;
            const count = cat.name === 'All Categories'
              ? approvedProducts.length
              : approvedProducts.filter(p => p.category === cat.name).length;

            return (
              <div
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`group/card shrink-0 w-36 sm:w-60 h-24 sm:h-36 rounded-xl sm:rounded-3xl overflow-hidden cursor-pointer border-2 transition-all duration-300 shadow-sm snap-start relative ${
                  isActive
                    ? 'border-indigo-600 ring-2 sm:ring-4 ring-indigo-500/30 scale-[1.02] shadow-indigo-500/20'
                    : 'border-white/80 hover:border-indigo-400 hover:shadow-xl hover:-translate-y-0.5'
                }`}
              >
                {/* Background Image */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Gradient Overlays */}
                <div className={`absolute inset-0 transition-opacity duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-t from-slate-950/95 via-indigo-950/80 to-indigo-900/40' 
                    : 'bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-slate-900/20 group-hover/card:from-slate-950/95'
                }`} />

                {/* Active Indicator Badge */}
                {isActive && (
                  <div className="absolute top-2 right-2 bg-indigo-600 text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 shadow-lg border border-indigo-400">
                    <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                    <span>Active</span>
                  </div>
                )}

                {/* Product Count Pill */}
                <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold border border-white/20">
                  {count} {count === 1 ? 'Product' : 'Products'}
                </div>

                {/* Card Bottom Content */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white space-y-0.5">
                  <h3 className="font-extrabold text-xs sm:text-base leading-tight group-hover/card:text-indigo-300 transition-colors drop-shadow">
                    {cat.name}
                  </h3>
                  <p className="text-[9px] sm:text-xs text-slate-300 font-medium line-clamp-1 opacity-90">
                    {cat.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Search Query Banner */}
        {searchQuery && (
          <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-emerald-50 border border-indigo-200 flex items-center justify-between text-xs text-slate-900 font-medium shadow-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500">Searching for:</span>
              <span className="font-extrabold text-indigo-700 bg-white px-3 py-1 rounded-xl border border-indigo-300 shadow-sm flex items-center gap-1.5 text-xs sm:text-sm">
                "{searchQuery}"
              </span>
              <span className="text-slate-600 font-semibold">
                ({filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found)
              </span>
            </div>

            <button
              onClick={() => setSearchQuery('')}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-300 shadow-sm flex items-center gap-1.5 transition-all text-xs shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4 text-slate-500" /> Clear Search
            </button>
          </div>
        )}

        {/* Selected Category Status & Reset Banner */}
        {!searchQuery && selectedCategory !== 'All Categories' && (
          <div className="p-3 sm:p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-between text-xs text-indigo-900 font-medium">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500">Filtered by:</span>
              <span className="font-extrabold text-indigo-700 bg-white px-3 py-1 rounded-xl border border-indigo-200 shadow-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                {selectedCategory}
              </span>
              <span className="text-slate-500 font-semibold hidden sm:inline">
                ({filteredProducts.length} approved product{filteredProducts.length !== 1 ? 's' : ''} found)
              </span>
            </div>

            <button
              onClick={() => setSelectedCategory('All Categories')}
              className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200 shadow-sm flex items-center gap-1 transition-all text-xs shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5 text-slate-400" /> Show All Categories
            </button>
          </div>
        )}
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
