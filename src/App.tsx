import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';

// Common Components
import { AnnouncementBar } from './components/common/AnnouncementBar';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { MobileNav } from './components/common/MobileNav';
import { ToastContainer } from './components/common/Toast';
import { CartDrawer } from './components/cart/CartDrawer';
import { SearchModal } from './components/search/SearchModal';
import { QuickViewModal } from './components/shop/QuickViewModal';
import { SizeGuideModal } from './components/shop/SizeGuideModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CategoryPage } from './pages/CategoryPage';
import { NewDropPage } from './pages/NewDropPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { CollectionDetailPage } from './pages/CollectionDetailPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { SearchPage } from './pages/SearchPage';
import { WishlistPage } from './pages/WishlistPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AccountPage } from './pages/AccountPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { ShippingReturnsPage } from './pages/ShippingReturnsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsConditionsPage } from './pages/TermsConditionsPage';
import { AdminPage } from './pages/AdminPage';

import { Product } from './types/product';

export const AppContent: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  // Modal / Drawer states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Browser navigation sync
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Route parsing
  const renderRoute = () => {
    // 1. Home
    if (currentPath === '/' || currentPath === '') {
      return <HomePage navigate={navigate} onQuickView={setQuickViewProduct} />;
    }

    // 2. Shop
    if (currentPath === '/shop') {
      return <ShopPage navigate={navigate} onQuickView={setQuickViewProduct} />;
    }

    // 3. Category: /category/:slug
    if (currentPath.startsWith('/category/')) {
      const slug = currentPath.replace('/category/', '').split('/')[0];
      return (
        <CategoryPage
          categorySlug={slug}
          navigate={navigate}
          onQuickView={setQuickViewProduct}
        />
      );
    }

    // 4. New Drop
    if (currentPath === '/new-drop') {
      return <NewDropPage navigate={navigate} onQuickView={setQuickViewProduct} />;
    }

    // 5. Collections
    if (currentPath === '/collections') {
      return <CollectionsPage navigate={navigate} />;
    }

    // 6. Collection Detail: /collection/:slug
    if (currentPath.startsWith('/collection/')) {
      const slug = currentPath.replace('/collection/', '').split('/')[0];
      return (
        <CollectionDetailPage
          collectionSlug={slug}
          navigate={navigate}
          onQuickView={setQuickViewProduct}
        />
      );
    }

    // 7. Product Detail: /product/:slug
    if (currentPath.startsWith('/product/')) {
      const slug = currentPath.replace('/product/', '').split('/')[0];
      return (
        <ProductDetailPage
          productSlug={slug}
          navigate={navigate}
          onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
          onQuickView={setQuickViewProduct}
        />
      );
    }

    // 8. Search
    if (currentPath === '/search') {
      return <SearchPage navigate={navigate} onQuickView={setQuickViewProduct} />;
    }

    // 9. Wishlist
    if (currentPath === '/wishlist') {
      return <WishlistPage navigate={navigate} onQuickView={setQuickViewProduct} />;
    }

    // 10. Cart
    if (currentPath === '/cart') {
      return <CartPage navigate={navigate} />;
    }

    // 11. Checkout (distraction-free)
    if (currentPath === '/checkout') {
      return <CheckoutPage navigate={navigate} />;
    }

    // 12. Login
    if (currentPath === '/login') {
      return <LoginPage navigate={navigate} />;
    }

    // 13. Register
    if (currentPath === '/register') {
      return <RegisterPage navigate={navigate} />;
    }

    // 14. Account
    if (currentPath === '/account') {
      return <AccountPage navigate={navigate} />;
    }

    // 15. Order History
    if (currentPath === '/account/orders') {
      return <OrderHistoryPage navigate={navigate} />;
    }

    // 16. About
    if (currentPath === '/about') {
      return <AboutPage navigate={navigate} />;
    }

    // 17. Contact
    if (currentPath === '/contact') {
      return <ContactPage navigate={navigate} />;
    }

    // 18. FAQ
    if (currentPath === '/faq') {
      return <FAQPage navigate={navigate} />;
    }

    // 19. Shipping & Returns
    if (currentPath === '/shipping-returns') {
      return <ShippingReturnsPage navigate={navigate} />;
    }

    // 20. Privacy Policy
    if (currentPath === '/privacy') {
      return <PrivacyPolicyPage navigate={navigate} />;
    }

    // 21. Terms & Conditions
    if (currentPath === '/terms') {
      return <TermsConditionsPage navigate={navigate} />;
    }

    // 22. Admin Command Center
    if (currentPath === '/admin' || currentPath.startsWith('/admin')) {
      return <AdminPage navigate={navigate} />;
    }

    // Fallback: 404
    return (
      <div className="section container" style={{ textAlign: 'center', padding: '120px 20px' }}>
        <h1 className="font-heading" style={{ fontSize: '4rem', color: '#EAEAEA' }}>404 // UNKNOWN COORDINATES</h1>
        <p className="font-editorial" style={{ color: 'rgba(234, 234, 234, 0.7)', margin: '16px 0 24px' }}>
          The requested silhouette or drop does not exist in our active archive.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          RETURN TO HOME
        </button>
      </div>
    );
  };

  const isCheckout = currentPath === '/checkout';
  const isAdmin = currentPath === '/admin' || currentPath.startsWith('/admin');

  return (
    <div className="app-wrapper">
      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Cart Drawer */}
      <CartDrawer navigate={navigate} />

      {/* Fullscreen Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        navigate={navigate}
      />

      {/* Mobile Nav Slide-over */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        navigate={navigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        navigate={navigate}
        onOpenSizeGuide={() => {
          setQuickViewProduct(null);
          setIsSizeGuideOpen(true);
        }}
      />

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      {/* Header & Announcements (hidden on distraction-free checkout & admin portal) */}
      {!isCheckout && !isAdmin && (
        <>
          <AnnouncementBar />
          <Header
            currentPage={currentPath}
            navigate={navigate}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenMobileNav={() => setIsMobileNavOpen(true)}
          />
        </>
      )}

      {/* Main Page Body */}
      <main className="main-content" id="main-content">
        {renderRoute()}
      </main>

      {/* Footer (hidden on distraction-free checkout & admin portal) */}
      {!isCheckout && !isAdmin && <Footer navigate={navigate} />}
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppContent />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
