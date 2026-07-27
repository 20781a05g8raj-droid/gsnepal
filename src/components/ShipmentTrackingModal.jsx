import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  Package,
  Navigation,
  ShieldCheck,
  Building2,
  User,
  Calendar,
  Save,
  ArrowRight
} from 'lucide-react';

export default function ShipmentTrackingModal({ trackingEntry, onClose, isEditable = true }) {
  const { updateShipmentTracking } = useApp();

  if (!trackingEntry) return null;

  const [form, setForm] = useState({
    shipmentStatus: trackingEntry.shipmentStatus || trackingEntry.deliveryStatus || 'Dispatched',
    currentLocation: trackingEntry.currentLocation || 'Central Logistics Hub',
    estimatedDeliveryDays: trackingEntry.estimatedDeliveryDays || '2-3 Days',
    trackingNumber: trackingEntry.trackingNumber || ('WS-SHIP-' + Date.now().toString().slice(-4)),
    courierPartner: trackingEntry.courierPartner || 'Express Cargo Nepal'
  });

  const [isEditing, setIsEditing] = useState(false);

  const STAGES = [
    { key: 'Order Confirmed', label: 'Order Confirmed', desc: 'Payment verified & order created' },
    { key: 'Dispatched', label: 'Dispatched', desc: 'Picked up from Seller facility' },
    { key: 'In Transit', label: 'In Transit', desc: 'On the way to regional sorting hub' },
    { key: 'Out for Delivery', label: 'Out for Delivery', desc: 'Out with local courier agent' },
    { key: 'Delivered', label: 'Delivered', desc: 'Safely delivered to buyer address' }
  ];

  const getCurrentStepIndex = () => {
    const current = form.shipmentStatus;
    if (current === 'Delivered') return 4;
    if (current === 'Out for Delivery') return 3;
    if (current === 'In Transit') return 2;
    if (current === 'Dispatched') return 1;
    return 0; // Order Confirmed
  };

  const currentStep = getCurrentStepIndex();
  const progressPercent = ((currentStep + 1) / 5) * 100;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (updateShipmentTracking) {
      updateShipmentTracking(trackingEntry.id, form);
    }
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 text-slate-900 shadow-md">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base sm:text-lg">Shipment Tracking & Delivery Status</h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 bg-emerald-500 text-slate-950 rounded-full font-mono">
                  {trackingEntry.id}
                </span>
              </div>
              <p className="text-xs text-slate-300">Live location updates & estimated delivery timeline</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 text-xs max-h-[75vh] overflow-y-auto">
          
          {/* Order Summary Pill */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Product Order</span>
              <h4 className="font-extrabold text-slate-900 text-sm line-clamp-1">{trackingEntry.productName}</h4>
              <p className="text-slate-600 font-semibold">
                Qty: <span className="font-bold text-indigo-600">{trackingEntry.quantity} {trackingEntry.unit}</span> | Total: <span className="font-extrabold text-emerald-700">Rs. {(Number(trackingEntry.totalAmount) || 0).toLocaleString()}</span>
              </p>
            </div>

            <div className="text-left sm:text-right space-y-0.5 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
              <p className="text-[10px] font-bold text-slate-400">Buyer & Seller</p>
              <p className="font-bold text-slate-800 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-indigo-600" />
                <span>{trackingEntry.buyerName}</span>
              </p>
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-slate-400" />
                <span>{trackingEntry.sellerName}</span>
              </p>
            </div>
          </div>

          {/* Visual 5-Step Milestone Progress Bar */}
          <div className="space-y-3 p-5 bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="font-bold text-xs text-indigo-200 uppercase tracking-wider">Live Shipment Progress</span>
              </div>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-extrabold border border-emerald-400/30">
                {form.shipmentStatus}
              </span>
            </div>

            {/* Progress Track Line */}
            <div className="relative pt-4 pb-2">
              <div className="overflow-hidden h-2.5 mb-4 text-xs flex rounded-full bg-slate-800 border border-slate-700">
                <div 
                  style={{ width: `${progressPercent}%` }} 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-500 via-emerald-400 to-teal-300 transition-all duration-700"
                />
              </div>

              {/* 5 Step Badges */}
              <div className="grid grid-cols-5 text-center gap-1">
                {STAGES.map((stage, idx) => {
                  const isDone = idx <= currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div key={stage.key} className="flex flex-col items-center space-y-1">
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isCurrent
                          ? 'bg-emerald-400 text-slate-950 ring-4 ring-emerald-400/30 scale-110 shadow-lg'
                          : isDone
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}>
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : (idx + 1)}
                      </div>
                      <span className={`text-[9px] sm:text-[10px] font-bold leading-tight line-clamp-1 ${
                        isCurrent ? 'text-emerald-300 font-extrabold' : isDone ? 'text-white' : 'text-slate-500'
                      }`}>
                        {stage.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current Checkpoint & Estimated Days */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>Current Package Location / Hub</span>
                </div>
                <p className="font-extrabold text-white text-xs sm:text-sm">{form.currentLocation}</p>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Estimated Delivery Time</span>
                </div>
                <p className="font-extrabold text-emerald-400 text-xs sm:text-sm">{form.estimatedDeliveryDays}</p>
              </div>
            </div>

            {/* Courier & Tracking Code */}
            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60 font-mono">
              <span>Courier: <strong className="text-slate-200">{form.courierPartner}</strong></span>
              <span>Tracking #: <strong className="text-indigo-300">{form.trackingNumber}</strong></span>
            </div>
          </div>

          {/* Admin / Seller Edit Form (If Editable) */}
          {isEditable && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-indigo-600" />
                  <span>Update Shipment Location & Stage</span>
                </h4>

                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-700 font-bold rounded-xl border border-indigo-200 text-xs hover:bg-indigo-100 transition-colors"
                >
                  {isEditing ? 'Close Editor' : '✏️ Edit Shipment Details'}
                </button>
              </div>

              {isEditing && (
                <form onSubmit={handleSubmit} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Shipment Stage Status</label>
                      <select
                        value={form.shipmentStatus}
                        onChange={(e) => setForm({ ...form, shipmentStatus: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800"
                      >
                        <option value="Order Confirmed">Order Confirmed</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Estimated Delivery Time / Days</label>
                      <input
                        type="text"
                        value={form.estimatedDeliveryDays}
                        onChange={(e) => setForm({ ...form, estimatedDeliveryDays: e.target.value })}
                        placeholder="e.g. 2 Days (Arriving 29 July)"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Current Location / Route Checkpoint</label>
                    <input
                      type="text"
                      value={form.currentLocation}
                      onChange={(e) => setForm({ ...form, currentLocation: e.target.value })}
                      placeholder="e.g. Kathmandu Sorting Hub -> Naubise Highway Checkpoint"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Courier / Transport Partner</label>
                      <input
                        type="text"
                        value={form.courierPartner}
                        onChange={(e) => setForm({ ...form, courierPartner: e.target.value })}
                        placeholder="e.g. Express Cargo Nepal"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Tracking Code / Waybill #</label>
                      <input
                        type="text"
                        value={form.trackingNumber}
                        onChange={(e) => setForm({ ...form, trackingNumber: e.target.value })}
                        placeholder="e.g. WS-SHIP-982101"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save & Update Tracking</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
