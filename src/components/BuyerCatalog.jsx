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
  Grid,
  CheckCircle2,
  X,
  Award,
  Truck,
  FileCheck,
  Search,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Factory
} from 'lucide-react';
import { PRESET_CATEGORIES, DEFAULT_WHATSAPP_NUMBER } from '../lib/supabase';

// Bento Box Category Definitions with Varied Sizes & High Quality Visual Images
const BENTO_CATEGORIES = [
  {
    id: 'cat-machinery',
    name: 'Industrial Machinery',
    subtitle: 'Paper Cup Units, Hydraulic Presses & Packaging Lines',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    size: 'lg:col-span-2 lg:row-span-2',
    accent: 'Industrial High-Demand',
    badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
    tag: 'Factory Direct'
  },
  {
    id: 'cat-medical',
    name: 'Medical & Healthcare',
    subtitle: 'ISO 13485 Sterile Syringes, Disposables & Hospital Supplies',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80',
    size: 'lg:col-span-2 lg:row-span-1',
    accent: 'Certified Sterile',
    badgeColor: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/40',
    tag: 'Hospital Grade'
  },
  {
    id: 'cat-agriculture',
    name: 'Agriculture & Food',
    subtitle: 'Bulk Himalayan Large Cardamom, Herbs & Organic Condiments',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    size: 'lg:col-span-1 lg:row-span-1',
    accent: 'Export Quality',
    badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
    tag: 'Direct Farm'
  },
  {
    id: 'cat-solar',
    name: 'Electronics & Solar',
    subtitle: 'Smart IoT 60A MPPT Controllers & Heavy Duty Solar Inverters',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    size: 'lg:col-span-1 lg:row-span-1',
    accent: 'High Conversion',
    badgeColor: 'bg-indigo-400/20 text-indigo-300 border-indigo-400/40',
    tag: 'IoT Tech'
  },
  {
    id: 'cat-textiles',
    name: 'Textiles & Apparel',
    subtitle: 'Bulk Cashmere, Pashmina, Woolens & Industrial Yarns',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
    size: 'lg:col-span-1 lg:row-span-1',
    accent: 'Himalayan Weave',
    badgeColor: 'bg-purple-400/20 text-purple-300 border-purple-400/40',
    tag: 'Wholesale'
  },
  {
    id: 'cat-chemicals',
    name: 'Chemicals & Plastics',
    subtitle: 'Industrial Polymers, Solvents & Packaging Raw Materials',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
    size: 'lg:col-span-1 lg:row-span-1',
    accent: 'Industrial Grade',
    badgeColor: 'bg-teal-400/20 text-teal-300 border-teal-400/40',
    tag: 'Bulk Supply'
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
    showToast,
    toggleUserRole
  } = useApp();

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

    const buyerName = (userProfile && userProfile.isLoggedIn) ? userProfile.name : 'Guest Trade Buyer';
    const buyerEmail = (userProfile && userProfile.isLoggedIn) ? userProfile.email : 'N/A';
    const buyerId = (userProfile && userProfile.isLoggedIn) ? userProfile.id : 'Guest';
    const buyerRole = (userProfile && userProfile.isLoggedIn) ? userProfile.role.toUpperCase() : 'BUYER';
    const buyerPhone = (userProfile && userProfile.isLoggedIn && userProfile.phone) ? userProfile.phone : 'N/A';

    const message = `Hello GS Nepal B2B Team / ${product?.seller_name || 'Supplier'},\n\n` +
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
    if (showToast) showToast(`WhatsApp trade lead dispatched for ${buyerName} (+${phone})`, 'success');
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* ========================================================================= */}
      {/* 1. ASYMMETRIC HERO SECTION: High-End Industrial Sourcing Value Proposition */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-12 shadow-2xl">
        
        {/* Decorative Grid Lines & Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT COLUMN: Asymmetric Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-white">
            
            {/* Top Authority Tag */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900 border border-amber-500/30 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-300 font-extrabold text-xs tracking-wider uppercase">
                Nepalese Industrial & Cross-Border B2B Sourcing
              </span>
            </div>

            {/* Main Headline: Modern Serif + High Contrast */}
            <h1 className="font-serif-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Authoritative Trade Sourcing for <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">Nepal & India</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal max-w-2xl">
              Connect directly with verified manufacturers, industrial machinery suppliers, medical disposables distributors, and agricultural spice exporters. Zero middleman markup with direct WhatsApp trade dispatch.
            </p>

            {/* Authority Key Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-b border-slate-800/80 py-4">
              <div>
                <p className="font-serif-heading text-2xl sm:text-3xl font-extrabold text-amber-400">1,400+</p>
                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Verified Factories</p>
              </div>
              <div>
                <p className="font-serif-heading text-2xl sm:text-3xl font-extrabold text-emerald-400">Rs. 18B+</p>
                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Annual Trade Volume</p>
              </div>
              <div>
                <p className="font-serif-heading text-2xl sm:text-3xl font-extrabold text-indigo-400">100%</p>
                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">RLS Data Security</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById('wholesale-catalog');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer group"
              >
                <Search className="w-4 h-4 text-slate-950" />
                <span>Browse Wholesale Catalog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={toggleUserRole}
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs border border-slate-700/80 shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Factory className="w-4 h-4 text-amber-400" />
                <span>Become a Supplier</span>
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: Asymmetric High-Quality Product Showcase Composition */}
          <div className="lg:col-span-5 relative">
            
            {/* Background Glow Ring */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-indigo-600/20 rounded-3xl blur-2xl pointer-events-none" />

            {/* Featured Composition Card */}
            <div className="relative bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl space-y-4">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-xs text-white uppercase tracking-wider">Spotlight Industrial Listing</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-md bg-amber-400/20 text-amber-300 text-[10px] font-extrabold uppercase border border-amber-400/30">
                  Verified Unit
                </span>
              </div>

              {/* Main Product Showcase Image */}
              <div className="relative h-52 sm:h-64 rounded-xl overflow-hidden group border border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
                  alt="Industrial Machine"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                
                <div className="absolute bottom-3 left-3 right-3 text-white space-y-1">
                  <span className="text-[10px] bg-indigo-600 text-white font-extrabold px-2 py-0.5 rounded">
                    Industrial Machinery
                  </span>
                  <h3 className="font-serif-heading font-bold text-base text-white line-clamp-1">
                    Automatic Hydraulic Paper Cup Machine 90pcs/min
                  </h3>
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="font-extrabold text-amber-400">Rs. 4,85,000 / Set</span>
                    <span className="text-[11px] text-slate-400">MOQ: 1 Set</span>
                  </div>
                </div>
              </div>

              {/* Floating Sub-Features Grid */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-[11px]">
                    <p className="font-bold text-white">ISO Medical</p>
                    <p className="text-[10px] text-slate-400">Sterile Luer Lock Syringes</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div className="text-[11px]">
                    <p className="font-bold text-white">Bulk Cardamom</p>
                    <p className="text-[10px] text-slate-400">Grade A Export Quality</p>
                  </div>
                </div>
              </div>

              {/* Direct Inquiry CTA Button */}
              <button
                onClick={(e) => handleWhatsAppClick(e, approvedProducts[0])}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-slate-950" />
                <span>Instant Direct WhatsApp Lead Inquiry</span>
              </button>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================================================= */}
      {/* 2. BENTO BOX CATEGORY LAYOUT: Dynamic Varied Cards with 0.5px Sharp Stroke */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>Structured Wholesale Categories</span>
            </div>
            <h2 className="font-serif-heading text-2xl sm:text-4xl font-extrabold text-white mt-1">
              Bento Sourcing Hub
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-xs">
            Select a category tile to filter approved industrial and consumer wholesale listings.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {BENTO_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            const count = approvedProducts.filter(p => p.category === cat.name).length;

            return (
              <div
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  const el = document.getElementById('wholesale-catalog');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`bento-card relative rounded-2xl overflow-hidden cursor-pointer border-stroke-subtle bg-slate-900 group ${cat.size} min-h-[220px] flex flex-col justify-between p-6 ${
                  isSelected ? 'ring-2 ring-amber-400 border-amber-400 shadow-2xl' : 'hover:border-amber-400/50'
                }`}
              >
                {/* Background Image with Dark Gradient Overlay */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className={`absolute inset-0 transition-opacity duration-300 ${
                  isSelected
                    ? 'bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-900/40'
                    : 'bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/30 group-hover:from-slate-950/95'
                }`} />

                {/* Top Tags */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${cat.badgeColor}`}>
                    {cat.tag}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900/90 text-slate-300 font-bold text-[10px] border border-slate-800">
                    {count} Listings
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="relative z-10 space-y-1.5 pt-12">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif-heading text-lg sm:text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
                      {cat.name}
                    </h3>
                    <ArrowUpRight className="w-5 h-5 text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <p className="text-xs text-slate-300 leading-snug line-clamp-2">
                    {cat.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Category Reset Tag */}
        {selectedCategory !== 'All Categories' && (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold">
            <span className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span>Filtering by Category: <strong>{selectedCategory}</strong> ({filteredProducts.length} items)</span>
            </span>
            <button
              onClick={() => setSelectedCategory('All Categories')}
              className="px-3 py-1 rounded-lg bg-amber-400 text-slate-950 font-black hover:bg-amber-300 transition-colors cursor-pointer"
            >
              Show All Categories
            </button>
          </div>
        )}

      </section>


      {/* ========================================================================= */}
      {/* 3. TRUST SIGNALS SECTION: Custom Line-Art Pillars & Light Contrast Canvas */}
      {/* ========================================================================= */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-amber-400 font-extrabold text-xs uppercase tracking-wider">
              Institutional Trust Guarantees
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-4xl font-extrabold text-white">
              Why Global Buyers Sourcing via GS Nepal
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Enterprise security, transparent verification, and customs-ready logistics for cross-border B2B trade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 hover:border-amber-400/50 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-serif-heading text-lg font-bold text-white">Verified Manufacturer Audits</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every supplier on GS Nepal undergoes PAN/GST verification, factory capacity auditing, and Row Level Security (RLS) data protection.
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 hover:border-emerald-400/50 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <FileCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-serif-heading text-lg font-bold text-white">ISO Standard Quality Inspection</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Medical equipment and industrial machinery meet strict ISO 13485 & CE standards with pre-shipment sampling and specification audits.
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 hover:border-indigo-400/50 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-indigo-400/10 border border-indigo-400/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <Truck className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-serif-heading text-lg font-bold text-white">Cross-Border Logistics</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Seamless Nepal-India trade corridors with expedited customs documentation, freight forwarding assistance, and live shipment tracking.
                </p>
              </div>
            </div>

          </div>

        </div>

      </section>


      {/* ========================================================================= */}
      {/* 4. WHOLESALE PRODUCTS CATALOG: Filterable Grid & Direct WhatsApp Trigger */}
      {/* ========================================================================= */}
      <section id="wholesale-catalog" className="space-y-6 pt-4">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Active Wholesale Inventory</span>
            </div>
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
              Verified Product Catalog ({filteredProducts.length})
            </h2>
          </div>

          {/* Category Quick Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {PRESET_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-4">
            <Package className="w-12 h-12 text-slate-600 mx-auto" />
            <div>
              <p className="text-white font-bold text-base">No wholesale products found</p>
              <p className="text-xs text-slate-400">Try adjusting your search query or selecting another category.</p>
            </div>
            <button
              onClick={() => {
                setSelectedCategory('All Categories');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="mobile-2col-grid">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedProductModal(p)}
                className="bg-slate-900/90 border-stroke-subtle rounded-2xl overflow-hidden cursor-pointer hover:border-amber-400/60 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative h-40 sm:h-48 overflow-hidden bg-slate-950 border-b border-slate-800">
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                      <span className="px-2 py-0.5 rounded bg-slate-950/90 text-amber-300 text-[10px] font-black border border-amber-400/30">
                        {p.category}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 right-2.5 bg-slate-950/90 px-2 py-0.5 rounded text-[10px] font-bold text-slate-300 border border-slate-800 flex items-center gap-1">
                      <Eye className="w-3 h-3 text-indigo-400" />
                      <span>{p.views || 100}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-3.5 sm:p-5 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-300 line-clamp-1">{p.seller_name}</span>
                      <span className="flex items-center gap-1 shrink-0">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        <span>{p.seller_location || 'Nepal'}</span>
                      </span>
                    </div>

                    <h3 className="font-serif-heading font-bold text-sm sm:text-base text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                      {p.name}
                    </h3>

                    <p className="text-slate-400 text-[11px] line-clamp-2 leading-relaxed hidden sm:block">
                      {p.description}
                    </p>

                    <div className="pt-2 flex items-baseline justify-between border-t border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Wholesale Price</span>
                        <p className="font-extrabold text-amber-400 text-sm sm:text-lg">
                          Rs. {(Number(p.price) || 0).toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">/ {p.unit}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">MOQ</span>
                        <p className="font-bold text-slate-200 text-xs">{p.moq}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="p-3 sm:p-4 pt-0">
                  <button
                    onClick={(e) => handleWhatsAppClick(e, p)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 fill-slate-950" />
                    <span>WhatsApp Inquiry</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </section>

    </div>
  );
}
