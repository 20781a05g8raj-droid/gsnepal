import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Edit3 } from 'lucide-react';
import { PRESET_CATEGORIES } from '../lib/supabase';

export default function EditProductModal({ editingProduct, setEditingProduct }) {
  const { updateProduct } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Industrial Machinery',
    subcategory: '',
    price: '',
    unit: 'Piece',
    moq: '1 Piece',
    description: '',
    image_url: '',
    is_approved: true
  });

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        category: editingProduct.category || 'Industrial Machinery',
        subcategory: editingProduct.subcategory || '',
        price: editingProduct.price || '',
        unit: editingProduct.unit || 'Piece',
        moq: editingProduct.moq || '1 Piece',
        description: editingProduct.description || '',
        image_url: editingProduct.image_url || '',
        is_approved: editingProduct.is_approved !== false
      });
    }
  }, [editingProduct]);

  if (!editingProduct) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProduct(editingProduct.id, {
      ...formData,
      price: parseFloat(formData.price) || 0
    });
    setEditingProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Admin Edit Product Details</h3>
              <p className="text-xs text-slate-500">Edit title, category, subcategory, price, or MOQ</p>
            </div>
          </div>

          <button
            onClick={() => setEditingProduct(null)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Product Title *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-purple-500 font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Category (Custom or Preset)</label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-purple-500 font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Subcategory / Variety</label>
              <input
                type="text"
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                placeholder="e.g. Surgical Disposables / Syringes"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Price (Rs.) *</label>
              <input
                type="number"
                required
                min="1"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-extrabold text-sm focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-purple-500"
              >
                <option value="Piece">Piece / Pcs</option>
                <option value="Set">Set / Machine</option>
                <option value="Kg">Kilogram (Kg)</option>
                <option value="Ton">Metric Ton</option>
                <option value="Meter">Meter</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">MOQ</label>
              <input
                type="text"
                value={formData.moq}
                onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Image Cover URL</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono text-[11px] focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Description</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is_approved"
              checked={formData.is_approved}
              onChange={(e) => setFormData({ ...formData, is_approved: e.target.checked })}
              className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
            />
            <label htmlFor="is_approved" className="font-bold text-slate-800 text-xs cursor-pointer">
              Mark as Approved (Visible in Public Catalog)
            </label>
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setEditingProduct(null)}
              className="px-4 py-2.5 rounded-xl font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-all"
            >
              Save Admin Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
