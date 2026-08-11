import React from 'react';
import { Award, Users, Globe2, Sparkles, CheckCircle2 } from 'lucide-react';
import { useBrand } from '../context/BrandContext';

export const BrandStory: React.FC = () => {
  const { brandConfig } = useBrand();
  return (
    <section className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-12 my-6">
      <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-8 shadow-xs">
        {/* Left Copy Column */}
        <div className="p-8 sm:p-12 flex flex-col justify-center space-y-6">
          <div className="inline-flex items-center gap-2 text-[#2B080C] font-bold text-xs uppercase tracking-widest bg-[#2B080C]/10 border border-[#2B080C]/20 w-fit px-3 py-1 rounded-full">
            Our Brand Philosophy
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] font-serif leading-tight">
            Crafting Uncompromising Quality for Modern Lifestyles
          </h2>

          <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed">
            Founded with a vision to redefine online shopping, <strong>{brandConfig.brandName} Store</strong> delivers handpicked premium audio, wearables, artisan leather, and home lifestyle essentials directly to your doorstep.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#2B080C] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-[#111827]">100% Authentic Quality</h4>
                <p className="text-[11px] text-[#6B7280]">Directly from certified artisans & lab specs</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#2B080C] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-[#111827]">Doorstep Cash on Delivery</h4>
                <p className="text-[11px] text-[#6B7280]">Inspect before paying in cash</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#2B080C] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-[#111827]">30-Day Guarantee</h4>
                <p className="text-[11px] text-[#6B7280]">Zero-risk instant replacement or refund</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#2B080C] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-[#111827]">24/7 Priority Support</h4>
                <p className="text-[11px] text-[#6B7280]">Dedicated customer care desk</p>
              </div>
            </div>
          </div>

          {/* Stats Badges */}
          <div className="pt-6 border-t border-[#E5E7EB] grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-black text-[#111827] font-mono">50K+</div>
              <div className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Happy Shoppers</div>
            </div>
            <div>
              <div className="text-2xl font-black text-[#2B080C] font-mono">99.4%</div>
              <div className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">On-time Delivery</div>
            </div>
            <div>
              <div className="text-2xl font-black text-[#111827] font-mono">4.92★</div>
              <div className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Product Rating</div>
            </div>
          </div>
        </div>

        {/* Right Image Grid */}
        <div className="relative min-h-[360px] lg:min-h-full">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80"
            alt={`${brandConfig.brandName} Store Studio`}
            className="w-full h-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-8">
            <div className="text-white space-y-1">
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Global Standard</p>
              <p className="text-sm font-semibold text-slate-200">
                Ethically crafted, rigorously inspected, and delivered with care.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
