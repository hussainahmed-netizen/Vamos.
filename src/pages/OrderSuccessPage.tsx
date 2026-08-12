import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, Truck, Calendar, Printer, ArrowRight, PackageCheck, Banknote, ShieldCheck } from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { currentOrder, setView, setIsAccountModalOpen } = useStore();

  if (!currentOrder) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">No recent order found</h2>
        <button onClick={() => setView('shop')} className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold">
          Go to Shop
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-in zoom-in-95 duration-300">
      {/* Success Hero Banner */}
      <div className="bg-slate-900 text-white p-8 sm:p-12 rounded-3xl text-center space-y-4 shadow-2xl relative overflow-hidden">
        <div className="w-16 h-16 bg-emerald-500 text-[#2C3539] rounded-2xl flex items-center justify-center mx-auto shadow-lg animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
            Order #{currentOrder.id} Confirmed
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif">Thank You For Your Order!</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            We've sent a detailed order receipt to <strong>{currentOrder.shippingAddress.email}</strong>.
          </p>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setIsAccountModalOpen(true)}
            className="px-5 py-2.5 bg-emerald-500 text-[#2C3539] font-bold text-xs rounded-xl shadow-md hover:bg-emerald-400 transition-colors"
          >
            Track Live Shipment
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" /> Print Receipt
          </button>
        </div>
      </div>

      {/* Itemized Order Receipt Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4 text-xs">
          <div>
            <span className="text-slate-400">Order Reference</span>
            <p className="font-extrabold text-[#2C3539] text-base font-mono">{currentOrder.id}</p>
          </div>
          <div>
            <span className="text-slate-400">Estimated Doorstep Delivery</span>
            <p className="font-bold text-emerald-700 text-sm">{currentOrder.estimatedDelivery}</p>
          </div>
          <div>
            <span className="text-slate-400">Payment Selected</span>
            <p className="font-bold text-[#2C3539] capitalize">
              {currentOrder.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Card / Digital'}
            </p>
          </div>
        </div>

        {/* Shipping address details */}
        <div className="p-4 bg-slate-50 rounded-2xl text-xs space-y-1">
          <span className="font-bold text-[#2C3539] uppercase tracking-wider block mb-1">
            Shipping Destination
          </span>
          <p className="font-semibold text-slate-800">{currentOrder.shippingAddress.fullName}</p>
          <p className="text-slate-600">
            {currentOrder.shippingAddress.address}, {currentOrder.shippingAddress.city},{' '}
            {currentOrder.shippingAddress.state} {currentOrder.shippingAddress.zipCode},{' '}
            {currentOrder.shippingAddress.country}
          </p>
          <p className="text-slate-500">Phone: {currentOrder.shippingAddress.phone}</p>
        </div>

        {/* Items */}
        <div className="space-y-3 pt-2">
          <h3 className="font-bold text-[#2C3539] text-sm">Order Items</h3>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
            {currentOrder.items.map((item, index) => (
              <div key={`${item.product.id}-${index}`} className="p-4 flex items-center justify-between gap-4 text-xs bg-white">
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded-xl border border-slate-200"
                  />
                  <div>
                    <p className="font-bold text-[#2C3539]">{item.product.name}</p>
                    <p className="text-slate-500">
                      Qty: {item.quantity} {item.selectedColor ? `| Color: ${item.selectedColor}` : ''}
                    </p>
                  </div>
                </div>
                <span className="font-mono font-bold text-[#2C3539]">
                  ৳{(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Total Cost Breakdown */}
        <div className="p-4 bg-slate-50 rounded-2xl space-y-1.5 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-mono text-[#2C3539]">৳{currentOrder.subtotal.toFixed(2)}</span>
          </div>
          {currentOrder.discount > 0 && (
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>Coupon Discount</span>
              <span className="font-mono">-৳{currentOrder.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="font-mono text-emerald-600 font-bold">
              {currentOrder.shippingFee === 0 ? 'FREE' : `৳${currentOrder.shippingFee.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-extrabold text-[#2C3539]">
            <span>Grand Total</span>
            <span className="font-mono text-emerald-700 text-lg">৳{currentOrder.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="pt-4 flex justify-center">
          <button
            onClick={() => setView('home')}
            className="px-8 py-3.5 bg-slate-900 text-white font-bold text-xs rounded-2xl hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-md"
          >
            <span>Continue Shopping Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
