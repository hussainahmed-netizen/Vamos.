import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, ShieldCheck, Truck, Zap } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { setView, setSelectedCategory, navigateToProduct } = useStore();
  const [activeSlide, setActiveSlide] = useState(0);
  const [box2Index, setBox2Index] = useState(0);
  const [box3Index, setBox3Index] = useState(0);

  const slides = [
    {
      title: 'Elevate Your Everyday Essentials',
      subtitle: 'Premium Audio, Smart Wearables & Minimalist Tech Gear',
      highlight: 'SPRING COLLECTION 2026',
      discountTag: 'UP TO 40% OFF',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80',
      ctaText: 'Explore Collection',
      action: () => setView('shop'),
      badge: 'Bestseller Flagship'
    },
    {
      title: 'Active Noise Cancelling Perfection',
      subtitle: 'Experience 40 hours of uncompromised studio-quality wireless audio',
      highlight: 'AURA ACTIVE ANC',
      discountTag: 'SAVE ৳500 TODAY',
      image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1200&auto=format&fit=crop&q=80',
      ctaText: 'View Aura Headphones',
      action: () => navigateToProduct('p1'),
      badge: 'Limited Stock Deal'
    },
    {
      title: 'Modern Handcrafted Leather Goods',
      subtitle: '100% full-grain Italian leather backpacks & tech sleeves',
      highlight: 'ARTISAN LEATHER',
      discountTag: 'FREE EXPRESS SHIPPING',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&auto=format&fit=crop&q=80',
      ctaText: 'Shop Leather Accessories',
      action: () => {
        setSelectedCategory('accessories');
        setView('shop');
      },
      badge: 'Handcrafted Quality'
    }
  ];

  // Box 2 (Top Right) Side Promo Banners - Pure High-Resolution Images
  const box2Promos = [
    {
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      alt: 'Smart Watch Collection',
      action: () => navigateToProduct('p2')
    },
    {
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
      alt: 'Aura Studio Headphones',
      action: () => navigateToProduct('p1')
    },
    {
      image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80',
      alt: 'Artisan Backpack',
      action: () => navigateToProduct('p3')
    }
  ];

  // Box 3 (Bottom Right) Side Promo Banners - Pure High-Resolution Images
  const box3Promos = [
    {
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
      alt: 'Handcrafted Leather Goods',
      action: () => {
        setSelectedCategory('accessories');
        setView('shop');
      }
    },
    {
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      alt: 'Wireless Noise Cancelling Earbuds',
      action: () => navigateToProduct('p4')
    },
    {
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
      alt: 'Minimalist Desk Lamp & Home Accessories',
      action: () => {
        setSelectedCategory('home');
        setView('shop');
      }
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const timer2 = setInterval(() => {
      setBox2Index((prev) => (prev + 1) % box2Promos.length);
    }, 7000);
    return () => clearInterval(timer2);
  }, [box2Promos.length]);

  useEffect(() => {
    const timer3 = setInterval(() => {
      setBox3Index((prev) => (prev + 1) % box3Promos.length);
    }, 8500);
    return () => clearInterval(timer3);
  }, [box3Promos.length]);

  const slide = slides[activeSlide];
  const currentBox2 = box2Promos[box2Index];
  const currentBox3 = box3Promos[box3Index];

  return (
    <section className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 my-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* ====================================================================
           BOX 1: Left Main Hero Banner (~68% width on desktop)
           ==================================================================== */}
        <div className="lg:col-span-8 relative overflow-hidden bg-[#0B0E14] text-white rounded-2xl sm:rounded-3xl shadow-xl flex flex-col justify-between p-5 sm:p-7 lg:p-8 h-[360px] sm:h-[380px] lg:h-[380px]">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              key={activeSlide}
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center opacity-35 scale-105 transition-all duration-1000 ease-out animate-in fade-in"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E14] via-[#0B0E14]/90 to-transparent" />
          </div>

          {/* Foreground Content */}
          <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#2B080C] text-white border border-white/10 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 uppercase tracking-wider backdrop-blur-md">
                {slide.highlight}
              </span>
              <span className="bg-white text-[#2B080C] text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                {slide.discountTag}
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="max-w-xl space-y-2 my-auto">
              <h1 className="text-xl sm:text-3xl lg:text-3xl font-extrabold tracking-tight font-serif text-slate-100 leading-snug">
                {slide.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed line-clamp-2">
                {slide.subtitle}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={slide.action}
                  className="px-5 py-2.5 bg-[#2B080C] hover:bg-[#380B0F] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2 group border border-white/10"
                >
                  <span>{slide.ctaText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setView('shop');
                  }}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm rounded-xl backdrop-blur-md transition-all"
                >
                  Browse All Products
                </button>
              </div>
            </div>

            {/* Bottom Controls & Value Props */}
            <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Carousel Indicators */}
              <div className="flex items-center gap-1.5">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSlide(index)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      activeSlide === index ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/60'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Value Badges */}
              <div className="flex flex-wrap items-center gap-3.5 text-[11px] text-slate-300 font-medium">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-white" /> Free Shipping &gt; ৳60
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Cash on Delivery
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-white" /> 1-Year Warranty
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================================
           BOX 2 & 3: Right Side Banners Container (~32% width on desktop)
           ==================================================================== */}
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2 gap-3.5 sm:gap-4 h-auto lg:h-[380px]">
          {/* BOX 2 (Top Right) */}
          <div
            onClick={currentBox2.action}
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#0B0E14] cursor-pointer group shadow-lg h-[175px] sm:h-[180px] lg:h-full border border-slate-800/60"
            title={currentBox2.alt}
          >
            <img
              key={box2Index}
              src={currentBox2.image}
              alt={currentBox2.alt}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700 ease-out animate-in fade-in"
            />
          </div>

          {/* BOX 3 (Bottom Right) */}
          <div
            onClick={currentBox3.action}
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#0B0E14] cursor-pointer group shadow-lg h-[175px] sm:h-[180px] lg:h-full border border-slate-800/60"
            title={currentBox3.alt}
          >
            <img
              key={box3Index}
              src={currentBox3.image}
              alt={currentBox3.alt}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700 ease-out animate-in fade-in"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

