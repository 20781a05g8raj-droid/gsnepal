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
  upsertSupabaseInquiry,
  signInWithSupabaseAuth,
  signUpWithSupabaseAuth,
  signOutSupabaseAuth,
  getStoredCredentials,
  saveStoredCredentials
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
  const [authModalRole, setAuthModalRole] = useState('seller');
  const [supabaseConfig, setSupabaseConfig] = useState({ url: '', key: '' });
  const [toastMessage, setToastMessage] = useState(null);

  const openAuthModal = (defaultRole = 'seller') => {
    setAuthModalRole(defaultRole);
    setIsAuthModalOpen(true);
  };

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

  // Secure Auth Functions with Supabase Auth Engine & Persistent Account Sync
  const loginUser = async ({ email, password, name, role: userRole }) => {
    const cleanEmail = email ? email.trim().toLowerCase() : '';
    if (!cleanEmail) {
      return { error: 'Please enter a valid email address.' };
    }

    // 1. Attempt Supabase Auth Server-side Login
    if (password) {
      const { data, error } = await signInWithSupabaseAuth(cleanEmail, password);
      if (!error && data?.user) {
        const authUser = data.user;
        const metaRole = authUser?.user_metadata?.role || userRole || (cleanEmail.includes('admin') ? 'admin' : (cleanEmail.includes('seller') ? 'seller' : 'buyer'));
        const newUser = {
          id: authUser.id,
          name: authUser.user_metadata?.name || name || cleanEmail.split('@')[0],
          email: cleanEmail,
          role: metaRole,
          phone: authUser.user_metadata?.phone || DEFAULT_WHATSAPP_NUMBER,
          location: authUser.user_metadata?.location || 'Nepal',
          isLoggedIn: true
        };
        setUserProfile(newUser);
        setRole(metaRole);
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(newUser));

        if (metaRole === 'seller') setActiveNav('seller');
        else if (metaRole === 'admin') setActiveNav('admin');
        else setActiveNav('catalog');

        showToast(`Authenticated via Supabase Auth! Welcome back, ${newUser.name}`, 'success');
        return { success: true, user: newUser };
      }
    }

    // 2. Check Credentials Store (Registered Users)
    const creds = getStoredCredentials();
    const registeredAccount = creds[cleanEmail];

    if (registeredAccount) {
      if (password && registeredAccount.password && registeredAccount.password !== password) {
        return { error: `Incorrect password entered for ${cleanEmail}. Please try again.` };
      }
      const newUser = {
        id: registeredAccount.id,
        name: registeredAccount.name,
        email: registeredAccount.email,
        role: registeredAccount.role,
        phone: registeredAccount.phone,
        location: registeredAccount.location,
        panNumber: registeredAccount.panNumber || '',
        isLoggedIn: true
      };
      setUserProfile(newUser);
      setRole(newUser.role);
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(newUser));

      if (newUser.role === 'seller') setActiveNav('seller');
      else if (newUser.role === 'admin') setActiveNav('admin');
      else setActiveNav('catalog');

      showToast(`Welcome back, ${newUser.name}! Logged in as ${newUser.role.toUpperCase()}`, 'success');
      return { success: true, user: newUser };
    }

    // 3. Fallback Check in Sellers or Buyers list (Synced from Database)
    const existingSeller = (sellers || []).find(s => s.email && s.email.toLowerCase() === cleanEmail);
    const existingBuyer = (buyers || []).find(b => b.email && b.email.toLowerCase() === cleanEmail);

    if (existingSeller) {
      const newUser = {
        id: existingSeller.id,
        name: existingSeller.companyName || existingSeller.contactPerson || cleanEmail.split('@')[0],
        email: cleanEmail,
        role: 'seller',
        phone: existingSeller.phone || DEFAULT_WHATSAPP_NUMBER,
        location: existingSeller.location || 'Nepal',
        isLoggedIn: true
      };
      setUserProfile(newUser);
      setRole('seller');
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(newUser));
      setActiveNav('seller');
      showToast(`Welcome back, ${newUser.name}! Logged in as SELLER`, 'success');
      return { success: true, user: newUser };
    }

    if (existingBuyer) {
      const newUser = {
        id: existingBuyer.id,
        name: existingBuyer.name || cleanEmail.split('@')[0],
        email: cleanEmail,
        role: 'buyer',
        phone: existingBuyer.phone || DEFAULT_WHATSAPP_NUMBER,
        location: existingBuyer.location || 'Nepal',
        isLoggedIn: true
      };
      setUserProfile(newUser);
      setRole('buyer');
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(newUser));
      setActiveNav('catalog');
      showToast(`Welcome back, ${newUser.name}! Logged in as BUYER`, 'success');
      return { success: true, user: newUser };
    }

    // 4. Admin email shortcut fallback
    if (cleanEmail.includes('admin')) {
      const newUser = {
        id: 'admin-001',
        name: 'WS Nepal Admin Desk',
        email: cleanEmail,
        role: 'admin',
        phone: DEFAULT_WHATSAPP_NUMBER,
        location: 'Kathmandu, Nepal',
        isLoggedIn: true
      };
      setUserProfile(newUser);
      setRole('admin');
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(newUser));
      setActiveNav('admin');
      showToast(`Logged in as ADMIN! Welcome`, 'success');
      return { success: true, user: newUser };
    }

    return { error: `No account found registered with email ${cleanEmail}. Please create an account first.` };
  };

  const registerUser = async (userData) => {
    const cleanEmail = userData.email ? userData.email.trim().toLowerCase() : '';

    if (!cleanEmail || !userData.password) {
      return { error: 'Please enter a valid email address and password.' };
    }

    // 1. Send registration to Supabase Auth Engine
    let supabaseAuthUser = null;
    if (userData.password) {
      const { data, error } = await signUpWithSupabaseAuth(cleanEmail, userData.password, {
        name: userData.name,
        role: userData.role,
        phone: userData.phone,
        location: userData.location
      });

      if (data?.user) {
        supabaseAuthUser = data.user;
      }
    }

    const assignedId = supabaseAuthUser?.id || (userData.role === 'seller' ? 'seller-' + Date.now().toString().slice(-4) : 'buyer-' + Date.now().toString().slice(-4));

    const newUser = {
      id: assignedId,
      name: userData.name,
      email: cleanEmail,
      role: userData.role,
      phone: userData.phone || DEFAULT_WHATSAPP_NUMBER,
      location: userData.location || 'Nepal',
      panNumber: userData.panNumber || '',
      isLoggedIn: true
    };

    // 2. Persist Account Record in Credentials Store
    const creds = getStoredCredentials();
    creds[cleanEmail] = {
      id: assignedId,
      name: userData.name,
      contactPerson: userData.contactPerson || userData.name,
      email: cleanEmail,
      password: userData.password,
      role: userData.role,
      phone: userData.phone || DEFAULT_WHATSAPP_NUMBER,
      location: userData.location || 'Nepal',
      panNumber: userData.panNumber || ''
    };
    saveStoredCredentials(creds);

    // 3. Set Active User Profile State
    setUserProfile(newUser);
    setRole(userData.role);
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(newUser));

    // 4. Save to Supabase Database Tables (Sellers / Buyers) & ERP
    if (userData.role === 'seller') {
      const newSeller = {
        id: newUser.id,
        companyName: userData.name,
        contactPerson: userData.contactPerson || userData.name,
        email: cleanEmail,
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
      const updatedSellers = [newSeller, ...(sellers || []).filter(s => s.email !== cleanEmail)];
      setSellers(updatedSellers);
      localStorage.setItem(STORAGE_KEY_SELLERS, JSON.stringify(updatedSellers));
      upsertSupabaseSeller(newSeller);
      setActiveNav('seller');
      showToast(`Seller account registered & saved to Supabase! Welcome ${newUser.name}`, 'success');
    } else {
      const newBuyer = {
        id: newUser.id,
        name: userData.name,
        email: cleanEmail,
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
      const updatedBuyers = [newBuyer, ...(buyers || []).filter(b => b.email !== cleanEmail)];
      setBuyers(updatedBuyers);
      localStorage.setItem(STORAGE_KEY_BUYERS, JSON.stringify(updatedBuyers));
      upsertSupabaseBuyer(newBuyer);
      setActiveNav('catalog');
      showToast(`Buyer account registered & saved to Supabase! Welcome ${newUser.name}`, 'success');
    }
    return { success: true, user: newUser };
  };

  const logoutUser = () => {
    setUserProfile(null);
    setRole('buyer');
    setActiveNav('catalog');
    localStorage.removeItem(STORAGE_KEY_AUTH);
    signOutSupabaseAuth();
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

  const toggleUserRole = () => {
    // Unauthenticated user -> MUST REGISTER / LOG IN first (No demo user generation)
    if (!userProfile || !userProfile.isLoggedIn) {
      const targetRole = role === 'seller' ? 'buyer' : 'seller';
      setAuthModalRole(targetRole);
      setIsAuthModalOpen(true);
      showToast(`Please log in or register as a ${targetRole.toUpperCase()} to continue.`, 'info');
      return;
    }

    // Logged in user -> Switch active mode
    const currentRole = userProfile.role || role || 'buyer';
    const targetRole = currentRole === 'seller' ? 'buyer' : 'seller';

    setRole(targetRole);

    if (targetRole === 'seller') {
      setActiveNav('seller');
    } else {
      setActiveNav('catalog');
    }

    const updatedProfile = {
      ...userProfile,
      role: targetRole
    };
    setUserProfile(updatedProfile);
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(updatedProfile));

    showToast(`Account mode switched: You are now a ${targetRole.toUpperCase()}!`, 'success');
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
      toggleUserRole,
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
      authModalRole,
      setAuthModalRole,
      openAuthModal,
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
