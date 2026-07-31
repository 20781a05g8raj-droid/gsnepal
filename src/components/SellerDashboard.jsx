import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ShipmentTrackingModal from './ShipmentTrackingModal';
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
  Database,
  FileSpreadsheet,
  Truck,
  MapPin,
  TrendingUp,
  User,
  Edit3
} from 'lucide-react';

export default function SellerDashboard() {
  const {
    userProfile,
    products,
    salesJournal = [],
    setIsAddModalOpen,
    deleteProduct,
    setSelectedProductModal,
    setEditingProduct
  } = useApp();

  const [selectedShipmentTracking, setSelectedShipmentTracking] = useState(null);

  const currentSellerId = userProfile ? userProfile.id : 'seller-101';
  const currentSellerName = userProfile ? userProfile.name : 'Apex Industrial';

  const sellerProducts = products.filter(p => p.seller_id === currentSellerId || p.seller_name === currentSellerName);
  const approvedCount = sellerProducts.filter(p => p.is_approved).length;
  const pendingCount = sellerProducts.filter(p => !p.is_approved).length;

  // Filter Sales Journal for current seller
  const sellerOrders = salesJournal.filter(j => j.sellerId === currentSellerId || j.sellerName === currentSellerName || currentSellerId === 'seller-101');

  return (
    <div className="space-y-8 pb-16">
      
      {/* Visual Seller Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-indigo-200 p-6 sm:p-10 shadow-xl min-h-[280px] flex items-center">
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none opacity-85 bg-cover bg-center"
          style={{ backgroundImage: `url('/b2b_seller_banner.png')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-900/40" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 w-full text-white">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-indigo-600/40 text-indigo-200 text-xs font-bold border border-indigo-400/40 backdrop-blur-md">
                Seller Portal & Logistics Hub
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
              List single products, upload bulk CSV catalogs, track shipment stages, and manage order deliveries.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-3 rounded-2xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Bulk CSV Import</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-3 rounded-2xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add Single Product</span>
            </button>
          </div>
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
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Orders & Shipments</span>
            <Truck className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-3xl font-extrabold text-indigo-600">{sellerOrders.length}</p>
          <p className="text-xs text-slate-500">Active shipment tracking entries</p>
        </div>
      </div>

      {/* Shipment Tracking & Delivery Management Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <Truck className="w-5 h-5 text-indigo-600" />
              <span>Order Sales & Shipment Tracking Manager</span>
            </h3>
            <p className="text-xs text-slate-500">Track package current location, estimated delivery days, and dispatch stages</p>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            {sellerOrders.length} Shipped Orders
          </span>
        </div>

        {sellerOrders.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 space-y-2">
            <Truck className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-bold text-slate-700">No active shipments found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-[11px] uppercase tracking-wider font-bold text-slate-500 border-b border-slate-200">
                  <th className="py-3.5 px-4">Order ID & Date</th>
                  <th className="py-3.5 px-4">Buyer Customer</th>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Quantity & Total</th>
                  <th className="py-3.5 px-4">Shipment Stage</th>
                  <th className="py-3.5 px-4">Current Hub Location</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sellerOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/80">
                    <td className="py-4 px-4 font-mono font-bold text-slate-900">
                      <p>{order.id}</p>
                      <p className="text-[10px] text-slate-400 font-normal">{order.date}</p>
                    </td>

                    <td className="py-4 px-4 font-bold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>{order.buyerName}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-semibold text-slate-900 max-w-[150px] truncate">{order.productName}</td>

                    <td className="py-4 px-4">
                      <p className="font-bold text-slate-800">{order.quantity} {order.unit}</p>
                      <p className="font-extrabold text-emerald-700 text-[11px]">Rs. {(Number(order.totalAmount) || 0).toLocaleString()}</p>
                    </td>

                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border flex items-center gap-1 w-fit ${
                          (order.shipmentStatus || order.deliveryStatus) === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : (order.shipmentStatus || order.deliveryStatus) === 'Out for Delivery'
                            ? 'bg-teal-50 text-teal-700 border-teal-200'
                            : (order.shipmentStatus || order.deliveryStatus) === 'In Transit'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          <Truck className="w-3 h-3" />
                          <span>{order.shipmentStatus || order.deliveryStatus || 'Dispatched'}</span>
                        </span>
                        <p className="text-[10px] text-slate-500 font-medium">ETA: {order.estimatedDeliveryDays || '2-3 Days'}</p>
                      </div>
                    </td>

                    <td className="py-4 px-4 max-w-[160px]">
                      <p className="text-[11px] font-semibold text-slate-800 line-clamp-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                        <span>{order.currentLocation || 'Logistics Hub'}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">#{order.trackingNumber || 'WS-SHIP-9821'}</p>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedShipmentTracking(order)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center gap-1 inline-flex cursor-pointer transition-all"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track / Update</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-lg">My Product Catalog</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 text-xs hover:bg-indigo-100 flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-600" />
              <span>Bulk CSV Import</span>
            </button>
            <span className="text-xs text-slate-500">{sellerProducts.length} items listed</span>
          </div>
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
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="View details & preview WhatsApp inquiry"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors cursor-pointer"
                        title="Edit product details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
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

      {/* Shipment Tracking Modal */}
      {selectedShipmentTracking && (
        <ShipmentTrackingModal
          trackingEntry={selectedShipmentTracking}
          onClose={() => setSelectedShipmentTracking(null)}
          isEditable={true}
        />
      )}

    </div>
  );
}
