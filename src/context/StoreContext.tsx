import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, CategoryId, Review, PaymentMethod, ViewMode, AccountTab, CategoryItem, UserProfile } from '../types';
import { CATEGORIES as MOCK_CATEGORIES, PRODUCTS as MOCK_PRODUCTS, REVIEWS as MOCK_REVIEWS, COUPONS, MOCK_ORDERS } from '../data/mockData';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface StoreContextType {
  // Global Data & Loading States
  user: any | null;
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (isOpen: boolean) => void;
  isProfileSetupRequired: boolean;
  setIsProfileSetupRequired: (isRequired: boolean) => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  products: Product[];
  categories: CategoryItem[];
  isLoading: boolean;
  error: string | null;

  view: ViewMode;
  setView: (view: ViewMode) => void;
  pathname: string;
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
  toggleWishlist: (productId: string) => Promise<void>;
  
  // Modals
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  activePolicyModal: string | null;
  setActivePolicyModal: (policy: string | null) => void;
  isAccountModalOpen: boolean;
  setIsAccountModalOpen: (open: boolean) => void;
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
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [categories, setCategories] = useState<CategoryItem[]>(MOCK_CATEGORIES);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileSetupRequired, setIsProfileSetupRequired] = useState(false);

  const fetchProfile = async (currentUser: User) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', currentUser.id).single();
      if (error && error.code !== 'PGRST116') {
        if (error.code === 'PGRST205') {
          // Table doesn't exist yet, ignore
          return;
        }
        console.error('Error fetching profile:', error);
      }
      
      if (data) {
        setProfile(data);
        // Check mandatory fields
        if (!data.full_name || !data.phone_number || !data.shipping_address || !data.city_district) {
          setIsProfileSetupRequired(true);
        } else {
          setIsProfileSetupRequired(false);
        }
      } else {
        // No profile found, attempt to auto-create from metadata if available
        const meta = currentUser.user_metadata;
        if (meta && (meta.full_name || meta.phone_number)) {
           const newProfile = {
             id: currentUser.id,
             full_name: meta.full_name || meta.name || '',
             email: currentUser.email || '',
             phone_number: meta.phone_number || '',
             shipping_address: meta.shipping_address || '',
             city_district: 'N/A',
             secondary_phone: '',
             delivery_instructions: '',
             updated_at: new Date().toISOString()
           };
           const { error: upsertErr } = await supabase.from('profiles').upsert(newProfile);
           if (!upsertErr) {
             setProfile(newProfile as unknown as UserProfile);
             setIsProfileSetupRequired(false);
             return;
           }
        }
        
        setProfile(null);
        setIsProfileSetupRequired(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: import.meta.env.VITE_GOOGLE_REDIRECT_URI
      }
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Fetch Supabase Data
  useEffect(() => {
    let authListener: any;

    const fetchData = async () => {
      try {
        setIsLoading(true);

        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser(session.user);
            if (!session.user.is_anonymous) {
              await fetchProfile(session.user);
            }
          } else {
            const { data: anonData } = await supabase.auth.signInAnonymously();
            if (anonData?.session?.user) {
              setUser(anonData.session.user);
            }
          }
        } catch (authErr) {
          console.warn('Anonymous auth failed or not enabled:', authErr);
        }

        // Setup auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          setUser(session?.user || null);
          if (session?.user && !session.user.is_anonymous) {
            fetchProfile(session.user);
            if (event === 'SIGNED_IN') {
              setIsAuthModalOpen(false);
            }
          } else {
            setProfile(null);
            setIsProfileSetupRequired(false);
          }
        });
        authListener = subscription;
        
        // Fetch Categories
        const { data: dbCategories, error: catError } = await supabase.from('categories').select('*');
        if (catError) {
          console.warn('Supabase categories error:', catError.message);
        }
        
        // Fetch Products
        const { data: dbProducts, error: prodError } = await supabase.from('products').select('*');
        if (prodError) {
          console.warn('Supabase products error:', prodError.message);
        }

        // Fetch Reviews
        const { data: dbReviews, error: revError } = await supabase.from('reviews').select('*');
        if (!revError && dbReviews && dbReviews.length > 0) {
          setReviewsList(dbReviews as Review[]);
        }

        // Fetch User Data (Wishlist & Orders) - only if authenticated
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: dbWishlist } = await supabase.from('wishlists').select('product_id');
          if (dbWishlist) {
            setWishlist(dbWishlist.map(w => w.product_id));
          }

          const { data: dbOrders } = await supabase.from('orders').select('*').order('date', { ascending: false });
          if (dbOrders && dbOrders.length > 0) {
            setOrdersHistory(dbOrders as any[]);
          }
        }

        // If data is empty, we keep the mock data fallback, else replace it
        if (dbCategories && dbCategories.length > 0) {
          // You could transform raw table data to CategoryItem[] here
          // For now just mapping it somewhat safely
          const mappedCats: CategoryItem[] = dbCategories.map(c => ({
            id: c.id as CategoryId,
            name: c.name,
            description: c.description,
            image: c.image,
            itemCount: c.item_count || 0,
            badge: c.badge || undefined,
            subCategories: [] // Would fetch from sub_categories
          }));
          setCategories(mappedCats);
        }
        
        if (dbProducts && dbProducts.length > 0) {
          const mappedProds: Product[] = dbProducts.map(p => ({
            ...p,
            category: p.category_id as CategoryId,
            subCategory: p.sub_category_id,
            categoryName: p.category_name,
            originalPrice: p.original_price,
            reviewCount: p.review_count,
            isBestSeller: p.is_best_seller,
            isNewArrival: p.is_new_arrival,
            isFeatured: p.is_featured,
            isDeal: p.is_deal,
            dealEndsInHours: p.deal_ends_in_hours
          }));
          setProducts(mappedProds);
        }

      } catch (err: any) {
        console.warn('Error fetching from Supabase:', err);
        setError(err.message || 'Failed to load data from Supabase');
        // Falls back to MOCK arrays defined in state initialization
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();

    return () => {
      if (authListener) authListener.unsubscribe();
    };
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
  const [ordersHistory, setOrdersHistory] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('vamos_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return MOCK_ORDERS;
    } catch {
      return MOCK_ORDERS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('vamos_orders', JSON.stringify(ordersHistory));
    } catch (e) {
      console.error(e);
    }
  }, [ordersHistory]);

  const [reviewsList, setReviewsList] = useState<Review[]>(MOCK_REVIEWS);
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
      // Fire and forget to Supabase
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          supabase.from('wishlists').delete().eq('product_id', productId).eq('user_id', session.user.id).then();
        }
      });
      setWishlist((prev) => prev.filter((id) => id !== productId));
    } else {
      showToast('Saved to wishlist!', 'success');
      // Fire and forget to Supabase
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          supabase.from('wishlists').insert({ product_id: productId, user_id: session.user.id }).then();
        }
      });
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
      subtotal,
      tax,
      shippingFee,
      discount: discountAmount,
      total,
      status: 'Processing',
      estimatedDelivery: estDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    };

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase.from('orders').insert({
          id: orderId,
          user_id: session.user.id,
          items: newOrder.items,
          shipping_address: newOrder.shippingAddress,
          payment_method: newOrder.paymentMethod,
          payment_status: paymentMethod === 'cod' ? 'pending' : 'paid',
          subtotal: newOrder.subtotal,
          tax: newOrder.tax,
          shipping_fee: newOrder.shippingFee,
          discount: newOrder.discount,
          total: newOrder.total,
          status: 'Processing',
          estimated_delivery: estDate.toISOString()
        });
      }
    } catch (e) {
      console.warn('Failed to save order to Supabase:', e);
    }

    setCurrentOrder(newOrder);
    setOrdersHistory((prev) => [newOrder, ...prev]);
    clearCart();
    setAppliedCoupon(null);
    setView('order-success');
    showToast(`Order ${orderId} placed successfully!`, 'success');
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

    setReviewsList((prev) => [newRev, ...prev]);
    showToast('Thank you for your product review!', 'success');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase.from('reviews').insert({
          id: newRevId,
          product_id: reviewData.productId,
          user_id: session.user.id,
          author: reviewData.author,
          rating: reviewData.rating,
          title: reviewData.title,
          comment: reviewData.comment,
          verified: true,
          likes: 0
        });
      }
    } catch (e) {
      console.warn('Failed to save review to Supabase:', e);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        user,
        profile,
        setProfile,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isProfileSetupRequired,
        setIsProfileSetupRequired,
        signInWithGoogle,
        signOut,
        products,
        categories,
        isLoading,
        error,
        view,
        setView,
        pathname,
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
