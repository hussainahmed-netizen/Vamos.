import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, Tag, Truck, Check } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    freeShippingThreshold,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    setView
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!isCartDrawerOpen) return null;

  const progress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <span className="font-bold text-slate-900 text-lg">Your Shopping Cart</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              {cart.reduce((a, c) => a + c.quantity, 0)} items
            </span>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="p-4 bg-emerald-50/70 border-b border-emerald-100 text-xs text-emerald-900">
          <div className="flex items-center gap-2 font-semibold mb-1.5">
            <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
            {remainingForFreeShipping === 0 ? (
              <span className="text-emerald-700 font-bold">🎉 Congratulations! You unlocked FREE Express Shipping!</span>
            ) : (
              <span>
                Add <strong className="text-slate-900 font-bold">৳{remainingForFreeShipping.toFixed(2)}</strong> more for <strong>FREE Express Shipping</strong>
              </span>
            )}
          </div>
          <div className="w-full bg-emerald-200/80 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-base">Your cart is empty</h3>
                <p className="text-sm sm:text-xs text-slate-500 max-w-xs mx-auto">
                  Explore our catalog for active noise-cancelling headphones, smartwatch gadgets, and heavy hoodies!
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setView('shop');
                }}
                className="px-6 py-2.5 bg-slate-900 text-white font-bold text-sm sm:text-xs rounded-xl hover:bg-slate-800 transition-colors"
              >
                Start Shopping Now
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                className="flex items-center gap-4 p-3 bg-slate-50/80 rounded-2xl border border-slate-200/60"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{item.product.name}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                    {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                  </div>
                  <div className="text-xs font-extrabold text-slate-900 mt-1 font-mono">
                    ৳{item.product.price.toFixed(2)}
                  </div>
                </div>

                {/* Quantity Adjuster */}
                <div className="flex items-center gap-2 sm:gap-1.5 bg-white border border-slate-200 rounded-lg p-1">
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.product.id,
                        item.quantity - 1,
                        item.selectedColor,
                        item.selectedSize
                      )
                    }
                    className="p-2 sm:p-1 min-w-[32px] sm:min-w-0 flex items-center justify-center text-slate-500 hover:text-slate-900"
                  >
                    <Minus className="w-4 h-4 sm:w-3 sm:h-3" />
                  </button>
                  <span className="w-6 text-center text-sm sm:text-xs font-bold font-mono">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.product.id,
                        item.quantity + 1,
                        item.selectedColor,
                        item.selectedSize
                      )
                    }
                    className="p-2 sm:p-1 min-w-[32px] sm:min-w-0 flex items-center justify-center text-slate-500 hover:text-slate-900"
                  >
                    <Plus className="w-4 h-4 sm:w-3 sm:h-3" />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.product.id, item.selectedColor, item.selectedSize)}
                  className="text-slate-400 hover:text-rose-600 p-3 sm:p-1 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center"
                  title="Remove item"
                >
                  <Trash2 className="w-5 h-5 sm:w-4 sm:h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cart.length > 0 && (
          <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-3">
            {/* Promo code form */}
            {!appliedCoupon ? (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Promo code (e.g. WELCOME10)"
                    className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs uppercase text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors shrink-0"
                >
                  Apply
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between bg-emerald-100/70 border border-emerald-300 p-2.5 rounded-xl text-xs text-emerald-900 font-semibold">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Code <strong>{appliedCoupon}</strong> (-{couponDiscount}%) Applied</span>
                </div>
                <button onClick={removeCoupon} className="text-xs text-rose-600 hover:underline">
                  Remove
                </button>
              </div>
            )}

            {couponError && <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>}

            {/* Price breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono font-bold text-slate-900">৳{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (5%)</span>
                <span className="font-mono text-slate-700">৳{(subtotal * 0.05).toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-extrabold text-slate-900">
                <span>Subtotal</span>
                <span className="font-mono text-emerald-700">৳{subtotal.toFixed(2)}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setView('cart');
                }}
                className="w-full py-4 sm:py-3 min-h-[44px] bg-white border border-slate-300 hover:bg-slate-100 text-slate-900 font-bold text-sm sm:text-xs rounded-xl transition-colors"
              >
                View Full Cart
              </button>

              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setView('checkout');
                }}
                className="w-full py-4 sm:py-3 min-h-[44px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-400">
              🔒 256-Bit SSL Encrypted | Cash on Delivery Available
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
