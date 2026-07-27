import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, PlusCircle, Image, Trash2, Plus, Sliders, Layers, FileSpreadsheet, Upload, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { PRESET_CATEGORIES } from '../lib/supabase';

const SAMPLE_IMAGE_PRESETS = [
  { name: 'Medical Syringe', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80' },
  { name: 'Surgical Equipment', url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80' },
  { name: 'Industrial Machine', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80' },
  { name: 'Cardamom / Spices', url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80' },
  { name: 'Solar Charge Controller', url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80' }
];

export default function AddProductModal() {
  const { isAddModalOpen, setIsAddModalOpen, addProduct, addBulkProducts, role } = useApp();

  const [activeTabMode, setActiveTabMode] = useState('single'); // 'single' | 'csv'

  // Single Product Form States
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

  const [images, setImages] = useState([SAMPLE_IMAGE_PRESETS[0].url]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [specifications, setSpecifications] = useState([
    { key: 'Material', value: 'Medical Grade / Stainless Steel' },
    { key: 'Certification', value: 'ISO 13485 / CE Approved' }
  ]);
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  // CSV Bulk Upload States
  const [csvFileName, setCsvFileName] = useState('');
  const [csvParsedProducts, setCsvParsedProducts] = useState([]);
  const [csvError, setCsvError] = useState('');
  const [isParsingCsv, setIsParsingCsv] = useState(false);

  if (!isAddModalOpen) return null;

  // Single Form Image Handlers
  const handleAddImage = (urlToAdd) => {
    const targetUrl = urlToAdd || newImageUrl;
    if (!targetUrl || images.length >= 5) return;
    if (!images.includes(targetUrl)) {
      setImages([...images, targetUrl]);
    }
    setNewImageUrl('');
  };

  const handleRemoveImage = (index) => {
    if (images.length === 1) return;
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddSpec = () => {
    if (!newSpecKey || !newSpecValue) return;
    setSpecifications([...specifications, { key: newSpecKey, value: newSpecValue }]);
    setNewSpecKey('');
    setNewSpecValue('');
  };

  const handleRemoveSpec = (index) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const handleSingleSubmit = (e) => {
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

    setFormData({ name: '', price: '', unit: 'Piece', moq: '10 Pieces', description: '' });
    setSubcategory('');
    setCustomCategory('');
  };

  // CSV File Parse Handler
  const handleCSVFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setCsvFileName(file.name);
    setCsvError('');
    setIsParsingCsv(true);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target.result;
        const lines = text.split(/\r\n|\n/);
        if (lines.length <= 1) {
          setCsvError('The CSV file is empty or missing data rows.');
          setIsParsingCsv(false);
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
        const parsedList = [];

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          // Parse CSV line handling quotes
          const values = [];
          let insideQuote = false;
          let currentVal = '';

          for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"' || char === "'") {
              insideQuote = !insideQuote;
            } else if (char === ',' && !insideQuote) {
              values.push(currentVal.trim().replace(/^["']|["']$/g, ''));
              currentVal = '';
            } else {
              currentVal += char;
            }
          }
          values.push(currentVal.trim().replace(/^["']|["']$/g, ''));

          if (values.length >= 1 && values[0]) {
            const obj = {};
            headers.forEach((h, idx) => {
              obj[h] = values[idx] || '';
            });

            const prodName = obj.name || obj.title || obj['product name'] || values[0];
            const prodPrice = parseFloat(obj.price || values[1]) || 0;
            const prodUnit = obj.unit || values[2] || 'Piece';
            const prodMoq = obj.moq || values[3] || '1 Piece';
            const prodCategory = obj.category || values[4] || 'Industrial Machinery';
            const prodSubcat = obj.subcategory || values[5] || 'General Wholesale';
            const prodDesc = obj.description || values[6] || 'Bulk CSV imported product listing.';
            const prodImg = obj.image_url || obj.image || values[7] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';

            parsedList.push({
              name: prodName,
              price: prodPrice,
              unit: prodUnit,
              moq: prodMoq,
              category: prodCategory,
              subcategory: prodSubcat,
              description: prodDesc,
              image_url: prodImg
            });
          }
        }

        if (parsedList.length === 0) {
          setCsvError('No valid product rows could be parsed from the CSV file.');
        } else {
          setCsvParsedProducts(parsedList);
        }
      } catch (err) {
        setCsvError('Failed to parse CSV file. Please check format.');
      }
      setIsParsingCsv(false);
    };

    reader.readAsText(file);
  };

  const handleDownloadSampleCSV = () => {
    const csvContent = `name,price,unit,moq,category,subcategory,description,image_url
"Disposable Syringe 5ml Luer Lock",18,"Piece","1000 Pieces","Medical & Healthcare","Surgical Disposables","Medical grade sterile 5ml syringes","https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80"
"Automatic Paper Cup Making Machine",485000,"Set","1 Set","Industrial Machinery","Paper Cup Plant","90pcs/min high speed paper cup manufacturing unit","https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
"Organic Large Cardamom Elaichi Grade A",1250,"Kg","50 Kg","Agriculture & Food","Himalayan Spices","Direct farm sourced Himalayan green cardamom","https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80"
"Monocrystalline Solar Panel 550W Tier 1",14500,"Piece","10 Pieces","Electronics & Solar","Solar Power Systems","High efficiency Tier 1 solar PV module","https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80"`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'WS_NEPAL_Product_Import_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSVProducts = () => {
    if (csvParsedProducts.length === 0) return;
    addBulkProducts(csvParsedProducts);
    setCsvParsedProducts([]);
    setCsvFileName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base sm:text-lg">Add Products to Marketplace</h3>
              <p className="text-xs text-slate-300">Single Product Entry or Bulk CSV Import</p>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-2 gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTabMode('single')}
            className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTabMode === 'single'
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Single Product Entry</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabMode('csv')}
            className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeTabMode === 'csv'
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Bulk CSV Import (Multiple Products)</span>
          </button>
        </div>

        {/* Tab 1: Single Product Entry Form */}
        {activeTabMode === 'single' ? (
          <form onSubmit={handleSingleSubmit} className="p-5 sm:p-6 space-y-5 text-xs max-h-[70vh] overflow-y-auto">
            
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

            {/* Category Selection */}
            <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>Product Main Category</span>
                </label>

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
                    + Custom Category
                  </button>
                </div>
              </div>

              {categoryMode === 'preset' ? (
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none focus:border-indigo-500"
                >
                  {PRESET_CATEGORIES.filter(c => c !== 'All Categories').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter New Category Name (e.g. Renewable Energy Equipment)"
                  className="w-full px-4 py-2.5 bg-white border border-indigo-300 rounded-xl text-slate-800 font-bold focus:outline-none focus:border-indigo-600"
                />
              )}

              {/* Subcategory */}
              <div className="pt-2">
                <label className="font-bold text-slate-700 block mb-1">Subcategory / Specialized Group (Optional)</label>
                <input
                  type="text"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  placeholder="e.g. Syringes & Needles, Solar Panels, Paper Packaging"
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800"
                />
              </div>
            </div>

            {/* Pricing & MOQ Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Wholesale Price (Rs.) *</label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g. 485000"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Unit of Measure</label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="e.g. Piece, Set, Kg, Meter"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Minimum Order Quantity (MOQ)</label>
                <input
                  type="text"
                  value={formData.moq}
                  onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
                  placeholder="e.g. 10 Pieces or 1 Set"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold"
                />
              </div>
            </div>

            {/* Multiple Images Upload & Gallery */}
            <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Image className="w-4 h-4 text-indigo-600" />
                  <span>Product Image Gallery (Up to 5 URLs)</span>
                </label>
                <span className="text-[11px] text-indigo-600 font-bold">{images.length}/5 Images</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {images.map((imgUrl, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-300 group">
                    <img src={imgUrl} alt={`Prod Image ${idx + 1}`} className="w-full h-full object-cover" />
                    {images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full opacity-90 hover:opacity-100 shadow-sm"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {images.length < 5 && (
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Paste image URL (https://...)"
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddImage()}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
                  >
                    + Add Image
                  </button>
                </div>
              )}

              {/* Sample Preset Presets */}
              <div className="pt-1">
                <p className="text-[10px] text-slate-500 font-bold mb-1">Quick Preset Images:</p>
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_IMAGE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddImage(preset.url)}
                      className="text-[10px] bg-white border border-slate-200 px-2.5 py-1 rounded-lg hover:border-indigo-400 text-slate-700 font-semibold"
                    >
                      + {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Specifications Builder */}
            <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <span>Technical Specifications & Attributes</span>
              </label>

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
                className="px-6 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all cursor-pointer"
              >
                Submit Product Listing
              </button>
            </div>

          </form>
        ) : (
          /* Tab 2: Bulk CSV Import Form */
          <div className="p-5 sm:p-6 space-y-5 text-xs max-h-[70vh] overflow-y-auto">
            
            {/* Top CSV Info Box */}
            <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-extrabold text-indigo-950 text-sm flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
                  <span>Bulk Product Listing via CSV File</span>
                </h4>
                <p className="text-slate-600 text-xs mt-0.5">
                  Upload multiple product listings at once using a CSV spreadsheet file.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownloadSampleCSV}
                className="px-3.5 py-2 bg-white hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl border border-indigo-200 shadow-sm flex items-center gap-1.5 text-xs shrink-0 cursor-pointer"
              >
                <Download className="w-4 h-4 text-indigo-600" />
                <span>Download Sample CSV Template</span>
              </button>
            </div>

            {/* File Upload Dropzone */}
            <div className="border-2 border-dashed border-indigo-300 bg-slate-50 hover:bg-indigo-50/40 rounded-3xl p-6 text-center space-y-3 transition-colors cursor-pointer relative">
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="font-extrabold text-slate-800 text-sm">
                  {csvFileName ? `Selected File: ${csvFileName}` : 'Click or Drag & Drop CSV File Here'}
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  Supports .csv files with columns: name, price, unit, moq, category, subcategory, description, image_url
                </p>
              </div>
            </div>

            {/* Parsing error */}
            {csvError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{csvError}</span>
              </div>
            )}

            {/* CSV Parsed Preview Table */}
            {csvParsedProducts.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Parsed {csvParsedProducts.length} Products Ready to Import</span>
                  </h4>

                  <button
                    type="button"
                    onClick={handleImportCSVProducts}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md flex items-center gap-2 text-xs cursor-pointer transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Import All {csvParsedProducts.length} Products Now</span>
                  </button>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-2xl max-h-60 overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100 text-slate-700 font-extrabold sticky top-0 border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">#</th>
                        <th className="p-2.5">Product Title</th>
                        <th className="p-2.5">Category</th>
                        <th className="p-2.5">Price</th>
                        <th className="p-2.5">MOQ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {csvParsedProducts.map((p, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 font-medium">
                          <td className="p-2.5 font-bold text-slate-400">{idx + 1}</td>
                          <td className="p-2.5 font-bold text-slate-900 line-clamp-1">{p.name}</td>
                          <td className="p-2.5 text-indigo-700 font-bold">{p.category}</td>
                          <td className="p-2.5 font-extrabold text-slate-900">Rs. {(Number(p.price) || 0).toLocaleString()} / {p.unit}</td>
                          <td className="p-2.5 text-slate-600">{p.moq}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Cancel & Import Buttons */}
            <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2.5 rounded-xl font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
              >
                Cancel
              </button>
              {csvParsedProducts.length > 0 && (
                <button
                  type="button"
                  onClick={handleImportCSVProducts}
                  className="px-6 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all cursor-pointer"
                >
                  Import All {csvParsedProducts.length} Products
                </button>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
