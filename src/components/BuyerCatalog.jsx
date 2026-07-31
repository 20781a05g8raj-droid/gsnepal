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
  X,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { PRESET_CATEGORIES, DEFAULT_WHATSAPP_NUMBER } from '../lib/supabase';

// Circular Story Categories Definition with 3D Aesthetic Images
const CIRCULAR_CATEGORIES = [
  { name: 'All Categories', icon: '/categories/cat_all.png', label: 'All Catalog', subtitle: 'Explore Full B2B Catalog' },
  { name: 'Medical & Healthcare', icon: '/categories/cat_medical.png', label: 'Medical & Healthcare', subtitle: 'Syringes & Surgical Supplies' },
  { name: 'Industrial Machinery', icon: '/categories/cat_machinery.png', label: 'Industrial Machinery', subtitle: 'Paper Cup & Plastic Units' },
  { name: 'Agriculture & Food', icon: '/categories/cat_agriculture.png', label: 'Agriculture & Food', subtitle: 'Himalayan Spices & Herbs' },
  { name: 'Electronics & Solar', icon: '/categories/cat_solar.png', label: 'Electronics & Solar', subtitle: 'Solar Panels & Controllers' },
  { name: 'Textiles & Apparel', icon: '/categories/cat_textiles.png', label: 'Textiles & Apparel', subtitle: 'Fabrics, Shawls & Garments' },
  { name: 'Construction Materials', icon: '/categories/cat_construction.png', label: 'Construction Materials', subtitle: 'Steel, Cement & Roofing' },
  { name: 'Chemicals & Plastics', icon: '/categories/cat_chemicals.png', label: 'Chemicals & Plastics', subtitle: 'Polymers & Solvents' }
];

