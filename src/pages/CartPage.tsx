import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Tag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Banknote,
  ArrowLeft
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    subtotal,
    freeShippingThreshold,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    setView,
    discountAmount,
    shippingFee,
    total
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

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

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-3 sm:py-2 min-h-[44px]0 text-center space-y-6 animate-in fade-in">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl sm:text-3xl font-extrabold text-[#2C3539]">Your Cart is Currently Empty</h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            You haven't added any products to your shopping bag yet. Check out our latest noise-cancelling headphones, smartwatches, and leather goods.
          </p>
        </div>
        <button
          onClick={() => setView('shop')}
          className="px-8 py-3.5 bg-slate-900 text-white font-bold text-sm rounded-2xl hover:bg-slate-800 transition-colors shadow-lg"
        >
          Explore Store Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-8 animate-in fade-in duration-300">
      {/* Page Title & Free Shipping Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-slate-200">
        <div>
          <button
            onClick={() => setView('shop')}
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
          </button>
          <h1 className="text-xl sm:text-3xl font-extrabold text-[#2C3539] truncate">
            Shopping Cart ({cart.reduce((a, c) => a + c.quantity, 0)} Items)
          </h1>
        </div>

        {/* Shipping meter */}
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl sm:max-w-xs w-full text-xs text-emerald-950 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold">
            <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
            {remainingForFreeShipping === 0 ? (
              <span>🎉 You unlocked FREE Express Shipping!</span>
            ) : (
              <span>
                Add <strong>৳{remainingForFreeShipping.toFixed(2)}</strong> for FREE Express Shipping
              </span>
            )}
          </div>
          <div className="w-full bg-emerald-200/80 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Main Grid: Items Table & Summary Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
        {/* Cart Item Cards */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
              className="p-4 sm:p-6 bg-white border border-slate-200/80 rounded-3xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-2xl border border-slate-200 shrink-0"
                />

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
                    {item.product.categoryName}
                  </span>
                  <h3 className="text-sm font-bold text-[#2C3539]">{item.product.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                    {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                  </div>
                  <div className="text-sm font-extrabold text-[#2C3539] font-mono">
                    ৳{item.product.price.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Quantity & Delete */}
              <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1">
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity - 1, item.selectedColor, item.selectedSize)
                    }
                    className="p-3 sm:p-1.5 min-w-[44px] sm:min-w-0 flex justify-center items-center text-slate-500 hover:text-[#2C3539]"
                  >
                    <Minus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm sm:text-xs font-bold font-mono">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity + 1, item.selectedColor, item.selectedSize)
                    }
                    className="p-3 sm:p-1.5 min-w-[44px] sm:min-w-0 flex justify-center items-center text-slate-500 hover:text-[#2C3539]"
                  >
                    <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                  </button>
                </div>
                <div className="text-right">
                  <div className="text-base font-black text-[#2C3539] font-mono">
                    ৳{(item.product.price * item.quantity).toFixed(2)}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id, item.selectedColor, item.selectedSize)}
                    className="text-sm sm:text-xs text-rose-600 hover:underline font-semibold mt-1 inline-flex items-center gap-1 p-2 sm:p-0 min-h-[44px] sm:min-h-0"
                  >
                    <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl space-y-5">
            <h3 className="font-bold text-[#2C3539] text-lg border-b border-slate-200 pb-3">
              Order Summary
            </h3>

            {/* Coupon Code Entry */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Promo / Coupon Code</label>
              {!appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="e.g. WELCOME10"
                      className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs uppercase text-[#2C3539] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-3 sm:py-2 min-h-[44px] bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    Apply
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-between bg-emerald-100/80 border border-emerald-300 p-3 rounded-xl text-xs text-emerald-900 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Code <strong>{appliedCoupon}</strong> Applied</span>
                  </div>
                  <button onClick={removeCoupon} className="text-xs text-rose-600 hover:underline">
                    Remove
                  </button>
                </div>
              )}
              {couponError && <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>}
            </div>

            {/* Breakdown costs */}
            <div className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-mono font-bold text-[#2C3539]">৳{subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount</span>
                  <span className="font-mono">-৳{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-mono text-[#2C3539]">
                  {shippingFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `৳${shippingFee.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Tax (5%)</span>
                <span className="font-mono text-[#2C3539]">৳{(subtotal * 0.05).toFixed(2)}</span>
              </div>

              <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-extrabold text-[#2C3539]">
                <span>Total Amount</span>
                <span className="font-mono text-emerald-700 text-xl">৳{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setView('checkout')}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2 font-bold text-[#2C3539]">
              <Banknote className="w-4 h-4 text-emerald-600" /> Cash on Delivery (COD) Available
            </div>
            <p>Pay in cash upon inspecting your package at your doorstep.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
