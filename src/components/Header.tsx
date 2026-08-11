import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useBrand } from '../context/BrandContext';
import { LogoContainer } from './LogoContainer';
import { PRODUCTS, CATEGORIES } from '../data/mockData';
import { CategoryId } from '../types';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Percent,
  Truck,
  ShieldCheck,
  Tag,
  ArrowRight,
  Smile,
  Package,
  Star,
  XCircle,
  LogOut
} from 'lucide-react';

export const Header: React.FC = () => {
  const { brandConfig } = useBrand();
  const {
    view,
    setView,
    pathname,
    selectedCategory,
    setSelectedCategory,
    cart,
    wishlist,
    setIsCartDrawerOpen,
    setIsAccountModalOpen,
    navigateToProduct,
    navigateToCategory,
    navigateToAccount,
    showToast,
    searchQuery,
    setSearchQuery,
    subtotal
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const accountTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isAccountClickOpenedRef = useRef<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const accountDropdownRef = useRef<HTMLDivElement>(null);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const hiddenRoutes = ['/account', '/user-portal', '/product', '/p/', '/checkout'];
  const activePath = pathname || (typeof window !== 'undefined' ? window.location.pathname : '');
  const isHiddenByPath = hiddenRoutes.some((route) => activePath.startsWith(route));
  const isHiddenByView = view === 'account' || view === 'product' || view === 'checkout';
  const shouldHideCategoryBar = isHiddenByView || isHiddenByPath;

  const handleAccountMouseEnter = () => {
    if (accountTimeoutRef.current) {
      clearTimeout(accountTimeoutRef.current);
      accountTimeoutRef.current = null;
    }
    setIsAccountDropdownOpen(true);
  };

  const handleAccountMouseLeave = () => {
    if (isAccountClickOpenedRef.current) return;
    if (accountTimeoutRef.current) {
      clearTimeout(accountTimeoutRef.current);
    }
    accountTimeoutRef.current = setTimeout(() => {
      setIsAccountDropdownOpen(false);
    }, 200);
  };

  const handleAccountClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (accountTimeoutRef.current) {
      clearTimeout(accountTimeoutRef.current);
      accountTimeoutRef.current = null;
    }
    setIsAccountDropdownOpen((prev) => {
      const next = !prev;
      isAccountClickOpenedRef.current = next;
      return next;
    });
  };

  const closeAccountDropdown = () => {
    if (accountTimeoutRef.current) {
      clearTimeout(accountTimeoutRef.current);
      accountTimeoutRef.current = null;
    }
    setIsAccountDropdownOpen(false);
    isAccountClickOpenedRef.current = false;
  };

  // Filter products for search autocomplete
  const searchResults = searchQuery.trim().length > 0
    ? PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  // Close search and account dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
        closeAccountDropdown();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (accountTimeoutRef.current) {
        clearTimeout(accountTimeoutRef.current);
      }
    };
  }, []);

  const handleCategoryClick = (catId: CategoryId) => {
    setSelectedCategory(catId);
    setView('shop');
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      {/* Top Announcement Bar */}
      {showAnnouncement && (
        <div className="bg-[#0B0E14] text-slate-300 text-xs py-2 px-4">
          <div className="max-w-[1536px] mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
              <span className="bg-[#2B080C] text-white font-bold px-2.5 py-0.5 rounded text-[10px] tracking-wider uppercase">
                Flash Offer
              </span>
              <span className="truncate">
                ⚡ Use code <strong className="text-white font-bold">WELCOME10</strong> for 10% OFF | Free Express Delivery over ৳60 | Cash on Delivery Available
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-4 shrink-0 text-slate-400">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-slate-200" /> Fast Delivery
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-200" /> 100% Authentic
              </span>
              <button
                onClick={() => setShowAnnouncement(false)}
                className="hover:text-white p-0.5"
                title="Dismiss announcement"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Header */}
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-6">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#111827] hover:text-[#0B0E14] hover:bg-slate-100 rounded-lg"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <button
              onClick={() => {
                setSelectedCategory('all');
                setView('home');
              }}
              className="flex items-center group text-left focus:outline-none"
              aria-label={`${brandConfig?.brandName || 'Vamos'} Home`}
            >
              <LogoContainer variant="light" size="md" />
            </button>
          </div>

          {/* Desktop Search Bar with Live Predictive Autocomplete */}
          <div className="hidden md:block flex-1 max-w-xl relative" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search products, brands, categories (e.g. Headphones, Hoodies)..."
                className="w-full pl-10 pr-10 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full text-sm text-[#111827] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#2B080C] focus:bg-white transition-all shadow-xs"
              />
              <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-3" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-[#6B7280] hover:text-[#111827]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Predictive Search Dropdown */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 text-xs font-semibold text-[#6B7280] uppercase tracking-wider flex justify-between">
                  <span>Search Suggestions</span>
                  <span>{searchResults.length} results</span>
                </div>
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      navigateToProduct(product.id);
                      setIsSearchFocused(false);
                      setSearchQuery('');
                    }}
                    className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-[#F9FAFB] transition-colors text-left"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-lg border border-[#E5E7EB]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#111827] truncate">{product.name}</p>
                      <p className="text-xs text-[#6B7280]">{product.categoryName}</p>
                    </div>
                    <span className="text-sm font-bold text-[#111827]">৳{product.price.toFixed(2)}</span>
                  </button>
                ))}
                <button
                  onClick={() => {
                    setView('shop');
                    setIsSearchFocused(false);
                  }}
                  className="w-full text-center py-2 bg-[#F9FAFB] hover:bg-slate-100 text-xs font-semibold text-[#2B080C] border-t border-[#E5E7EB]"
                >
                  View all search results in store →
                </button>
              </div>
            )}
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wishlist Button */}
            <button
              onClick={() => {
                setView('wishlist');
              }}
              className={`relative p-2.5 text-[#111827] hover:text-[#0B0E14] hover:bg-slate-100 rounded-full transition-colors ${
                view === 'wishlist' ? 'bg-slate-100 text-[#2B080C]' : ''
              }`}
              title="View Wishlist"
            >
              <Heart className={`w-5 h-5 ${view === 'wishlist' ? 'fill-current text-[#2B080C]' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#2B080C] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account Profile Dropdown Trigger & Floating Card */}
            <div
              className="relative"
              ref={accountDropdownRef}
              onMouseEnter={handleAccountMouseEnter}
              onMouseLeave={handleAccountMouseLeave}
            >
              <button
                onClick={handleAccountClick}
                className={`flex items-center gap-2 p-2 sm:px-3.5 sm:py-2 text-[#111827] hover:text-[#0B0E14] hover:bg-slate-100 rounded-full transition-colors ${
                  isAccountDropdownOpen ? 'bg-slate-100 text-[#2B080C]' : ''
                }`}
                title="Account & Profile Menu"
                aria-expanded={isAccountDropdownOpen}
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline text-xs font-semibold">Account</span>
              </button>

              {/* Floating Profile Dropdown Card Container with pt-2 hit area bridge */}
              {isAccountDropdownOpen && (
                <div
                  className="absolute top-full right-0 pt-2 z-50 pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseEnter={handleAccountMouseEnter}
                  onMouseLeave={handleAccountMouseLeave}
                >
                  <div className="w-64 sm:w-72 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 relative">
                    {/* Top Pointer Arrow */}
                    <div className="absolute -top-1.5 right-6 sm:right-8 w-3 h-3 bg-white border-t border-l border-slate-200/80 rotate-45 z-10" />

                    {/* Vertical Menu Items */}
                    <div className="relative z-20 space-y-0.5 px-1.5">
                      {/* 1. Manage My Account */}
                      <button
                        onClick={() => {
                          closeAccountDropdown();
                          navigateToAccount('overview');
                        }}
                        className="w-full flex items-center gap-3.5 px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl transition-colors text-left group"
                      >
                        <Smile className="w-5 h-5 text-slate-500 group-hover:text-slate-900 stroke-[1.5] shrink-0" />
                        <span>Manage My Account</span>
                      </button>

                      {/* 2. My Orders */}
                      <button
                        onClick={() => {
                          closeAccountDropdown();
                          navigateToAccount('orders');
                        }}
                        className="w-full flex items-center gap-3.5 px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl transition-colors text-left group"
                      >
                        <Package className="w-5 h-5 text-slate-500 group-hover:text-slate-900 stroke-[1.5] shrink-0" />
                        <span>My Orders</span>
                      </button>

                      {/* 3. My Reviews */}
                      <button
                        onClick={() => {
                          closeAccountDropdown();
                          navigateToAccount('reviews');
                        }}
                        className="w-full flex items-center gap-3.5 px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl transition-colors text-left group"
                      >
                        <Star className="w-5 h-5 text-slate-500 group-hover:text-amber-500 stroke-[1.5] shrink-0" />
                        <span>My Reviews</span>
                      </button>

                      {/* 4. My Returns & Cancellations */}
                      <button
                        onClick={() => {
                          closeAccountDropdown();
                          navigateToAccount('returns');
                        }}
                        className="w-full flex items-center gap-3.5 px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl transition-colors text-left group"
                      >
                        <XCircle className="w-5 h-5 text-slate-500 group-hover:text-slate-900 stroke-[1.5] shrink-0" />
                        <span>My Returns & Cancellations</span>
                      </button>

                      {/* 5. Logout */}
                      <button
                        onClick={() => {
                          closeAccountDropdown();
                          showToast('Logged out successfully', 'info');
                          setView('home');
                          window.history.pushState({}, '', '/');
                        }}
                        className="w-full flex items-center gap-3.5 px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:text-rose-600 hover:bg-rose-50/70 rounded-xl transition-colors text-left border-t border-slate-100 mt-1 pt-2.5 group"
                      >
                      <LogOut className="w-5 h-5 text-slate-500 group-hover:text-rose-600 stroke-[1.5] shrink-0" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

            {/* Cart Drawer Trigger Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-2.5 px-3.5 py-2 bg-[#2B080C] hover:bg-[#380B0F] text-white rounded-full transition-all shadow-sm hover:shadow-md"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-white" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-white text-[#2B080C] font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-bold border-l border-white/20 pl-2.5 text-white">
                ৳{subtotal.toFixed(2)}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden mt-3 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products & categories..."
            className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-slate-400">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Desktop Category Bar */}
        {!shouldHideCategoryBar && (
          <nav className="hidden lg:flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-sm font-medium">
            <div className="flex items-center gap-8 text-slate-600">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setView('home');
                }}
                className={`hover:text-slate-900 transition-colors pb-1 border-b-2 ${
                  view === 'home' && selectedCategory === 'all'
                    ? 'border-slate-900 text-slate-900 font-semibold'
                    : 'border-transparent'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setView('shop');
                }}
                className={`hover:text-[#111827] transition-colors pb-1 border-b-2 ${
                  view === 'shop' && selectedCategory === 'all'
                    ? 'border-[#2B080C] text-[#2B080C] font-semibold'
                    : 'border-transparent'
                }`}
              >
                Shop All Catalog
              </button>

              {CATEGORIES.map((cat) => (
                <div key={cat.id} className="relative group">
                  <button
                    onClick={() => handleCategoryClick(cat.id as CategoryId)}
                    className={`hover:text-[#111827] transition-colors pb-1 border-b-2 flex items-center gap-1 py-1 ${
                      view === 'shop' && selectedCategory === cat.id
                        ? 'border-[#2B080C] text-[#2B080C] font-semibold'
                        : 'border-transparent text-slate-700'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400 group-hover:rotate-180 transition-transform" />
                  </button>

                  {/* Sub-category Hover Dropdown */}
                  <div className="absolute top-full left-0 hidden group-hover:block w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono border-b border-slate-100 mb-1">
                      {cat.name} Sub-categories
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCategory(cat.id as CategoryId, null);
                        setView('shop');
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs font-bold text-[#2B080C] hover:bg-slate-50 flex items-center justify-between"
                    >
                      <span>All {cat.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({PRODUCTS.filter((p) => p.category === cat.id).length})
                      </span>
                    </button>
                    {cat.subCategories.map((sub) => {
                      const subCount = PRODUCTS.filter(
                        (p) => p.category === cat.id && p.subCategory === sub.id
                      ).length;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setSelectedCategory(cat.id as CategoryId, sub.id);
                            setView('shop');
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-[#2B080C] hover:bg-slate-50 flex items-center justify-between pl-5"
                        >
                          <span>{sub.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({subCount})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setSelectedCategory('all');
                setView('shop');
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#2B080C] bg-[#2B080C]/10 hover:bg-[#2B080C]/20 border border-[#2B080C]/20 px-3 py-1.5 rounded-full transition-colors"
            >
              Special Deals & Flash Sale
            </button>
          </nav>
        )}
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col p-5 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <LogoContainer
                variant="light"
                size="sm"
                onClick={() => {
                  setSelectedCategory('all');
                  setView('home');
                  setIsMobileMenuOpen(false);
                }}
              />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-slate-500 hover:text-slate-900"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="py-4 space-y-1">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setView('home');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl font-medium text-sm flex items-center justify-between ${
                  view === 'home' ? 'bg-slate-900 text-white font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Home Page</span>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>

              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setView('shop');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl font-medium text-sm flex items-center justify-between ${
                  view === 'shop' && selectedCategory === 'all'
                    ? 'bg-slate-900 text-white font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Shop All Catalog</span>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>

              <button
                onClick={() => {
                  setView('wishlist');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl font-medium text-sm flex items-center justify-between ${
                  view === 'wishlist'
                    ? 'bg-slate-900 text-white font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>My Wishlist</span>
                  {wishlist.length > 0 && (
                    <span className="px-2 py-0.5 bg-[#2B080C] text-white text-[10px] font-extrabold rounded-full">
                      {wishlist.length}
                    </span>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>

              <div className="pt-3 pb-1 text-xs font-bold text-slate-400 uppercase tracking-wider px-3">
                Categories
              </div>

              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id as CategoryId)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl font-medium text-sm flex items-center justify-between ${
                    view === 'shop' && selectedCategory === cat.id
                      ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{cat.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
              ))}
            </div>

            <div className="mt-auto pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => {
                  navigateToAccount('overview');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold text-slate-800 bg-slate-100 rounded-xl hover:bg-slate-200"
              >
                <User className="w-4 h-4" /> Account & Orders
              </button>
              <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-900 font-medium">
                🚚 Free shipping on orders over ৳60. Cash on Delivery Available!
              </div>
            </div>
          </div>

          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};
