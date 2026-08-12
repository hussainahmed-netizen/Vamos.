import React, { useState } from 'react';
import { Search, X, Clock, TrendingUp, ArrowRight, Star } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CategoryId } from '../types';

export const MobileSearchModal: React.FC = () => {
  const {
    isMobileSearchOpen,
    setIsMobileSearchOpen,
    products,
    categories,
    navigateToProduct,
    navigateToCategory,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Wireless Headphones',
    'Mechanical Keyboard',
    'Smart Watch',
  ]);

  if (!isMobileSearchOpen) return null;

  const filteredProducts = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const handleSelectRecent = (term: string) => {
    setSearchQuery(term);
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
  };

  const handleProductClick = (productId: string) => {
    if (searchQuery.trim() && !recentSearches.includes(searchQuery.trim())) {
      setRecentSearches((prev) => [searchQuery.trim(), ...prev.slice(0, 4)]);
    }
    setIsMobileSearchOpen(false);
    navigateToProduct(productId);
  };

  const handleCategoryClick = (catId: CategoryId) => {
    setIsMobileSearchOpen(false);
    navigateToCategory(catId);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-bottom duration-200">
      {/* Top Header Bar */}
      <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-white sticky top-0 z-10">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, brands, categories..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-100/80 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2B080C] focus:bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setIsMobileSearchOpen(false)}
          className="p-2.5 text-slate-600 hover:text-slate-900 font-bold text-sm"
        >
          Close
        </button>
      </div>

      {/* Main Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* If user hasn't typed anything */}
        {!searchQuery.trim() ? (
          <>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Recent Searches
                  </h3>
                  <button
                    onClick={handleClearRecent}
                    className="text-xs text-slate-400 hover:text-slate-600 font-medium"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((term, i) => (
                    <div
                      key={i}
                      onClick={() => handleSelectRecent(term)}
                      className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-semibold text-slate-800">{term}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Categories */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Trending Categories
              </h3>
              <div className="space-y-2">
                {categories.slice(0, 5).map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id as CategoryId)}
                    className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-4 h-4 text-[#2B080C]" />
                      <span className="text-sm font-bold text-slate-800">{cat.name}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">{cat.itemCount} Items</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Live Results List */
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Results for "{searchQuery}"</span>
              <span>{filteredProducts.length} items found</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <p className="text-base font-bold text-slate-800">No products found</p>
                <p className="text-xs text-slate-500">Try searching with a different keyword or category.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className="py-3 flex items-center gap-3.5 hover:bg-slate-50 px-2 rounded-xl transition-colors cursor-pointer"
                  >
                    <img
                      src={product.images[0] || product.image}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded-xl bg-slate-100 border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {product.categoryName}
                      </p>
                      <h4 className="text-sm font-bold text-slate-900 truncate">{product.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm font-extrabold text-[#2B080C] font-mono">
                          ৳{product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-slate-400 line-through font-mono">
                            ৳{product.originalPrice.toFixed(2)}
                          </span>
                        )}
                        <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-current" /> {product.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
