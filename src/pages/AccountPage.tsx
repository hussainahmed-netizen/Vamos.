import React, { useState, useEffect } from 'react';
import { useAuth, useUser, useClerk, SignedIn, SignedOut } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { OrderDetailsPage } from './OrderDetailsPage';
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
  const navigate = useNavigate();
  let isLoaded = false;
  let isSignedIn = false;
  let user: ReturnType<typeof useUser>['user'] = null;
  let clerkObj: ReturnType<typeof useClerk> | null = null;

  try {
    const auth = useAuth();
    const clerkUser = useUser();
    const clerk = useClerk();
    isLoaded = auth.isLoaded;
    isSignedIn = auth.isSignedIn || false;
    user = clerkUser.user || null;
    clerkObj = clerk;
  } catch {
    // Fallback if ClerkProvider is omitted
    isLoaded = true;
    isSignedIn = false;
  }

  const signOut = clerkObj?.signOut ? clerkObj.signOut : async () => {};

  const {
    accountTab,
    setAccountTab,
    ordersHistory,
    currentOrder,
    selectedOrderId,
    setSelectedOrderId,
    navigateToOrderDetails,
    reviewsList,
    wishlist,
    setView,
    showToast
  } = useStore();

  // Strict Route Protection: If user manually accesses /account while logged out,
  // strictly redirect them to Home ('/') and trigger clerk.openSignIn()
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/', { replace: true });
      setView('home');
      if (clerkObj?.openSignIn) {
        try {
          clerkObj.openSignIn();
        } catch (err) {
          console.warn('clerk.openSignIn failed on route protection redirect:', err);
        }
      }
    }
  }, [isLoaded, isSignedIn]);

  if (isLoaded && !isSignedIn) {
    return null;
  }

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
      if (accountTab !== 'orders') setAccountTab('orders');
    } else if (path.includes('/account/reviews')) {
      if (accountTab !== 'reviews') setAccountTab('reviews');
    } else if (path.includes('/account/returns')) {
      if (accountTab !== 'returns') setAccountTab('returns');
    } else if (path.includes('/account')) {
      if (accountTab !== 'overview') setAccountTab('overview');
    }
  }, [accountTab, setAccountTab]);

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
    <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-8 sm:pb-12 animate-in fade-in duration-300">
      {/* Page Title */}
      <div className="mb-8 border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2C3539] tracking-tight">
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
                      : 'text-slate-700 hover:bg-slate-50 hover:text-[#2C3539]'
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
              <SignedIn>
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                      {user?.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          alt={user.fullName || 'User'}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-[#2B080C] shadow-md"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-[#2B080C] text-white font-bold rounded-2xl flex items-center justify-center text-xl shadow-md overflow-hidden">
                          <User className="w-7 h-7 text-white" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-bold text-[#2C3539]">
                          {user?.fullName || user?.username || 'Customer Account'}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {user?.primaryEmailAddress?.emailAddress || 'Manage your orders, saved items, and reviews'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                        <Mail className="w-3.5 h-3.5 text-slate-400" /> Account Status
                      </div>
                      <p className="text-sm font-semibold text-emerald-700 truncate">
                        Verified & Active
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                        <Phone className="w-3.5 h-3.5 text-slate-400" /> Primary Email
                      </div>
                      <p className="text-sm font-semibold text-[#2C3539] truncate">
                        {user?.primaryEmailAddress?.emailAddress || 'Connected'}
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> Shipping Region
                      </div>
                      <p className="text-sm font-semibold text-[#2C3539] truncate">
                        Bangladesh
                      </p>
                    </div>
                  </div>
                </div>
              </SignedIn>

              <SignedOut>
                <div className="bg-gradient-to-br from-[#2B080C] to-[#481217] text-white rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
                  <div className="max-w-xl space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold backdrop-blur-xs text-amber-200">
                      <ShieldCheck className="w-3.5 h-3.5" /> Instant & Secure Auth
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                      Sign in or Register to your Account
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      Sync your wishlist, track live orders, manage saved addresses, and leave reviews with your Google account or email address.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        try {
                          signOut();
                        } catch {}
                        const clerkInstance = (window as any).Clerk;
                        if (clerkInstance?.openSignIn) {
                          clerkInstance.openSignIn();
                        }
                      }}
                      className="px-6 py-2.5 bg-white text-[#2B080C] font-extrabold text-xs rounded-xl hover:bg-slate-100 transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      Sign In Now
                    </button>

                    <button
                      onClick={() => {
                        const clerkInstance = (window as any).Clerk;
                        if (clerkInstance?.openSignUp) {
                          clerkInstance.openSignUp();
                        }
                      }}
                      className="px-6 py-2.5 bg-amber-400 text-[#2B080C] font-extrabold text-xs rounded-xl hover:bg-amber-300 transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      Create Free Account
                    </button>
                  </div>
                </div>
              </SignedOut>

              {/* Quick Summary Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Total Orders</p>
                    <p className="text-2xl font-extrabold text-[#2C3539] mt-1">{ordersHistory.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700">
                    <Package className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Saved Items</p>
                    <p className="text-2xl font-extrabold text-[#2C3539] mt-1">{wishlist.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                    <Heart className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Reviews Written</p>
                    <p className="text-2xl font-extrabold text-[#2C3539] mt-1">{reviewsList.length}</p>
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
              {selectedOrderId ? (
                <OrderDetailsPage orderId={selectedOrderId} onBack={() => setSelectedOrderId(null)} />
              ) : (
                <>
                  {/* Search / Track Order Form */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                    <h3 className="text-sm font-bold text-[#2C3539] uppercase tracking-wider">
                      Track Specific Shipment
                    </h3>
                    <form onSubmit={handleTrackSearch} className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={trackInput}
                          onChange={(e) => setTrackInput(e.target.value)}
                          placeholder="Enter Order ID (e.g. ORD-839210)"
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase text-[#2C3539] focus:outline-none focus:ring-2 focus:ring-[#2B080C]"
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
                        <div className="flex justify-between items-center font-bold">
                          <span className="font-mono text-sm">Order #{foundOrder.id}</span>
                          <span className="bg-emerald-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-extrabold">
                            {foundOrder.status}
                          </span>
                        </div>
                        <p>Placed on: {foundOrder.date}</p>
                        <p>Est. Delivery: {foundOrder.estimatedDelivery}</p>
                        <p className="font-mono font-bold">Total: ৳{foundOrder.total.toFixed(2)}</p>
                        <button
                          onClick={() => navigateToOrderDetails(foundOrder.id)}
                          className="mt-2 w-full py-2 bg-[#2B080C] text-white font-bold text-xs rounded-lg hover:bg-[#380B0F] transition-all flex items-center justify-center gap-1.5"
                        >
                          Open Full Order Details & Live Tracking <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Order History Cards */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                    <h3 className="text-base font-bold text-[#2C3539] flex items-center gap-2">
                      <Package className="w-5 h-5 text-[#2B080C]" /> Order History ({ordersHistory.length})
                    </h3>

                    {ordersHistory.length === 0 ? (
                      <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-slate-700">No orders placed yet</p>
                        <p className="text-xs text-slate-500 mt-1">Explore our catalog and place your first order!</p>
                      </div>
                    ) : (
                      <div className="space-y-3.5">
                        {ordersHistory.map((order) => {
                          const itemCount = order.items.length;
                          const firstProduct = order.items[0]?.product;
                          const firstImage =
                            firstProduct?.images?.[0] ||
                            firstProduct?.image ||
                            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';
                          const shippingAddrStr = order.shippingAddress
                            ? `${order.shippingAddress.address ? order.shippingAddress.address + ', ' : ''}${order.shippingAddress.city || ''}, ${order.shippingAddress.country || ''}`
                            : 'Dhaka, Bangladesh';

                          return (
                            <div
                              key={order.id}
                              onClick={() => navigateToOrderDetails(order.id)}
                              role="button"
                              tabIndex={0}
                              className="p-4 sm:p-5 bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-[#2B080C]/40 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs cursor-pointer shadow-2xs hover:shadow-md transition-all duration-200 group animate-in fade-in slide-in-from-bottom-1"
                            >
                              {/* Left Section: Product Thumbnail / Stacked Gallery */}
                              <div className="flex items-center gap-4 min-w-0 md:w-5/12">
                                {itemCount === 1 ? (
                                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                                    <img
                                      src={firstImage}
                                      alt={firstProduct?.name || 'Product'}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  /* Multiple Products: Stacked depth-effect image container */
                                  <div className="relative w-16 h-14 sm:w-20 sm:h-16 flex items-center shrink-0">
                                    {order.items.slice(0, 3).map((item, idx) => {
                                      const imgUrl =
                                        item.product?.images?.[0] ||
                                        item.product?.image ||
                                        firstImage;
                                      return (
                                        <div
                                          key={idx}
                                          className="absolute w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden border-2 border-white bg-slate-100 shadow-md transition-transform duration-200 group-hover:translate-x-1"
                                          style={{
                                            left: `${idx * 12}px`,
                                            zIndex: 10 - idx,
                                            transform: `rotate(${(idx - 1) * 6}deg)`
                                          }}
                                        >
                                          <img
                                            src={imgUrl}
                                            alt={item.product?.name || ''}
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                      );
                                    })}
                                    {itemCount > 3 && (
                                      <div
                                        className="absolute w-7 h-7 rounded-full bg-[#2B080C] text-white font-bold text-[10px] flex items-center justify-center border-2 border-white shadow-lg z-20"
                                        style={{ left: `${2 * 12 + 18}px` }}
                                      >
                                        +{itemCount - 3}
                                      </div>
                                    )}
                                  </div>
                                )}

                                <div className="min-w-0 flex-1">
                                  <p className="font-bold text-[#2C3539] group-hover:text-[#2B080C] transition-colors truncate text-xs sm:text-sm">
                                    {firstProduct?.name || 'Order Package'}
                                  </p>
                                  {itemCount > 1 && (
                                    <span className="inline-block mt-0.5 px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold border border-slate-200">
                                      +{itemCount - 1} more item{itemCount - 1 > 1 ? 's' : ''}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Center Section: Order Info */}
                              <div className="space-y-1 md:w-4/12">
                                <div className="flex items-center gap-2 font-bold text-[#2C3539]">
                                  <span className="font-mono text-sm tracking-tight text-[#2C3539]">#{order.id}</span>
                                  <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2.5 py-0.5 rounded-full font-extrabold border border-emerald-300/60">
                                    {order.status}
                                  </span>
                                </div>
                                <p className="text-slate-500 font-medium text-[11px]">
                                  Date: <span className="text-slate-800">{order.date}</span> | <span className="font-semibold text-slate-700">{itemCount} Item(s)</span>
                                </p>
                                <p className="text-slate-500 truncate text-[11px]" title={shippingAddrStr}>
                                  Delivery to: <span className="text-slate-700 font-medium">{shippingAddrStr}</span>
                                </p>
                              </div>

                              {/* Right Section: Pricing & Delivery ETA */}
                              <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 md:w-3/12">
                                <div className="text-right">
                                  <div className="text-base font-black text-[#2B080C] font-mono">
                                    ৳{order.total.toFixed(2)}
                                  </div>
                                  <div className="text-[11px] text-emerald-700 font-bold mt-0.5 flex items-center md:justify-end gap-1">
                                    <Clock className="w-3 h-3 text-emerald-600" />
                                    <span>Est: {order.estimatedDelivery}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 text-[11px] font-bold text-[#2B080C] opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                                  <span>View Details</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 3: MY REVIEWS */}
          {accountTab === 'reviews' && (
            <div className={`bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4 ${slideDirection === 'right' ? 'animate-tab-slide-right' : 'animate-tab-slide-left'}`}>
              <h3 className="text-base font-bold text-[#2C3539] flex items-center gap-2">
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
              <h3 className="text-base font-bold text-[#2C3539] flex items-center gap-2">
                <XCircle className="w-5 h-5 text-slate-600" /> Returns & Cancellations
              </h3>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-[#2C3539]">No Active Return Requests</h4>
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
