import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import {
  Star,
  ShoppingBag,
  Truck,
  Check,
  Plus,
  Minus,
  Clock,
  ShieldCheck,
  Banknote,
  Send,
  Flame,
  Gift,
  PackageCheck,
  Zap,
  MapPin,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Lock
} from 'lucide-react';

/* ==========================================================================
   PRODUCT PAGE CONFIGURATION BLOCK (EDITABLE VALUES FOR NON-CODERS)
   ==========================================================================
   Edit any value below to update the Product Details Page content instantly.
   -------------------------------------------------------------------------- */
const PRODUCT_PAGE_CONFIG = {
  // 1. Basic Product Details
  name: 'Acoustic Pro Wireless Headphones',
  subtitle: 'Hi-Fi Sound with Active Noise Cancellation & 40H Battery Life',
  regularPrice: 220,
  offerPrice: 175,
  discountPercentage: '-20%',
  stockCount: 14, // Number of items available in stock
  isOutOfStock: false, // Set to true if product is sold out

  // 2. Review Summary
  rating: 4.8,
  totalReviews: 120,

  // 3. Countdown Timer Settings
  // Real-time offer countdown (Set duration in seconds or target date)
  offerTimer: {
    enabled: true,
    title: 'Offer ends in:',
    initialSeconds: 86400, // 24 hours countdown
  },

  // 4. Color & Size Options
  colors: [
    { name: 'Matte Black', hex: '#0f172a' },
    { name: 'Silver Slate', hex: '#94a3b8' },
    { name: 'Deep Emerald', hex: '#065f46' },
  ],
  sizes: ['Standard', 'Pro Foam Cushion', 'XL Studio Cushion'],

  // 5. Image Gallery (Main image + Thumbnails)
  images: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=800',
  ],

  // 6. Full Description & Specifications
  description:
    'Experience studio-quality sound acoustics with hybrid active noise cancellation technology. Designed for audiophiles, gamers, and remote professionals, these ergonomic headphones feature memory foam earcups, Bluetooth 5.3 low-latency pairing, and a 40-hour battery life.',
  features: [
    'Hybrid Active Noise Cancellation (ANC) up to -35dB',
    '40-Hour Continuous Playback on a single 10-minute Type-C fast charge',
    'Custom 40mm Dynamic Drivers for crystal-clear acoustics and deep bass',
    'Ergonomic Foldable Design with ultra-soft memory foam cushion earcups',
    'Dual HD Microphones with AI Environment Noise Reduction for clear calling',
    'Dual Device Connectivity — seamlessly switch between laptop and smartphone',
  ],
  specifications: {
    'Bluetooth Version': 'v5.3 Low-Latency',
    'Battery Life': '40 Hours (ANC On) / 60 Hours (ANC Off)',
    'Charging Time': '1.5 Hours (Type-C Fast Charge)',
    'Driver Unit': '40mm Neodymium Magnet',
    'Weight': '235g Light Weight',
    'Warranty': '1 Year Official Warranty',
  },

  // 7. Size Chart Settings (Optional for Clothing/Apparel)
  // --------------------------------------------------------------------------
  // HOW TO TOGGLE SIZE CHART:
  // Set `showSizeChart: true` to display the Size Chart section.
  // Set `showSizeChart: false` to completely remove it from the page.
  // --------------------------------------------------------------------------
  showSizeChart: true,
  sizeChart: {
    title: 'Size Guide & Measurement Chart',
    headers: ['Size', 'Ear Cup Diameter', 'Headband Span', 'Recommended Fit'],
    rows: [
      ['Standard', '75 mm', '28 - 34 cm', 'Universal Daily Fit'],
      ['Pro Foam Cushion', '82 mm', '30 - 36 cm', 'Extra Comfort Over-Ear'],
      ['XL Studio Cushion', '90 mm', '32 - 38 cm', 'Max Isolation & Studio Fit'],
    ],
  },

  // 8. Delivery Details & COD Info
  delivery: {
    insideDhaka: '৳60 (1-2 Days Delivery inside Dhaka)',
    outsideDhaka: '৳120 (2-3 Days Delivery outside Dhaka)',
    timeframe: '1 to 3 business days',
    codAvailable: true,
    codDescription:
      'Cash on delivery available. Open the package and verify before making payment.',
  },

  // 9. Combo Package Deal
  comboPackage: {
    enabled: true,
    title: 'Special Value Combo Package',
    subtitle: 'Buy this Headphones set together with protection accessories & save ৳30 extra!',
    comboPrice: 199.0,
    originalPrice: 250.0,
    items: [
      { name: 'Acoustic Pro Wireless Headphones', price: '৳175.00' },
      { name: 'Hard Shell Anti-Shock Carry Case', price: '৳40.00' },
      { name: 'Braided Gold-Plated Aux Cable & Stand', price: '৳35.00' },
    ],
  },
};

