import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, User, Package, Search, Clock, CheckCircle2, Truck, ShieldCheck } from 'lucide-react';

export const AccountModal: React.FC = () => {
  const { isAccountModalOpen, setIsAccountModalOpen, ordersHistory, currentOrder } = useStore();
  const [trackInput, setTrackInput] = useState('');
  const [foundOrder, setFoundOrder] = useState<any>(null);
  const [trackError, setTrackError] = useState(false);

  if (!isAccountModalOpen) return null;

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError(false);
    const cleanId = trackInput.trim().toUpperCase();

    // Check current or history
    const allOrders = currentOrder ? [currentOrder, ...ordersHistory] : ordersHistory;
    const match = allOrders.find((o) => o.id.toUpperCase() === cleanId || o.id.replace('#', '') === cleanId);

    if (match) {
      setFoundOrder(match);
    } else {
      setFoundOrder(null);
      setTrackError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl p-6 sm:p-8 relative border border-slate-200 max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setIsAccountModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 bg-slate-900 text-emerald-400 rounded-2xl flex items-center justify-center font-bold text-xl">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-serif">Account & Order Tracker</h3>
            <p className="text-xs text-slate-500">Track shipments, view order history, and account status</p>
          </div>
        </div>

        {/* Live Order Tracker Search Box */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mb-6 space-y-3">
          <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
            Track Order Status
          </label>
          <form onSubmit={handleTrackSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={trackInput}
                onChange={(e) => setTrackInput(e.target.value)}
                placeholder="Enter Order ID (e.g. ORD-839210)"
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono uppercase text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
            >
              Track Order
            </button>
          </form>

          {trackError && (
            <p className="text-xs text-rose-600 font-medium">
              Order ID not found in local session. Try searching <strong>ORD-839210</strong> or place a new test order!
            </p>
          )}

          {foundOrder && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-950 mt-3 animate-in fade-in">
              <div className="flex justify-between font-bold">
                <span>Order #{foundOrder.id}</span>
                <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px]">
                  {foundOrder.status}
                </span>
              </div>
              <p>Placed on: {foundOrder.date}</p>
              <p>Est. Delivery: {foundOrder.estimatedDelivery}</p>
              <p>Payment: {foundOrder.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Card / Digital'}</p>
              <p className="font-extrabold font-mono">Total: ৳{foundOrder.total.toFixed(2)}</p>
            </div>
          )}
        </div>

        {/* Orders History List */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-600" /> Recent Session Orders ({ordersHistory.length})
          </h4>

          {ordersHistory.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No orders placed in this session yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {ordersHistory.map((order) => (
                <div
                  key={order.id}
                  className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <span>#{order.id}</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full">
                        {order.status}
                      </span>
                    </div>
                    <p className="text-slate-500">Date: {order.date} | {order.items.length} Items</p>
                    <p className="text-slate-500">Shipping to: {order.shippingAddress.city}, {order.shippingAddress.country}</p>
                  </div>

                  <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    <div className="text-sm font-black text-slate-900 font-mono">
                      ৳{order.total.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                      Est: {order.estimatedDelivery}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
