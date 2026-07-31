import { createClient } from '@supabase/supabase-js';

const STORAGE_KEY_CONFIG = 'wsnepal_supabase_config';
const STORAGE_KEY_PRODUCTS = 'wsnepal_mock_products';

export const DEFAULT_SUPABASE_PROJECT = 'wsnepal';
export const DEFAULT_SUPABASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) || '';
export const DEFAULT_SUPABASE_KEY = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) || '';

export const getStoredConfig = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed && parsed.url && parsed.key && isValidSupabaseKey(parsed.key)) {
        return parsed;
      }
    }
  } catch (e) {}
  return {
    url: DEFAULT_SUPABASE_URL,
    key: DEFAULT_SUPABASE_KEY
  };
};

export const saveStoredConfig = (config) => {
  localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
};

const STORAGE_KEY_CREDENTIALS = 'wsnepal_user_credentials';

export const getStoredCredentials = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_CREDENTIALS);
    if (data) return JSON.parse(data);
  } catch (e) {}
  return {};
};

export const saveStoredCredentials = (creds) => {
  try {
    localStorage.setItem(STORAGE_KEY_CREDENTIALS, JSON.stringify(creds));
  } catch (e) {}
};

export const DEFAULT_WHATSAPP_NUMBER = '9779821863885';

// Seed Products with updated WhatsApp contact number +977 9821863885
export const INITIAL_PRODUCTS = [
  {
    id: 'prod-001',
    seller_id: 'seller-101',
    seller_name: 'Apex Industrial Machines Pvt Ltd',
    seller_phone: '9779821863885',
    seller_location: 'Kathmandu / Delhi',
    name: 'Automatic Hydraulic Paper Cup Making Machine 90pcs/min',
    description: 'Heavy duty high speed paper cup manufacturing unit with ultrasound sealing, automatic oil lubrication, and micro-computer touch screen controller.',
    price: 485000,
    unit: 'Set',
    moq: '1 Set',
    category: 'Industrial Machinery',
    subcategory: 'Paper Converting & Packaging Machinery',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { key: 'Production Capacity', value: '85-95 pcs/min' },
      { key: 'Paper Thickness', value: '170-350 gsm' },
      { key: 'Power Rating', value: '3.5 kW (3 Phase)' },
      { key: 'Cup Size Range', value: '2 oz - 16 oz' }
    ],
    is_approved: true,
    created_at: '2026-07-20T10:00:00Z',
    views: 342
  },
  {
    id: 'prod-002',
    seller_id: 'seller-105',
    seller_name: 'MedTech Surgical & Hospital Supplies',
    seller_phone: '9779821863885',
    seller_location: 'Kathmandu, Nepal',
    name: 'Disposable Sterile Syringe with Needle (Luer Lock 5ml & 2ml)',
    description: 'Medical grade 3-part disposable hypodermic syringes with ultra-sharp siliconized stainless steel needle. EO Gas Sterilized, non-toxic, non-pyrogenic.',
    price: 18,
    unit: 'Piece',
    moq: '1,000 Pieces',
    category: 'Medical & Healthcare',
    subcategory: 'Surgical Disposables & Syringes',
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { key: 'Syringe Type', value: 'Luer Lock (3-Piece)' },
      { key: 'Capacity / Volume', value: '5ml & 2ml Available' },
      { key: 'Needle Gauge', value: '21G x 1.5 Inch' },
      { key: 'Material', value: 'Medical Grade Polypropylene' },
      { key: 'Sterilization', value: 'EO Gas Sterilized (ISO 13485)' }
    ],
    is_approved: true,
    created_at: '2026-07-21T14:20:00Z',
    views: 480
  },
  {
    id: 'prod-003',
    seller_id: 'seller-102',
    seller_name: 'Himalayan Herbal & Spices Export',
    seller_phone: '9779821863885',
    seller_location: 'Pokhara, Nepal',
    name: 'Bulk Organic Large Cardamom (Elaichi) Grade A',
    description: 'Sun-dried high altitude premium large cardamom seeds. Direct farm source, lab tested for purity & aroma content. Moisture < 10%.',
    price: 1250,
    unit: 'Kg',
    moq: '100 Kg',
    category: 'Agriculture & Food',
    subcategory: 'Spices & Himalayan Condiments',
    image_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { key: 'Variety', value: 'Ramsai / Golshai Grade A' },
      { key: 'Moisture Level', value: '< 9.5%' },
      { key: 'Origin', value: 'Ilam / Sankhuwasabha, Nepal' }
    ],
    is_approved: true,
    created_at: '2026-07-22T08:15:00Z',
    views: 215
  },
  {
    id: 'prod-004',
    seller_id: 'seller-103',
    seller_name: 'NextGen Electronics Wholesalers',
    seller_phone: '9779821863885',
    seller_location: 'Mumbai, India',
    name: 'Smart IoT Solar Charge Controller 60A MPPT',
    description: '12V/24V/48V auto-sensing maximum power point tracking solar controller with Wi-Fi monitoring app & LCD screen.',
    price: 4200,
    unit: 'Piece',
    moq: '25 Pieces',
    category: 'Electronics & Solar',
    subcategory: 'Solar Energy Inverters & Controllers',
    image_url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80'
    ],
    specifications: [
      { key: 'Max Current', value: '60A MPPT' },
      { key: 'System Voltage', value: '12V / 24V / 48V Auto' },
      { key: 'Efficiency', value: '98.5%' }
    ],
    is_approved: true,
    created_at: '2026-07-22T14:45:00Z',
    views: 180
  }
];

