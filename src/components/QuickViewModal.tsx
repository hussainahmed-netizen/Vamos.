import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Star, ShoppingBag, Check, ShieldCheck, Truck, ArrowRight, Heart } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    navigateToProduct,
    wishlist,
    toggleWishlist
  } = useStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  React.useEffect(() => {
    if (quickViewProduct) {
      setSelectedImage(0);
      setSelectedColor(quickViewProduct.colors?.[0]?.name);
      setSelectedSize(quickViewProduct.sizes?.[0]);
      setQuantity(1);
      setIsAdded(false);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const isWishlisted = wishlist.includes(quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity, selectedColor, selectedSize);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden relative border border-slate-200 max-h-[90vh] flex flex-col md:flex-row animate-in zoom-in-95 duration-200">
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Column */}
        <div className="md:w-1/2 p-6 bg-slate-50 flex flex-col justify-between">
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200/80 mb-4 bg-white">
            <img
              src={quickViewProduct.images[selectedImage] || quickViewProduct.images[0]}
              alt={quickViewProduct.name}
              className="w-full h-full object-cover"
            />
          </div>

          {quickViewProduct.images.length > 1 && (
            <div className="flex flex-row items-center gap-2.5 overflow-x-auto pt-3 pb-1 px-0.5">
              {quickViewProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === idx ? 'border-[#2B080C] ring-2 ring-[#2B080C]/40 shadow-sm opacity-100' : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info Column */}
        <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-700 font-bold uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full">
                {quickViewProduct.categoryName}
              </span>
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-current" />
                <span>{quickViewProduct.rating}</span>
                <span className="text-slate-400 font-normal">({quickViewProduct.reviewCount})</span>
              </div>
            </div>

            <h2 className="text-xl font-bold text-[#2C3539] font-serif leading-snug">
              {quickViewProduct.name}
            </h2>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#2C3539] font-mono">
                ৳{quickViewProduct.price.toFixed(2)}
              </span>
              {quickViewProduct.originalPrice && (
                <span className="text-sm text-slate-400 line-through font-mono">
                  ৳{quickViewProduct.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
              {quickViewProduct.description}
            </p>

            {/* Colors picker */}
            {quickViewProduct.colors && (
              <div className="space-y-1.5 pt-2">
                <span className="text-xs font-bold text-[#2C3539]">Color: {selectedColor}</span>
                <div className="flex gap-2">
                  {quickViewProduct.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        selectedColor === c.name ? 'border-slate-900 scale-110 shadow-sm' : 'border-slate-300'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes picker */}
            {quickViewProduct.sizes && (
              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-bold text-[#2C3539]">Size:</span>
                <div className="flex gap-2">
                  {quickViewProduct.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                        selectedSize === sz
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                  isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
                }`}
              >
                {isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                <span>{isAdded ? 'Added to Cart' : 'Add to Cart'}</span>
              </button>

              <button
                onClick={() => toggleWishlist(quickViewProduct.id)}
                className={`p-3 rounded-2xl border transition-colors ${
                  isWishlisted
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            <button
              onClick={() => {
                setQuickViewProduct(null);
                navigateToProduct(quickViewProduct.id);
              }}
              className="w-full text-center text-xs font-bold text-emerald-700 hover:underline flex items-center justify-center gap-1"
            >
              View Full Product Page & Specifications <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
