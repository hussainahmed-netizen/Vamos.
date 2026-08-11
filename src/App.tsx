import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { BrandProvider } from './context/BrandContext';
import { Header } from './components/Header';
import { Breadcrumbs } from './components/Breadcrumbs';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { PolicyModal } from './components/PolicyModal';
import { ReviewModal } from './components/ReviewModal';
import { AccountModal } from './components/AccountModal';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { WishlistPage } from './pages/WishlistPage';
import { AccountPage } from './pages/AccountPage';

const StoreContent: React.FC = () => {
  const { view } = useStore();

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] flex flex-col font-sans selection:bg-[#2B080C] selection:text-white">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Main Header & Navigation */}
      <Header />

      {/* Sitewide Breadcrumb Navigation Trail */}
      <Breadcrumbs />

      {/* View Switcher Router */}
      <main className="flex-1">
        {view === 'home' && <HomePage />}
        {view === 'shop' && <ShopPage />}
        {view === 'product' && <ProductDetailPage />}
        {view === 'cart' && <CartPage />}
        {view === 'checkout' && <CheckoutPage />}
        {view === 'order-success' && <OrderSuccessPage />}
        {view === 'wishlist' && <WishlistPage />}
        {view === 'account' && <AccountPage />}
      </main>

      {/* Drawers & Modals */}
      <CartDrawer />
      <QuickViewModal />
      <PolicyModal />
      <ReviewModal />
      <AccountModal />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <BrandProvider>
      <StoreProvider>
        <StoreContent />
      </StoreProvider>
    </BrandProvider>
  );
}
