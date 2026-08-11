import React, { useState, useMemo } from 'react';
import { PRODUCTS, CATEGORIES } from '../data/mockData';
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
    selectedCategory,
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory,
    searchQuery,
    setSearchQuery
  } = useStore();

  const [priceRange, setPriceRange] = useState<number>(250);
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
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
  }, [selectedCategory, selectedSubCategory, priceRange, minRating, onlyInStock, searchQuery, sortBy]);

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

  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E7EB]">
          <div>
            <span className="text-xs font-bold text-[#2B080C] uppercase tracking-widest font-mono">
              {brandConfig.brandName} Catalog
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] font-serif">
              {selectedCategory === 'all'
                ? 'All Products Catalog'
                : CATEGORIES.find((c) => c.id === selectedCategory)?.name || 'Product Listing'}
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
              Showing {filteredProducts.length} items with instant availability & Cash on Delivery support
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden px-4 py-2 bg-[#2B080C] text-white font-bold text-xs rounded-xl flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters ({filteredProducts.length})
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700">
              <span className="text-slate-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured / Best Sellers</option>
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
        {/* Sidebar Filters */}
        <aside
          className={`lg:block ${
            showMobileFilters ? 'block' : 'hidden'
          } bg-[#F9FAFB] border border-[#E5E7EB] p-6 rounded-3xl space-y-6 h-fit sticky top-24`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
            <h3 className="font-bold text-[#111827] text-base flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#2B080C]" /> Filter Catalog
            </h3>
          </div>

          {/* Reusable Contextual Dynamic Category & Sub-Category Sidebar */}
          <CategorySidebar />

          {/* Price Range Slider */}
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
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>৳20</span>
              <span>৳250</span>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2 pt-4 border-t border-slate-200">
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
              Minimum Rating
            </label>
            <div className="space-y-1">
              {[4.8, 4.5, 4.0].map((r) => (
                <button
                  key={r}
                  onClick={() => setMinRating(minRating === r ? 0 : r)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between border ${
                    minRating === r
                      ? 'bg-amber-50 text-amber-900 border-amber-300 font-bold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{r}+ Stars</span>
                  </div>
                  {minRating === r && <span className="text-[10px] font-bold text-amber-700">Active</span>}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Cards Grid */}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
