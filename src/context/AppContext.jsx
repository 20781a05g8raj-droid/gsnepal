import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getStoredProducts,
  saveStoredProducts,
  getStoredConfig,
  saveStoredConfig,
  INITIAL_PRODUCTS,
  DEFAULT_WHATSAPP_NUMBER,
  fetchSupabaseProducts,
  fetchSupabaseSellers,
  fetchSupabaseBuyers,
  fetchSupabaseSalesJournal,
  fetchSupabaseInquiries,
  upsertSupabaseProduct,
  deleteSupabaseProduct,
  upsertSupabaseSeller,
  deleteSupabaseSeller,
  upsertSupabaseBuyer,
  deleteSupabaseBuyer,
  upsertSupabaseSalesJournal,
  deleteSupabaseSalesJournal,
  upsertSupabaseInquiry
} from '../lib/supabase';
import { INITIAL_SELLERS, INITIAL_BUYERS, INITIAL_INQUIRIES, INITIAL_SALES_JOURNAL } from '../data/erpData';

const STORAGE_KEY_AUTH = 'wsnepal_auth_user';
const STORAGE_KEY_SELLERS = 'wsnepal_erp_sellers';
const STORAGE_KEY_BUYERS = 'wsnepal_erp_buyers';
const STORAGE_KEY_INQUIRIES = 'wsnepal_erp_inquiries';
const STORAGE_KEY_SALES_JOURNAL = 'wsnepal_erp_sales_journal';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [activeNav, setActiveNav] = useState('catalog');
  const [role, setRole] = useState('buyer');
  
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  const [products, setProducts] = useState(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return [];
  });
  
  // Robust ERP Data States - strictly synced from Database
  const [sellers, setSellers] = useState(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SELLERS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return [];
  });

  const [buyers, setBuyers] = useState(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_BUYERS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return [];
  });

  const [inquiries, setInquiries] = useState(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_INQUIRIES);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return [];
  });

  // Seller Sales Journal State - strictly synced from Database
  const [salesJournal, setSalesJournal] = useState(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SALES_JOURNAL);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedProductModal, setSelectedProductModal] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [supabaseConfig, setSupabaseConfig] = useState({ url: '', key: '' });
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Synchronize ONLY Database Data on Mount
  useEffect(() => {
    const loadedConfig = getStoredConfig();
    setSupabaseConfig(loadedConfig);

    const syncSupabaseBackend = async () => {
      // 1. Products Sync - ONLY Supabase Database Records
      const spProducts = await fetchSupabaseProducts();
      if (spProducts !== null) {
        setProducts(spProducts);
        saveStoredProducts(spProducts);
      }

      // 2. Sellers Sync - ONLY Supabase Database Records
      const spSellers = await fetchSupabaseSellers();
      if (spSellers !== null) {
        setSellers(spSellers);
        localStorage.setItem(STORAGE_KEY_SELLERS, JSON.stringify(spSellers));
      }

      // 3. Buyers Sync - ONLY Supabase Database Records
      const spBuyers = await fetchSupabaseBuyers();
      if (spBuyers !== null) {
        setBuyers(spBuyers);
        localStorage.setItem(STORAGE_KEY_BUYERS, JSON.stringify(spBuyers));
      }

      // 4. Sales Journal Sync - ONLY Supabase Database Records
      const spJournal = await fetchSupabaseSalesJournal();
      if (spJournal !== null) {
        setSalesJournal(spJournal);
        localStorage.setItem(STORAGE_KEY_SALES_JOURNAL, JSON.stringify(spJournal));
      }

      // 5. WhatsApp Inquiries Sync - ONLY Supabase Database Records
      const spInquiries = await fetchSupabaseInquiries();
      if (spInquiries !== null) {
        setInquiries(spInquiries);
        localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(spInquiries));
      }
    };

    syncSupabaseBackend();
  }, []);

  const updateProductsState = (newProducts) => {
    setProducts(newProducts);
    saveStoredProducts(newProducts);
  };

  // Auth Functions
  const loginUser = ({ email, name, role: userRole }) => {
    const assignedRole = userRole || (email.includes('admin') ? 'admin' : (email.includes('seller') ? 'seller' : 'buyer'));
    const newUser = {
      id: assignedRole === 'seller' ? 'seller-101' : (assignedRole === 'admin' ? 'admin-001' : 'buyer-' + Date.now().toString().slice(-4)),
      name: name || email.split('@')[0],
      email: email,
      role: assignedRole,
      phone: DEFAULT_WHATSAPP_NUMBER,
      location: 'Kathmandu / Delhi',
      isLoggedIn: true
    };
    setUserProfile(newUser);
    setRole(assignedRole);
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(newUser));

    if (assignedRole === 'seller') {
      setActiveNav('seller');
    } else if (assignedRole === 'admin') {
      setActiveNav('admin');
    } else {
      setActiveNav('catalog');
    }

    showToast(`Welcome, ${newUser.name}! Active mode: ${assignedRole.toUpperCase()}`, 'success');
  };

  const registerUser = (userData) => {
    const newUser = {
      id: userData.role === 'seller' ? 'seller-' + Date.now().toString().slice(-4) : 'buyer-' + Date.now().toString().slice(-4),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      phone: userData.phone || DEFAULT_WHATSAPP_NUMBER,
      location: userData.location,
      panNumber: userData.panNumber || '',
      isLoggedIn: true
    };
    setUserProfile(newUser);
    setRole(userData.role);
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(newUser));

    if (userData.role === 'seller') {
      const newSeller = {
        id: newUser.id,
        companyName: userData.name,
        contactPerson: userData.contactPerson || userData.name,
        email: userData.email,
        phone: userData.phone || DEFAULT_WHATSAPP_NUMBER,
        location: userData.location || 'Kathmandu, Nepal',
        panGst: userData.panNumber || 'PAN Pending',
        category: 'General Wholesaler',
        status: 'Verified',
        totalProducts: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        adminRating: 5,
        adminTag: 'Verified Supplier',
        adminReview: '',
        adminReviewUpdatedAt: new Date().toISOString().split('T')[0]
      };
      const updatedSellers = [newSeller, ...(sellers || [])];
      setSellers(updatedSellers);
      localStorage.setItem(STORAGE_KEY_SELLERS, JSON.stringify(updatedSellers));
      upsertSupabaseSeller(newSeller);
      setActiveNav('seller');
      showToast(`Seller registered in ERP & Supabase! Welcome ${newUser.name}`, 'success');
    } else {
      const newBuyer = {
        id: newUser.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone || DEFAULT_WHATSAPP_NUMBER,
        location: userData.location || 'Nepal / India',
        interest: 'General Sourcing',
        inquiriesSent: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        adminRating: 5,
        adminTag: 'Genuine & Active Buyer',
        adminReview: '',
        adminReviewUpdatedAt: new Date().toISOString().split('T')[0]
      };
      const updatedBuyers = [newBuyer, ...(buyers || [])];
      setBuyers(updatedBuyers);
      localStorage.setItem(STORAGE_KEY_BUYERS, JSON.stringify(updatedBuyers));
      upsertSupabaseBuyer(newBuyer);
      setActiveNav('catalog');
      showToast(`Buyer registered in ERP & Supabase! Welcome ${newUser.name}`, 'success');
    }
  };

  const logoutUser = () => {
    setUserProfile(null);
    setRole('buyer');
    setActiveNav('catalog');
    localStorage.removeItem(STORAGE_KEY_AUTH);
    showToast('Logged out successfully.', 'info');
  };

  // Full Account & Personal Data Purge Action (GDPR / Data Privacy Compliance)
  const deleteMyAccount = () => {
    if (!userProfile) return;
    const userId = userProfile.id;
    if (userProfile.role === 'seller') {
      deleteSeller(userId);
    } else if (userProfile.role === 'buyer') {
      deleteBuyer(userId);
    }
    setUserProfile(null);
    setRole('buyer');
    setActiveNav('catalog');
    localStorage.removeItem(STORAGE_KEY_AUTH);
    showToast('Your account & personal data have been purged from ERP & Supabase.', 'info');
  };

  // ERP Actions: Sellers & Buyers management with Real-time Supabase Persistence
  const verifySeller = (sellerId) => {
    let targetSeller = null;
    const updated = (sellers || []).map(s => {
      if (s.id === sellerId) {
        targetSeller = { ...s, status: 'Verified' };
        return targetSeller;
      }
      return s;
    });
    setSellers(updated);
    localStorage.setItem(STORAGE_KEY_SELLERS, JSON.stringify(updated));
    if (targetSeller) upsertSupabaseSeller(targetSeller);
    showToast('Seller verified in ERP directory & Supabase!', 'success');
  };

  const deleteSeller = (sellerId) => {
    const updated = (sellers || []).filter(s => s.id !== sellerId);
    setSellers(updated);
    localStorage.setItem(STORAGE_KEY_SELLERS, JSON.stringify(updated));
    deleteSupabaseSeller(sellerId);
    showToast('Seller removed from ERP directory & Supabase.', 'warning');
  };

  const deleteBuyer = (buyerId) => {
    const updated = (buyers || []).filter(b => b.id !== buyerId);
    setBuyers(updated);
    localStorage.setItem(STORAGE_KEY_BUYERS, JSON.stringify(updated));
    deleteSupabaseBuyer(buyerId);
    showToast('Buyer removed from ERP directory & Supabase.', 'warning');
  };

  const updateSellerAdminReview = (sellerId, reviewData) => {
    if (!reviewData) return;
    const newReview = reviewData.adminReview !== undefined ? reviewData.adminReview : (reviewData.review !== undefined ? reviewData.review : '');
    const newRating = reviewData.adminRating !== undefined ? Number(reviewData.adminRating) : (reviewData.rating !== undefined ? Number(reviewData.rating) : 5);
    const newTag = reviewData.adminTag !== undefined ? reviewData.adminTag : (reviewData.tag !== undefined ? reviewData.tag : 'Verified Supplier');

    let targetSeller = null;
    const updated = (sellers || []).map(s => {
      if (s.id === sellerId) {
        targetSeller = {
          ...s,
          adminReview: newReview,
          adminRating: newRating,
          adminTag: newTag,
          adminReviewUpdatedAt: new Date().toISOString().split('T')[0]
        };
        return targetSeller;
      }
      return s;
    });
    setSellers(updated);
    localStorage.setItem(STORAGE_KEY_SELLERS, JSON.stringify(updated));
    if (targetSeller) upsertSupabaseSeller(targetSeller);
    showToast('Private Admin Review saved & synced to Supabase!', 'success');
  };

  const updateBuyerAdminReview = (buyerId, reviewData) => {
    if (!reviewData) return;
    const newReview = reviewData.adminReview !== undefined ? reviewData.adminReview : (reviewData.review !== undefined ? reviewData.review : '');
    const newRating = reviewData.adminRating !== undefined ? Number(reviewData.adminRating) : (reviewData.rating !== undefined ? Number(reviewData.rating) : 5);
    const newTag = reviewData.adminTag !== undefined ? reviewData.adminTag : (reviewData.tag !== undefined ? reviewData.tag : 'Genuine & Active Buyer');

    let targetBuyer = null;
    const updated = (buyers || []).map(b => {
      if (b.id === buyerId) {
        targetBuyer = {
          ...b,
          adminReview: newReview,
          adminRating: newRating,
          adminTag: newTag,
          adminReviewUpdatedAt: new Date().toISOString().split('T')[0]
        };
        return targetBuyer;
      }
      return b;
    });
    setBuyers(updated);
    localStorage.setItem(STORAGE_KEY_BUYERS, JSON.stringify(updated));
    if (targetBuyer) upsertSupabaseBuyer(targetBuyer);
    showToast('Private Admin Review saved & synced to Supabase!', 'success');
  };

  // Sales Journal Ledger Actions with Supabase Persistence
  const addSalesJournalEntry = (entryData) => {
    const newEntry = {
      id: 'JRN-2026-' + Date.now().toString().slice(-4),
      date: entryData.date || new Date().toISOString().split('T')[0],
      sellerId: entryData.sellerId || 'seller-101',
      sellerName: entryData.sellerName || 'Apex Industrial Machines Pvt Ltd',
      buyerName: entryData.buyerName || 'Verified Buyer',
      productName: entryData.productName || 'Wholesale Product',
      category: entryData.category || 'General',
      quantity: Number(entryData.quantity) || 1,
      unit: entryData.unit || 'Pcs',
      pricePerUnit: Number(entryData.pricePerUnit) || 0,
      totalAmount: (Number(entryData.quantity) || 1) * (Number(entryData.pricePerUnit) || 0),
      paymentStatus: entryData.paymentStatus || 'Paid / Completed',
      deliveryStatus: entryData.deliveryStatus || 'Dispatched'
    };

    const updated = [newEntry, ...(salesJournal || [])];
    setSalesJournal(updated);
    localStorage.setItem(STORAGE_KEY_SALES_JOURNAL, JSON.stringify(updated));
    upsertSupabaseSalesJournal(newEntry);
    showToast(`Recorded Sales Entry #${newEntry.id} in Seller Journal & Supabase!`, 'success');
  };

  const deleteSalesJournalEntry = (entryId) => {
    const updated = (salesJournal || []).filter(j => j.id !== entryId);
    setSalesJournal(updated);
    localStorage.setItem(STORAGE_KEY_SALES_JOURNAL, JSON.stringify(updated));
    deleteSupabaseSalesJournal(entryId);
    showToast('Sales Journal Entry removed from ERP & Supabase.', 'warning');
  };

  // WhatsApp Inquiry Lead Tracking Action
  const addInquiry = (inquiryData) => {
    const newInquiry = {
      id: 'inq-' + Date.now().toString().slice(-4),
      buyerName: inquiryData.buyerName || userProfile?.name || 'Verified Buyer',
      productName: inquiryData.productName || 'Wholesale Product',
      sellerName: inquiryData.sellerName || 'Verified Supplier',
      targetQty: inquiryData.targetQty || '1 Unit',
      estimatedValue: Number(inquiryData.estimatedValue) || 0,
      status: 'Converted / Direct WhatsApp',
      date: new Date().toISOString().split('T')[0]
    };

    const updated = [newInquiry, ...(inquiries || [])];
    setInquiries(updated);
    localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(updated));
    upsertSupabaseInquiry(newInquiry);
  };

  // Master Catalog Product Management Actions with Supabase Persistence
  const addProduct = (productData) => {
    const newProduct = {
      id: 'prod-' + Date.now().toString().slice(-6),
      seller_id: userProfile ? userProfile.id : 'seller-101',
      seller_name: userProfile ? userProfile.name : 'Verified Manufacturer',
      seller_phone: userProfile?.phone || DEFAULT_WHATSAPP_NUMBER,
      seller_location: userProfile?.location || 'Nepal / India',
      name: productData.name,
      description: productData.description,
      price: parseFloat(productData.price) || 0,
      unit: productData.unit || 'Piece',
      moq: productData.moq || '1 Piece',
      category: productData.category || 'Industrial Machinery',
      subcategory: productData.subcategory || '',
      image_url: productData.image_url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      images: productData.images || [productData.image_url],
      specifications: productData.specifications || [],
      is_approved: role === 'admin',
      created_at: new Date().toISOString(),
      views: 0
    };

    const updated = [newProduct, ...(products || [])];
    updateProductsState(updated);
    upsertSupabaseProduct(newProduct);
    
    if (role === 'admin') {
      showToast('Product added, approved & saved to Supabase!', 'success');
    } else {
      showToast('Product submitted! Pending Admin Approval (Saved to Supabase).', 'info');
    }
    setIsAddModalOpen(false);
  };

  const updateProduct = (productId, updatedData) => {
    let updatedProduct = null;
    const updated = (products || []).map(p => {
      if (p.id === productId) {
        updatedProduct = { ...p, ...updatedData };
        return updatedProduct;
      }
      return p;
    });
    updateProductsState(updated);
    if (updatedProduct) upsertSupabaseProduct(updatedProduct);
    showToast('Product updated in ERP & Supabase!', 'success');
  };

  const approveProduct = (productId) => {
    let approvedProduct = null;
    const updated = (products || []).map(p => {
      if (p.id === productId) {
        approvedProduct = { ...p, is_approved: true };
        return approvedProduct;
      }
      return p;
    });
    updateProductsState(updated);
    if (approvedProduct) upsertSupabaseProduct(approvedProduct);
    showToast('Product Approved & Synced to Supabase!', 'success');
  };

  const deleteProduct = (productId) => {
    const updated = (products || []).filter(p => p.id !== productId);
    updateProductsState(updated);
    deleteSupabaseProduct(productId);
    showToast('Product removed from catalog & Supabase.', 'warning');
  };

  const resetData = () => {
    updateProductsState(INITIAL_PRODUCTS);
    setSellers(INITIAL_SELLERS);
    setBuyers(INITIAL_BUYERS);
    setInquiries(INITIAL_INQUIRIES);
    setSalesJournal(INITIAL_SALES_JOURNAL);
    localStorage.setItem(STORAGE_KEY_SELLERS, JSON.stringify(INITIAL_SELLERS));
    localStorage.setItem(STORAGE_KEY_BUYERS, JSON.stringify(INITIAL_BUYERS));
    localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(INITIAL_INQUIRIES));
    localStorage.setItem(STORAGE_KEY_SALES_JOURNAL, JSON.stringify(INITIAL_SALES_JOURNAL));
    
    // Seed reset datasets to Supabase
    INITIAL_PRODUCTS.forEach(p => upsertSupabaseProduct(p));
    INITIAL_SELLERS.forEach(s => upsertSupabaseSeller(s));
    INITIAL_BUYERS.forEach(b => upsertSupabaseBuyer(b));
    INITIAL_SALES_JOURNAL.forEach(j => upsertSupabaseSalesJournal(j));
    INITIAL_INQUIRIES.forEach(i => upsertSupabaseInquiry(i));

    showToast('Reset ERP dataset & resynced to Supabase initial state.', 'info');
  };

  const saveConfig = (url, key) => {
    const newConf = { url, key };
    setSupabaseConfig(newConf);
    saveStoredConfig(newConf);
    showToast('Supabase settings saved.', 'success');
    setIsConfigModalOpen(false);
  };

  return (
    <AppContext.Provider value={{
      activeNav,
      setActiveNav,
      role,
      setRole,
      userProfile,
      loginUser,
      registerUser,
      logoutUser,
      deleteMyAccount,
      sellers,
      buyers,
      inquiries,
      salesJournal,
      verifySeller,
      deleteSeller,
      deleteBuyer,
      updateSellerAdminReview,
      updateBuyerAdminReview,
      addSalesJournalEntry,
      deleteSalesJournalEntry,
      addInquiry,
      products,
      addProduct,
      updateProduct,
      approveProduct,
      deleteProduct,
      resetData,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      selectedProductModal,
      setSelectedProductModal,
      isAddModalOpen,
      setIsAddModalOpen,
      isConfigModalOpen,
      setIsConfigModalOpen,
      isAuthModalOpen,
      setIsAuthModalOpen,
      supabaseConfig,
      saveConfig,
      toastMessage,
      showToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
