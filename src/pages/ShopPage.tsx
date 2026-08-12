import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { useBrand } from '../context/BrandContext';
import { CategoryId } from '../types';
import { ProductCard } from '../components/ProductCard';
import { CategorySidebar } from '../components/CategorySidebar';
import {
  SlidersHorizontal,
  Search,
  X,
  Star,
  Grid,
  List,
  ChevronDown,
  RotateCcw
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { brandConfig } = useBrand();
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory,
    searchQuery,
    setSearchQuery,
    isLoading
  } = useStore();

  const [priceRange, setPriceRange] = useState<number>(250);
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;

      // Sub-category filter
      if (selectedSubCategory && p.subCategory !== selectedSubCategory) return false;

      // Price filter
      if (p.price > priceRange) return false;

      // Rating filter
      if (minRating > 0 && p.rating < minRating) return false;

      // Stock filter
      if (onlyInStock && p.stock <= 0) return false;

      // Search keyword filter
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesCat = p.categoryName.toLowerCase().includes(query);
        const matchesSub = p.subCategory ? p.subCategory.toLowerCase().includes(query) : false;
        const matchesTags = p.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesCat && !matchesSub && !matchesTags) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured default
    });
  }, [products, selectedCategory, selectedSubCategory, priceRange, minRating, onlyInStock, searchQuery, sortBy]);

  const clearFilters = () => {
    setSelectedCategory('all', null);
    setSelectedSubCategory(null);
    setPriceRange(250);
    setMinRating(0);
    setOnlyInStock(false);
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    Boolean(selectedSubCategory) ||
    priceRange < 250 ||
    minRating > 0 ||
    onlyInStock ||
    searchQuery.length > 0;

  if (isLoading) {
    return (
      <div className="max-w-[1536px] mx-auto px-4 pt-3 pb-8 sm:pt-8 animate-pulse">
        <div className="h-24 bg-slate-200 rounded-2xl w-full mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="hidden lg:block h-[600px] bg-slate-200 rounded-3xl w-full"></div>
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-slate-200 rounded-2xl w-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-8 sm:pt-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
          <div>
            <span className="text-xs font-bold text-[#2B080C] uppercase tracking-widest font-mono">
              {brandConfig.brandName} Catalog
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111827] font-serif">
              {selectedCategory === 'all'
                ? 'All Products Catalog'
                : categories.find((c) => c.id === selectedCategory)?.name || 'Product Listing'}
            </h1>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Showing {filteredProducts.length} items with instant availability & Cash on Delivery support
            </p>
          </div>

          {/* Dual Action Pills for Mobile & Desktop */}
          <div className="flex items-center gap-2">
            {/* Filter Pill */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex-1 sm:flex-none px-4 py-2.5 bg-[#0B0E14] text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-sm"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-300" />
              <span>Filter ({filteredProducts.length})</span>
            </button>

            {/* Sort Pill */}
            <div className="flex-1 sm:flex-none flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-slate-800">
              <span className="text-slate-400 font-normal hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer w-full"
              >
                <option value="featured">Sort</option>
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Catalog Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block bg-[#F9FAFB] border border-[#E5E7EB] p-6 rounded-3xl space-y-6 h-fit sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
            <h3 className="font-bold text-[#111827] text-base flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#2B080C]" /> Filter Catalog
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-[#2B080C] hover:underline font-bold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          <CategorySidebar />

          <div className="space-y-2 pt-4 border-t border-slate-200">
            <div className="flex justify-between text-xs font-bold text-slate-900">
              <span>Max Price:</span>
              <span className="font-mono text-emerald-700">৳{priceRange}</span>
            </div>
            <input
              type="range"
              min="20"
              max="250"
              step="10"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-[#2B080C] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>৳20</span>
              <span>৳250</span>
            </div>
          </div>
        </aside>

        {/* Mobile Slide-Up Bottom Sheet Filter Drawer Overlay */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden bg-slate-900/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in">
            <div className="bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto p-5 space-y-6 shadow-2xl border-t border-slate-200 animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 sticky top-0 bg-white z-10 pt-1">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#2B080C]" />
                  <h3 className="font-extrabold text-slate-900 text-lg font-serif">Filter Products</h3>
                </div>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category Options */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Categories</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  <label
                    onClick={() => setSelectedCategory('all', null)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer text-sm font-semibold text-slate-800"
                  >
                    <input
                      type="radio"
                      name="catFilter"
                      checked={selectedCategory === 'all'}
                      onChange={() => setSelectedCategory('all', null)}
                      className="accent-[#2B080C]"
                    />
                    <span>All Categories</span>
                  </label>
                  {categories.map((cat) => (
                    <label
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id as CategoryId, null)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer text-sm font-semibold text-slate-800"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="catFilter"
                          checked={selectedCategory === cat.id}
                          onChange={() => setSelectedCategory(cat.id as CategoryId, null)}
                          className="accent-[#2B080C]"
                        />
                        <span>{cat.name}</span>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">{cat.itemCount}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <div className="flex justify-between text-xs font-bold text-slate-900">
                  <span>Price Range</span>
                  <span className="font-mono text-[#2B080C]">Up to ৳{priceRange}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="250"
                  step="10"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#2B080C] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>৳20</span>
                  <span>৳250</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex gap-3">
                <button
                  onClick={clearFilters}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 py-3 bg-[#2B080C] hover:bg-[#380B0F] text-white font-bold text-xs rounded-xl shadow-lg transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Cards Grid - 2 Column Grid on Mobile */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center space-y-4">
              <Search className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">No products matched your filter criteria</h3>
                <p className="text-xs text-slate-500">
                  Try adjusting the price slider or clear your search terms to see more options.
                </p>
              </div>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
