import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Edit3, Image, Trash2, Plus, Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { PRESET_CATEGORIES, uploadImageToSupabaseStorage, compressImageFile, isBase64DataUrl } from '../lib/supabase';

const SAMPLE_IMAGE_PRESETS = [
  { name: 'Medical Syringe', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80' },
  { name: 'Surgical Equipment', url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80' },
  { name: 'Industrial Machine', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80' },
  { name: 'Cardamom / Spices', url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80' },
  { name: 'Solar Charge Controller', url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80' }
];

export default function EditProductModal({ editingProduct, setEditingProduct }) {
  const { updateProduct, showToast } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const editFileInputRef = React.useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Industrial Machinery',
    subcategory: '',
    price: '',
    unit: 'Piece',
    moq: '1 Piece',
    description: '',
    is_approved: true
  });

  const [images, setImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadStatus, setUploadStatus] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        is_approved: editingProduct.is_approved !== false
      });

      const initialImgs = Array.isArray(editingProduct.images) && editingProduct.images.length > 0
        ? editingProduct.images
        : [editingProduct.image_url || SAMPLE_IMAGE_PRESETS[2].url];
      setImages(initialImgs);
      setUploadStatus({});
    }
  }, [editingProduct]);

  if (!editingProduct) return null;

  const handleAddImage = (urlToAdd) => {
    const targetUrl = urlToAdd || newImageUrl;
    if (!targetUrl || images.length >= 5) return;
    if (!images.includes(targetUrl)) {
      setImages([...images, targetUrl]);
    }
    setNewImageUrl('');
  };

  const handleRemoveImage = (indexToRemove) => {
    if (images.length <= 1) {
      if (showToast) showToast('Product must have at least 1 image', 'warning');
      return;
    }
    setImages(images.filter((_, i) => i !== indexToRemove));
  };

  const handleFiles = (fileList) => {
    if (!fileList || fileList.length === 0) return;
    const arrayFiles = Array.from(fileList).filter(f => f.type.startsWith('image/'));
    
    arrayFiles.forEach(async (file) => {
      // Step 1: Compress image → get instant preview dataUrl + blob for upload
      const { dataUrl: compressedDataUrl, blob: compressedBlob } = await compressImageFile(file);
      if (!compressedDataUrl) return;

      // Step 2: Show instant preview
      setImages(prev => {
        if (prev.length >= 5 || prev.includes(compressedDataUrl)) return prev;
        return [...prev, compressedDataUrl];
      });

      // Step 3: Upload compressed blob to Supabase Storage in background
      setUploadStatus(prev => ({ ...prev, [compressedDataUrl]: 'uploading' }));
      try {
        let storageUrl = await uploadImageToSupabaseStorage(compressedBlob || file);
        if (!storageUrl && file) {
          storageUrl = await uploadImageToSupabaseStorage(file);
        }

        if (storageUrl) {
          setImages(prev => prev.map(img => img === compressedDataUrl ? storageUrl : img));
          setUploadStatus(prev => {
            const next = { ...prev };
            delete next[compressedDataUrl];
            next[storageUrl] = 'done';
            return next;
          });
        } else {
          setUploadStatus(prev => {
            const next = { ...prev };
            delete next[compressedDataUrl];
            return next;
          });
        }
      } catch (err) {
        console.warn('Supabase Storage upload failed:', err);
        setUploadStatus(prev => {
          const next = { ...prev };
          delete next[compressedDataUrl];
          return next;
        });
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      if (showToast) showToast('Please provide Product Title and Price', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Before submitting: upload base64 images to Supabase Storage
      const finalImages = [];
      for (const imgUrl of images) {
        if (isBase64DataUrl(imgUrl)) {
          const storageUrl = await uploadImageToSupabaseStorage(imgUrl);
          if (storageUrl) {
            finalImages.push(storageUrl);
          } else {
            console.warn('Supabase storage upload failed or permissions restricted. Using base64 image string as fallback.');
            finalImages.push(imgUrl);
          }
        } else {
          finalImages.push(imgUrl);
        }
      }

      const safeImages = finalImages.length > 0 ? finalImages : [SAMPLE_IMAGE_PRESETS[2].url];

      updateProduct(editingProduct.id, {
        ...formData,
        price: parseFloat(formData.price) || 0,
        images: safeImages,
        image_url: safeImages[0]
      });
      setEditingProduct(null);
    } catch (err) {
      console.error('Edit submit error:', err);
      if (showToast) showToast('Error saving changes. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Edit Product Details & Gallery</h3>
              <p className="text-xs text-slate-500">Edit title, category, pricing, description & drag and drop multiple images</p>
            </div>
          </div>

          <button
            onClick={() => setEditingProduct(null)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
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
              <label className="font-bold text-slate-700">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-purple-500 font-semibold"
              >
                {PRESET_CATEGORIES.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Subcategory / Variety</label>
              <input
                type="text"
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-purple-500 font-semibold"
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
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-purple-500 font-bold"
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

          <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <Image className="w-4 h-4 text-purple-600" />
                <span>Product Images Gallery (Multiple Images & Drag and Drop)</span>
              </label>
              <span className="text-[10px] text-slate-500 font-semibold">{images.length}/5 images</span>
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
              onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  handleFiles(e.dataTransfer.files);
                }
              }}
              onClick={() => editFileInputRef.current && editFileInputRef.current.click()}
              className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-purple-600 bg-purple-50 scale-[1.01]'
                  : 'border-slate-300 bg-white hover:bg-slate-100 hover:border-purple-400'
              }`}
            >
              <input
                type="file"
                ref={editFileInputRef}
                multiple
                accept="image/*"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
                className="hidden"
              />

              <Upload className="w-6 h-6 text-purple-600 mx-auto mb-1" />
              <p className="font-bold text-slate-800 text-xs">Drag & Drop Image files here or click to browse</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Add up to 5 images (First image will be the COVER thumbnail)</p>
            </div>

            <div className="grid grid-cols-5 gap-2.5 pt-1">
              {images.map((imgUrl, idx) => {
                const status = uploadStatus[imgUrl];
                return (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-white aspect-square">
                    <img src={imgUrl} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-rose-600/90 hover:bg-rose-600 text-white rounded-full opacity-90 transition-opacity"
                      title="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 bg-purple-600 text-white text-[9px] font-black text-center py-0.5">
                        COVER
                      </span>
                    )}
                    {/* Upload status indicator */}
                    {status === 'uploading' && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      </div>
                    )}
                    {status === 'done' && (
                      <div className="absolute top-1 left-1 bg-emerald-500 text-white p-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                    )}
                    {status === 'failed' && (
                      <div className="absolute top-1 left-1 bg-amber-500 text-white p-0.5 rounded-full" title="Upload to cloud failed">
                        <AlertCircle className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {images.length < 5 && (
              <div className="flex gap-2 pt-2 border-t border-slate-200/60">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Or paste image URL (https://...)"
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => handleAddImage()}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl"
                >
                  + Add URL
                </button>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Detailed Overview & Description</label>
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
              disabled={isSubmitting}
              className={`px-6 py-2.5 rounded-xl font-bold text-white shadow-md transition-all flex items-center gap-2 ${
                isSubmitting 
                  ? 'bg-purple-400 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700 cursor-pointer'
              }`}
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? 'Uploading & Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
