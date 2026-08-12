import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Star, Heart, Eye, ShoppingBag, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigateToProduct, addToCart, wishlist, toggleWishlist, setQuickViewProduct } = useStore();
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product.colors?.[0]?.name);
  const [isAdded, setIsAdded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, selectedColor);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      onClick={() => navigateToProduct(product.id)}
      className="group bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer relative h-full"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-square bg-slate-50 overflow-hidden">
        <img
          src={product.images[currentImageIndex] || product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {discountPercent > 0 && (
            <span className="bg-[#2B080C] text-white text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
              -{discountPercent}% OFF
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-[#0B0E14] text-amber-400 text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wider flex items-center gap-1">
              ★ Bestseller
            </span>
          )}
          {product.isNewArrival && !product.isBestSeller && (
            <span className="bg-[#2B080C] text-white text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
              NEW
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2.5 right-2.5 w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center rounded-full shadow-md backdrop-blur-md transition-all z-10 ${
            isWishlisted
              ? 'bg-[#2B080C] text-white'
              : 'bg-white/90 text-[#2C3539] hover:bg-white hover:text-[#2B080C]'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 sm:w-3.5 sm:h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View & Image Options Hover Action Overlay */}
        <div className="absolute inset-x-0 bottom-3 px-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out flex items-center justify-center gap-2 z-10 pointer-events-none">
          <button
            onClick={handleQuickView}
            className="pointer-events-auto min-h-[36px] sm:min-h-[32px] px-2.5 sm:px-3.5 py-1.5 bg-white/95 backdrop-blur-xs border border-slate-200 hover:border-[#2B080C] hover:bg-[#2B080C] text-[#2C3539] hover:text-white text-[10px] sm:text-xs font-semibold whitespace-nowrap rounded-full shadow-md flex items-center justify-center gap-1.5 transition-all transform active:scale-95"
          >
            <Eye className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            <span>Quick View</span>
          </button>

          {/* Alternate Image Hover Preview Dots Pill */}
          {product.images.length > 1 && (
            <div className="pointer-events-auto px-2 py-1.5 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-full shadow-md flex items-center gap-1">
              {product.images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    currentImageIndex === idx ? 'bg-[#2B080C] w-3' : 'bg-slate-300 hover:bg-slate-500 w-1.5'
                  }`}
                  title={`Preview image ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Details & Copy */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between gap-2">
        <div className="flex flex-col">
          {/* Category & Ratings */}
          <div className="flex items-center justify-between text-[11px] lg:text-xs mb-1">
            <span className="text-slate-500 font-medium truncate max-w-[100px] lg:max-w-[130px]">{product.categoryName}</span>
            <div className="flex items-center gap-1 text-amber-500 font-bold shrink-0">
              <Star className="w-3 h-3 lg:w-3.5 lg:h-3.5 fill-current" />
              <span className="lg:text-xs">{product.rating}</span>
              <span className="text-slate-400 font-normal lg:text-xs">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="text-xs sm:text-sm lg:text-base font-bold text-[#2C3539] group-hover:text-[#2B080C] transition-colors line-clamp-1 h-5 lg:h-6 leading-5 lg:leading-6">
            {product.name}
          </h3>

          {/* Subtitle / Reserve Slot */}
          <p className="text-[11px] lg:text-xs text-slate-500 line-clamp-1 mt-0.5 h-4 lg:h-5 leading-4 lg:leading-5">
            {product.subtitle || '\u00A0'}
          </p>

          {/* Color Swatches or Variant Slot Reserve */}
          {product.colors && product.colors.length > 0 ? (
            <div className="flex items-center gap-1 h-5 lg:h-6 mt-2">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColor(color.name);
                  }}
                  className={`w-3.5 h-3.5 lg:w-4 lg:h-4 rounded-full border transition-all ${
                    selectedColor === color.name
                      ? 'ring-2 ring-slate-900 ring-offset-1 border-white scale-110'
                      : 'border-slate-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              <span className="text-[10px] lg:text-xs text-slate-400 font-medium ml-1">
                {product.colors.length} colors
              </span>
            </div>
          ) : (
            <div className="h-5 lg:h-6 mt-2" aria-hidden="true" />
          )}
        </div>

        {/* Pricing & Add To Cart CTA */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1 sm:gap-1.5 mt-auto">
          <div className="flex flex-col justify-center min-h-[32px] min-w-0">
            <div className="flex items-baseline gap-0.5 sm:gap-1 flex-wrap">
              <span className="text-[11px] sm:text-base lg:text-lg font-extrabold text-[#2C3539] font-mono truncate">
                ৳{product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-[9px] sm:text-[10px] lg:text-xs text-slate-400 line-through font-mono truncate">
                  ৳{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {product.stock <= 10 ? (
              <span className="text-[9px] lg:text-xs text-amber-600 font-semibold block leading-tight">
                ⚡ Only {product.stock} left
              </span>
            ) : (
              <span className="text-[9px] lg:text-xs text-emerald-600 font-semibold block leading-tight">
                ✓ In Stock
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`w-8 h-8 sm:w-auto sm:h-auto sm:min-h-0 p-0 sm:px-2.5 sm:py-1.5 lg:px-3 lg:py-2 rounded-lg sm:rounded-xl text-sm sm:text-xs lg:text-sm font-bold transition-all flex items-center justify-center gap-1 shrink-0 ${
              isAdded
                ? 'bg-[#0B0E14] text-white shadow-md'
                : 'bg-[#2B080C] hover:bg-[#380B0F] text-white shadow-xs hover:shadow-md'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-white" /> <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" /> <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
