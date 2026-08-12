import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, ShieldCheck, Truck, RotateCcw, Banknote, FileText } from 'lucide-react';

export const PolicyModal: React.FC = () => {
  const { activePolicyModal, setActivePolicyModal } = useStore();

  if (!activePolicyModal) return null;

  const getContent = () => {
    switch (activePolicyModal) {
      case 'shipping':
        return {
          title: 'Shipping & Delivery Policy',
          icon: <Truck className="w-6 h-6 text-sky-600" />,
          body: (
            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                <strong>Express Delivery:</strong> Orders over ৳60 qualify for FREE Express Shipping (2-3 business days). Orders under ৳60 incur a flat ৳4.99 shipping fee.
              </p>
              <p>
                <strong>Order Processing:</strong> All orders placed before 2:00 PM EST are processed and dispatched on the same business day.
              </p>
              <p>
                <strong>Real-Time Live Tracking:</strong> As soon as your order leaves our fulfillment center, you will receive an SMS and email notification with a live tracking number (#ORD-XXXXX).
              </p>
            </div>
          )
        };

      case 'cod':
        return {
          title: 'Cash on Delivery (COD) Rules',
          icon: <Banknote className="w-6 h-6 text-amber-600" />,
          body: (
            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                <strong>Inspect Before Cash Payment:</strong> Our Cash on Delivery (COD) service allows you to inspect your package upon doorstep arrival before handing over cash to the courier representative.
              </p>
              <p>
                <strong>Exact Change Preferred:</strong> Please ensure you have the exact order amount ready in cash when the delivery associate arrives.
              </p>
              <p>
                <strong>Order Verification:</strong> Orders selecting COD will receive a quick SMS/Phone confirmation prior to dispatch.
              </p>
            </div>
          )
        };

      case 'returns':
        return {
          title: '30-Day Return & Refund Guarantee',
          icon: <RotateCcw className="w-6 h-6 text-emerald-600" />,
          body: (
            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                <strong>No-Questions-Asked 30 Days:</strong> If you are not completely satisfied with your item, you may request a return or exchange within 30 days of delivery.
              </p>
              <p>
                <strong>Prepaid Return Labels:</strong> We provide prepaid return shipping labels for all defective or size-exchange items.
              </p>
              <p>
                <strong>Fast Refund Processing:</strong> Refunds are processed back to your original payment method (or store credit for COD orders) within 2-3 business days of return receipt.
              </p>
            </div>
          )
        };

      case 'privacy':
      default:
        return {
          title: 'Privacy & Data Protection',
          icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
          body: (
            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                <strong>256-Bit SSL Security:</strong> Your personal information and checkout details are encrypted using industry-standard SSL technology.
              </p>
              <p>
                <strong>Zero Selling of Personal Data:</strong> We never sell, rent, or trade your personal email, phone number, or delivery address with third-party advertisers.
              </p>
            </div>
          )
        };
    }
  };

  const content = getContent();

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl p-6 sm:p-8 relative border border-slate-200">
        <button
          onClick={() => setActivePolicyModal(null)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-[#2C3539] hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-slate-100 rounded-2xl">{content.icon}</div>
          <h3 className="text-xl font-bold text-[#2C3539] font-serif">{content.title}</h3>
        </div>

        <div className="pt-2 border-t border-slate-100">{content.body}</div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => setActivePolicyModal(null)}
            className="px-6 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