export const PRESET_CATEGORIES = [
  'All Categories',
  'Medical & Healthcare',
  'Industrial Machinery',
  'Agriculture & Food',
  'Electronics & Solar',
  'Textiles & Apparel',
  'Construction Materials',
  'Chemicals & Plastics'
];

export const getStoredProducts = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (data) {
      const parsed = JSON.parse(data);
      // Ensure existing cached products use the new phone number
      return parsed.map(p => ({ ...p, seller_phone: DEFAULT_WHATSAPP_NUMBER }));
    }
  } catch (e) {
    console.error('Failed reading products from localStorage', e);
  }
  localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
};

export const saveStoredProducts = (products) => {
  try {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  } catch (e) {
    console.warn('localStorage quota warning:', e);
  }
};

export const getSupabaseClient = () => {
  const { url, key } = getStoredConfig();
  const validUrl = url || DEFAULT_SUPABASE_URL;
  const validKey = key || DEFAULT_SUPABASE_KEY;

  if (validUrl && validKey && validUrl.startsWith('http')) {
    try {
      return createClient(validUrl, validKey);
    } catch (err) {
      console.warn('Supabase client creation issue:', err.message || err);
    }
  }
  return null;
};

// Validate that a key looks like a real Supabase JWT anon key
export const isValidSupabaseKey = (key) => {
  if (!key || typeof key !== 'string') return false;
  // Real Supabase anon keys are JWT tokens starting with eyJ
  return key.startsWith('eyJ') && key.length > 100;
};

// Diagnostic: test Supabase connection (DB read + Storage bucket access)
export const testSupabaseConnection = async (url, key) => {
  const results = { db: false, storage: false, dbError: null, storageError: null, keyValid: false };
  
  results.keyValid = isValidSupabaseKey(key);
  if (!results.keyValid) {
    results.dbError = 'Invalid Anon Key format. Real key starts with eyJhbGci... (JWT token). Go to Supabase Dashboard → Project Settings → API → copy anon public key.';
    results.storageError = results.dbError;
    return results;
  }

  if (!url || !url.startsWith('http')) {
    results.dbError = 'Invalid Supabase URL.';
    results.storageError = results.dbError;
    return results;
  }

  try {
    const client = createClient(url, key);
    
    // Test DB: try to read from products table
    const { data, error } = await client.from('products').select('id').limit(1);
    if (error) {
      results.dbError = error.message;
    } else {
      results.db = true;
    }

    // Test Storage: try to list files in product-images bucket
    const { data: files, error: storageErr } = await client.storage.from('product-images').list('products', { limit: 1 });
    if (storageErr) {
      results.storageError = storageErr.message;
    } else {
      results.storage = true;
    }
  } catch (e) {
    results.dbError = e.message;
    results.storageError = e.message;
  }

  return results;
};

