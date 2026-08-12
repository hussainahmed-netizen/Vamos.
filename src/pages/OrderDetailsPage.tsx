import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Order, PaymentStatus } from '../types';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  Navigation,
  MapPin,
  CreditCard,
  Download,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  Building,
  FileText,
  AlertCircle,
  HelpCircle,
  ShoppingBag
} from 'lucide-react';

interface OrderDetailsPageProps {
  orderId?: string | null;
  onBack?: () => void;
}

export const OrderDetailsPage: React.FC<OrderDetailsPageProps> = ({ orderId, onBack }) => {
  const {
    ordersHistory,
    currentOrder,
    selectedOrderId,
    setSelectedOrderId,
    setAccountTab,
    navigateToProduct,
    showToast
  } = useStore();

  const activeId = orderId || selectedOrderId;

  // Find order from history or current order
  const allOrders = currentOrder ? [currentOrder, ...ordersHistory] : ordersHistory;
  const targetOrder = allOrders.find((o) => o.id.toUpperCase() === (activeId || '').toUpperCase()) || allOrders[0];

  const activeStatus = targetOrder.status || 'Processing';

  if (!targetOrder) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-4 max-w-2xl mx-auto my-8">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Order Not Found</h2>
        <p className="text-sm text-slate-500">
          We couldn't find details for order ID <span className="font-mono font-bold">{activeId}</span>.
        </p>
        <button
          onClick={() => {
            setSelectedOrderId(null);
            setAccountTab('orders');
            if (onBack) onBack();
          }}
          className="px-5 py-2.5 bg-[#2B080C] text-white font-bold text-xs rounded-xl hover:bg-[#380B0F] transition-all"
        >
          Back to My Orders
        </button>
      </div>
    );
  }

  const handleBackNavigation = () => {
    setSelectedOrderId(null);
    setAccountTab('orders');
    window.history.pushState({}, '', '/account/orders');
    if (onBack) onBack();
  };

  // Helper for Payment Status Badge
  const renderPaymentStatusBadge = (status?: PaymentStatus, method?: string) => {
    const resolvedStatus = status || (method === 'cod' ? 'cod' : 'online_paid');

    switch (resolvedStatus) {
      case 'online_paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300/80 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Online Paid
          </span>
        );
      case 'half_paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300/80 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            Half Paid / Partial Payment
          </span>
        );
      case 'delivery_charge_paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#2B080C]/10 text-[#2B080C] border border-[#2B080C]/30 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2B080C]" />
            Delivery Charge Paid Only
          </span>
        );
      case 'cod':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300/80 shadow-2xs">
            <CreditCard className="w-3.5 h-3.5 text-amber-600" />
            Cash on Delivery
          </span>
        );
    }
  };

  // 5 Step Order Tracker Logic
  const steps = [
    { id: 'Order Placed', label: 'Order Placed', icon: FileText, desc: 'Received & Confirmed' },
    { id: 'Processing', label: 'Processing', icon: Package, desc: 'Warehouse Dispatch' },
    { id: 'Shipped', label: 'Handed to Courier', icon: Truck, desc: 'In Transit' },
    { id: 'Out for Delivery', label: 'Out for Delivery', icon: Navigation, desc: 'On Delivery Van' },
    { id: 'Delivered', label: 'Delivered', icon: CheckCircle2, desc: 'Handed to Customer' }
  ];

  const getStepIndex = (st: string) => {
    switch (st) {
      case 'Order Placed': return 0;
      case 'Processing': return 1;
      case 'Shipped': return 2;
      case 'Out for Delivery': return 3;
      case 'Delivered': return 4;
      default: return 1;
    }
  };

  const currentStepIdx = getStepIndex(activeStatus);

  // Financial calculations with fallbacks
  const subtotal = targetOrder.subtotal || targetOrder.items.reduce((acc, i) => acc + (i.product.price * i.quantity), 0);
  const shippingFee = targetOrder.shippingFee ?? 0;
  const discount = targetOrder.discount ?? 0;
  const total = targetOrder.total || (subtotal + shippingFee - discount);
  
  // Calculate amount paid and due amount based on status
  let amountPaid = targetOrder.amountPaid;
  if (amountPaid === undefined) {
    if (targetOrder.paymentStatus === 'online_paid') amountPaid = total;
    else if (targetOrder.paymentStatus === 'delivery_charge_paid') amountPaid = shippingFee || 4.99;
    else if (targetOrder.paymentStatus === 'half_paid') amountPaid = Math.round((total / 2) * 100) / 100;
    else amountPaid = 0; // COD
  }
  
  const dueAmount = targetOrder.dueAmount !== undefined ? targetOrder.dueAmount : Math.max(0, total - amountPaid);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <button
          onClick={handleBackNavigation}
          className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-700 hover:text-[#2B080C] bg-white border border-slate-200 hover:border-slate-300 px-4 py-2.5 rounded-xl transition-all hover:shadow-2xs active:scale-[0.98] w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Orders
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast(`Invoice downloaded for Order #${targetOrder.id}`, 'success')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" /> Invoice PDF
          </button>
          <button
            onClick={() => showToast('Support ticket initiated for this shipment', 'info')}
            className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" /> Need Help?
          </button>
        </div>
      </div>

      {/* Main Order Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-mono">
                #{targetOrder.id}
              </h1>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-300/60">
                {activeStatus}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Placed on: <strong className="text-slate-800">{targetOrder.date}</strong></span>
              <span>•</span>
              <span>Estimated Delivery: <strong className="text-emerald-800 font-semibold">{targetOrder.estimatedDelivery}</strong></span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Payment Status:</span>
            {renderPaymentStatusBadge(targetOrder.paymentStatus, targetOrder.paymentMethod)}
          </div>
        </div>

        {/* STEP-BY-STEP TRACKER STEPPER */}
        <div className="pt-2 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#2B080C]" /> Live Shipment Tracking Status
            </h3>
          </div>

          {/* Stepper Grid Container */}
          <div className="relative my-6">
            {/* Background connecting bar */}
            <div className="hidden md:block absolute top-1/2 left-8 right-8 h-1 bg-slate-200 -translate-y-1/2 z-0" />
            {/* Active connecting bar */}
            <div
              className="hidden md:block absolute top-1/2 left-8 h-1 bg-emerald-500 -translate-y-1/2 transition-all duration-500 z-0"
              style={{
                width: `${(currentStepIdx / (steps.length - 1)) * 88}%`
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
              {steps.map((step, idx) => {
                const IconComp = step.icon;
                const isCompleted = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div
                    key={step.id}
                    className={`flex md:flex-col items-center gap-3 md:gap-2 p-3 md:p-2 rounded-xl transition-all ${
                      isCurrent
                        ? 'bg-emerald-50/80 border border-emerald-200 md:border-0 shadow-2xs'
                        : ''
                    }`}
                  >
                    {/* Circle Node */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-600 text-white shadow-md ring-4 ring-emerald-100'
                          : 'bg-slate-100 text-slate-400 border border-slate-300'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : (
                        <IconComp className="w-4 h-4 text-slate-400" />
                      )}
                    </div>

                    {/* Step Labels */}
                    <div className="md:text-center min-w-0">
                      <p
                        className={`text-xs font-bold ${
                          isCompleted ? 'text-slate-900' : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout: Left Column (Purchased Items) & Right Column (Billing + Delivery Info) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Purchased Items List (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#2B080C]" /> Order Items ({targetOrder.items.length})
              </h3>
              <span className="text-xs text-slate-500 font-mono">Unit Prices in BDT (৳)</span>
            </div>

            <div className="divide-y divide-slate-100">
              {targetOrder.items.map((item, index) => {
                const prodImage =
                  item.product?.images?.[0] ||
                  item.product?.image ||
                  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';
                
                const itemSubtotal = item.product.price * item.quantity;

                return (
                  <div key={index} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                    <button
                      onClick={() => navigateToProduct(item.product.id)}
                      className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 rounded-xl overflow-hidden border border-slate-200 shrink-0 group hover:border-[#2B080C] transition-all"
                    >
                      <img
                        src={prodImage}
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </button>

                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => navigateToProduct(item.product.id)}
                        className="text-left text-sm font-bold text-slate-900 hover:text-[#2B080C] transition-colors truncate block w-full"
                      >
                        {item.product.name}
                      </button>

                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                        {item.selectedColor && (
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-200">
                            Color: {item.selectedColor}
                          </span>
                        )}
                        {item.selectedSize && (
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-200">
                            Size: {item.selectedSize}
                          </span>
                        )}
                        <span className="font-semibold text-slate-700">
                          Qty: {item.quantity} × ৳{item.product.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-extrabold text-slate-900 font-mono">
                        ৳{itemSubtotal.toFixed(2)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Payment & Billing Breakdown + Shipping Address (1 Col) */}
        <div className="space-y-6">
          {/* Billing & Payment Summary Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Payment Breakdown</span>
              <CreditCard className="w-4 h-4 text-slate-400" />
            </h3>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-mono font-semibold text-slate-900">৳{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span className="font-mono font-semibold text-slate-900">
                  {shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `৳${shippingFee.toFixed(2)}`}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount Savings:</span>
                  <span className="font-mono font-bold">-৳{discount.toFixed(2)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900">
                <span>Total Order Amount:</span>
                <span className="font-mono text-[#2B080C] text-base">৳{total.toFixed(2)}</span>
              </div>

              {/* Payment Status & Due Breakdown */}
              <div className="mt-4 pt-3 bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Amount Paid:</span>
                  <span className="font-mono text-emerald-700">৳{amountPaid.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-xs font-bold">
                  <span>Remaining Due Amount:</span>
                  <span className={`font-mono text-sm ${dueAmount > 0 ? 'text-rose-600 font-extrabold' : 'text-slate-700'}`}>
                    ৳{dueAmount.toFixed(2)}
                  </span>
                </div>

                {dueAmount > 0 && (
                  <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded border border-amber-200 font-medium">
                    ⚠️ Remaining balance of ৳{dueAmount.toFixed(2)} will be collected upon delivery via Cash on Delivery or Mobile Payment.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Shipping Destination</span>
              <MapPin className="w-4 h-4 text-[#2B080C]" />
            </h3>

            <div className="text-xs space-y-2 text-slate-700">
              <p className="font-extrabold text-slate-900 text-sm">
                {targetOrder.shippingAddress?.fullName || 'John Doe'}
              </p>
              
              <div className="flex items-start gap-2 text-slate-600">
                <Building className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <span>
                  {targetOrder.shippingAddress?.address || 'House 42, Road 11, Banani'},{' '}
                  {targetOrder.shippingAddress?.city || 'Dhaka'},{' '}
                  {targetOrder.shippingAddress?.country || 'Bangladesh'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{targetOrder.shippingAddress?.phone || '+880 1700-000000'}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{targetOrder.shippingAddress?.email || 'johndoe@example.com'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
