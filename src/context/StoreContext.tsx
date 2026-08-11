import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, CategoryId, Review, PaymentMethod } from '../types';
import { PRODUCTS, REVIEWS, COUPONS } from '../data/mockData';

type ViewMode = 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'order-success' | 'wishlist';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface StoreContextType {
  view: ViewMode;
  setView: (view: ViewMode) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedCategory: CategoryId;
  setSelectedCategory: (cat: CategoryId, subCat?: string | null) => void;
  selectedSubCategory: string | null;
  setSelectedSubCategory: (subCat: string | null) => void;
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
  toggleWishlist: (productId: string) => void;
  
  // Modals
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  activePolicyModal: string | null;
  setActivePolicyModal: (policy: string | null) => void;
  isAccountModalOpen: boolean;
  setIsAccountModalOpen: (open: boolean) => void;
  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (open: boolean) => void;
  
  // Orders
  currentOrder: Order | null;
  setCurrentOrder: (order: Order | null) => void;
  ordersHistory: Order[];
  createOrder: (shipping: any, paymentMethod: PaymentMethod) => Order;
  
  // Reviews
  reviewsList: Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'likes' | 'verified'>) => void;
  
  // Toast notifications
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  
  // Helper calculations
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  freeShippingThreshold: number;
  total: number;
  
  // Navigation helper
  navigateToProduct: (productId: string) => void;
  navigateToCategory: (category: CategoryId) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [view, setViewState] = useState<ViewMode>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>('p1');
  const [selectedCategoryState, setSelectedCategoryState] = useState<CategoryId>('all');
  const [selectedSubCategoryState, setSelectedSubCategoryState] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Handle URL detection for category and subcategory params
  useEffect(() => {
    const syncFromUrl = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const cat = params.get('category');
        const sub = params.get('subcategory') || params.get('sub');

        if (cat) {
          const validCatMap: Record<string, CategoryId> = {
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
            'all': 'all'
          };
          const resolvedCat = validCatMap[cat.toLowerCase()] || (cat as CategoryId);
          if (resolvedCat) {
            setSelectedCategoryState(resolvedCat);
            setViewState('shop');
          }
        }
        if (sub) {
          setSelectedSubCategoryState(sub);
        }
      } catch (e) {
        console.error('Failed to parse URL params:', e);
      }
    };

    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  const setSelectedCategory = (cat: CategoryId, subCat: string | null = null) => {
    setSelectedCategoryState(cat);
    setSelectedSubCategoryState(subCat);
  };

  const setSelectedSubCategory = (subCat: string | null) => {
    setSelectedSubCategoryState(subCat);
  };

  const navigateToCategory = (category: CategoryId, subCategory: string | null = null) => {
    setSelectedCategory(category, subCategory);
    setView('shop');
  };
  
  // Load saved state from localStorage if available
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('vamos_cart') || localStorage.getItem('ehsan_cart');
      return saved ? JSON.parse(saved) : [
        { product: PRODUCTS[0], quantity: 1, selectedColor: PRODUCTS[0].colors?.[0]?.name }
      ];
    } catch {
      return [{ product: PRODUCTS[0], quantity: 1, selectedColor: PRODUCTS[0].colors?.[0]?.name }];
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
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [ordersHistory, setOrdersHistory] = useState<Order[]>([]);
  const [reviewsList, setReviewsList] = useState<Review[]>(REVIEWS);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToProduct = (productId: string) => {
    setSelectedProductId(productId);
    setView('product');
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

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to wishlist!', 'success');
        return [...prev, productId];
      }
    });
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

  const createOrder = (shippingAddress: any, paymentMethod: PaymentMethod): Order => {
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
      subtotal,
      tax,
      shippingFee,
      discount: discountAmount,
      total,
      status: 'Processing',
      estimatedDelivery: estDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    };

    setCurrentOrder(newOrder);
    setOrdersHistory((prev) => [newOrder, ...prev]);
    clearCart();
    setAppliedCoupon(null);
    setView('order-success');
    showToast(`Order ${orderId} placed successfully!`, 'success');
    return newOrder;
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'date' | 'likes' | 'verified'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `r-${Date.now()}`,
      date: 'Just now',
      likes: 0,
      verified: true
    };
    setReviewsList((prev) => [newRev, ...prev]);
    showToast('Thank you for your product review!', 'success');
  };

  return (
    <StoreContext.Provider
      value={{
        view,
        setView,
        selectedProductId,
        setSelectedProductId,
        selectedCategory: selectedCategoryState,
        setSelectedCategory,
        selectedSubCategory: selectedSubCategoryState,
        setSelectedSubCategory,
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
        isAccountModalOpen,
        setIsAccountModalOpen,
        isReviewModalOpen,
        setIsReviewModalOpen,
        currentOrder,
        setCurrentOrder,
        ordersHistory,
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