// Supabase Authentication Backend Helpers
export const signInWithSupabaseAuth = async (email, password) => {
  const supabase = getSupabaseClient();
  if (!supabase) return { data: null, error: new Error('Supabase environment variables missing on Vercel. Please add VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY in Vercel Settings -> Environment Variables.') };
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password
    });
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
};

export const signUpWithSupabaseAuth = async (email, password, metadata = {}) => {
  const supabase = getSupabaseClient();
  if (!supabase) return { data: null, error: new Error('Supabase environment variables missing on Vercel. Please add VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY in Vercel Settings -> Environment Variables.') };
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        data: metadata
      }
    });
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
};

// Utility: check if a string is a base64 data URL
export const isBase64DataUrl = (str) => {
  return typeof str === 'string' && str.startsWith('data:');
};

// Utility: convert base64 data URL to a File/Blob for upload
export const dataUrlToBlob = (dataUrl) => {
  try {
    const parts = dataUrl.split(',');
    const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(parts[1]);
    const u8arr = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    return new Blob([u8arr], { type: mime });
  } catch (e) {
    console.warn('dataUrlToBlob conversion failed:', e);
    return null;
  }
};

export const compressImageFile = (file, maxWidth = 800, quality = 0.75) => {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('image/')) {
      resolve({ dataUrl: null, blob: null });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        // Also produce a Blob for direct Supabase upload
        canvas.toBlob(
          (blob) => {
            resolve({ dataUrl: compressedDataUrl, blob: blob });
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => resolve({ dataUrl: e.target?.result, blob: null });
      img.src = e.target?.result;
    };
    reader.onerror = () => resolve({ dataUrl: null, blob: null });
    reader.readAsDataURL(file);
  });
};

export const signOutSupabaseAuth = async () => {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  try {
    await supabase.auth.signOut();
  } catch (e) {}
};

