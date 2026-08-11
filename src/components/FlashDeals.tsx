import React, { useState, useEffect } from 'react';
import { PRODUCTS } from '../data/mockData';
import { ProductCard } from './ProductCard';
import { Timer, Zap, Flame } from 'lucide-react';

export const FlashDeals: React.FC = () => {
  const dealProducts = PRODUCTS.filter((p) => p.isDeal);

  // Countdown state
  const [timeLeft, setTimeLeft] = useState({
    hours: 13,
    minutes: 42,
    seconds: 19
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (dealProducts.length === 0) return null;

  return (
    <section className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-10 my-6 bg-white border border-[#E5E7EB] rounded-3xl shadow-xs">
      {/* Header with Countdown */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#2B080C] text-white rounded-2xl flex items-center justify-center font-black shadow-md shrink-0">
            <Flame className="w-6 h-6 fill-current animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[#2B080C] font-extrabold text-xs uppercase tracking-widest">
              <Zap className="w-4 h-4 fill-current" /> Limited Time Flash Sale
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] font-serif">
              Today's Special Deals
            </h2>
          </div>
        </div>

        {/* Live Countdown Box */}
        <div className="flex items-center gap-3 bg-[#F9FAFB] px-5 py-3 rounded-2xl shadow-xs border border-[#E5E7EB] shrink-0">
          <Timer className="w-5 h-5 text-[#2B080C]" />
          <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Ends In:</span>
          <div className="flex items-center gap-1.5 font-mono text-base font-extrabold text-[#111827]">
            <span className="bg-[#0B0E14] text-white px-2 py-1 rounded-lg">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span>:</span>
            <span className="bg-[#0B0E14] text-white px-2 py-1 rounded-lg">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span>:</span>
            <span className="bg-[#2B080C] text-white px-2 py-1 rounded-lg animate-pulse">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Deal Products Grid - 5 columns on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {dealProducts.map((product) => (
          <div key={product.id} className="relative flex flex-col justify-between h-full">
            <div className="flex-1">
              <ProductCard product={product} />
            </div>
            {/* Stock Progress Bar */}
            <div className="mt-2.5 px-2.5 py-2 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] text-xs">
              <div className="flex justify-between text-[10px] sm:text-[11px] font-semibold text-[#6B7280] mb-1">
                <span>Claimed: 78%</span>
                <span className="text-[#2B080C] font-bold">Only {product.stock} left</span>
              </div>
              <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#2B080C] h-full rounded-full w-[78%]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