// Hero Background Carousel Multi-Images (Auto-changes every 2.5 seconds)
const HERO_SLIDER_IMAGES = [
  {
    url: '/b2b_hero_background.png',
    tag: 'Industrial & Paper Cup Machinery',
    title: 'Direct Factory Sourcing'
  },
  {
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1600&q=80',
    tag: 'Medical & Surgical Disposables',
    title: 'Sterile Syringes & Equipment'
  },
  {
    url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1600&q=80',
    tag: 'Himalayan Organic Spices',
    title: 'Pure Grade A Cardamom & Herbs'
  },
  {
    url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1600&q=80',
    tag: 'Solar Energy & Electronics',
    title: 'IoT MPPT Solar Charge Controllers'
  },
  {
    url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80',
    tag: 'Textiles & Wholesale Garments',
    title: 'Traditional & Western Outfits'
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

  const [scrollY, setScrollY] = useState(0);
  const [heroBgIndex, setHeroBgIndex] = useState(0);

  // Auto-change Hero Background Image every 2.5 seconds (2500ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroBgIndex(prev => (prev + 1) % HERO_SLIDER_IMAGES.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const approvedProducts = (products || []).filter(p => p && p.is_approved);
  const cleanSearchQuery = (searchQuery || '').trim().toLowerCase();

  const filteredProducts = approvedProducts.filter(p => {
    if (!p) return false;
    
    const matchesSearch = !cleanSearchQuery || 
      (p.name && p.name.toLowerCase().includes(cleanSearchQuery)) ||
      (p.description && p.description.toLowerCase().includes(cleanSearchQuery)) ||
      (p.category && p.category.toLowerCase().includes(cleanSearchQuery)) ||
      (p.subcategory && p.subcategory.toLowerCase().includes(cleanSearchQuery)) ||
      (p.seller_name && p.seller_name.toLowerCase().includes(cleanSearchQuery));

    if (cleanSearchQuery) return matchesSearch;

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

    const buyerName = (userProfile && userProfile.isLoggedIn) ? userProfile.name : 'Guest Visitor';
    const buyerEmail = (userProfile && userProfile.isLoggedIn) ? userProfile.email : 'N/A';

    const message = `Hello WS Nepal B2B Team / ${product?.seller_name || 'Supplier'},\n\n` +
      `I want to inquire about bulk wholesale sourcing:\n\n` +
      `*Product:* ${prodName}\n` +
      `*Category:* ${prodCategory}\n` +
      `*Price:* ${prodPrice}\n` +
      `*MOQ:* ${prodMoq}\n\n` +
      `*Inquirer:* ${buyerName} (${buyerEmail})\n\n` +
      `Please share availability and bulk quotation.`;
    
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    if (showToast) showToast(`WhatsApp inquiry prepared for ${buyerName}`, 'success');
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-16">
      
      {/* FULL SCREEN HERO POSTER BANNER (Low Margin & Padding) */}
      <section className="relative overflow-hidden rounded-xl sm:rounded-3xl bg-slate-900 border border-slate-800 p-3.5 sm:p-8 lg:p-10 shadow-2xl min-h-[160px] sm:min-h-[380px] lg:min-h-[420px] flex items-center w-full">
        
        {/* Multi-Image Auto-Sliding Background Carousel */}
        {HERO_SLIDER_IMAGES.map((imgItem, idx) => (
          <div 
            key={idx}
            className={`absolute inset-0 w-full h-[125%] -top-[10%] pointer-events-none bg-cover bg-center transition-all duration-1000 ease-in-out ${
              idx === heroBgIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
            style={{
              transform: `translate3d(0, ${scrollY * 0.18}px, 0)`,
              backgroundImage: `url('${imgItem.url}')`
            }}
          />
        ))}

        {/* Subtle Bottom/Left Gradient Shadow for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:bg-gradient-to-r sm:from-black/70 sm:via-black/30 sm:to-transparent" />

        {/* Slider Indicator Dots Bottom Right */}
        <div className="absolute bottom-2.5 right-3 sm:bottom-3 sm:right-4 z-20 flex items-center gap-1 sm:gap-1.5 bg-slate-950/60 backdrop-blur-md px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border border-white/20 shadow-lg">
          <span className="text-[10px] text-slate-300 font-bold mr-1 hidden sm:inline">
            {HERO_SLIDER_IMAGES[heroBgIndex].tag}
          </span>
          {HERO_SLIDER_IMAGES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setHeroBgIndex(idx)}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === heroBgIndex ? 'w-4 sm:w-6 bg-emerald-400' : 'w-1.5 sm:w-2 bg-white/40 hover:bg-white/70'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl space-y-1.5 sm:space-y-4 text-white">
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-indigo-600/50 text-indigo-100 text-[9px] sm:text-xs font-extrabold border border-indigo-400/40 backdrop-blur-md shadow-md">
              <Package className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-300" />
              <span>{approvedProducts.length}+ Products</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-emerald-600/50 text-emerald-100 text-[9px] sm:text-xs font-extrabold border border-emerald-400/40 backdrop-blur-md shadow-md">
              <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-300" />
              <span>Verified Wholesalers</span>
            </span>
          </div>

          <h1 className="text-base sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight font-serif drop-shadow-md">
            Direct Wholesale & <span className="text-emerald-400">Nepal Sourcing Hub</span>
          </h1>

          <p className="text-slate-200 text-[11px] sm:text-base leading-snug sm:leading-relaxed font-medium drop-shadow line-clamp-1 sm:line-clamp-none">
            Source traditional sarees, gowns, lehengas, kurtis, medical supplies & industrial machinery directly from verified factories in Nepal & India.
          </p>

          <div className="pt-0.5 sm:pt-1 flex items-center gap-2 sm:gap-3">
            <button
              onClick={(e) => handleWhatsAppClick(e, null)}
              className="px-3 py-1.5 sm:px-6 sm:py-3.5 rounded-lg sm:rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-xl shadow-emerald-950/60 font-extrabold text-[11px] sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>WhatsApp Inquiry</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('catalog-grid-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 sm:px-5 sm:py-3 rounded-lg sm:rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] sm:text-sm border border-white/20 backdrop-blur-md transition-all cursor-pointer"
            >
              <span>Browse Catalog ↓</span>
            </button>
          </div>
        </div>
      </section>

      {/* SMALL CIRCULAR CATEGORY STORY CAROUSEL ("CIRCLE ME KARO CHOTA CHOTA") */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 text-slate-900 font-extrabold text-xs sm:text-base">
            <Grid className="w-4 h-4 text-indigo-600" />
            <span>Product Categories</span>
          </div>
          <span className="text-[11px] text-slate-400 font-bold">Scroll →</span>
        </div>

        {/* Small Circular Category Icons Horizontal Scroll */}
        <div className="flex items-center gap-3.5 sm:gap-5 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth">
          {CIRCULAR_CATEGORIES.map(cat => {
            const isActive = selectedCategory === cat.name;
            const count = cat.name === 'All Categories'
              ? approvedProducts.length
              : approvedProducts.filter(p => p.category === cat.name).length;

            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setSearchQuery('');
                }}
                className="group flex flex-col items-center gap-1.5 shrink-0 focus:outline-none cursor-pointer"
              >
                {/* Circle Icon Badge */}
                <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-0.5 transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-400 ring-4 ring-indigo-500/25 scale-105 shadow-lg shadow-indigo-500/20' 
                    : 'bg-slate-200 hover:bg-slate-300 group-hover:scale-105'
                }`}>
                  <div className="w-full h-full bg-white rounded-full overflow-hidden shadow-inner flex items-center justify-center p-0.5">
                    <img 
                      src={cat.icon} 
                      alt={cat.label} 
                      className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Count Pill */}
                  <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.2 rounded-full text-[9px] font-black border border-white shadow-sm whitespace-nowrap ${
                    isActive ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-white'
                  }`}>
                    {count} {count === 1 ? 'Prod' : 'Prods'}
                  </div>

                  {/* Active Indicator Badge */}
                  {isActive && (
                    <div className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm">
                      ✓
                    </div>
                  )}
                </div>

                {/* Circle Subtitle Labels */}
                <div className="text-center space-y-0.5 max-w-[100px] sm:max-w-[120px]">
                  <span className={`text-[11px] sm:text-xs font-bold block truncate transition-colors ${
                    isActive ? 'text-indigo-700 font-black' : 'text-slate-800 group-hover:text-indigo-600'
                  }`}>
                    {cat.label}
                  </span>
                  <span className="text-[9px] text-slate-400 block truncate font-medium">
                    {cat.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Active Search Query Filter Notification */}
      {searchQuery && (
        <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-between text-xs text-slate-900 font-medium shadow-sm">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500">Searching for:</span>
            <span className="font-extrabold text-indigo-700 bg-white px-3 py-1 rounded-xl border border-indigo-300 shadow-sm flex items-center gap-1.5 text-xs">
              "{searchQuery}"
            </span>
            <span className="text-slate-600 font-semibold">
              ({filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found)
            </span>
          </div>

          <button
            onClick={() => setSearchQuery('')}
            className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-300 shadow-sm flex items-center gap-1 transition-all text-xs shrink-0 cursor-pointer"
          >
            <X className="w-3.5 h-3.5 text-slate-500" /> Clear Search
          </button>
        </div>
      )}

      {/* Selected Category Status Banner */}
      {!searchQuery && selectedCategory !== 'All Categories' && (
        <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-between text-xs text-indigo-900 font-medium">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500">Filtered Category:</span>
            <span className="font-extrabold text-indigo-700 bg-white px-3 py-1 rounded-xl border border-indigo-200 shadow-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
              {selectedCategory}
            </span>
            <span className="text-slate-500 font-semibold hidden sm:inline">
              ({filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''})
            </span>
          </div>

          <button
            onClick={() => setSelectedCategory('All Categories')}
            className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200 shadow-sm flex items-center gap-1 transition-all text-xs shrink-0 cursor-pointer"
          >
            <X className="w-3.5 h-3.5 text-slate-400" /> Show All
          </button>
        </div>
      )}

      {/* CATALOG PRODUCT GRID (Forced Mobile 2-Column Grid) */}
      <section id="catalog-grid-section" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>Wholesale Catalog</span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-bold">
              {filteredProducts.length} Items
            </span>
          </h2>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center space-y-3 border border-slate-200 shadow-sm">
            <Package className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Approved Products Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try resetting your search query or selecting a different category.
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
                    {/* Cover Image */}
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
                    <div className="p-2.5 sm:p-4 space-y-1.5 sm:space-y-2.5 min-w-0">
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

                      {/* Price & MOQ */}
                      <div className="bg-slate-50 rounded-lg sm:rounded-xl p-1.5 sm:p-2.5 border border-slate-200 space-y-1 min-w-0">
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

                      {/* Seller Info */}
                      <div className="flex items-center justify-between pt-0.5 text-[9px] sm:text-xs text-slate-500 border-t border-slate-100 min-w-0">
                        <div className="flex items-center gap-1 truncate max-w-full">
                          <Building2 className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-indigo-600 shrink-0" />
                          <span className="truncate font-semibold text-slate-700">{product.seller_name}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="p-2.5 pt-0 sm:p-4 sm:pt-0">
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
      </section>

    </div>
  );
}
