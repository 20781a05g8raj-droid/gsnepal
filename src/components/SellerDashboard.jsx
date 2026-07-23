import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Store,
  PlusCircle,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Trash2,
  Eye,
  Package,
  Layers,
  Database
} from 'lucide-react';

export default function SellerDashboard() {
  const {
    userProfile,
    products,
    setIsAddModalOpen,
    deleteProduct,
    setSelectedProductModal
  } = useApp();

  const sellerProducts = products.filter(p => p.seller_id === (userProfile ? userProfile.id : 'seller-101'));
  const approvedCount = sellerProducts.filter(p => p.is_approved).length;
  const pendingCount = sellerProducts.filter(p => !p.is_approved).length;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Visual Seller Header Banner - High Visibility Image */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-indigo-200 p-8 sm:p-12 shadow-xl min-h-[300px] flex items-center">
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none opacity-85 bg-cover bg-center"
          style={{ backgroundImage: `url('/b2b_seller_banner.png')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-900/40" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 w-full text-white">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-indigo-600/40 text-indigo-200 text-xs font-bold border border-indigo-400/40 backdrop-blur-md">
                Seller Portal & Product Management
              </span>
              <span className="px-3.5 py-1 rounded-full bg-slate-900/80 text-white text-xs font-semibold backdrop-blur-md flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                RLS Policy Active
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
              Seller Center: <span className="text-indigo-300">{userProfile ? userProfile.name : 'Apex Industrial'}</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 font-medium">
              List your wholesale inventory, track admin approval status, and manage direct WhatsApp buyer leads.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-3 rounded-2xl font-bold text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 shrink-0 transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add New Product Listing</span>
          </button>
        </div>
      </div>

      {/* RLS Policy Banner */}
      <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-start gap-3 text-xs">
        <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 shrink-0">
          <Database className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <p className="font-bold text-indigo-900">Supabase Row Level Security (RLS) Active</p>
          <p className="text-slate-700 leading-relaxed font-mono">
            Policy SELECT: <span className="text-emerald-700 font-bold">auth.uid() = seller_id</span> — You are viewing only products listed under your Seller ID (<span className="text-indigo-700">{userProfile ? userProfile.id : 'seller-101'}</span>).
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Listed</span>
            <Package className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{sellerProducts.length}</p>
          <p className="text-xs text-slate-500">Products under your seller account</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Approved & Live</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-600">{approvedCount}</p>
          <p className="text-xs text-slate-500">Visible to buyers in Marketplace Catalog</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Approval</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-extrabold text-amber-600">{pendingCount}</p>
          <p className="text-xs text-slate-500">Awaiting Admin review</p>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-lg">My Product Catalog</h3>
          </div>
          <span className="text-xs text-slate-500">{sellerProducts.length} items listed</span>
        </div>

        {sellerProducts.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <Package className="w-12 h-12 text-slate-400 mx-auto" />
            <p className="text-slate-700 font-medium">You haven't listed any products yet.</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] uppercase tracking-wider font-bold text-slate-500 border-b border-slate-200">
                  <th className="py-4 px-6">Product Details</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Wholesale Price</th>
                  <th className="py-4 px-4">MOQ</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {sellerProducts.map(product => (
                  <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-slate-100"
                        />
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{product.name}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{product.description}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px] border border-slate-200">
                        {product.category}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-bold text-slate-900">
                      Rs. {product.price.toLocaleString()} <span className="text-[10px] font-normal text-slate-500">/ {product.unit}</span>
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-700">
                      {product.moq}
                    </td>

                    <td className="py-4 px-4">
                      {product.is_approved ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" /> Approved
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold flex items-center gap-1 w-fit">
                          <Clock className="w-3 h-3" /> Pending Admin Approval
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => setSelectedProductModal(product)}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        title="View details & preview WhatsApp inquiry"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
