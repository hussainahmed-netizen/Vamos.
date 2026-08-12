import React from 'react';
import { useStore } from '../context/StoreContext';
import { CategoryId } from '../types';
import { ArrowRight, Layers } from 'lucide-react';

export const CategoryShowcase: React.FC = () => {
  const { navigateToCategory, categories } = useStore();

  return (
    <section className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#2B080C] font-bold text-xs uppercase tracking-widest mb-1">
            <Layers className="w-4 h-4" /> Curated Collections
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C3539] font-serif">
            Shop by Category
          </h2>
        </div>
        <button
          onClick={() => navigateToCategory('all')}
          className="text-sm font-bold text-[#2C3539] hover:text-[#2B080C] flex items-center gap-1 group"
        >
          View All Categories <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => navigateToCategory(cat.id as CategoryId)}
            className="group relative bg-[#0B0E14] rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer aspect-3/4 flex flex-col justify-end p-4 border border-[#E5E7EB]"
          >
            {/* Image background with gradient overlay */}
            <img
              src={cat.image}
              alt={cat.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-70 group-hover:opacity-85"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/40 to-transparent" />

            {/* Badge */}
            {cat.badge && (
              <span className="absolute top-3 left-3 bg-[#2B080C] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full z-10 shadow-xs">
                {cat.badge}
              </span>
            )}

            {/* Text Copy */}
            <div className="relative z-10 space-y-1">
              <p className="text-xs font-semibold text-slate-200 font-mono">
                {cat.itemCount} Items
              </p>
              <h3 className="text-sm font-bold text-white leading-snug group-hover:underline transition-colors">
                {cat.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
