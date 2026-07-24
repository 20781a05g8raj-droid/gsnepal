import { createClient } from '@supabase/supabase-js';

const STORAGE_KEY_CONFIG = 'wsnepal_supabase_config';
const STORAGE_KEY_PRODUCTS = 'wsnepal_mock_products';

export const DEFAULT_SUPABASE_PROJECT = 'wsnepal';
export const DEFAULT_SUPABASE_URL = 'https://vbklvftgawigfwxomlie.supabase.co';
export const DEFAULT_SUPABASE_KEY = 'sb_publishable_yfbqpT1EFZ9mX9nCL0a76A_RTlzsx0J';

export const getStoredConfig = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed && parsed.url && parsed.key) return parsed;
    }
  } catch (e) {}
  return {
    url: (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) || DEFAULT_SUPABASE_URL,
    key: (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) || DEFAULT_SUPABASE_KEY
  };
};

export const saveStoredConfig = (config) => {
  localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
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
  localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
};

export const getSupabaseClient = () => {
  const { url, key } = getStoredConfig();
  const validUrl = url || (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) || DEFAULT_SUPABASE_URL;
  const validKey = key || (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) || DEFAULT_SUPABASE_KEY;

  if (validUrl && validKey && validUrl.startsWith('http')) {
    try {
      return createClient(validUrl, validKey);
    } catch (err) {
      console.warn('Supabase initialization failed:', err);
    }
  }
  return null;
};
