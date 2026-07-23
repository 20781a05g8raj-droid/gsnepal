import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  MessageSquare,
  Building2,
  MapPin,
  ShieldCheck,
  Copy,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { DEFAULT_WHATSAPP_NUMBER } from '../lib/supabase';

export default function ProductDetailModal() {
  const { selectedProductModal, setSelectedProductModal, userProfile, showToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!selectedProductModal) return null;

  const product = selectedProductModal;
  const phone = product.seller_phone || DEFAULT_WHATSAPP_NUMBER;
  
  const galleryImages = (product.images && product.images.length > 0) 
    ? product.images 
    : [product.image_url];

  const activeImage = galleryImages[activeImageIndex] || product.image_url;

  // Inquirer Details dynamically from LOGGED-IN user profile
  const buyerName = (userProfile && userProfile.isLoggedIn) ? userProfile.name : 'Guest Visitor';
  const buyerEmail = (userProfile && userProfile.isLoggedIn) ? userProfile.email : 'N/A';
  const buyerId = (userProfile && userProfile.isLoggedIn) ? userProfile.id : 'Guest';
  const buyerRole = (userProfile && userProfile.isLoggedIn) ? userProfile.role.toUpperCase() : 'BUYER';
  const buyerPhone = (userProfile && userProfile.isLoggedIn && userProfile.phone) ? userProfile.phone : 'N/A';

  const rawMessage = `Hello WS Nepal B2B Team / ${product.seller_name},\n\n` +
    `I want to inquire about bulk wholesale sourcing:\n\n` +
    `*Product:* ${product.name}\n` +
    `*Category:* ${product.category} (${product.subcategory || ''})\n` +
    `*Price:* Rs. ${(Number(product.price) || 0).toLocaleString()} / ${product.unit}\n` +
    `*MOQ:* ${product.moq}\n\n` +
    `-----------------------------------\n` +
    `*INQUIRER DETAILS (Logged-In User):*\n` +
    `*Account Name:* ${buyerName}\n` +
    `*User ID / Role:* ${buyerId} (${buyerRole})\n` +
    `*Email:* ${buyerEmail}\n` +
    `*WhatsApp Contact:* +${buyerPhone}\n` +
    `-----------------------------------\n\n` +
    `Please share availability and bulk quotation.`;

  const whatsappURL = `https://wa.me/${phone}?text=${encodeURIComponent(rawMessage)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(rawMessage);
    setCopied(true);
    if (showToast) showToast(`WhatsApp message for ${buyerName} copied to clipboard!`, 'info');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
              {product.category}
            </span>

            {product.subcategory && (
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">{product.subcategory}</span>
              </span>
            )}

            {product.is_approved ? (
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Listing
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Pending Approval
              </span>
            )}
          </div>

          <button
            onClick={() => setSelectedProductModal(null)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 max-h-[75vh] overflow-y-auto">
          
          {/* Gallery & Supplier Card */}
          <div className="space-y-4">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider shrink-0">Photos:</span>
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx ? 'border-indigo-600 ring-2 ring-indigo-500/20' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx+1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Supplier Details */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400">Manufacturer / Supplier</h4>
                <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Business
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700 shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="space-y-1 min-w-0">
                  <p className="font-bold text-slate-900 text-base truncate">{product.seller_name}</p>
                  <p className="text-xs text-slate-600 flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                    {product.seller_location}
                  </p>
                  <p className="text-xs text-slate-500 font-mono pt-1">
                    WhatsApp Target: +{phone}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Pricing, Specs & WhatsApp CTA */}
          <div className="space-y-6 flex flex-col justify-between">
            
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
                {product.name}
              </h2>

              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Wholesale Price</p>
                  <p className="text-3xl font-extrabold text-slate-900">
                    Rs. {(Number(product.price) || 0).toLocaleString()}
                    <span className="text-sm font-normal text-slate-500"> / {product.unit}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Minimum Order</p>
                  <p className="text-sm font-extrabold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-200 inline-block mt-1">
                    {product.moq}
                  </p>
                </div>
              </div>

              {/* Technical Specifications Grid */}
              {product.specifications && product.specifications.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                    Technical Specifications
                  </h4>
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
                    {product.specifications.map((spec, i) => (
                      <div key={i} className="p-2 bg-white rounded-xl border border-slate-200">
                        <p className="text-[10px] uppercase font-bold text-slate-400">{spec.key}</p>
                        <p className="font-semibold text-slate-900 line-clamp-1">{spec.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Product Overview</h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  {product.description}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Inquirer Account: <span className="text-slate-900 font-extrabold">{buyerName}</span> ({buyerId})
                  </span>
                  <button
                    onClick={handleCopy}
                    className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-bold transition-colors text-[11px]"
                  >
                    <Copy className="w-3 h-3" />
                    {copied ? 'Copied!' : 'Copy Template'}
                  </button>
                </div>

                <pre className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap">
                  {rawMessage}
                </pre>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={whatsappURL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-6 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
              >
                <MessageSquare className="w-5 h-5 fill-emerald-200/30" />
                <span>Inquire as {buyerName} on WhatsApp</span>
                <ExternalLink className="w-4 h-4 opacity-80" />
              </a>

              <button
                onClick={() => setSelectedProductModal(null)}
                className="px-5 py-3 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
              >
                Close
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