export const ProductDetailPage: React.FC = () => {
  const {
    products,
    categories,
    selectedProductId,
    addToCart,
    setView,
    setSelectedCategory,
    reviewsList,
    ordersHistory,
    showToast,
    isLoading
  } = useStore();

  // Selected state from CONFIG or active product
  const storeProduct = products.find((p) => p.id === selectedProductId) || products[0] || {} as any;

  // Dynamic Product Attributes
  const displayTitle = storeProduct.name || PRODUCT_PAGE_CONFIG.name;
  const displaySubtitle = storeProduct.subtitle || PRODUCT_PAGE_CONFIG.subtitle;
  const displayPrice = storeProduct.price || PRODUCT_PAGE_CONFIG.offerPrice;
  const displayOriginalPrice = storeProduct.originalPrice || PRODUCT_PAGE_CONFIG.regularPrice;
  const displayRating = storeProduct.rating || PRODUCT_PAGE_CONFIG.rating;
  const displayReviews = storeProduct.reviewCount || PRODUCT_PAGE_CONFIG.totalReviews;

  // Dynamic Image Array Resolution
  const productImages: string[] = (() => {
    if (Array.isArray(storeProduct?.images) && storeProduct.images.length > 0) {
      return storeProduct.images;
    }
    if (Array.isArray((storeProduct as any)?.imagesUrl) && (storeProduct as any).imagesUrl.length > 0) {
      return (storeProduct as any).imagesUrl;
    }
    const singleImg = storeProduct?.image || (storeProduct as any)?.imageUrl;
    if (singleImg) {
      return [singleImg];
    }
    return ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'];
  })();

  // Dynamic Category & Breadcrumb Resolution
  const mainCategoryObj = categories.find((c) => c.id === storeProduct.category);
  const mainCategoryName = mainCategoryObj?.name || storeProduct.categoryName || 'Catalog';
  const subCategoryObj = mainCategoryObj?.subCategories?.find((s) => s.id === storeProduct.subCategory);
  const subCategoryName = subCategoryObj?.name || (storeProduct.subCategory ? storeProduct.subCategory.charAt(0).toUpperCase() + storeProduct.subCategory.slice(1) : null);
  const productTitle = displayTitle;

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  // Reset selected image index when active product changes
  useEffect(() => {
    setSelectedImageIdx(0);
  }, [storeProduct.id]);

  const currentDisplayImage = productImages[selectedImageIdx] || productImages[0];
  const [selectedColor, setSelectedColor] = useState(PRODUCT_PAGE_CONFIG.colors[0].name);
  const [selectedSize, setSelectedSize] = useState(PRODUCT_PAGE_CONFIG.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  // IntersectionObserver for Sticky Bottom Buy Bar
  const mainCtaRef = useRef<HTMLDivElement>(null);
  const [isStickyVisible, setIsStickyVisible] = useState(false);

  useEffect(() => {
    const target = mainCtaRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky bar only if the target is out of view AND it is above the viewport
        setIsStickyVisible(!entry.isIntersecting && entry.boundingClientRect.y < 0);
      },
      {
        root: null,
        threshold: 0,
      }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, []);

  // Countdown timer state
  const [secondsLeft, setSecondsLeft] = useState(PRODUCT_PAGE_CONFIG.offerTimer.initialSeconds);

  useEffect(() => {
    if (!PRODUCT_PAGE_CONFIG.offerTimer.enabled) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (totalSecs: number) => {
    const days = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return { days, hours, mins, secs };
  };

  const timer = formatTimer(secondsLeft);

  // Form state for submitting a new review
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');

  // Pagination state for reviews
  const [reviewPage, setReviewPage] = useState(0);
  const [reviewDirection, setReviewDirection] = useState<'next' | 'prev'>('next');
  const REVIEWS_PER_PAGE = 5;

  const [localReviews, setLocalReviews] = useState([
    {
      id: 'r-101',
      author: 'Tanvir Hossain',
      rating: 5,
      date: 'Yesterday',
      comment:
        'Outstanding headphones! Sound quality and bass are fantastic. Received in 1 day via Cash on Delivery. Thank you!',
    },
    {
      id: 'r-102',
      author: 'Rafiqul Islam',
      rating: 5,
      date: '3 days ago',
      comment:
        'Battery life is outstanding. Noise cancellation works really well in noise offices.',
    },
    {
      id: 'r-103',
      author: 'Anika Rahman',
      rating: 4,
      date: '1 week ago',
      comment: 'Very comfortable ear cushions. Product original and packaging was safe.',
    },
    {
      id: 'r-104',
      author: 'Mahfuz Hasan',
      rating: 5,
      date: '1 week ago',
      comment: 'Crystal clear audio during gaming and online meetings. Best purchase!',
    },
    {
      id: 'r-105',
      author: 'Sadia Afrin',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Fast delivery and authentic product. Highly recommended.',
    },
    {
      id: 'r-106',
      author: 'Farhan Ahmed',
      rating: 4,
      date: '2 weeks ago',
      comment: 'Build quality is premium. Noise cancellation is very effective.',
    },
    {
      id: 'r-107',
      author: 'Nusrat Jahan',
      rating: 5,
      date: '3 weeks ago',
      comment: 'Super bass and long battery life. Worth every penny!',
    },
    {
      id: 'r-108',
      author: 'Kazi Imran',
      rating: 5,
      date: '1 month ago',
      comment: 'Seamless Bluetooth connection with my laptop and phone.',
    },
    {
      id: 'r-109',
      author: 'Sumaiya Akter',
      rating: 4,
      date: '1 month ago',
      comment: 'Lightweight design and soft ear cups. Great for long study sessions.',
    },
    {
      id: 'r-110',
      author: 'Tareq Rahman',
      rating: 5,
      date: '1 month ago',
      comment: 'Delivery within 24 hours in Dhaka. Top notch service!',
    },
    {
      id: 'r-111',
      author: 'Bilkis Khanom',
      rating: 5,
      date: '2 months ago',
      comment: 'Premium packaging, comes with Type-C fast charging cable.',
    },
    {
      id: 'r-112',
      author: 'Shakil Chowdhury',
      rating: 4,
      date: '2 months ago',
      comment: 'Excellent sound stage and active noise cancellation.',
    },
  ]);

  const totalReviewPages = Math.ceil(localReviews.length / REVIEWS_PER_PAGE);
  const currentReviews = localReviews.slice(
    reviewPage * REVIEWS_PER_PAGE,
    (reviewPage + 1) * REVIEWS_PER_PAGE
  );

  // User review quota per product based on purchases
  const [userReviewsCountMap, setUserReviewsCountMap] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('vamos_user_product_reviews_submitted');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const purchasedCount = (ordersHistory || []).reduce((total, order) => {
    const matchingItems = (order.items || []).filter(
      (item) => item.product && item.product.id === storeProduct.id
    );
    const count = matchingItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    return total + count;
  }, 0);

  const userSubmittedCount = userReviewsCountMap[storeProduct.id] || 0;
  const remainingReviewsAllowed = Math.max(0, purchasedCount - userSubmittedCount);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (remainingReviewsAllowed <= 0) {
      showToast('You must purchase this product to leave a review.', 'error');
      return;
    }
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) {
      showToast('Please enter your name and review comment.', 'error');
      return;
    }
    const newRev = {
      id: `r-${Date.now()}`,
      author: newReviewAuthor,
      rating: newReviewRating,
      date: 'Just now',
      comment: newReviewComment,
    };
    setLocalReviews([newRev, ...localReviews]);
    setReviewDirection('prev');
    setReviewPage(0); // Jump to first page so user sees new review immediately
    setNewReviewAuthor('');
    setNewReviewComment('');
    setNewReviewRating(5);

    setUserReviewsCountMap((prev) => {
      const current = prev[storeProduct.id] || 0;
      const updated = { ...prev, [storeProduct.id]: current + 1 };
      try {
        localStorage.setItem('vamos_user_product_reviews_submitted', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });

    showToast('Thank you! Your verified review has been submitted.', 'success');
  };

  const handleAddToCartAction = () => {
    addToCart(storeProduct, quantity, selectedColor, selectedSize);
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  const handleBuyNowAction = () => {
    addToCart(storeProduct, quantity, selectedColor, selectedSize);
    setView('checkout');
  };

  const relatedItems = products.filter((p) => p.id !== storeProduct.id).slice(0, 4);

  if (isLoading) {
    return (
      <div className="max-w-[1536px] mx-auto px-4 py-8 animate-pulse">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 pb-16 border-b border-slate-200">
          <div className="w-full lg:w-1/2">
            <div className="aspect-square bg-slate-200 rounded-3xl w-full mb-4"></div>
            <div className="flex gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-slate-200 rounded-2xl w-24"></div>
              ))}
            </div>
          </div>
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="h-8 bg-slate-200 rounded-xl w-3/4"></div>
            <div className="h-6 bg-slate-200 rounded-xl w-1/2"></div>
            <div className="h-24 bg-slate-200 rounded-2xl w-full"></div>
            <div className="h-12 bg-slate-200 rounded-2xl w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-['Hind_Siliguri','Plus_Jakarta_Sans',sans-serif] bg-slate-50 text-[#2C3539] pb-28 sm:pb-24 animate-in fade-in duration-300">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
        
        {/* ====================================================================
           1. MAIN PRODUCT SECTION (GALLERY + DETAILS)
           ==================================================================== */}
        <section className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Image Gallery (3:2 Ratio - 7 Cols) */}
          <div className="lg:col-span-7 flex flex-col">
            {/* Main Product Display Image */}
            <div className="aspect-square max-h-[500px] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative shadow-inner">
              <img
                src={currentDisplayImage}
                alt={displayTitle}
                className="w-full h-full object-cover transition-all duration-300"
              />
              {PRODUCT_PAGE_CONFIG.discountPercentage && (
                <span className="absolute top-3.5 left-3.5 bg-rose-600 text-white font-extrabold text-xs px-3 py-1 rounded-xl shadow-md uppercase tracking-wider">
                  {PRODUCT_PAGE_CONFIG.discountPercentage} OFF
                </span>
              )}
            </div>

            {/* Thumbnails row below - dynamically rendered only when multiple images exist */}
            {productImages.length > 1 && (
              <div className="flex flex-row items-center gap-2.5 overflow-x-auto pt-3 pb-1 px-0.5">
                {productImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImageIdx === idx
                        ? 'border-[#2B080C] ring-2 ring-[#2B080C]/40 shadow-xs opacity-100'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`${displayTitle} - ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Actions & Meta (3:2 Ratio - 5 Cols, Compact Density) */}
          <div className="lg:col-span-5 space-y-2.5">
            {/* Product Name */}
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#2C3539] leading-tight mb-0.5">
                {displayTitle}
              </h1>
              <p className="text-xs lg:text-sm text-[#6B7280] mb-1">{displaySubtitle}</p>
            </div>

            {/* Review Summary */}
            <div className="flex items-center gap-2 text-xs lg:text-sm">
              <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{displayRating}</span>
              </div>
              <span className="text-[#6B7280] text-xs lg:text-sm font-semibold">
                | {displayReviews} Reviews
              </span>
            </div>

            {/* Pricing Section */}
            <div className="py-2 px-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] lg:text-xs text-[#6B7280] block font-semibold leading-none mb-0.5">
                  Special Offer Price:
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl lg:text-3xl font-black text-[#2B080C] font-mono leading-none">
                    ৳{displayPrice.toFixed(2)}
                  </span>
                  <span className="text-sm lg:text-base text-[#6B7280] line-through font-mono">
                    ৳{displayOriginalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
              <span className="bg-[#2B080C] text-white text-xs lg:text-sm font-extrabold px-2.5 py-1 rounded-full border border-[#2B080C]">
                {PRODUCT_PAGE_CONFIG.discountPercentage} OFF
              </span>
            </div>

            {/* Countdown Timer */}
            {PRODUCT_PAGE_CONFIG.offerTimer.enabled && (
              <div className="bg-amber-50/90 border border-amber-300 py-1.5 px-3 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] lg:text-xs font-bold text-amber-900">
                  <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                  <span>{PRODUCT_PAGE_CONFIG.offerTimer.title}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 text-center font-mono">
                  <div className="bg-white py-1 px-1 rounded-lg border border-amber-200 shadow-2xs">
                    <span className="block text-sm lg:text-base font-black text-[#2C3539] leading-none">{timer.days}</span>
                    <span className="text-[9px] lg:text-[10px] text-[#6B7280] uppercase font-sans">Days</span>
                  </div>
                  <div className="bg-white py-1 px-1 rounded-lg border border-amber-200 shadow-2xs">
                    <span className="block text-sm lg:text-base font-black text-[#2C3539] leading-none">{timer.hours}</span>
                    <span className="text-[9px] lg:text-[10px] text-[#6B7280] uppercase font-sans">Hours</span>
                  </div>
                  <div className="bg-white py-1 px-1 rounded-lg border border-amber-200 shadow-2xs">
                    <span className="block text-sm lg:text-base font-black text-[#2C3539] leading-none">{timer.mins}</span>
                    <span className="text-[9px] lg:text-[10px] text-[#6B7280] uppercase font-sans">Mins</span>
                  </div>
                  <div className="bg-white py-1 px-1 rounded-lg border border-amber-200 shadow-2xs">
                    <span className="block text-sm lg:text-base font-black text-[#2B080C] leading-none">{timer.secs}</span>
                    <span className="text-[9px] lg:text-[10px] text-[#6B7280] uppercase font-sans">Secs</span>
                  </div>
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div>
              {!PRODUCT_PAGE_CONFIG.isOutOfStock ? (
                <span className="inline-flex items-center gap-1.5 bg-[#2B080C]/10 text-[#2B080C] text-[11px] lg:text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#2B080C]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2B080C] animate-ping" />
                  ✓ In Stock ({PRODUCT_PAGE_CONFIG.stockCount} items left)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-900 text-[11px] lg:text-xs font-bold px-2.5 py-0.5 rounded-full border border-rose-300">
                  ✕ Out of Stock
                </span>
              )}
            </div>

            {/* Variables / Options */}
            {PRODUCT_PAGE_CONFIG.colors && (
              <div className="space-y-1.5 mb-5">
                <label className="text-[11px] lg:text-sm font-bold text-slate-700 uppercase tracking-wider block">
                  Select Color:
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRODUCT_PAGE_CONFIG.colors.map((col) => (
                    <button
                      key={col.name}
                      onClick={() => setSelectedColor(col.name)}
                      className={`px-3 py-1.5 rounded-lg border text-xs lg:text-base font-bold flex items-center gap-2 transition-all ${
                        selectedColor === col.name
                          ? 'bg-[#0B0E14] text-white border-[#0B0E14] shadow-2xs'
                          : 'bg-white text-[#2C3539] border-[#E5E7EB] hover:border-slate-400'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: col.hex }} />
                      <span>{col.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {PRODUCT_PAGE_CONFIG.sizes && (
              <div className="space-y-1.5 mb-5">
                <label className="text-[11px] lg:text-sm font-bold text-slate-700 uppercase tracking-wider block">
                  Select Size:
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRODUCT_PAGE_CONFIG.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3.5 py-1.5 rounded-lg border text-xs lg:text-base font-bold transition-all ${
                        selectedSize === sz
                          ? 'bg-[#0B0E14] text-white border-[#0B0E14] shadow-2xs'
                          : 'bg-white text-[#2C3539] border-[#E5E7EB] hover:border-slate-400'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-1.5 mb-7">
              <label className="text-[11px] lg:text-sm font-bold text-slate-700 uppercase tracking-wider block">
                Quantity:
              </label>
              <div className="inline-flex items-center bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-0.5 lg:p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 lg:p-2 text-[#6B7280] hover:text-[#2C3539]"
                >
                  <Minus className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                </button>
                <span className="w-10 lg:w-12 text-center text-xs lg:text-base font-extrabold font-mono text-[#2C3539]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1.5 lg:p-2 text-[#6B7280] hover:text-[#2C3539]"
                >
                  <Plus className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons: Add to Cart & Buy Now */}
            <div ref={mainCtaRef} className="grid grid-cols-2 gap-2 sm:gap-2.5 pt-1 mt-2">
              <button
                onClick={handleAddToCartAction}
                className={`py-2.5 px-2 sm:px-5 rounded-xl font-extrabold text-[11px] sm:text-sm lg:text-base border-2 transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${
                  isAddedToCart
                    ? 'bg-[#0B0E14] text-white border-[#0B0E14]'
                    : 'bg-[#2B080C] hover:bg-[#380B0F] text-white border-[#2B080C] shadow-sm'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" />
                <span className="truncate">{isAddedToCart ? 'Added!' : 'Add to Cart'}</span>
              </button>

              <button
                onClick={handleBuyNowAction}
                className="py-2.5 px-2 sm:px-5 bg-white border-2 border-[#111827] hover:bg-[#111827] text-[#2C3539] hover:text-white font-extrabold text-[11px] sm:text-sm lg:text-base rounded-xl shadow-2xs transition-all flex items-center justify-center truncate"
              >
                <span>Buy Now</span>
              </button>
            </div>
          </div>
        </section>

        {/* ====================================================================
           2. PRODUCT DETAILS SECTION
           ==================================================================== */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E7EB] shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl lg:text-3xl font-extrabold text-[#2C3539] font-serif flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 lg:w-6 lg:h-6 text-[#2B080C]" />
              Product Description & Specs
            </h2>
          </div>

          <p className="text-sm lg:text-lg text-[#6B7280] leading-relaxed font-medium">
            {PRODUCT_PAGE_CONFIG.description}
          </p>

          {/* Key features checklist */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm lg:text-lg font-extrabold text-[#2C3539]">Key Features:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PRODUCT_PAGE_CONFIG.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3.5 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] text-xs lg:text-base font-semibold text-[#2C3539]">
                  <Check className="w-4 h-4 lg:w-5 lg:h-5 text-[#2B080C] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Specifications table */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm lg:text-lg font-extrabold text-[#2C3539]">Specifications:</h3>
            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs lg:text-base">
              {Object.entries(PRODUCT_PAGE_CONFIG.specifications).map(([key, val]) => (
                <div key={key} className="flex p-3.5 bg-white even:bg-slate-50/60">
                  <span className="w-1/3 font-bold text-slate-700">{key}</span>
                  <span className="w-2/3 text-[#2C3539] font-mono font-medium">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====================================================================
           3. SIZE CHART SECTION (OPTIONAL / TOGGLEABLE IN CONFIG)
           ==================================================================== */}
        {PRODUCT_PAGE_CONFIG.showSizeChart && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h2 className="text-lg lg:text-xl font-extrabold text-[#2C3539] font-serif">
                {PRODUCT_PAGE_CONFIG.sizeChart.title}
              </h2>
              <span className="text-[10px] lg:text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-bold">
                Optional Section
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs lg:text-sm border border-slate-200 rounded-2xl overflow-hidden">
                <thead className="bg-slate-900 text-white font-bold">
                  <tr>
                    {PRODUCT_PAGE_CONFIG.sizeChart.headers.map((h, i) => (
                      <th key={i} className="p-3 border-b border-slate-800">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {PRODUCT_PAGE_CONFIG.sizeChart.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-3 border-r border-slate-100 last:border-r-0">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ====================================================================
           4. DELIVERY DETAILS SECTION
           ==================================================================== */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E7EB] shadow-xs space-y-4">
          <h2 className="text-lg lg:text-2xl font-extrabold text-[#2C3539] font-serif flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <Truck className="w-5 h-5 lg:w-6 lg:h-6 text-[#2B080C]" />
            Delivery Charges & Info
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs lg:text-base">
            <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl space-y-1">
              <div className="flex items-center gap-2 font-bold text-[#2C3539]">
                <MapPin className="w-4 h-4 lg:w-5 lg:h-5 text-[#2B080C]" />
                <span>Delivery Charge Inside Dhaka:</span>
              </div>
              <p className="font-mono text-[#2B080C] text-sm lg:text-lg font-bold">
                {PRODUCT_PAGE_CONFIG.delivery.insideDhaka}
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <div className="flex items-center gap-2 font-bold text-[#2C3539]">
                <Truck className="w-4 h-4 lg:w-5 lg:h-5 text-slate-600" />
                <span>Delivery Charge Outside Dhaka:</span>
              </div>
              <p className="font-mono text-[#2C3539] text-sm lg:text-lg font-bold">
                {PRODUCT_PAGE_CONFIG.delivery.outsideDhaka}
              </p>
            </div>
          </div>

          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-2 text-xs lg:text-base text-amber-950">
            <div className="flex items-center gap-2 font-bold lg:text-lg">
              <Banknote className="w-4 h-4 lg:w-5 lg:h-5 text-amber-700" />
              <span>Cash on Delivery Available:</span>
            </div>
            <p className="leading-relaxed">{PRODUCT_PAGE_CONFIG.delivery.codDescription}</p>
            <p className="font-semibold text-slate-700">
              Estimated Delivery Time: <strong>{PRODUCT_PAGE_CONFIG.delivery.timeframe}</strong>
            </p>
          </div>
        </section>

        {/* ====================================================================
           5. REVIEWS SECTION (REVIEWS LIST + SUBMIT REVIEW FORM)
           ==================================================================== */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
            <h2 className="text-base sm:text-lg lg:text-2xl font-extrabold text-[#2C3539] font-serif truncate">
              Customer Reviews ({localReviews.length})
            </h2>
            <div className="flex items-center gap-1.5 text-amber-500 font-bold text-xs lg:text-base shrink-0">
              <Star className="w-4 h-4 lg:w-5 lg:h-5 fill-current" />
              <span>{PRODUCT_PAGE_CONFIG.rating} / 5.0</span>
            </div>
          </div>

          {/* Existing Reviews (Paginated max 5 per page with smooth transition) */}
          <div className="overflow-hidden min-h-[380px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={reviewPage}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="space-y-3 w-full"
              >
                {currentReviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2 text-xs lg:text-base">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-[#2C3539] lg:text-base">{rev.author}</span>
                      <span className="text-slate-400 font-mono text-[10px] lg:text-sm">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 lg:w-4 lg:h-4 ${i < rev.rating ? 'fill-current' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium lg:text-base">"{rev.comment}"</p>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Review Pagination Buttons (Above Leave a Review Section) */}
          {localReviews.length > REVIEWS_PER_PAGE && (
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2 flex-wrap">
              <span className="text-[11px] sm:text-xs lg:text-sm font-semibold text-slate-500">
                Page {reviewPage + 1} of {totalReviewPages} ({reviewPage * REVIEWS_PER_PAGE + 1} - {Math.min((reviewPage + 1) * REVIEWS_PER_PAGE, localReviews.length)} of {localReviews.length})
              </span>

              <div className="flex items-center gap-2 ml-auto">
                {/* Back Button (Appears only after first click / when reviewPage > 0) */}
                {reviewPage > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setReviewDirection('prev');
                      setReviewPage((prev) => Math.max(0, prev - 1));
                    }}
                    className="py-1.5 px-3 bg-white border border-slate-300 hover:bg-slate-100 text-[#2C3539] text-xs lg:text-sm font-extrabold rounded-xl shadow-2xs transition-all flex items-center gap-1 active:scale-95 cursor-pointer touch-manipulation"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-[#2C3539]" />
                    <span>Back</span>
                  </button>
                )}

                {/* Next Button */}
                <button
                  type="button"
                  disabled={reviewPage >= totalReviewPages - 1}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (reviewPage < totalReviewPages - 1) {
                      setReviewDirection('next');
                      setReviewPage((prev) => Math.min(totalReviewPages - 1, prev + 1));
                    }
                  }}
                  className={`py-1.5 px-3.5 text-xs lg:text-sm font-extrabold rounded-xl transition-all flex items-center gap-1 touch-manipulation ${
                    reviewPage >= totalReviewPages - 1
                      ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60'
                      : 'bg-[#2B080C] hover:bg-[#380B0F] text-white shadow-xs active:scale-95 cursor-pointer'
                  }`}
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Write a Review Form - Conditional based on Purchase History & Quota */}
          {purchasedCount === 0 ? (
            <div className="p-5 sm:p-6 bg-slate-50 border border-slate-200 text-[#2C3539] rounded-2xl space-y-3 pt-4 shadow-2xs">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl shrink-0">
                  <Lock className="w-5 h-5 lg:w-6 lg:h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-bold text-sm lg:text-lg text-[#2C3539]">Leave a Review (Verified Buyers Only)</h3>
                  <p className="text-xs lg:text-sm text-slate-600 leading-relaxed">
                    You must purchase this product before leaving a review. Once ordered, you can submit verified feedback for each purchase!
                  </p>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={handleBuyNowAction}
                      className="px-4 py-2 bg-[#2B080C] hover:bg-[#380B0F] text-white text-xs lg:text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                      <span>Buy Now to Unlock Review</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : remainingReviewsAllowed === 0 ? (
            <div className="p-5 sm:p-6 bg-emerald-50 border border-emerald-200 text-[#2C3539] rounded-2xl space-y-3 pt-4 shadow-2xs">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl shrink-0">
                  <CheckCircle2 className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-700" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm lg:text-lg text-emerald-950">Thank you for your feedback!</h3>
                    <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 font-extrabold text-[10px] lg:text-xs rounded-md">
                      {userSubmittedCount}/{purchasedCount} Reviews Submitted
                    </span>
                  </div>
                  <p className="text-xs lg:text-sm text-slate-600 leading-relaxed">
                    You have submitted feedback for all your purchases of this product. If you purchase this product again in the future, you will unlock another review attempt!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 sm:p-6 bg-[#2B080C]/5 border border-[#2B080C]/15 text-[#2C3539] rounded-2xl space-y-4 pt-4 shadow-2xs">
              <div className="border-b border-[#2B080C]/10 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs lg:text-sm mb-0.5">
                    <CheckCircle2 className="w-4 h-4 lg:w-5 lg:h-5 fill-emerald-100 text-emerald-700" />
                    <span>Verified Purchaser</span>
                  </div>
                  <h3 className="font-bold text-sm lg:text-lg text-[#2C3539]">Leave a Review</h3>
                </div>
                <div className="px-3 py-1 bg-amber-100 border border-amber-300 text-amber-900 rounded-xl text-[11px] lg:text-xs font-bold self-start sm:self-auto">
                  Remaining Reviews: {remainingReviewsAllowed} of {purchasedCount} purchase(s)
                </div>
              </div>

              <form onSubmit={handleAddReview} className="space-y-3 text-xs lg:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">Your Name</label>
                    <input
                      type="text"
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      placeholder="e.g. Tanvir Hossain"
                      className="w-full p-2.5 bg-white border-2 border-slate-300 focus:border-[#2B080C] rounded-xl text-[#2C3539] outline-none font-medium transition-all text-xs lg:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">Rating</label>
                    <select
                      value={newReviewRating}
                      onChange={(e) => setNewReviewRating(Number(e.target.value))}
                      className="w-full p-2.5 bg-white border-2 border-slate-300 focus:border-[#2B080C] rounded-xl text-[#2C3539] outline-none font-medium cursor-pointer transition-all text-xs lg:text-sm"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ 5 Stars - Excellent</option>
                      <option value={4}>⭐⭐⭐⭐ 4 Stars - Very Good</option>
                      <option value={3}>⭐⭐⭐ 3 Stars - Average</option>
                      <option value={2}>⭐⭐ 2 Stars - Poor</option>
                      <option value={1}>⭐ 1 Star - Very Bad</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Comment</label>
                  <textarea
                    rows={2}
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    placeholder="Write your feedback about the product..."
                    className="w-full p-2.5 bg-white border-2 border-slate-300 focus:border-[#2B080C] rounded-xl text-[#2C3539] outline-none font-medium transition-all text-xs lg:text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#2B080C] hover:bg-[#380B0F] text-white font-extrabold rounded-xl transition-all flex items-center gap-2 shadow-sm cursor-pointer active:scale-95 text-xs lg:text-sm"
                >
                  <Send className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                  <span>Submit Review</span>
                </button>
              </form>
            </div>
          )}
        </section>

        {/* ====================================================================
           6. COMBO PACKAGE SECTION
           ==================================================================== */}
        {PRODUCT_PAGE_CONFIG.comboPackage.enabled && (
          <section className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-8 space-y-5 border border-emerald-800 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800 pb-4">
              <div>
                <span className="text-[10px] font-bold bg-amber-400 text-[#2C3539] px-2.5 py-1 rounded-full uppercase tracking-wider">
                  🔥 Special Bundle Offer
                </span>
                <h2 className="text-xl font-extrabold text-white font-serif mt-1">
                  {PRODUCT_PAGE_CONFIG.comboPackage.title}
                </h2>
                <p className="text-xs text-emerald-200 mt-0.5">
                  {PRODUCT_PAGE_CONFIG.comboPackage.subtitle}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-emerald-400 block font-semibold">Combo Package Price:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-amber-300 font-mono">
                    ৳{PRODUCT_PAGE_CONFIG.comboPackage.comboPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-emerald-400/80 line-through font-mono">
                    ৳{PRODUCT_PAGE_CONFIG.comboPackage.originalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bundle items list */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {PRODUCT_PAGE_CONFIG.comboPackage.items.map((item, idx) => (
                <div key={idx} className="p-3 bg-emerald-900/60 border border-emerald-700/60 rounded-2xl flex items-center gap-3">
                  <Gift className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <p className="font-bold text-white">{item.name}</p>
                    <span className="text-emerald-300 font-mono">{item.price}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleBuyNowAction}
              className="w-full py-4 bg-amber-400 hover:bg-amber-300 text-[#2C3539] font-black text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Buy Combo Package Now</span>
              <Zap className="w-4 h-4 fill-current text-[#2C3539]" />
            </button>
          </section>
        )}

        {/* ====================================================================
           7. RELATED PRODUCTS SECTION
           ==================================================================== */}
        <section className="space-y-4 pt-2">
          <h2 className="text-xl font-extrabold text-[#2C3539] font-serif">
            Related Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {relatedItems.map((relItem) => (
              <ProductCard key={relItem.id} product={relItem} />
            ))}
          </div>
        </section>

      </div>

      {/* ====================================================================
         8. STICKY BAR (FLOATING AT BOTTOM ON SCROLL)
         ==================================================================== */}
      <div
        className={`fixed bottom-16 md:bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl p-3 sm:p-4 transition-all duration-300 ease-in-out ${
          isStickyVisible
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-[1536px] mx-auto flex items-center justify-between gap-3">
          
          {/* Product Thumbnail & Details */}
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={currentDisplayImage}
              alt={displayTitle}
              className="w-11 h-11 sm:w-12 sm:h-12 object-cover rounded-xl border border-slate-200 shrink-0"
            />
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-extrabold text-[#2C3539] truncate">
                {displayTitle}
              </h4>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                <span className="text-[#2B080C] font-extrabold">৳{displayPrice.toFixed(2)}</span>
                <span className="hidden sm:inline">| Color: {selectedColor} | Size: {selectedSize}</span>
              </div>
            </div>
          </div>

          {/* Buttons: Add to Cart + Buy Now */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleAddToCartAction}
              className="hidden xs:flex px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-all items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-white" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={handleBuyNowAction}
              className="px-5 py-2.5 bg-[#2B080C] hover:bg-[#380B0F] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4 fill-current text-amber-300" />
              <span>Buy Now</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
