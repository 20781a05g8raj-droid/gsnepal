import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, PlusCircle, Image, Trash2, Plus, Sliders, Layers } from 'lucide-react';
import { PRESET_CATEGORIES } from '../lib/supabase';

const SAMPLE_IMAGE_PRESETS = [
  { name: 'Medical Syringe', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80' },
  { name: 'Surgical Equipment', url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80' },
  { name: 'Industrial Machine', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80' },
  { name: 'Cardamom / Spices', url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80' },
  { name: 'Solar Charge Controller', url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80' }
];

export default function AddProductModal() {
  const { isAddModalOpen, setIsAddModalOpen, addProduct, role } = useApp();

  const [categoryMode, setCategoryMode] = useState('preset'); // 'preset' | 'custom'
  const [selectedCategory, setSelectedCategory] = useState('Industrial Machinery');
  const [customCategory, setCustomCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    unit: 'Piece',
    moq: '10 Pieces',
    description: ''
  });

  // Multiple Images Gallery List
  const [images, setImages] = useState([SAMPLE_IMAGE_PRESETS[0].url]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Specifications Key-Value Array
  const [specifications, setSpecifications] = useState([
    { key: 'Material', value: 'Medical Grade / Stainless Steel' },
    { key: 'Certification', value: 'ISO 13485 / CE Approved' }
  ]);
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  if (!isAddModalOpen) return null;

  // Add Image URL to Gallery
  const handleAddImage = (urlToAdd) => {
    const targetUrl = urlToAdd || newImageUrl;
    if (!targetUrl || images.length >= 5) return;
    if (!images.includes(targetUrl)) {
      setImages([...images, targetUrl]);
    }
    setNewImageUrl('');
  };

  const handleRemoveImage = (index) => {
    if (images.length === 1) return; // Keep at least 1 image
    setImages(images.filter((_, i) => i !== index));
  };

  // Add Key-Value Specification Pair
  const handleAddSpec = () => {
    if (!newSpecKey || !newSpecValue) return;
    setSpecifications([...specifications, { key: newSpecKey, value: newSpecValue }]);
    setNewSpecKey('');
    setNewSpecValue('');
  };

  const handleRemoveSpec = (index) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    const finalCategory = categoryMode === 'custom' && customCategory ? customCategory : selectedCategory;

    addProduct({
      ...formData,
      category: finalCategory,
      subcategory: subcategory || 'General Wholesale',
      images: images,
      image_url: images[0],
      specifications: specifications
    });

    // Reset Form
    setFormData({ name: '', price: '', unit: 'Piece', moq: '10 Pieces', description: '' });
    setSubcategory('');
    setCustomCategory('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Add Product Listing</h3>
              <p className="text-xs text-slate-500">Custom Category, Subcategories, Specs & Multiple Images</p>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
          
          {/* Product Name */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Product Full Title & Model *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Disposable Sterile Syringe Luer Lock 5ml (Package of 100)"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500 font-semibold"
            />
          </div>

          {/* Category Selection & Custom Category Input */}
          <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Product Main Category</span>
              </label>

              {/* Mode switch */}
              <div className="flex bg-slate-200 p-0.5 rounded-lg text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setCategoryMode('preset')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${categoryMode === 'preset' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600'}`}
                >
                  Select Preset
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryMode('custom')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${categoryMode === 'custom' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600'}`}
                >
                  Type Custom Category
                </button>
              </div>
            </div>

            {categoryMode === 'preset' ? (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:border-indigo-500"
              >
                {PRESET_CATEGORIES.filter(c => c !== 'All Categories').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                required
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="e.g. Dental Instruments, Heavy Hydraulics, Ayurvedic Extracts..."
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:border-indigo-500"
              />
            )}

            {/* Subcategory & Variety Input */}
            <div className="space-y-1 pt-1">
              <label className="font-bold text-slate-700">Subcategory / Product Variety & Specific Type</label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                placeholder="e.g. Surgical Disposables / Syringes 5ml Luer Lock"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Pricing & MOQ */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Wholesale Price (Rs.) *</label>
              <input
                type="number"
                required
                min="1"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="18"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Unit Type</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                <option value="Piece">Piece / Pcs</option>
                <option value="Box">Box / Carton</option>
                <option value="Set">Set / Unit</option>
                <option value="Kg">Kilogram (Kg)</option>
                <option value="Ton">Metric Ton</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Min. Order (MOQ)</label>
              <input
                type="text"
                value={formData.moq}
                onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
                placeholder="1,000 Pcs"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Multiple Image Gallery Section */}
          <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <Image className="w-4 h-4 text-indigo-600" />
                <span>Multiple Product Photo Gallery ({images.length}/5)</span>
              </label>
              <span className="text-[11px] text-slate-500">First photo is main cover image</span>
            </div>

            {/* Thumbnail previews grid */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((imgUrl, index) => (
                <div key={index} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-300 group shrink-0">
                  <img src={imgUrl} alt={`Product angle ${index+1}`} className="w-full h-full object-cover" />
                  {index === 0 && (
                    <span className="absolute bottom-0 inset-x-0 bg-indigo-600 text-white text-[9px] text-center font-bold">Cover</span>
                  )}
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Image URL input */}
            <div className="flex gap-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Paste additional product image URL..."
                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 font-mono text-[11px]"
              />
              <button
                type="button"
                onClick={() => handleAddImage()}
                className="px-3 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700"
              >
                Add Image
              </button>
            </div>

            {/* Sample Image Presets */}
            <div className="flex items-center gap-2 overflow-x-auto pt-1">
              <span className="text-[10px] text-slate-500 shrink-0 font-medium">Sample Presets:</span>
              {SAMPLE_IMAGE_PRESETS.map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleAddImage(preset.url)}
                  className="shrink-0 px-2 py-1 rounded-lg text-[10px] bg-white border border-slate-200 hover:border-indigo-400 text-slate-600"
                >
                  + {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Technical Specifications Builder */}
          <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <span>Technical Specifications & Attributes</span>
              </label>
              <span className="text-[11px] text-slate-500">e.g., Gauge Size, Material, Sterilization</span>
            </div>

            {/* Specs List */}
            <div className="space-y-2">
              {specifications.map((spec, i) => (
                <div key={i} className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
                  <span className="font-bold text-slate-700">{spec.key}:</span>
                  <span className="text-slate-600 font-semibold">{spec.value}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(i)}
                    className="text-rose-500 hover:text-rose-700 ml-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Spec row */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={newSpecKey}
                onChange={(e) => setNewSpecKey(e.target.value)}
                placeholder="Spec Name (e.g. Capacity)"
                className="w-1/3 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800"
              />
              <input
                type="text"
                value={newSpecValue}
                onChange={(e) => setNewSpecValue(e.target.value)}
                placeholder="Spec Value (e.g. 5ml / Luer Lock)"
                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800"
              />
              <button
                type="button"
                onClick={handleAddSpec}
                className="px-3 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 shrink-0"
              >
                + Add Spec
              </button>
            </div>
          </div>

          {/* Full Description */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Detailed Description & Overview</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide detailed information about usage, packaging specs, shipping lead times..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2.5 rounded-xl font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all"
            >
              Submit Product Listing
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
