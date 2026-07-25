import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  User,
  Store,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Lock,
  Phone,
  Building2,
  MapPin,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, loginUser, registerUser, showToast } = useApp();

  const [activeTab, setActiveTab] = useState('signup'); // 'login' | 'signup'
  const [selectedRole, setSelectedRole] = useState('buyer'); // 'buyer' | 'seller'

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  const [buyerData, setBuyerData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    password: '',
    confirmPassword: ''
  });

  const [sellerData, setSellerData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    location: '',
    panNumber: '',
    password: '',
    confirmPassword: ''
  });

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!loginEmail || !loginPassword) {
      setErrorMsg('Please enter both Email and Password.');
      return;
    }

    const secretAdminEmail = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ADMIN_EMAIL) || 'admin@wsnepal.com';
    const secretAdminPass = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ADMIN_PASSWORD) || 'admin123';

    const isAdminAttempt = loginEmail.toLowerCase().trim() === secretAdminEmail.toLowerCase().trim() || loginEmail.toLowerCase().includes('admin');

    if (isAdminAttempt) {
      if (loginPassword !== secretAdminPass) {
        setErrorMsg('🔒 Incorrect Secret Admin Password! Access Denied.');
        return;
      }
      loginUser({
        email: secretAdminEmail,
        name: 'Super Admin ERP',
        role: 'admin'
      });
      setIsAuthModalOpen(false);
      return;
    }

    const assignedRole = loginEmail.toLowerCase().includes('seller') ? 'seller' : 'buyer';
    loginUser({
      email: loginEmail,
      name: loginEmail.split('@')[0],
      role: assignedRole
    });
    setIsAuthModalOpen(false);
  };

  const handleBuyerSignupSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!buyerData.name || !buyerData.email || !buyerData.password || !buyerData.confirmPassword) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (buyerData.password !== buyerData.confirmPassword) {
      setErrorMsg('Passwords do not match! Please make sure both passwords match.');
      return;
    }

    if (buyerData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    registerUser({
      name: buyerData.name,
      email: buyerData.email,
      phone: buyerData.phone || '9779821863885',
      location: buyerData.city || 'Nepal / India',
      password: buyerData.password,
      role: 'buyer'
    });
    setIsAuthModalOpen(false);
  };

  const handleSellerSignupSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!sellerData.companyName || !sellerData.email || !sellerData.password || !sellerData.confirmPassword) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (sellerData.password !== sellerData.confirmPassword) {
      setErrorMsg('Passwords do not match! Please make sure both passwords match.');
      return;
    }

    if (sellerData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    registerUser({
      name: sellerData.companyName,
      contactPerson: sellerData.contactName,
      email: sellerData.email,
      phone: sellerData.phone || '9779821863885',
      location: sellerData.location || 'Kathmandu / Delhi',
      panNumber: sellerData.panNumber,
      password: sellerData.password,
      role: 'seller'
    });
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-extrabold text-indigo-600 text-lg">WS NEPAL</span>
              <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200">
                B2B Registration
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Register account as Buyer or Seller with secure password</p>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Validation Error Banner */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab Selector */}
        <div className="p-6 space-y-6">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            <button
              onClick={() => {
                setActiveTab('signup');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'signup'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Create Account
            </button>
            <button
              onClick={() => {
                setActiveTab('login');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'login'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Log In
            </button>
          </div>

          {activeTab === 'signup' ? (
            <div className="space-y-5 text-xs">
              
              <div className="space-y-2">
                <label className="font-bold text-slate-700 text-xs flex items-center justify-between">
                  <span>Choose Account Type:</span>
                  <span className="text-indigo-600 font-semibold">Select Role</span>
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('buyer');
                      setErrorMsg('');
                    }}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-2 transition-all ${
                      selectedRole === 'buyer'
                        ? 'bg-emerald-50/70 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`p-2 rounded-xl ${selectedRole === 'buyer' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      {selectedRole === 'buyer' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">I am a Buyer</p>
                      <p className="text-[11px] text-slate-500 leading-snug">Browse products & buy via WhatsApp</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('seller');
                      setErrorMsg('');
                    }}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-2 transition-all ${
                      selectedRole === 'seller'
                        ? 'bg-indigo-50/70 border-indigo-500 text-indigo-950 ring-2 ring-indigo-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`p-2 rounded-xl ${selectedRole === 'seller' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        <Store className="w-4 h-4" />
                      </div>
                      {selectedRole === 'seller' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">I am a Seller</p>
                      <p className="text-[11px] text-slate-500 leading-snug">List products & get direct sales leads</p>
                    </div>
                  </button>
                </div>
              </div>

              {selectedRole === 'buyer' ? (
                <form onSubmit={handleBuyerSignupSubmit} className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Full Name / Buyer Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={buyerData.name}
                        onChange={(e) => setBuyerData({ ...buyerData, name: e.target.value })}
                        placeholder="e.g. Ramesh Thapa"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Email Address *</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={buyerData.email}
                          onChange={(e) => setBuyerData({ ...buyerData, email: e.target.value })}
                          placeholder="buyer@gmail.com"
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">WhatsApp Phone *</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          required
                          value={buyerData.phone}
                          onChange={(e) => setBuyerData({ ...buyerData, phone: e.target.value })}
                          placeholder="9779821863885"
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">City / Location</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={buyerData.city}
                        onChange={(e) => setBuyerData({ ...buyerData, city: e.target.value })}
                        placeholder="e.g. Pokhara, Nepal"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Password & Confirm Password */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Password *</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={buyerData.password}
                          onChange={(e) => setBuyerData({ ...buyerData, password: e.target.value })}
                          placeholder="Create password"
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Confirm Password *</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={buyerData.confirmPassword}
                          onChange={(e) => setBuyerData({ ...buyerData, confirmPassword: e.target.value })}
                          placeholder="Repeat password"
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all mt-4"
                  >
                    <span>Register as Buyer</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSellerSignupSubmit} className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Company / Business Name *</label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={sellerData.companyName}
                        onChange={(e) => setSellerData({ ...sellerData, companyName: e.target.value })}
                        placeholder="e.g. Everest Machinery Works Pvt Ltd"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Contact Person Name</label>
                      <input
                        type="text"
                        value={sellerData.contactName}
                        onChange={(e) => setSellerData({ ...sellerData, contactName: e.target.value })}
                        placeholder="Contact person"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">WhatsApp Phone *</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          required
                          value={sellerData.phone}
                          onChange={(e) => setSellerData({ ...sellerData, phone: e.target.value })}
                          placeholder="9779821863885"
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Business Email *</label>
                      <input
                        type="email"
                        required
                        value={sellerData.email}
                        onChange={(e) => setSellerData({ ...sellerData, email: e.target.value })}
                        placeholder="sales@company.com"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">PAN / GST Registration No.</label>
                      <input
                        type="text"
                        value={sellerData.panNumber}
                        onChange={(e) => setSellerData({ ...sellerData, panNumber: e.target.value })}
                        placeholder="PAN / GST No."
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Password & Confirm Password */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Password *</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={sellerData.password}
                          onChange={(e) => setSellerData({ ...sellerData, password: e.target.value })}
                          placeholder="Create password"
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Confirm Password *</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={sellerData.confirmPassword}
                          onChange={(e) => setSellerData({ ...sellerData, confirmPassword: e.target.value })}
                          placeholder="Repeat password"
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all mt-4"
                  >
                    <span>Register as Seller & Open Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

            </div>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Enter email address..."
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Secret Admin Credentials Notice */}
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-[11px] text-purple-900 font-medium space-y-1">
                <div className="flex items-center gap-1 font-bold text-purple-900">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>Admin Authentication</span>
                </div>
                <p className="text-purple-700 leading-snug">
                  Admin login requires Secret Email <code className="font-bold bg-purple-100 px-1 py-0.5 rounded text-purple-900">admin@wsnepal.com</code> and Secret Password configured in <code className="font-bold bg-purple-100 px-1 py-0.5 rounded text-purple-900">.env</code>.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <span>Log In to Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
