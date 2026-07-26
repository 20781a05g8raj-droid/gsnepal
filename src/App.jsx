import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import BuyerCatalog from './components/BuyerCatalog';
import BlogSection from './components/BlogSection';
import SellerDashboard from './components/SellerDashboard';
import AdminPanel from './components/AdminPanel';
import ProductDetailModal from './components/ProductDetailModal';
import AddProductModal from './components/AddProductModal';
import SupabaseSettingsModal from './components/SupabaseSettingsModal';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import Footer from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';

function MainContent() {
  const { activeNav } = useApp();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white">
      
      {/* Top Header Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-8">
        
        {/* Dynamic View rendering with ErrorBoundary */}
        <ErrorBoundary>
          {activeNav === 'catalog' && <BuyerCatalog />}
          {activeNav === 'blog' && <BlogSection />}
          {activeNav === 'seller' && <SellerDashboard />}
          {activeNav === 'admin' && <AdminPanel />}
        </ErrorBoundary>

      </main>

      {/* Modals & Overlays */}
      <ProductDetailModal />
      <AddProductModal />
      <SupabaseSettingsModal />
      <AuthModal />
      <Toast />

      {/* Luxury Footer */}
      <Footer />

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
