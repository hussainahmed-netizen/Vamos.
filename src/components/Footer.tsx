import React from 'react';
import { useStore } from '../context/StoreContext';
import { useBrand } from '../context/BrandContext';
import { LogoContainer } from './LogoContainer';
import { CategoryId } from '../types';
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Banknote,
  Mail,
  Phone,
  MapPin,
  Heart,
  Instagram,
  Facebook,
  Twitter,
  Linkedin
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { categories, setView, setSelectedCategory, navigateToCategory, setActivePolicyModal, setIsAccountModalOpen, view } = useStore();
  const { brandConfig } = useBrand();

  return (
    <footer className={`bg-[#0B0E14] text-slate-300 pt-16 pb-12 border-t border-slate-900 mt-16 ${view === 'cart' || view === 'wishlist' || view === 'checkout' || view === 'shop' ? 'mobile-hide-footer' : ''}`}>
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top 4 Value props */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6 text-white shrink-0" />
            <div>
              <p className="font-bold text-slate-100">Free Express Delivery</p>
              <p className="text-slate-400">On all orders over ৳60</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Banknote className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold text-slate-100">Cash on Delivery (COD)</p>
              <p className="text-slate-400">Pay at your doorstep</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RotateCcw className="w-6 h-6 text-slate-200 shrink-0" />
            <div>
              <p className="font-bold text-slate-100">30-Day Easy Returns</p>
              <p className="text-slate-400">100% money-back guarantee</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-white shrink-0" />
            <div>
              <p className="font-bold text-slate-100">Secure 256-Bit SSL</p>
              <p className="text-slate-400">Encrypted payment gateway</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <LogoContainer
                variant="dark"
                size="md"
                onClick={() => setView('home')}
              />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Your premier destination for high-fidelity audio, smart fitness wearables, artisan leather bags, and aesthetic home lifestyle essentials.
            </p>
            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-white shrink-0" />
                <span>100 Innovation Parkway, Suite 400, Tech Plaza</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-white shrink-0" />
                <span>+1 (800) 458-2910 / 24/7 Support Desk</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-white shrink-0" />
                <span>{brandConfig.supportEmail}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Quick Navigation</p>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setView('home')} className="hover:text-white transition-colors">
                  Home Page
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setView('shop');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Shop Catalog
                </button>
              </li>
              <li>
                <button onClick={() => setView('cart')} className="hover:text-white transition-colors">
                  Shopping Cart
                </button>
              </li>
              <li>
                <button onClick={() => setIsAccountModalOpen(true)} className="hover:text-white transition-colors">
                  Account & Order Tracker
                </button>
              </li>
            </ul>
          </div>

          {/* Category Links */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Categories</p>
            <ul className="space-y-2 text-xs text-slate-400">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      navigateToCategory(cat.id as CategoryId);
                    }}
                    className="hover:text-white transition-colors"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies & Customer Care */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Customer Care</p>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setActivePolicyModal('shipping')} className="hover:text-white transition-colors">
                  Shipping & Express Delivery
                </button>
              </li>
              <li>
                <button onClick={() => setActivePolicyModal('cod')} className="hover:text-white transition-colors">
                  Cash on Delivery (COD) Rules
                </button>
              </li>
              <li>
                <button onClick={() => setActivePolicyModal('returns')} className="hover:text-white transition-colors">
                  30-Day Return & Refunds
                </button>
              </li>
              <li>
                <button onClick={() => setActivePolicyModal('privacy')} className="hover:text-white transition-colors">
                  Privacy & Data Protection
                </button>
              </li>
              <li>
                <button onClick={() => setActivePolicyModal('terms')} className="hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & payment methods */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <span>{brandConfig.copyrightText}</span>
          </div>

          {/* Payment Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 bg-[#2B080C] border border-[#2B080C] rounded text-[10px] font-bold text-white">
              CASH ON DELIVERY (COD)
            </span>
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] font-bold text-slate-300">
              VISA
            </span>
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] font-bold text-slate-300">
              MASTERCARD
            </span>
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] font-bold text-slate-300">
              AMEX
            </span>
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] font-bold text-slate-300">
              PAYPAL
            </span>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-4 text-slate-400">
            <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-white transition-colors" aria-label="Facebook">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-white transition-colors" aria-label="LinkedIn">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
