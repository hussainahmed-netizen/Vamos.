import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  User,
  Package,
  Star,
  XCircle,
  Heart,
  Clock,
  CheckCircle2,
  Search,
  Truck,
  ShieldCheck,
  ChevronRight,
  MapPin,
  Mail,
  Phone,
  Edit2
} from 'lucide-react';

type AccountTab = 'overview' | 'orders' | 'reviews' | 'returns';

export const AccountPage: React.FC = () => {
  const {
    accountTab,
    setAccountTab,
    ordersHistory,
    currentOrder,
    reviewsList,
    wishlist,
    setView,
    showToast
  } = useStore();

  const [trackInput, setTrackInput] = useState('');
  const [foundOrder, setFoundOrder] = useState<any>(null);
  const [trackError, setTrackError] = useState(false);

  const [slideDirection, setSlideDirection] = useState<'right' | 'left'>('right');

  const getTabIndex = (tabId: string) => {
    switch (tabId) {
      case 'overview': return 0;
      case 'orders': return 1;
      case 'reviews': return 2;
      case 'returns': return 3;
      default: return 0;
    }
  };

  const handleTabSelect = (targetTab: AccountTab) => {
    const currentIdx = getTabIndex(accountTab);
    const targetIdx = getTabIndex(targetTab);
    setSlideDirection(targetIdx >= currentIdx ? 'right' : 'left');
    setAccountTab(targetTab);
    const path = targetTab === 'overview' ? '/account' : `/account/${targetTab}`;
    window.history.pushState({}, '', path);
  };

  // Sync tab if URL has subpath
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/account/orders')) {
      setAccountTab('orders');
    } else if (path.includes('/account/reviews')) {
      setAccountTab('reviews');
    } else if (path.includes('/account/returns')) {
      setAccountTab('returns');
    } else if (path.includes('/account')) {
      setAccountTab('overview');
    }
  }, [setAccountTab]);

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError(false);
    const cleanId = trackInput.trim().toUpperCase();

    const allOrders = currentOrder ? [currentOrder, ...ordersHistory] : ordersHistory;
    const match = allOrders.find(
      (o) => o.id.toUpperCase() === cleanId || o.id.replace('#', '') === cleanId
    );

    if (match) {
      setFoundOrder(match);
    } else {
      setFoundOrder(null);
      setTrackError(true);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Manage My Account', icon: User },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'reviews', label: 'My Reviews', icon: Star },
    { id: 'returns', label: 'My Returns & Cancellations', icon: XCircle }
  ] as const;

  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in duration-300">
      {/* Page Title */}
      <div className="mb-8 border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          My Account
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your personal profile, track orders, check reviews, and view active returns
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-2">
          <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = accountTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabSelect(tab.id as AccountTab)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-semibold text-sm flex items-center justify-between transition-all duration-200 transform hover:translate-x-1 active:scale-[0.99] ${
                    isActive
                      ? 'bg-[#2B080C] text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{tab.label}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'text-white/70 translate-x-0.5' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Account</span>
            </div>
            <p className="text-slate-600">
              Your account is fully verified. Enjoy fast express shipping and instant order tracking!
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {/* TAB 1: OVERVIEW */}
          {accountTab === 'overview' && (
            <div className={`space-y-6 ${slideDirection === 'right' ? 'animate-tab-slide-right' : 'animate-tab-slide-left'}`}>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#2B080C] text-white font-bold rounded-2xl flex items-center justify-center text-xl shadow-md">
                      JD
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">John Doe</h3>
                      <p className="text-xs text-slate-500">Member since August 2026</p>
                    </div>
                  </div>
                  <button
                    onClick={() => showToast('Profile edit mode updated', 'info')}
                    className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address
                    </div>
                    <p className="text-sm font-semibold text-slate-900 truncate">johndoe@example.com</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone Number
                    </div>
                    <p className="text-sm font-semibold text-slate-900">+880 1700-000000</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> Default Shipping
                    </div>
                    <p className="text-sm font-semibold text-slate-900 truncate">Dhaka, Bangladesh</p>
                  </div>
                </div>
              </div>

              {/* Quick Summary Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Total Orders</p>
                    <p className="text-2xl font-extrabold text-slate-900 mt-1">{ordersHistory.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700">
                    <Package className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Saved Items</p>
                    <p className="text-2xl font-extrabold text-slate-900 mt-1">{wishlist.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                    <Heart className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Reviews Written</p>
                    <p className="text-2xl font-extrabold text-slate-900 mt-1">{reviewsList.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                    <Star className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY ORDERS */}
          {accountTab === 'orders' && (
            <div className={`space-y-6 ${slideDirection === 'right' ? 'animate-tab-slide-right' : 'animate-tab-slide-left'}`}>
              {/* Search / Track Order Form */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Track Specific Shipment
                </h3>
                <form onSubmit={handleTrackSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={trackInput}
                      onChange={(e) => setTrackInput(e.target.value)}
                      placeholder="Enter Order ID (e.g. ORD-839210)"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2B080C]"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#2B080C] text-white font-bold text-xs rounded-xl hover:bg-[#380B0F] transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Track
                  </button>
                </form>

                {trackError && (
                  <p className="text-xs text-rose-600 font-medium">
                    Order ID not found. Check your order list below or place a new test order!
                  </p>
                )}

                {foundOrder && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-950 mt-3 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex justify-between font-bold">
                      <span>Order #{foundOrder.id}</span>
                      <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px]">
                        {foundOrder.status}
                      </span>
                    </div>
                    <p>Placed on: {foundOrder.date}</p>
                    <p>Est. Delivery: {foundOrder.estimatedDelivery}</p>
                    <p>Total: ৳{foundOrder.total.toFixed(2)}</p>
                  </div>
                )}
              </div>

              {/* Order History */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#2B080C]" /> Order History ({ordersHistory.length})
                </h3>

                {ordersHistory.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-700">No orders placed yet</p>
                    <p className="text-xs text-slate-500 mt-1">Explore our catalog and place your first order!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {ordersHistory.map((order) => (
                      <div
                        key={order.id}
                        className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs hover:border-slate-300 hover:shadow-xs transition-all duration-200 animate-in fade-in slide-in-from-bottom-1"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 font-bold text-slate-900">
                            <span>Order #{order.id}</span>
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                              {order.status}
                            </span>
                          </div>
                          <p className="text-slate-500">Date: {order.date} | {order.items.length} Item(s)</p>
                          <p className="text-slate-500">Delivery to: {order.shippingAddress.city}, {order.shippingAddress.country}</p>
                        </div>

                        <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                          <div className="text-base font-extrabold text-slate-900 font-mono">
                            ৳{order.total.toFixed(2)}
                          </div>
                          <div className="text-[11px] text-emerald-700 font-bold mt-0.5">
                            Est: {order.estimatedDelivery}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: MY REVIEWS */}
          {accountTab === 'reviews' && (
            <div className={`bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 ${slideDirection === 'right' ? 'animate-tab-slide-right' : 'animate-tab-slide-left'}`}>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> My Reviews ({reviewsList.length})
              </h3>

              <div className="space-y-3">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 animate-in fade-in slide-in-from-bottom-1 transition-all hover:bg-slate-100/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-200 fill-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-slate-400">{rev.date}</span>
                    </div>
                    <p className="text-xs text-slate-700 italic">"{rev.comment}"</p>
                    <p className="text-[11px] text-slate-500 font-medium">— Reviewed by {rev.author}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: RETURNS & CANCELLATIONS */}
          {accountTab === 'returns' && (
            <div className={`bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 ${slideDirection === 'right' ? 'animate-tab-slide-right' : 'animate-tab-slide-left'}`}>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-slate-600" /> Returns & Cancellations
              </h3>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900">No Active Return Requests</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  You currently have no pending return or cancellation requests. We offer a hassle-free 7-day money-back guarantee on all authentic products.
                </p>
                <button
                  onClick={() => handleTabSelect('orders')}
                  className="mt-2 px-4 py-2 bg-[#2B080C] text-white font-bold text-xs rounded-xl hover:bg-[#380B0F] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  View Order History
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
