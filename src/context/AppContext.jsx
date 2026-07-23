import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getStoredProducts,
  saveStoredProducts,
  getStoredConfig,
  saveStoredConfig,
  INITIAL_PRODUCTS,
  DEFAULT_WHATSAPP_NUMBER
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

  const [products, setProducts] = useState([]);
  
  // Robust ERP Data States
  const [sellers, setSellers] = useState(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SELLERS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_SELLERS;
  });

  const [buyers, setBuyers] = useState(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_BUYERS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_BUYERS;
  });

  const [inquiries, setInquiries] = useState(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_INQUIRIES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_INQUIRIES;
  });

  // Seller Sales Journal State
  const [salesJournal, setSalesJournal] = useState(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SALES_JOURNAL);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_SALES_JOURNAL;
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

  useEffect(() => {
    const loaded = getStoredProducts();
    setProducts(Array.isArray(loaded) && loaded.length > 0 ? loaded : INITIAL_PRODUCTS);
    setSupabaseConfig(getStoredConfig());
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
        joinedDate: new Date().toISOString().split('T')[0]
      };
      const updatedSellers = [newSeller, ...(sellers || [])];
      setSellers(updatedSellers);
      localStorage.setItem(STORAGE_KEY_SELLERS, JSON.stringify(updatedSellers));
      setActiveNav('seller');
      showToast(`Seller registered in ERP! Welcome ${newUser.name}`, 'success');
    } else {
      const newBuyer = {
        id: newUser.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone || DEFAULT_WHATSAPP_NUMBER,
        location: userData.location || 'Nepal / India',
        interest: 'General Sourcing',
        inquiriesSent: 0,
        joinedDate: new Date().toISOString().split('T')[0]
      };
      const updatedBuyers = [newBuyer, ...(buyers || [])];
      setBuyers(updatedBuyers);
      localStorage.setItem(STORAGE_KEY_BUYERS, JSON.stringify(updatedBuyers));
      setActiveNav('catalog');
      showToast(`Buyer registered in ERP! Welcome ${newUser.name}`, 'success');
    }
  };

  const logoutUser = () => {
    setUserProfile(null);
    setRole('buyer');
    setActiveNav('catalog');
    localStorage.removeItem(STORAGE_KEY_AUTH);
    showToast('Logged out successfully.', 'info');
  };

  // ERP Actions: Sellers & Buyers management
  const verifySeller = (sellerId) => {
    const updated = (sellers || []).map(s => s.id === sellerId ? { ...s, status: 'Verified' } : s);
    setSellers(updated);
    localStorage.setItem(STORAGE_KEY_SELLERS, JSON.stringify(updated));
    showToast('Seller verified in ERP directory!', 'success');
  };

  const deleteSeller = (sellerId) => {
    const updated = (sellers || []).filter(s => s.id !== sellerId);
    setSellers(updated);
    localStorage.setItem(STORAGE_KEY_SELLERS, JSON.stringify(updated));
    showToast('Seller removed from ERP directory.', 'warning');
  };

  const deleteBuyer = (buyerId) => {
    const updated = (buyers || []).filter(b => b.id !== buyerId);
    setBuyers(updated);
    localStorage.setItem(STORAGE_KEY_BUYERS, JSON.stringify(updated));
    showToast('Buyer removed from ERP directory.', 'warning');
  };

  // Sales Journal Ledger Actions
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
    showToast(`Recorded Sales Entry #${newEntry.id} in Seller Journal!`, 'success');
  };

  const deleteSalesJournalEntry = (entryId) => {
    const updated = (salesJournal || []).filter(j => j.id !== entryId);
    setSalesJournal(updated);
    localStorage.setItem(STORAGE_KEY_SALES_JOURNAL, JSON.stringify(updated));
    showToast('Sales Journal Entry removed.', 'warning');
  };

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
    
    if (role === 'admin') {
      showToast('Product added & approved by Admin!', 'success');
    } else {
      showToast('Product submitted! Pending Admin Approval.', 'info');
    }
    setIsAddModalOpen(false);
  };

  const updateProduct = (productId, updatedData) => {
    const updated = (products || []).map(p => 
      p.id === productId ? { ...p, ...updatedData } : p
    );
    updateProductsState(updated);
    showToast('Product updated by Admin ERP!', 'success');
  };

  const approveProduct = (productId) => {
    const updated = (products || []).map(p => 
      p.id === productId ? { ...p, is_approved: true } : p
    );
    updateProductsState(updated);
    showToast('Product Approved! Now visible to all Buyers in Catalog.', 'success');
  };

  const deleteProduct = (productId) => {
    const updated = (products || []).filter(p => p.id !== productId);
    updateProductsState(updated);
    showToast('Product removed.', 'warning');
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
    showToast('Reset ERP dataset to initial state.', 'info');
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
      sellers: sellers || INITIAL_SELLERS,
      buyers: buyers || INITIAL_BUYERS,
      inquiries: inquiries || INITIAL_INQUIRIES,
      salesJournal: salesJournal || INITIAL_SALES_JOURNAL,
      verifySeller,
      deleteSeller,
      deleteBuyer,
      addSalesJournalEntry,
      deleteSalesJournalEntry,
      products: products || INITIAL_PRODUCTS,
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
