import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PaymentMethod, ShippingAddress } from '../types';
import {
  Banknote,
  CreditCard,
  ShieldCheck,
  Truck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  User,
  MapPin
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { cart, subtotal, discountAmount, shippingFee, total, createOrder, setView, selectedProductId, navigateToProduct } = useStore();

  const [step, setStep] = useState<1 | 2>(1); // Step 1: Address & Shipping, Step 2: Payment Method

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: 'Alex Wright',
    email: 'alex.wright@example.com',
    phone: '+1 (555) 382-9210',
    address: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62704',
    country: 'United States',
    notes: 'Please leave package at front door if unavailable.'
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [cardDetails, setCardDetails] = useState({
    number: '4532 •••• •••• 8821',
    expiry: '08/28',
    cvv: '921'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      createOrder(address, paymentMethod);
      setIsSubmitting(false);
    }, 1200);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#2C3539]">Your cart is empty</h2>
        <p className="text-xs text-slate-500">Please add items to cart before proceeding to checkout.</p>
        <button
          onClick={() => setView('shop')}
          className="px-6 py-3 min-h-[44px] bg-slate-900 text-white font-bold text-xs rounded-xl"
        >
          Return to Store Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-8 sm:py-8 space-y-5 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header & Stepper */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-8 bg-[#2B080C]/5 border border-[#2B080C]/15 rounded-2xl sm:rounded-3xl shadow-2xs">
        <div>
          <button
            onClick={() => {
              if (step === 2) {
                setStep(1);
              } else {
                const targetProdId = selectedProductId || (cart.length > 0 ? cart[cart.length - 1].product.id : null);
                if (targetProdId) {
                  navigateToProduct(targetProdId);
                } else {
                  setView('shop');
                }
              }
            }}
            className="text-xs font-bold text-[#2B080C] hover:underline flex items-center gap-1 mb-1 sm:mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> 
            {step === 2 ? 'Back to Checkout Information' : 'Back to Product Details'}
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2C3539] font-serif">Secure Express Checkout</h1>
        </div>

        {/* Stepper indicator */}
        <div className="hidden sm:flex items-center justify-between sm:justify-start gap-1 sm:gap-3 text-[10px] sm:text-xs font-bold w-full sm:w-auto py-1">
          <div
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-full transition-all text-center ${
              step === 1 ? 'bg-[#2B080C] text-white shadow-xs' : 'bg-[#2B080C]/10 text-[#2B080C] border border-[#2B080C]/20'
            }`}
          >
            <span className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-mono text-[9px] sm:text-[10px] shrink-0 ${
              step === 1 ? 'bg-white text-[#2B080C] font-extrabold' : 'bg-[#2B080C] text-white'
            }`}>
              1
            </span>
            <span className="whitespace-nowrap text-[10px] sm:text-xs">Shipping Address</span>
          </div>

          <span className="text-slate-400 shrink-0 text-xs">→</span>

          <div
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-full transition-all text-center ${
              step === 2 ? 'bg-[#2B080C] text-white shadow-xs' : 'bg-slate-100 text-slate-500 border border-slate-200'
            }`}
          >
            <span className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-mono text-[9px] sm:text-[10px] shrink-0 ${
              step === 2 ? 'bg-white text-[#2B080C] font-extrabold' : 'bg-slate-200 text-slate-700'
            }`}>
              2
            </span>
            <span className="whitespace-nowrap text-[10px] sm:text-xs">Payment Method</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Body */}
        <div className="lg:col-span-2 space-y-6">
          {step === 1 && (
            <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xs animate-in fade-in">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100 font-bold text-[#2C3539]">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <span>Customer Contact & Shipping Address</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full p-3 bg-white border-2 border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 rounded-xl text-xs text-[#2C3539] font-medium outline-none transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                    className="w-full p-3 bg-white border-2 border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 rounded-xl text-xs text-[#2C3539] font-medium outline-none transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (for COD verification)</label>
                  <input
                    type="text"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full p-3 bg-white border-2 border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 rounded-xl text-xs text-[#2C3539] font-medium outline-none transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={address.address}
                    onChange={(e) => setAddress({ ...address, address: e.target.value })}
                    className="w-full p-3 bg-white border-2 border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 rounded-xl text-xs text-[#2C3539] font-medium outline-none transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full p-3 bg-white border-2 border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 rounded-xl text-xs text-[#2C3539] font-medium outline-none transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">State / Province</label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full p-3 bg-white border-2 border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 rounded-xl text-xs text-[#2C3539] font-medium outline-none transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Zip / Postal Code</label>
                  <input
                    type="text"
                    required
                    value={address.zipCode}
                    onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                    className="w-full p-3 bg-white border-2 border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 rounded-xl text-xs text-[#2C3539] font-medium outline-none transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    className="w-full p-3 bg-white border-2 border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 rounded-xl text-xs text-[#2C3539] font-medium outline-none transition-all shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={address.notes}
                  onChange={(e) => setAddress({ ...address, notes: e.target.value })}
                  placeholder="Special courier instructions..."
                  className="w-full p-3 bg-white border-2 border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 rounded-xl text-xs text-[#2C3539] font-medium outline-none transition-all shadow-2xs"
                />
              </div>

              <div className="pt-4 flex justify-center sm:justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  <span>Continue to Payment Method</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xs animate-in fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 font-bold text-[#2C3539]">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-emerald-600" />
                  <span>Choose Payment Method</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-emerald-700 hover:underline"
                >
                  Edit Address
                </button>
              </div>

              <div className="space-y-3">
                {/* Cash on Delivery (COD) Option */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border-2 flex items-start gap-4 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'bg-amber-50/80 border-amber-500 text-amber-950 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 accent-amber-600"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <Banknote className="w-5 h-5 text-amber-600" />
                      <span>Cash on Delivery (COD) — Recommended</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Pay in cash at your doorstep when the delivery associate delivers your order. Inspect package before payment!
                    </p>
                  </div>
                </label>

                {/* Credit / Debit Card Option */}
                <label
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border-2 flex items-start gap-4 cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-emerald-50/80 border-emerald-500 text-emerald-950 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="mt-1 accent-emerald-600"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <CreditCard className="w-5 h-5 text-emerald-600" />
                      <span>Credit / Debit Card (Visa, Mastercard, Amex)</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Instant 256-Bit SSL encrypted transaction. Safe & fast dispatch.
                    </p>
                  </div>
                </label>
              </div>

              {/* Card input mock */}
              {paymentMethod === 'card' && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 animate-in fade-in">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                        className="w-full p-2.5 bg-white border-2 border-slate-300 focus:border-slate-900 rounded-xl font-mono outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Expiry / CVV</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                          className="w-1/2 p-2.5 bg-white border-2 border-slate-300 focus:border-slate-900 rounded-xl font-mono outline-none"
                        />
                        <input
                          type="text"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                          className="w-1/2 p-2.5 bg-white border-2 border-slate-300 focus:border-slate-900 rounded-xl font-mono outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 flex flex-col-reverse sm:flex-row justify-between items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full sm:w-auto px-6 py-3 min-h-[44px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl text-center"
                >
                  ← Back to Address
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Processing Order...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Place Order (৳{total.toFixed(2)})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl space-y-4">
            <h3 className="font-bold text-[#2C3539] text-base border-b border-slate-200 pb-3">
              Order Items ({cart.length})
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item, index) => (
                <div key={`${item.product.id}-${item.selectedColor || ''}-${item.selectedSize || ''}-${index}`} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded-xl border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#2C3539] truncate">{item.product.name}</p>
                    <p className="text-slate-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold font-mono text-[#2C3539]">
                    ৳{(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono font-bold">৳{subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount</span>
                  <span className="font-mono">-৳{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-mono text-emerald-600 font-bold">
                  {shippingFee === 0 ? 'FREE' : `৳${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-extrabold text-[#2C3539]">
                <span>Total Due</span>
                <span className="font-mono text-emerald-700">৳{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
