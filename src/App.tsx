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
import { BottomNav } from './components/BottomNav';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { WishlistPage } from './pages/WishlistPage';
import { AccountPage } from './pages/AccountPage';
import { AdminPage } from './pages/AdminPage';

const StoreContent: React.FC = () => {
  const { view } = useStore();

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#2C3539] flex flex-col font-sans selection:bg-[#2B080C] selection:text-white pb-16 md:pb-0">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Main Header & Navigation (Only on Storefront) */}
      {view !== 'admin' && <Header />}

      {/* Sitewide Breadcrumb Navigation Trail (Only on Storefront) */}
      {view !== 'admin' && <Breadcrumbs />}

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
        {view === 'admin' && <AdminPage />}
      </main>

      {/* Drawers & Modals */}
      <CartDrawer />
      <QuickViewModal />
      <PolicyModal />
      <ReviewModal />

      {/* Mobile Bottom Navigation Bar (Only on Storefront) */}
      {view !== 'admin' && <BottomNav />}

      {/* Footer (Only on Storefront) */}
      {view !== 'admin' && <Footer />}
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
