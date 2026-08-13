import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, CategoryId, Review, PaymentMethod, ViewMode, AccountTab, CategoryItem, Coupon } from '../types';
import { CATEGORIES as MOCK_CATEGORIES, PRODUCTS as MOCK_PRODUCTS, REVIEWS as MOCK_REVIEWS, COUPONS, MOCK_ORDERS } from '../data/mockData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface StoreContextType {
  // Global Data & Loading States
  products: Product[];
  categories: CategoryItem[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;

  view: ViewMode;
  setView: (view: ViewMode) => void;
  pathname: string;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedCategory: CategoryId;
  setSelectedCategory: (cat: CategoryId, subCat?: string | null) => void;
  selectedSubCategory: string | null;
  setSelectedSubCategory: (subCat: string | null) => void;
  showOnlyDeals: boolean;
  setShowOnlyDeals: (show: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (productId: string, color?: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  
  // Coupons
  appliedCoupon: string | null;
  couponDiscount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  
  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => Promise<void>;
  
  // Modals
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  activePolicyModal: string | null;
  setActivePolicyModal: (policy: string | null) => void;
  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (open: boolean) => void;
  isMobileSearchOpen: boolean;
  setIsMobileSearchOpen: (open: boolean) => void;
  
  // Orders
  currentOrder: Order | null;
  setCurrentOrder: (order: Order | null) => void;
  ordersHistory: Order[];
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  navigateToOrderDetails: (orderId: string) => void;
  createOrder: (shipping: any, paymentMethod: PaymentMethod) => Promise<Order>;
  
  // Reviews
  reviewsList: Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'likes' | 'verified'>) => Promise<void>;
  
  // Toast notifications
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  
  // Helper calculations
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  freeShippingThreshold: number;
  total: number;
  
  // Account
  accountTab: AccountTab;
  setAccountTab: (tab: AccountTab) => void;
  navigateToAccount: (tab?: AccountTab) => void;
  
  // Navigation helper
  navigateToProduct: (productId: string) => void;
  navigateToCategory: (category: CategoryId, subCategory?: string | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [ordersHistory, setOrdersHistory] = useState<Order[]>([]);
  const [couponsList, setCouponsList] = useState<Coupon[]>(COUPONS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const safeFetchJson = async (url: string, fallback: any) => {
        try {
          const r = await fetch(url);
          if (!r.ok) return fallback;
          const ct = r.headers.get('content-type') || '';
          if (!ct.includes('application/json')) return fallback;
          return await r.json();
        } catch {
          return fallback;
        }
      };

      const [prodRes, catRes, revRes, ordRes, coupRes] = await Promise.all([
        safeFetchJson('/api/products', MOCK_PRODUCTS),
        safeFetchJson('/api/categories', MOCK_CATEGORIES),
        safeFetchJson('/api/reviews', MOCK_REVIEWS),
        safeFetchJson('/api/orders', MOCK_ORDERS),
        safeFetchJson('/api/coupons', COUPONS)
      ]);

      setProducts(Array.isArray(prodRes) && prodRes.length > 0 ? prodRes : MOCK_PRODUCTS);
      setCategories(Array.isArray(catRes) && catRes.length > 0 ? catRes : MOCK_CATEGORIES);
      setReviewsList(Array.isArray(revRes) ? revRes : MOCK_REVIEWS);
      setOrdersHistory(Array.isArray(ordRes) ? ordRes : MOCK_ORDERS);
      setCouponsList(Array.isArray(coupRes) ? coupRes : COUPONS);
    } catch (err: any) {
      console.warn('Falling back to local cache if API fails:', err);
      setProducts(MOCK_PRODUCTS);
      setCategories(MOCK_CATEGORIES);
      setReviewsList(MOCK_REVIEWS);
      setOrdersHistory(MOCK_ORDERS);
      setCouponsList(COUPONS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);
  const [view, setViewState] = useState<ViewMode>('home');
  const [pathname, setPathname] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  });
  const [selectedProductId, setSelectedProductId] = useState<string | null>('p1');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedCategoryState, setSelectedCategoryState] = useState<CategoryId>('all');
  const [selectedSubCategoryState, setSelectedSubCategoryState] = useState<string | null>(null);
  const [showOnlyDeals, setShowOnlyDeals] = useState<boolean>(false);
  const [accountTab, setAccountTabState] = useState<AccountTab>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const CATEGORY_ID_TO_SLUG: Record<string, string> = {
    'electronics': 'electronics-audio',
    'fashion': 'fashion-apparel',
    'gadgets': 'smart-gadgets',
    'home': 'home-living',
    'beauty': 'beauty-skincare',
    'accessories': 'leather-bags',
    'all': 'shop'
  };

  const CATEGORY_SLUG_TO_ID: Record<string, CategoryId> = {
    'electronics': 'electronics',
    'electronics-audio': 'electronics',
    'fashion': 'fashion',
    'fashion-apparel': 'fashion',
    'gadgets': 'gadgets',
    'smart-gadgets': 'gadgets',
    'home': 'home',
    'home-living': 'home',
    'beauty': 'beauty',
    'beauty-skincare': 'beauty',
    'accessories': 'accessories',
    'leather-bags': 'accessories',
    'all': 'all',
    'shop': 'all',
    'catalog': 'all'
  };

  const slugify = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const slugToProduct = (param: string): Product | undefined => {
    if (!param) return undefined;
    const cleanParam = param.toLowerCase().trim();
    const byId = products.find((p) => p.id.toLowerCase() === cleanParam);
    if (byId) return byId;

    const bySlug = products.find((p) => slugify(p.name) === cleanParam);
    if (bySlug) return bySlug;

    const byPartial = products.find(
      (p) => cleanParam.includes(p.id.toLowerCase()) || slugify(p.name).includes(cleanParam)
    );
    return byPartial;
  };

  const getPathForView = (
    v: ViewMode,
    prodId?: string | null,
    cat?: CategoryId,
    subCat?: string | null,
    tab?: AccountTab,
    orderId?: string | null
  ): string => {
    switch (v) {
      case 'home':
        return '/';
      case 'shop': {
        if (cat && cat !== 'all') {
          const catSlug = CATEGORY_ID_TO_SLUG[cat] || cat;
          if (subCat) {
            return `/category/${catSlug}/${subCat}`;
          }
          return `/category/${catSlug}`;
        }
        return '/shop';
      }
      case 'product':
        return prodId ? `/product/${prodId}` : '/shop';
      case 'cart':
        return '/cart';
      case 'checkout':
        return '/checkout';
      case 'wishlist':
        return '/wishlist';
      case 'account': {
        if (tab === 'orders' && orderId) {
          return `/account/orders/${orderId}`;
        }
        return tab && tab !== 'overview' ? `/account/${tab}` : '/account';
      }
      case 'order-success':
        return '/order-success';
      case 'admin':
        return '/admin';
      default:
        return '/';
    }
  };

  const navigateToOrderDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setAccountTabState('orders');
    setViewState('account');
    const path = `/account/orders/${orderId}`;
    setPathname(path);
    if (typeof window !== 'undefined' && window.location.pathname !== path) {
      try {
        window.history.pushState({}, '', path);
      } catch (e) {
        console.error(e);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAccount = (tab: AccountTab = 'overview') => {
    setAccountTabState(tab);
    if (tab !== 'orders') {
      setSelectedOrderId(null);
    }
    setViewState('account');
    const path = tab === 'overview' ? '/account' : `/account/${tab}`;
    setPathname(path);
    if (typeof window !== 'undefined' && window.location.pathname !== path) {
      try {
        window.history.pushState({}, '', path);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const setAccountTab = (tab: AccountTab) => {
    setAccountTabState(tab);
    if (tab !== 'orders') {
      setSelectedOrderId(null);
    }
  };

  // Handle URL detection for routes, categories and subcategory params
  useEffect(() => {
    const syncFromUrl = () => {
      try {
        if (typeof window === 'undefined') return;
        const currentP = window.location.pathname;
        const searchStr = window.location.search;
        setPathname(currentP);

        const cleanPath = currentP.split('?')[0].split('#')[0];
        const segments = cleanPath.split('/').filter(Boolean);

        if (segments.length === 0) {
          setViewState('home');
          setSelectedCategoryState('all');
          setSelectedSubCategoryState(null);
        } else if (cleanPath === '/shop' || cleanPath === '/catalog') {
          setViewState('shop');
          setSelectedCategoryState('all');
          setSelectedSubCategoryState(null);
        } else if (segments[0] === 'category') {
          const catSlug = segments[1];
          const subSlug = segments[2];
          const resolvedCat = catSlug ? (CATEGORY_SLUG_TO_ID[catSlug.toLowerCase()] || (catSlug as CategoryId)) : 'all';

          setSelectedCategoryState(resolvedCat);
          setSelectedSubCategoryState(subSlug || null);
          setViewState('shop');
        } else if (segments[0] === 'product' || segments[0] === 'p') {
          const prodParam = segments[1];
          if (prodParam) {
            const matchedProd = slugToProduct(prodParam);
            if (matchedProd) {
              setSelectedProductId(matchedProd.id);
            } else {
              setSelectedProductId(prodParam);
            }
            setViewState('product');
          } else {
            setViewState('shop');
          }
        } else if (segments[0] === 'account' || segments[0] === 'user-portal') {
          setViewState('account');
          if (segments[1] === 'orders') {
            setAccountTabState('orders');
            if (segments[2]) {
              setSelectedOrderId(segments[2]);
            } else {
              setSelectedOrderId(null);
            }
          } else if (segments[1] === 'reviews') {
            setAccountTabState('reviews');
            setSelectedOrderId(null);
          } else if (segments[1] === 'returns') {
            setAccountTabState('returns');
            setSelectedOrderId(null);
          } else {
            setAccountTabState('overview');
            setSelectedOrderId(null);
          }
        } else if (cleanPath === '/cart') {
          setViewState('cart');
        } else if (cleanPath === '/checkout') {
          setViewState('checkout');
        } else if (cleanPath === '/wishlist') {
          setViewState('wishlist');
        } else if (cleanPath === '/order-success') {
          setViewState('order-success');
        } else if (cleanPath === '/admin' || cleanPath === '/dashboard') {
          setViewState('admin');
        }

        if (searchStr) {
          const params = new URLSearchParams(searchStr);
          const cat = params.get('category');
          const sub = params.get('subcategory') || params.get('sub');
          const q = params.get('search') || params.get('q');

          if (cat) {
            const resolvedCat = CATEGORY_SLUG_TO_ID[cat.toLowerCase()] || (cat as CategoryId);
            if (resolvedCat) {
              setSelectedCategoryState(resolvedCat);
              setViewState('shop');
            }
          }
          if (sub) {
            setSelectedSubCategoryState(sub);
          }
          if (q) {
            setSearchQuery(q);
          }
        }
      } catch (e) {
        console.error('Failed to parse URL params:', e);
      }
    };

    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  const pushUrl = (newPath: string) => {
    setPathname(newPath);
    if (typeof window !== 'undefined' && window.location.pathname !== newPath) {
      try {
        window.history.pushState({}, '', newPath);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const setSelectedCategory = (cat: CategoryId, subCat: string | null = null) => {
    setSelectedCategoryState(cat);
    setSelectedSubCategoryState(subCat);
    if (view === 'shop') {
      const newPath = getPathForView('shop', selectedProductId, cat, subCat, accountTab, selectedOrderId);
      pushUrl(newPath);
    }
  };

  const setSelectedSubCategory = (subCat: string | null) => {
    setSelectedSubCategoryState(subCat);
    if (view === 'shop') {
      const newPath = getPathForView('shop', selectedProductId, selectedCategoryState, subCat, accountTab, selectedOrderId);
      pushUrl(newPath);
    }
  };

  const navigateToCategory = (category: CategoryId, subCategory: string | null = null) => {
    setSelectedCategoryState(category);
    setSelectedSubCategoryState(subCategory);
    setViewState('shop');
    const newPath = getPathForView('shop', selectedProductId, category, subCategory, accountTab, selectedOrderId);
    pushUrl(newPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Load saved state from localStorage if available
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('vamos_cart') || localStorage.getItem('ehsan_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vamos_wishlist') || localStorage.getItem('ehsan_wishlist');
      return saved ? JSON.parse(saved) : ['p1', 'p3'];
    } catch {
      return ['p1', 'p3'];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('WELCOME10');
  const [couponDiscount, setCouponDiscount] = useState<number>(10); // 10%
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [activePolicyModal, setActivePolicyModal] = useState<string | null>(null);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState<boolean>(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState<boolean>(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const freeShippingThreshold = 60;

  useEffect(() => {
    try {
      localStorage.setItem('vamos_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('vamos_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const setView = (newView: ViewMode) => {
    setViewState(newView);
    const newPath = getPathForView(newView, selectedProductId, selectedCategoryState, selectedSubCategoryState, accountTab, selectedOrderId);
    pushUrl(newPath);

    if (newView === 'account') {
      navigateToAccount(accountTab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToProduct = (productId: string) => {
    setSelectedProductId(productId);
    setViewState('product');
    const path = `/product/${productId}`;
    pushUrl(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === color && item.selectedSize === size
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, { product, quantity, selectedColor: color, selectedSize: size }];
      }
    });

    showToast(`Added "${product.name}" to cart!`, 'success');
  };

  const removeFromCart = (productId: string, color?: string, size?: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.product.id === productId && item.selectedColor === color && item.selectedSize === size)
      )
    );
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (productId: string, quantity: number, color?: string, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, size);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.product.id === productId && item.selectedColor === color && item.selectedSize === size) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = async (productId: string) => {
    const exists = wishlist.includes(productId);

    if (exists) {
      showToast('Removed from wishlist', 'info');
      setWishlist((prev) => prev.filter((id) => id !== productId));
    } else {
      showToast('Saved to wishlist!', 'success');
      setWishlist((prev) => [...prev, productId]);
    }
  };

  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const found = COUPONS.find((c) => c.code === trimmed);

    if (!found) {
      return { success: false, message: 'Invalid coupon code' };
    }

    if (found.minSpend && subtotal < found.minSpend) {
      return { success: false, message: `Minimum spend of ৳${found.minSpend} required for code ${trimmed}` };
    }

    setAppliedCoupon(found.code);
    setCouponDiscount(found.value);
    showToast(`Coupon "${found.code}" applied!`, 'success');
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    showToast('Coupon code removed', 'info');
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  let discountAmount = 0;
  if (appliedCoupon) {
    const couponObj = COUPONS.find((c) => c.code === appliedCoupon);
    if (couponObj) {
      if (couponObj.discountType === 'percentage') {
        discountAmount = (subtotal * couponObj.value) / 100;
      } else {
        discountAmount = couponObj.value;
      }
    }
  }

  const shippingFee = subtotal >= freeShippingThreshold || cart.length === 0 ? 0 : 4.99;
  const tax = subtotal * 0.05; // 5% estimated tax
  const total = Math.max(0, subtotal - discountAmount + shippingFee + tax);

  const createOrder = async (shippingAddress: any, paymentMethod: PaymentMethod): Promise<Order> => {
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    const estDate = new Date();
    estDate.setDate(now.getDate() + (paymentMethod === 'cod' ? 3 : 2));

    const newOrder: Order = {
      id: orderId,
      date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      items: [...cart],
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'cod' : 'online_paid',
      amountPaid: paymentMethod === 'cod' ? 0 : total,
      dueAmount: paymentMethod === 'cod' ? total : 0,
      subtotal,
      tax,
      shippingFee,
      discount: discountAmount,
      total,
      status: 'Processing',
      estimatedDelivery: estDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    };

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
    } catch (err) {
      console.error('Error saving order to Turso:', err);
    }

    setCurrentOrder(newOrder);
    setOrdersHistory((prev) => [newOrder, ...prev]);
    clearCart();
    setAppliedCoupon(null);
    setView('order-success');
    showToast(`Order ${orderId} placed successfully! Saved to Turso DB.`, 'success');
    return newOrder;
  };

  const addReview = async (reviewData: Omit<Review, 'id' | 'date' | 'likes' | 'verified'>) => {
    const newRevId = `r-${Date.now()}`;
    const newRev: Review = {
      ...reviewData,
      id: newRevId,
      date: 'Just now',
      likes: 0,
      verified: true
    };

    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRev)
      });
    } catch (err) {
      console.error('Error saving review to Turso:', err);
    }

    setReviewsList((prev) => [newRev, ...prev]);
    showToast('Thank you for your product review! Saved to Turso DB.', 'success');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        isLoading,
        error,
        refreshData,
        view,
        setView,
        pathname,
        selectedProductId,
        setSelectedProductId,
        selectedCategory: selectedCategoryState,
        setSelectedCategory,
        selectedSubCategory: selectedSubCategoryState,
        setSelectedSubCategory,
        showOnlyDeals,
        setShowOnlyDeals,
        searchQuery,
        setSearchQuery,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        appliedCoupon,
        couponDiscount,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        quickViewProduct,
        setQuickViewProduct,
        activePolicyModal,
        setActivePolicyModal,
        isReviewModalOpen,
        setIsReviewModalOpen,
        isMobileSearchOpen,
        setIsMobileSearchOpen,
        currentOrder,
        setCurrentOrder,
        ordersHistory,
        selectedOrderId,
        setSelectedOrderId,
        navigateToOrderDetails,
        createOrder,
        reviewsList,
        addReview,
        toasts,
        showToast,
        subtotal,
        discountAmount,
        shippingFee,
        freeShippingThreshold,
        total,
        accountTab,
        setAccountTab,
        navigateToAccount,
        navigateToProduct,
        navigateToCategory
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
