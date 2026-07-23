import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import EditProductModal from './EditProductModal';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Code,
  Package,
  Terminal,
  Copy,
  Edit3,
  PlusCircle,
  Trash2,
  Store,
  MessageSquare,
  TrendingUp,
  Building2,
  BarChart3,
  Users,
  RefreshCw
} from 'lucide-react';

export default function AdminPanel() {
  const {
    products = [],
    sellers = [],
    buyers = [],
    inquiries = [],
    verifySeller,
    deleteSeller,
    deleteBuyer,
    approveProduct,
    deleteProduct,
    resetData,
    setIsAddModalOpen,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'sellers' | 'buyers' | 'products' | 'inquiries' | 'sql'
  const [sqlCopied, setSqlCopied] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const safeProducts = Array.isArray(products) ? products : [];
  const safeSellers = Array.isArray(sellers) ? sellers : [];
  const safeBuyers = Array.isArray(buyers) ? buyers : [];
  const safeInquiries = Array.isArray(inquiries) ? inquiries : [];

  const pendingProducts = safeProducts.filter(p => p && !p.is_approved);
  const approvedProducts = safeProducts.filter(p => p && p.is_approved);

  // Total Catalog Gross Value calculation safely
  const totalCatalogValue = safeProducts.reduce((acc, p) => acc + (Number(p?.price) || 0), 0);
  const totalInquiryValue = safeInquiries.reduce((acc, i) => acc + (Number(i?.estimatedValue) || 0), 0);

  const formatPrice = (amount) => {
    const num = Number(amount);
    return isNaN(num) ? '0' : num.toLocaleString();
  };

  const sqlSchema = `-- B2B Marketplace Enterprise Supabase PostgreSQL Schema

-- 1. Profiles Table (Roles: Admin, Seller, Buyer)
create table profiles (
  id uuid references auth.users not null primary key,
  full_name text not null,
  role text check (role in ('admin', 'seller', 'buyer')),
  whatsapp_number text,
  pan_gst text,
  location text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Products Table (Multi-Vendor Wholesale Catalog)
create table products (
  id uuid default uuid_generate_v4() primary key,
  seller_id uuid references profiles(id) not null,
  seller_name text,
  seller_phone text,
  seller_location text,
  name text not null,
  description text,
  price decimal not null,
  unit text default 'Piece',
  moq text default '1 Piece',
  category text not null,
  subcategory text,
  image_url text,
  images text[],
  specifications jsonb,
  is_approved boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Inquiries Table (WhatsApp Lead Logs)
create table inquiries (
  id uuid default uuid_generate_v4() primary key,
  buyer_id uuid references profiles(id),
  product_id uuid references products(id),
  seller_id uuid references profiles(id),
  status text default 'WhatsApp Connected',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Row Level Security (RLS) Policies
alter table products enable row level security;

create policy "Sellers view own products" on products
  for select using (auth.uid() = seller_id);

create policy "Sellers insert own products" on products
  for insert with check (auth.uid() = seller_id);

create policy "Buyers view approved products" on products
  for select using (is_approved = true);`;

  const copySql = () => {
    try {
      navigator.clipboard.writeText(sqlSchema);
      setSqlCopied(true);
      if (showToast) showToast('SQL Schema copied to clipboard!', 'success');
      setTimeout(() => setSqlCopied(false), 2500);
    } catch (e) {}
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Enterprise ERP Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-purple-200 p-8 sm:p-10 shadow-xl text-white">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-400/30 backdrop-blur-md flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                Enterprise Business ERP Portal
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                Live Data Synchronized
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
              Super Admin <span className="text-purple-400">Control & Analytics Hub</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300">
              Manage seller registrations, buyer directories, product pricing, pending approvals, and WhatsApp inquiry leads.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsAddModalOpen && setIsAddModalOpen(true)}
              className="px-5 py-3 rounded-2xl font-bold text-sm bg-purple-600 hover:bg-purple-500 text-white shadow-xl shadow-purple-900/40 flex items-center justify-center gap-2 transition-all"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Add Auto-Approved Product</span>
            </button>

            <button
              onClick={resetData}
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 shadow-md"
              title="Reset ERP Mock Dataset"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ERP Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all shrink-0 ${
            activeTab === 'overview'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Executive Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('sellers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all shrink-0 ${
            activeTab === 'sellers'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Sellers Directory ({safeSellers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('buyers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all shrink-0 ${
            activeTab === 'buyers'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Buyers Directory ({safeBuyers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all shrink-0 ${
            activeTab === 'products'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Master Catalog ({safeProducts.length})</span>
          {pendingProducts.length > 0 && (
            <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full">
              {pendingProducts.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all shrink-0 ${
            activeTab === 'inquiries'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>WhatsApp Inquiry Leads ({safeInquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sql')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all shrink-0 ${
            activeTab === 'sql'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Supabase SQL</span>
        </button>
      </div>

      {/* 1. EXECUTIVE OVERVIEW DASHBOARD */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Key KPI Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Registered Sellers</span>
                <Store className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{safeSellers.length}</p>
              <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {safeSellers.filter(s => s && s.status === 'Verified').length} Verified Sellers
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Registered Buyers</span>
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{safeBuyers.length}</p>
              <p className="text-xs text-slate-500 font-medium">Wholesale Trade Sourcing Accounts</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Approved Live Products</span>
                <Package className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-3xl font-extrabold text-emerald-600">{approvedProducts.length}</p>
              <p className="text-xs text-amber-600 font-bold">
                {pendingProducts.length} Pending Admin Approvals
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">WhatsApp Inquiry Leads</span>
                <MessageSquare className="w-5 h-5 text-teal-600" />
              </div>
              <p className="text-3xl font-extrabold text-teal-600">{safeInquiries.length}</p>
              <p className="text-xs text-slate-500 font-medium">Est. Value: Rs. {(totalInquiryValue / 100000).toFixed(1)} Lakhs</p>
            </div>
          </div>

          {/* Financial Breakdown & Pending Approvals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  Wholesale Sourcing Financial Summary
                </h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Active Trade GMV
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-600">Total Listed Catalog Unit Value</span>
                  <span className="font-extrabold text-slate-900 text-base">Rs. {formatPrice(totalCatalogValue)}</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200">
                  <span className="text-xs font-bold text-indigo-900">Est. WhatsApp Sourcing Pipeline Value</span>
                  <span className="font-extrabold text-indigo-700 text-base">Rs. {formatPrice(totalInquiryValue)}</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-purple-50 border border-purple-200">
                  <span className="text-xs font-bold text-purple-900">Average Order Value per Lead</span>
                  <span className="font-extrabold text-purple-700 text-base">Rs. {formatPrice(Math.round(totalInquiryValue / (safeInquiries.length || 1)))}</span>
                </div>
              </div>
            </div>

            {/* Quick Action Pending Approvals */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  Action Required: Pending Approvals
                </h3>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  {pendingProducts.length} Items
                </span>
              </div>

              {pendingProducts.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 space-y-1">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="font-bold text-slate-800">All submissions approved!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingProducts.map(product => (
                    <div key={product.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                      <div className="truncate max-w-[200px]">
                        <p className="font-bold text-slate-900 truncate">{product.name || 'Untitled'}</p>
                        <p className="text-[11px] text-slate-500">By {product.seller_name || 'Supplier'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-emerald-700">Rs. {formatPrice(product.price)}</span>
                        <button
                          onClick={() => approveProduct && approveProduct(product.id)}
                          className="px-3 py-1 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 text-[11px]"
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* 2. REGISTERED SELLERS ERP DIRECTORY */}
      {activeTab === 'sellers' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Store className="w-5 h-5 text-indigo-600" />
                Registered Sellers ERP Directory
              </h3>
              <p className="text-xs text-slate-500">View registered manufacturers, PAN/GST tax numbers, and verification status</p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-200">
              {safeSellers.length} Registered Suppliers
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-[11px] uppercase tracking-wider font-bold text-slate-500 border-b border-slate-200">
                  <th className="py-4 px-4">Company Name</th>
                  <th className="py-4 px-4">Contact Person</th>
                  <th className="py-4 px-4">WhatsApp Phone</th>
                  <th className="py-4 px-4">Location</th>
                  <th className="py-4 px-4">PAN / GST No.</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {safeSellers.map(seller => (
                  <tr key={seller.id || Math.random()} className="hover:bg-slate-50/80">
                    <td className="py-4 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span>{seller.companyName || 'Wholesaler Firm'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-700 font-semibold">{seller.contactPerson || '-'}</td>
                    <td className="py-4 px-4 font-mono text-slate-800">+{seller.phone || '9779821863885'}</td>
                    <td className="py-4 px-4 text-slate-600">{seller.location || 'Nepal'}</td>
                    <td className="py-4 px-4 font-mono text-slate-600">{seller.panGst || 'N/A'}</td>
                    <td className="py-4 px-4">
                      {seller.status === 'Verified' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[11px] flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200 text-[11px] flex items-center gap-1 w-fit">
                          <Clock className="w-3 h-3" /> Pending Verification
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      {seller.status !== 'Verified' && (
                        <button
                          onClick={() => verifySeller && verifySeller(seller.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700"
                        >
                          Verify
                        </button>
                      )}
                      <button
                        onClick={() => deleteSeller && deleteSeller(seller.id)}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 font-bold text-[11px] hover:bg-rose-100"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. REGISTERED BUYERS ERP DIRECTORY */}
      {activeTab === 'buyers' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Registered Wholesale Buyers ERP Directory
              </h3>
              <p className="text-xs text-slate-500">Track registered buyers, sourcing interests, and WhatsApp inquiry activity</p>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-200">
              {safeBuyers.length} Wholesale Buyers
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-[11px] uppercase tracking-wider font-bold text-slate-500 border-b border-slate-200">
                  <th className="py-4 px-4">Buyer Name & Firm</th>
                  <th className="py-4 px-4">Email</th>
                  <th className="py-4 px-4">WhatsApp Phone</th>
                  <th className="py-4 px-4">Location</th>
                  <th className="py-4 px-4">Sourcing Interest</th>
                  <th className="py-4 px-4">Inquiries Sent</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {safeBuyers.map(buyer => (
                  <tr key={buyer.id || Math.random()} className="hover:bg-slate-50/80">
                    <td className="py-4 px-4 font-bold text-slate-900">{buyer.name || 'Buyer'}</td>
                    <td className="py-4 px-4 text-slate-600">{buyer.email || '-'}</td>
                    <td className="py-4 px-4 font-mono text-slate-800">+{buyer.phone || '9779821863885'}</td>
                    <td className="py-4 px-4 text-slate-600">{buyer.location || 'Nepal'}</td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
                        {buyer.interest || 'Wholesale Products'}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-emerald-700">{buyer.inquiriesSent || 0} leads</td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => deleteBuyer && deleteBuyer(buyer.id)}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 font-bold text-[11px] hover:bg-rose-100"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. MASTER CATALOG & PRODUCT ERP */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Master Catalog & Price Management ERP</h3>
              <p className="text-xs text-slate-500">Edit titles, custom categories, subcategories, pricing, and MOQ</p>
            </div>
            <span className="text-xs text-slate-500 font-medium">{safeProducts.length} Total Listings</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-[11px] uppercase tracking-wider font-bold text-slate-500 border-b border-slate-200">
                  <th className="py-4 px-6">Product Title</th>
                  <th className="py-4 px-4">Category & Subcategory</th>
                  <th className="py-4 px-4">Seller</th>
                  <th className="py-4 px-4">Wholesale Price</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {safeProducts.map(p => (
                  <tr key={p.id || Math.random()} className="hover:bg-slate-50">
                    <td className="py-3 px-6 font-bold text-slate-900 max-w-[220px] truncate">{p.name || 'Product'}</td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="font-semibold text-slate-800">{p.category || 'General'}</span>
                      {p.subcategory && <p className="text-[10px] text-indigo-600 font-semibold truncate">↳ {p.subcategory}</p>}
                    </td>
                    <td className="py-3 px-4 text-slate-700 truncate max-w-[150px]">{p.seller_name || 'Seller'}</td>
                    <td className="py-3 px-4 text-emerald-700 font-extrabold">Rs. {formatPrice(p.price)} <span className="text-[10px] font-normal text-slate-400">/ {p.unit || 'Pcs'}</span></td>
                    <td className="py-3 px-4">
                      {p.is_approved ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px]">Approved</span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[11px]">Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-6 text-right space-x-2">
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold border border-purple-200 inline-flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => deleteProduct && deleteProduct(p.id)}
                        className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. WHATSAPP INQUIRY LEADS LOG ERP */}
      {activeTab === 'inquiries' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-teal-600" />
                WhatsApp Lead & Sourcing Inquiries ERP Log
              </h3>
              <p className="text-xs text-slate-500">Track buyer inquiry history, estimated lead pipeline values, and conversion statuses</p>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-200">
              {safeInquiries.length} Lead Records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-[11px] uppercase tracking-wider font-bold text-slate-500 border-b border-slate-200">
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-4">Buyer</th>
                  <th className="py-4 px-4">Product Inquired</th>
                  <th className="py-4 px-4">Supplier</th>
                  <th className="py-4 px-4">Quantity</th>
                  <th className="py-4 px-4">Est. Order Value</th>
                  <th className="py-4 px-6 text-right">Conversion Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {safeInquiries.map(inq => (
                  <tr key={inq.id || Math.random()} className="hover:bg-slate-50/80">
                    <td className="py-4 px-4 text-slate-500 font-mono">{inq.date || '2026-07-23'}</td>
                    <td className="py-4 px-4 font-bold text-slate-900">{inq.buyerName || 'Buyer'}</td>
                    <td className="py-4 px-4 font-semibold text-slate-800">{inq.productName || 'Product'}</td>
                    <td className="py-4 px-4 text-slate-600">{inq.sellerName || 'Supplier'}</td>
                    <td className="py-4 px-4 font-bold text-indigo-700">{inq.targetQty || '1 Set'}</td>
                    <td className="py-4 px-4 font-extrabold text-emerald-700">Rs. {formatPrice(inq.estimatedValue)}</td>
                    <td className="py-4 px-6 text-right">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[11px]">
                        {inq.status || 'Active Lead'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. SUPABASE SQL MIGRATION INSPECTOR */}
      {activeTab === 'sql' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-700 font-bold">
              <Terminal className="w-5 h-5" />
              <span>Enterprise Supabase SQL Database Migration Script</span>
            </div>
            <button
              onClick={copySql}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span>{sqlCopied ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
            </button>
          </div>

          <pre className="p-6 rounded-2xl bg-slate-900 text-emerald-400 text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap shadow-inner">
            {sqlSchema}
          </pre>
        </div>
      )}

      {/* Admin Edit Product Modal */}
      {editingProduct && (
        <EditProductModal 
          editingProduct={editingProduct} 
          setEditingProduct={setEditingProduct} 
        />
      )}

    </div>
  );
}