// Upload image to Supabase Storage. Accepts File, Blob, or base64 data URL string.
export const uploadImageToSupabaseStorage = async (input) => {
  const supabase = getSupabaseClient();
  if (!supabase || !input) {
    console.error('[IMAGE UPLOAD] Failed: Supabase client is null. Check your Anon Key in .env or Supabase Settings.');
    return null;
  }

  // Check key validity before attempting upload
  const { key } = getStoredConfig();
  const activeKey = key || DEFAULT_SUPABASE_KEY;
  if (!isValidSupabaseKey(activeKey)) {
    console.error('[IMAGE UPLOAD] Failed: Your Supabase Anon Key is INVALID.', 
      '\nCurrent key:', activeKey?.substring(0, 20) + '...',
      '\nReal keys start with: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      '\nGet it from: Supabase Dashboard → Project Settings → API → anon public key');
    return null;
  }

  try {
    let uploadBlob = null;
    let fileExt = 'jpg';

    if (typeof input === 'string' && isBase64DataUrl(input)) {
      // Convert base64 data URL to Blob
      uploadBlob = dataUrlToBlob(input);
      if (!uploadBlob) return null;
      const mimeMatch = input.match(/data:(image\/\w+)/);
      if (mimeMatch) {
        const mime = mimeMatch[1]; // e.g. image/jpeg
        fileExt = mime.split('/')[1] || 'jpg';
        if (fileExt === 'jpeg') fileExt = 'jpg';
      }
    } else if (input instanceof Blob || input instanceof File) {
      uploadBlob = input;
      if (input.name) {
        fileExt = input.name.split('.').pop() || 'jpg';
      } else if (input.type) {
        fileExt = input.type.split('/')[1] || 'jpg';
        if (fileExt === 'jpeg') fileExt = 'jpg';
      }
    } else {
      return null;
    }

    const fileName = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    // Upload attempt 1: Root directory of bucket
    let { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, uploadBlob, {
        contentType: uploadBlob.type || 'image/jpeg',
        cacheControl: '3600',
        upsert: true
      });

    // Upload attempt 2: With raw input if blob had issue
    if (error && (input instanceof File || input instanceof Blob)) {
      const retry = await supabase.storage
        .from('product-images')
        .upload(fileName, input, {
          contentType: input.type || 'image/jpeg',
          cacheControl: '3600',
          upsert: true
        });
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      console.error('[SUPABASE STORAGE ERROR]', error.message || error, error);
      return null;
    }

    const targetPath = data?.path || fileName;
    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(targetPath);

    return publicUrlData?.publicUrl || null;
  } catch (err) {
    console.error('[STORAGE EXCEPTION]', err);
    return null;
  }
};

// Data Mapper Utilities for Supabase <-> JS
export const mapSellerToDb = (s) => ({
  id: s.id,
  company_name: s.companyName || 'Wholesaler Firm',
  contact_person: s.contactPerson || '',
  email: s.email || '',
  phone: s.phone || DEFAULT_WHATSAPP_NUMBER,
  location: s.location || 'Nepal',
  pan_gst: s.panGst || 'N/A',
  category: s.category || 'General Wholesaler',
  status: s.status || 'Verified',
  total_products: s.totalProducts || 0,
  joined_date: s.joinedDate || new Date().toISOString().split('T')[0],
  admin_rating: s.adminRating !== undefined ? Number(s.adminRating) : 5,
  admin_tag: s.adminTag !== undefined ? s.adminTag : 'Verified Supplier',
  admin_review: s.adminReview !== undefined ? s.adminReview : '',
  admin_review_updated_at: s.adminReviewUpdatedAt || new Date().toISOString().split('T')[0]
});

export const mapSellerFromDb = (d) => ({
  id: d.id,
  companyName: d.company_name,
  contactPerson: d.contact_person,
  email: d.email,
  phone: d.phone,
  location: d.location,
  panGst: d.pan_gst,
  category: d.category,
  status: d.status,
  totalProducts: d.total_products,
  joinedDate: d.joined_date,
  adminRating: Number(d.admin_rating) || 5,
  adminTag: d.admin_tag || 'Verified Supplier',
  adminReview: d.admin_review || '',
  adminReviewUpdatedAt: d.admin_review_updated_at
});

export const mapBuyerToDb = (b) => ({
  id: b.id,
  name: b.name || 'Buyer',
  email: b.email || '',
  phone: b.phone || DEFAULT_WHATSAPP_NUMBER,
  location: b.location || 'Nepal',
  interest: b.interest || 'General Sourcing',
  inquiries_sent: b.inquiriesSent || 0,
  joined_date: b.joinedDate || new Date().toISOString().split('T')[0],
  admin_rating: b.adminRating !== undefined ? Number(b.adminRating) : 5,
  admin_tag: b.adminTag !== undefined ? b.adminTag : 'Genuine & Active Buyer',
  admin_review: b.adminReview !== undefined ? b.adminReview : '',
  admin_review_updated_at: b.adminReviewUpdatedAt || new Date().toISOString().split('T')[0]
});

export const mapBuyerFromDb = (d) => ({
  id: d.id,
  name: d.name,
  email: d.email,
  phone: d.phone,
  location: d.location,
  interest: d.interest,
  inquiriesSent: d.inquiries_sent,
  joinedDate: d.joined_date,
  adminRating: Number(d.admin_rating) || 5,
  adminTag: d.admin_tag || 'Genuine & Active Buyer',
  adminReview: d.admin_review || '',
  adminReviewUpdatedAt: d.admin_review_updated_at
});

export const mapJournalToDb = (j) => ({
  id: j.id,
  date: j.date || new Date().toISOString().split('T')[0],
  seller_id: j.sellerId,
  seller_name: j.sellerName,
  buyer_name: j.buyerName,
  product_name: j.productName,
  category: j.category,
  quantity: j.quantity,
  unit: j.unit,
  price_per_unit: j.pricePerUnit,
  total_amount: j.totalAmount,
  payment_status: j.paymentStatus,
  delivery_status: j.deliveryStatus
});

export const mapJournalFromDb = (d) => ({
  id: d.id,
  date: d.date,
  sellerId: d.seller_id,
  sellerName: d.seller_name,
  buyerName: d.buyer_name,
  productName: d.product_name,
  category: d.category,
  quantity: Number(d.quantity) || 1,
  unit: d.unit,
  pricePerUnit: Number(d.price_per_unit) || 0,
  totalAmount: Number(d.total_amount) || 0,
  paymentStatus: d.payment_status,
  deliveryStatus: d.delivery_status
});

export const mapInquiryToDb = (i) => ({
  id: i.id,
  buyer_name: i.buyerName,
  product_name: i.productName,
  seller_name: i.sellerName,
  target_qty: i.targetQty,
  estimated_value: i.estimatedValue,
  status: i.status,
  date: i.date
});

export const mapInquiryFromDb = (d) => ({
  id: d.id,
  buyerName: d.buyer_name,
  productName: d.product_name,
  sellerName: d.seller_name,
  targetQty: d.target_qty,
  estimatedValue: Number(d.estimated_value) || 0,
  status: d.status,
  date: d.date
});

// Async Supabase Database API Helpers
export const fetchSupabaseProducts = async () => {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!error && Array.isArray(data)) {
      return data.map(p => ({ ...p, seller_phone: p.seller_phone || DEFAULT_WHATSAPP_NUMBER }));
    }
  } catch (e) {
    console.warn('Failed fetching products from Supabase:', e);
  }
  return null;
};

