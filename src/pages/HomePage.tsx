import React from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { CategoryShowcase } from '../components/CategoryShowcase';
import { FlashDeals } from '../components/FlashDeals';
import { ProductCard } from '../components/ProductCard';
import { TrustBadges } from '../components/TrustBadges';
import { CustomerReviews } from '../components/CustomerReviews';
import { BrandStory } from '../components/BrandStory';
import { FAQSection } from '../components/FAQSection';
import { Newsletter } from '../components/Newsletter';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Flame } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { setView, setSelectedCategory, products, isLoading } = useStore();

  const bestSellers = products.filter((p) => p.isBestSeller);
  const newArrivals = products.filter((p) => p.isNewArrival);
  const featuredProducts = products.slice(0, 10);

  if (isLoading) {
    return (
      <div className="max-w-[1536px] mx-auto px-4 py-12 space-y-8 animate-pulse">
        <div className="h-96 bg-slate-200 rounded-3xl w-full"></div>
        <div className="h-10 bg-slate-200 rounded w-1/4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-slate-200 rounded-2xl w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* 1. Hero Promo Banner */}
      <HeroBanner />

      {/* 2. Category Showcase Row */}
      <CategoryShowcase />

      {/* 3. Limited Time Flash Deals Section */}
      <FlashDeals />

      {/* 4. Best Sellers Featured Grid */}
      <section className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#2B080C] font-bold text-xs uppercase tracking-widest mb-1">
              <Flame className="w-4 h-4 fill-current" /> Customer Favorites
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] font-serif">
              Best Seller Products
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setView('shop');
            }}
            className="text-sm font-bold text-[#111827] hover:text-[#2B080C] flex items-center gap-1 group"
          >
            Explore Best Sellers <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Featured Products Grid (5 cols x 2 rows on desktop) */}
      <section className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#2B080C] font-bold text-xs uppercase tracking-widest mb-1">
              HANDPICKED SELECTION
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] font-serif">
              Featured Products
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setView('shop');
            }}
            className="text-sm font-bold text-[#111827] hover:text-[#2B080C] flex items-center gap-1 group"
          >
            Explore Featured <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Trust Badges Row */}
      <TrustBadges />

      {/* 6. New Arrivals Grid */}
      <section className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#2B080C] font-bold text-xs uppercase tracking-widest mb-1">
              Fresh In Store
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] font-serif">
              New Arrivals
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setView('shop');
            }}
            className="text-sm font-bold text-[#111827] hover:text-[#2B080C] flex items-center gap-1 group"
          >
            Shop New Arrivals <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. Customer Reviews & Testimonials */}
      <CustomerReviews />

      {/* 8. Brand Story & Statistics */}
      <BrandStory />

      {/* 9. FAQ Section */}
      <FAQSection />

      {/* 10. Newsletter Signup with Voucher */}
      <Newsletter />
    </div>
  );
};
