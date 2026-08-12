import React, { useState, useEffect, useRef } from 'react';
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
  CheckCircle2
} from 'lucide-react';

/* ==========================================================================
   PRODUCT PAGE CONFIGURATION BLOCK (EDITABLE VALUES FOR NON-CODERS)
   ==========================================================================
   Edit any value below to update the Product Details Page content instantly.
   -------------------------------------------------------------------------- */
const PRODUCT_PAGE_CONFIG = {
  // 1. Basic Product Details
  name: 'Acoustic Pro Wireless Headphones (প্রিমিয়াম অন-ইয়ার হেডফোন)',
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
    title: 'অফার শেষ হতে বাকি (Offer ends in):',
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
    'Hybrid Active Noise Cancellation (ANC) up to -35dB (অ্যাডভান্সড নয়েজ ক্যানসেলেশন)',
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
    'Warranty': '1 Year Official Warranty (১ বছরের অফিসিয়াল ওয়ারেন্টি)',
  },

  // 7. Size Chart Settings (Optional for Clothing/Apparel)
  // --------------------------------------------------------------------------
  // HOW TO TOGGLE SIZE CHART:
  // Set `showSizeChart: true` to display the Size Chart section.
  // Set `showSizeChart: false` to completely remove it from the page.
  // --------------------------------------------------------------------------
  showSizeChart: true,
  sizeChart: {
    title: 'Size Guide & Measurement Chart (সাইজ নির্দেশিকা)',
    headers: ['Size', 'Ear Cup Diameter', 'Headband Span', 'Recommended Fit'],
    rows: [
      ['Standard', '75 mm', '28 - 34 cm', 'Universal Daily Fit'],
      ['Pro Foam Cushion', '82 mm', '30 - 36 cm', 'Extra Comfort Over-Ear'],
      ['XL Studio Cushion', '90 mm', '32 - 38 cm', 'Max Isolation & Studio Fit'],
    ],
  },

  // 8. Delivery Details & COD Info
  delivery: {
    insideDhaka: '৳৬০ (ঢাকায় ১-২ দিনের মধ্যে ডেলিভারি)',
    outsideDhaka: '৳১২০ (ঢাকার বাইরে ২-৩ দিনের মধ্যে ডেলিভারি)',
    timeframe: '১ থেকে ৩ কার্যদিবসের মধ্যে ডেলিভারি সম্পন্ন হয়',
    codAvailable: true,
    codDescription:
      'ক্যাশ অন ডেলিভারি সুবিধা আছে। পার্সেল ডেলিভারি ম্যানের সামনে খুলে দেখে চেক করে মূল্য পরিশোধ করুন।',
  },

  // 9. Combo Package Deal
  comboPackage: {
    enabled: true,
    title: 'Special Value Combo Package (স্পেশাল কম্বো অফার)',
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
    showToast,
    isLoading
  } = useStore();

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
        setIsStickyVisible(!entry.isIntersecting);
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
  const [localReviews, setLocalReviews] = useState([
    {
      id: 'r-101',
      author: 'Tanvir Hossain (তানভীর হোসেন)',
      rating: 5,
      date: 'Yesterday',
      comment:
        'অসাধারণ হেডফোন! সাউন্ড কোয়ালিটি এবং বেস খুব জোস। ক্যাশ অন ডেলিভারিতে ১ দিনেই হাতে পেয়েছি। ধন্যবাদ!',
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
  ]);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
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
    setNewReviewAuthor('');
    setNewReviewComment('');
    setNewReviewRating(5);
    showToast('ধন্যবাদ! আপনার রিভিউ সফলভাবে জমা হয়েছে। (Review submitted!)', 'success');
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

  return (
    <div className="font-['Hind_Siliguri','Plus_Jakarta_Sans',sans-serif] bg-slate-50 text-slate-900 pb-28 sm:pb-24 animate-in fade-in duration-300">
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
              <h1 className="text-xl sm:text-2xl font-black text-[#111827] leading-tight mb-0.5">
                {displayTitle}
              </h1>
              <p className="text-xs text-[#6B7280] mb-1">{displaySubtitle}</p>
            </div>

            {/* Review Summary */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>⭐ {displayRating}</span>
              </div>
              <span className="text-[#6B7280] text-xs font-semibold">
                | {displayReviews} Reviews (গ্রাহক রিভিউ)
              </span>
            </div>

            {/* Pricing Section */}
            <div className="py-2 px-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-[#6B7280] block font-semibold leading-none mb-0.5">
                  স্পেশাল অফার মূল্য:
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#2B080C] font-mono leading-none">
                    ৳{displayPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-[#6B7280] line-through font-mono">
                    ৳{displayOriginalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
              <span className="bg-[#2B080C] text-white text-xs font-extrabold px-2.5 py-1 rounded-full border border-[#2B080C]">
                {PRODUCT_PAGE_CONFIG.discountPercentage} ছাড়
              </span>
            </div>

            {/* Countdown Timer */}
            {PRODUCT_PAGE_CONFIG.offerTimer.enabled && (
              <div className="bg-amber-50/90 border border-amber-300 py-1.5 px-3 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900">
                  <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                  <span>{PRODUCT_PAGE_CONFIG.offerTimer.title}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 text-center font-mono">
                  <div className="bg-white py-1 px-1 rounded-lg border border-amber-200 shadow-2xs">
                    <span className="block text-sm font-black text-[#111827] leading-none">{timer.days}</span>
                    <span className="text-[9px] text-[#6B7280] uppercase font-sans">Days</span>
                  </div>
                  <div className="bg-white py-1 px-1 rounded-lg border border-amber-200 shadow-2xs">
                    <span className="block text-sm font-black text-[#111827] leading-none">{timer.hours}</span>
                    <span className="text-[9px] text-[#6B7280] uppercase font-sans">Hours</span>
                  </div>
                  <div className="bg-white py-1 px-1 rounded-lg border border-amber-200 shadow-2xs">
                    <span className="block text-sm font-black text-[#111827] leading-none">{timer.mins}</span>
                    <span className="text-[9px] text-[#6B7280] uppercase font-sans">Mins</span>
                  </div>
                  <div className="bg-white py-1 px-1 rounded-lg border border-amber-200 shadow-2xs">
                    <span className="block text-sm font-black text-[#2B080C] leading-none">{timer.secs}</span>
                    <span className="text-[9px] text-[#6B7280] uppercase font-sans">Secs</span>
                  </div>
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div>
              {!PRODUCT_PAGE_CONFIG.isOutOfStock ? (
                <span className="inline-flex items-center gap-1.5 bg-[#2B080C]/10 text-[#2B080C] text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#2B080C]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2B080C] animate-ping" />
                  ✓ স্টকে আছে ({PRODUCT_PAGE_CONFIG.stockCount} টি পিস অবশিষ্ট আছে)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-900 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-rose-300">
                  ✕ স্টক আউট (Sold Out)
                </span>
              )}
            </div>

            {/* Variables / Options */}
            {PRODUCT_PAGE_CONFIG.colors && (
              <div className="space-y-1 mb-5">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  কালার অপশন (Select Color):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PRODUCT_PAGE_CONFIG.colors.map((col) => (
                    <button
                      key={col.name}
                      onClick={() => setSelectedColor(col.name)}
                      className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all ${
                        selectedColor === col.name
                          ? 'bg-[#0B0E14] text-white border-[#0B0E14] shadow-2xs'
                          : 'bg-white text-[#111827] border-[#E5E7EB] hover:border-slate-400'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: col.hex }} />
                      <span>{col.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {PRODUCT_PAGE_CONFIG.sizes && (
              <div className="space-y-1 mb-5">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  সাইজ ভ্যারিয়েন্ট (Select Size):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PRODUCT_PAGE_CONFIG.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-1 rounded-lg border text-xs font-bold transition-all ${
                        selectedSize === sz
                          ? 'bg-[#0B0E14] text-white border-[#0B0E14] shadow-2xs'
                          : 'bg-white text-[#111827] border-[#E5E7EB] hover:border-slate-400'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-1 mb-7">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                পরিমাণ (Quantity):
              </label>
              <div className="inline-flex items-center bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-0.5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 text-[#6B7280] hover:text-[#111827]"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-xs font-extrabold font-mono text-[#111827]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1.5 text-[#6B7280] hover:text-[#111827]"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Action Buttons: Add to Cart & Buy Now */}
            <div ref={mainCtaRef} className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 mt-2">
              <button
                onClick={handleAddToCartAction}
                className={`py-2.5 px-5 rounded-xl font-extrabold text-xs sm:text-sm border-2 transition-all flex items-center justify-center gap-2 ${
                  isAddedToCart
                    ? 'bg-[#0B0E14] text-white border-[#0B0E14]'
                    : 'bg-[#2B080C] hover:bg-[#380B0F] text-white border-[#2B080C] shadow-sm'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-white" />
                <span>{isAddedToCart ? 'Added to Cart!' : 'Add to Cart'}</span>
              </button>

              <button
                onClick={handleBuyNowAction}
                className="py-2.5 px-5 bg-white border-2 border-[#111827] hover:bg-[#111827] text-[#111827] hover:text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-2xs transition-all flex items-center justify-center"
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
            <h2 className="text-xl font-extrabold text-[#111827] font-serif flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#2B080C]" />
              পণ্যের বিস্তারিত বিবরণ (Product Description & Specs)
            </h2>
          </div>

          <p className="text-sm text-[#6B7280] leading-relaxed">
            {PRODUCT_PAGE_CONFIG.description}
          </p>

          {/* Key features checklist */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-extrabold text-[#111827]">মূল বৈশিষ্ট্যসমূহ (Key Features):</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {PRODUCT_PAGE_CONFIG.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] text-xs font-semibold text-[#111827]">
                  <Check className="w-4 h-4 text-[#2B080C] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Specifications table */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-extrabold text-slate-900">প্রযুক্তিগত বৈশিষ্ট্য (Specifications):</h3>
            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
              {Object.entries(PRODUCT_PAGE_CONFIG.specifications).map(([key, val]) => (
                <div key={key} className="flex p-3 bg-white even:bg-slate-50/60">
                  <span className="w-1/3 font-bold text-slate-700">{key}</span>
                  <span className="w-2/3 text-slate-900 font-mono font-medium">{val}</span>
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
              <h2 className="text-lg font-extrabold text-slate-900 font-serif">
                {PRODUCT_PAGE_CONFIG.sizeChart.title}
              </h2>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-bold">
                Optional Section
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-2xl overflow-hidden">
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
          <h2 className="text-lg font-extrabold text-[#111827] font-serif flex items-center gap-2 border-b border-slate-100 pb-3">
            <Truck className="w-5 h-5 text-[#2B080C]" />
            ডেলিভারি সংক্রান্ত তথ্য (Delivery Charges & Info)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl space-y-1">
              <div className="flex items-center gap-2 font-bold text-[#111827]">
                <MapPin className="w-4 h-4 text-[#2B080C]" />
                <span>ঢাকার ভিতরে ডেলিভারি চার্জ:</span>
              </div>
              <p className="font-mono text-[#2B080C] text-sm font-bold">
                {PRODUCT_PAGE_CONFIG.delivery.insideDhaka}
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Truck className="w-4 h-4 text-slate-600" />
                <span>ঢাকার বাইরে ডেলিভারি চার্জ:</span>
              </div>
              <p className="font-mono text-slate-900 text-sm font-bold">
                {PRODUCT_PAGE_CONFIG.delivery.outsideDhaka}
              </p>
            </div>
          </div>

          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-2 text-xs text-amber-950">
            <div className="flex items-center gap-2 font-bold">
              <Banknote className="w-4 h-4 text-amber-700" />
              <span>ক্যাশ অন ডেলিভারি (Cash on Delivery) সুবিধা:</span>
            </div>
            <p className="leading-relaxed">{PRODUCT_PAGE_CONFIG.delivery.codDescription}</p>
            <p className="font-semibold text-slate-700">
              ডেলিভারির সময়সীমা: <strong>{PRODUCT_PAGE_CONFIG.delivery.timeframe}</strong>
            </p>
          </div>
        </section>

        {/* ====================================================================
           5. REVIEWS SECTION (REVIEWS LIST + SUBMIT REVIEW FORM)
           ==================================================================== */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-extrabold text-slate-900 font-serif">
              গ্রাহক মূল্যায়ন ও রিভিউ ({localReviews.length})
            </h2>
            <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
              <Star className="w-4 h-4 fill-current" />
              <span>⭐ {PRODUCT_PAGE_CONFIG.rating} / 5.0</span>
            </div>
          </div>

          {/* Existing Reviews */}
          <div className="space-y-3">
            {localReviews.map((rev) => (
              <div key={rev.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-slate-900">{rev.author}</span>
                  <span className="text-slate-400 font-mono text-[10px]">{rev.date}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-slate-200'}`}
                    />
                  ))}
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">"{rev.comment}"</p>
              </div>
            ))}
          </div>

          {/* Write a Review Form */}
          <div className="p-5 sm:p-6 bg-[#2B080C]/5 border border-[#2B080C]/15 text-[#111827] rounded-2xl space-y-4 pt-4 shadow-2xs">
            <div className="border-b border-[#2B080C]/10 pb-2">
              <h3 className="font-bold text-sm text-[#111827]">একটি নতুন রিভিউ প্রদান করুন (Leave a Review)</h3>
              <p className="text-[11px] text-slate-500">
                (Note: Only buyers who purchased this product can leave verified feedback)
              </p>
            </div>

            <form onSubmit={handleAddReview} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">আপনার নাম (Your Name)</label>
                  <input
                    type="text"
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    placeholder="e.g. Tanvir Hossain"
                    className="w-full p-2.5 bg-white border-2 border-slate-300 focus:border-[#2B080C] rounded-xl text-slate-900 outline-none font-medium transition-all"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">রেটিং দিন (Rating)</label>
                  <select
                    value={newReviewRating}
                    onChange={(e) => setNewReviewRating(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border-2 border-slate-300 focus:border-[#2B080C] rounded-xl text-slate-900 outline-none font-medium cursor-pointer transition-all"
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
                <label className="block text-slate-700 mb-1 font-bold">আপনার অভিজ্ঞতা বা বক্তব্য (Comment)</label>
                <textarea
                  rows={2}
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="পণ্যটির মান ও অভিজ্ঞতা সম্পর্কে লিখুন..."
                  className="w-full p-2.5 bg-white border-2 border-slate-300 focus:border-[#2B080C] rounded-xl text-slate-900 outline-none font-medium transition-all"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#2B080C] hover:bg-[#380B0F] text-white font-extrabold rounded-xl transition-all flex items-center gap-2 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>রিভিউ জমা দিন (Submit Review)</span>
              </button>
            </form>
          </div>
        </section>

        {/* ====================================================================
           6. COMBO PACKAGE SECTION
           ==================================================================== */}
        {PRODUCT_PAGE_CONFIG.comboPackage.enabled && (
          <section className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-8 space-y-5 border border-emerald-800 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800 pb-4">
              <div>
                <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2.5 py-1 rounded-full uppercase tracking-wider">
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
                <span className="text-xs text-emerald-400 block font-semibold">কম্বো প্যাকেজ মূল্য:</span>
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
              className="w-full py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Buy Combo Package Now</span>
              <Zap className="w-4 h-4 fill-current text-slate-950" />
            </button>
          </section>
        )}

        {/* ====================================================================
           7. RELATED PRODUCTS SECTION
           ==================================================================== */}
        <section className="space-y-4 pt-2">
          <h2 className="text-xl font-extrabold text-slate-900 font-serif">
            সম্পর্কিত অন্যান্য পণ্য (Related Products)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl p-3 sm:p-4 transition-all duration-300 ease-in-out ${
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
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
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