export const fetchSupabaseSellers = async () => {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('sellers').select('*');
    if (!error && Array.isArray(data)) {
      return data.map(mapSellerFromDb);
    }
  } catch (e) {
    console.warn('Failed fetching sellers from Supabase:', e);
  }
  return null;
};

export const fetchSupabaseBuyers = async () => {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('buyers').select('*');
    if (!error && Array.isArray(data)) {
      return data.map(mapBuyerFromDb);
    }
  } catch (e) {
    console.warn('Failed fetching buyers from Supabase:', e);
  }
  return null;
};

export const fetchSupabaseSalesJournal = async () => {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('sales_journal').select('*').order('created_at', { ascending: false });
    if (!error && Array.isArray(data)) {
      return data.map(mapJournalFromDb);
    }
  } catch (e) {
    console.warn('Failed fetching sales journal from Supabase:', e);
  }
  return null;
};

export const fetchSupabaseInquiries = async () => {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
    if (!error && Array.isArray(data)) {
      return data.map(mapInquiryFromDb);
    }
  } catch (e) {
    console.warn('Failed fetching inquiries from Supabase:', e);
  }
  return null;
};

export const upsertSupabaseProduct = async (product) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    console.warn('Supabase client not available — product not saved to DB.');
    return { success: false, error: 'No Supabase client' };
  }
  try {
    // Ensure images array has valid image references (HTTP or data URLs)
    const rawImages = Array.isArray(product.images) && product.images.length > 0 
      ? product.images 
      : [product.image_url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'];
    const finalImages = rawImages.filter(img => typeof img === 'string' && img.trim().length > 0);
    const finalImageUrl = finalImages[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';

    // Handle seller_id FK: first check if seller exists, if not set null to avoid FK violation
    let safeSellerId = product.seller_id || null;
    if (safeSellerId) {
      const { data: sellerCheck } = await supabase.from('sellers').select('id').eq('id', safeSellerId).maybeSingle();
      if (!sellerCheck) {
        safeSellerId = null; // Seller doesn't exist in DB, set null to avoid FK constraint error
      }
    }

    const dbPayload = {
      id: product.id,
      seller_id: safeSellerId,
      seller_name: product.seller_name || 'Verified Wholesaler',
      seller_phone: product.seller_phone || DEFAULT_WHATSAPP_NUMBER,
      seller_location: product.seller_location || 'Nepal',
      name: product.name,
      description: product.description || '',
      price: Number(product.price) || 0,
      unit: product.unit || 'Piece',
      moq: product.moq || '1 Piece',
      category: product.category || 'Industrial Machinery',
      subcategory: product.subcategory || 'General Wholesale',
      image_url: finalImageUrl,
      images: finalImages,
      specifications: product.specifications || [],
      is_approved: product.is_approved !== false,
      views: product.views || 0,
      created_at: product.created_at || new Date().toISOString()
    };

    const { error } = await supabase.from('products').upsert(dbPayload);
    if (error) {
      console.error('Supabase Product Upsert Error:', error.message || error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (e) {
    console.error('Supabase product save exception:', e.message || e);
    return { success: false, error: e.message };
  }
};

export const deleteSupabaseProduct = async (id) => {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) console.error('Supabase Product Delete Error:', error.message || '[REDACTED_ERROR]');
  } catch (e) {
    console.warn('Supabase product delete exception:', e.message || '[REDACTED_ERROR]');
  }
};

export const upsertSupabaseSeller = async (seller) => {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  try {
    const dbPayload = mapSellerToDb(seller);
    const { error } = await supabase.from('sellers').upsert(dbPayload);
    if (error) console.error('Supabase Seller Sync Error:', error.message || '[REDACTED_ERROR]');
  } catch (e) {
    console.warn('Supabase seller save exception:', e.message || '[REDACTED_ERROR]');
  }
};

export const deleteSupabaseSeller = async (id) => {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  try {
    const { error } = await supabase.from('sellers').delete().eq('id', id);
    if (error) console.error('Supabase Seller Delete Error:', error.message || '[REDACTED_ERROR]');
  } catch (e) {
    console.warn('Supabase seller delete exception:', e.message || '[REDACTED_ERROR]');
  }
};

export const upsertSupabaseBuyer = async (buyer) => {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  try {
    const dbPayload = mapBuyerToDb(buyer);
    const { error } = await supabase.from('buyers').upsert(dbPayload);
    if (error) console.error('Supabase Buyer Sync Error:', error.message || '[REDACTED_ERROR]');
  } catch (e) {
    console.warn('Supabase buyer save exception:', e.message || '[REDACTED_ERROR]');
  }
};

export const deleteSupabaseBuyer = async (id) => {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  try {
    const { error } = await supabase.from('buyers').delete().eq('id', id);
    if (error) console.error('Supabase Buyer Delete Error:', error.message || '[REDACTED_ERROR]');
  } catch (e) {
    console.warn('Supabase buyer delete exception:', e.message || '[REDACTED_ERROR]');
  }
};

export const upsertSupabaseSalesJournal = async (journalEntry) => {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  try {
    const dbPayload = mapJournalToDb(journalEntry);
    const { error } = await supabase.from('sales_journal').upsert(dbPayload);
    if (error) console.error('Supabase Sales Journal Sync Error:', error.message || '[REDACTED_ERROR]');
  } catch (e) {
    console.warn('Supabase journal save exception:', e.message || '[REDACTED_ERROR]');
  }
};

export const deleteSupabaseSalesJournal = async (id) => {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  try {
    const { error } = await supabase.from('sales_journal').delete().eq('id', id);
    if (error) console.error('Supabase Sales Journal Delete Error:', error.message || '[REDACTED_ERROR]');
  } catch (e) {
    console.warn('Supabase journal delete exception:', e.message || '[REDACTED_ERROR]');
  }
};

export const upsertSupabaseInquiry = async (inquiry) => {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  try {
    const dbPayload = mapInquiryToDb(inquiry);
    const { error } = await supabase.from('inquiries').upsert(dbPayload);
    if (error) console.error('Supabase Inquiry Sync Error:', error.message || '[REDACTED_ERROR]');
  } catch (e) {
    console.warn('Supabase inquiry save exception:', e.message || '[REDACTED_ERROR]');
  }
};
