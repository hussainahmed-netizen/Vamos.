import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { products, wishlist, setView, toggleWishlist, addToCart, showToast } = useStore();

  const favoritedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleAddAllToCart = () => {
    if (favoritedProducts.length === 0) return;
    favoritedProducts.forEach((product) => {
      addToCart(product, 1, product.colors?.[0]?.name);
    });
    showToast(`Added ${favoritedProducts.length} items to your cart!`, 'success');
  };

  const handleClearWishlist = () => {
    if (favoritedProducts.length === 0) return;
    wishlist.forEach((id) => toggleWishlist(id));
    showToast('Wishlist cleared', 'info');
  };

  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-8 sm:pt-8 space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 sm:p-8 sm:bg-white sm:border sm:border-slate-200/80 sm:rounded-3xl sm:shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-[#2B080C]/10 text-[#2B080C] rounded-xl hidden md:inline-flex">
              <Heart className="w-5 h-5 fill-current" />
            </span>
            <span className="text-xs font-bold text-[#2B080C] uppercase tracking-widest font-mono">
              Saved Products
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111827] font-serif">
            My Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {favoritedProducts.length === 0
              ? 'Save items you love to find them easily later.'
              : `You have ${favoritedProducts.length} ${favoritedProducts.length === 1 ? 'item' : 'items'} saved in your favorites list.`}
          </p>
        </div>

        {favoritedProducts.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleClearWishlist}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
              title="Clear all wishlist items"
            >
              <Trash2 className="w-4 h-4 text-slate-500" />
              <span>Clear Wishlist</span>
            </button>

            <button
              onClick={handleAddAllToCart}
              className="px-5 py-2.5 bg-[#2B080C] hover:bg-[#380B0F] text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add All to Cart</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content Grid or Empty State */}
      {favoritedProducts.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-700">
              Saved Items ({favoritedProducts.length})
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-5">
            {favoritedProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in-up opacity-0"
                style={{
                  animationDelay: `${index * 60}ms`,
                  animationFillMode: 'forwards',
                }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-16 text-center space-y-5 max-w-2xl mx-auto shadow-xs">
          <div className="w-20 h-20 bg-[#2B080C]/10 text-[#2B080C] rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Heart className="w-10 h-10 stroke-[1.5]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
              Your wishlist is currently empty
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Explore our catalog and save your favorite products by tapping the heart icon on any item. They’ll be ready for you here anytime.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setView('shop')}
              className="px-8 py-3.5 bg-[#2B080C] hover:bg-[#380B0F] text-white text-xs sm:text-sm font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl hover:scale-105 inline-flex items-center gap-2.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Browse Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
