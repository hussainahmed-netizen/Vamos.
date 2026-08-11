import React from 'react';
import { CATEGORIES, PRODUCTS } from '../data/mockData';
import { useStore } from '../context/StoreContext';
import { CategoryId } from '../types';
import { ArrowLeft, ChevronRight, Check } from 'lucide-react';

export const CategorySidebar: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory
  } = useStore();

  const activeCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <div className="space-y-3">
      {/* SECTION HEADER STRICTLY INTACT AS "CATEGORY" */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-[#2B080C] uppercase tracking-wider font-mono">
          CATEGORY
        </label>
        {selectedCategory !== 'all' && (
          <button
            onClick={() => setSelectedCategory('all', null)}
            className="text-[11px] font-bold text-slate-500 hover:text-[#2B080C] flex items-center gap-1 transition-colors group"
            title="Return to all parent categories"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
            <span>All Categories</span>
          </button>
        )}
      </div>

      <div className="space-y-1">
        {selectedCategory === 'all' ? (
          /* ROOT / ALL CATEGORIES VIEW */
          <>
            <button
              onClick={() => setSelectedCategory('all', null)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#2B080C] text-white shadow-xs font-bold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>All Categories</span>
              </div>
              <span className={selectedCategory === 'all' ? 'text-white/80 font-mono text-[11px]' : 'text-slate-400 font-mono text-[11px]'}>
                ({PRODUCTS.length})
              </span>
            </button>

            {CATEGORIES.map((cat) => {
              const count = PRODUCTS.filter((p) => p.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as CategoryId, null)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all group ${
                    selectedCategory === cat.id
                      ? 'bg-slate-900 text-white shadow-xs font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="truncate">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-slate-400 group-hover:text-slate-600 font-mono text-[11px]">
                      ({count})
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              );
            })}
          </>
        ) : (
          /* CONTEXTUAL ACTIVE CATEGORY & SUB-CATEGORIES VIEW */
          <>
            {/* Top Back Navigation Link */}
            <button
              onClick={() => setSelectedCategory('all', null)}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-[#2B080C] hover:bg-slate-100/80 flex items-center gap-1.5 transition-colors border border-dashed border-slate-200 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#2B080C]" />
              <span>← All Categories</span>
            </button>

            {/* Main Category All Reset Option */}
            <button
              onClick={() => setSelectedSubCategory(null)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                selectedSubCategory === null
                  ? 'bg-[#2B080C] text-white shadow-xs'
                  : 'text-slate-800 bg-slate-100/70 hover:bg-slate-200/80'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                {selectedSubCategory === null && <Check className="w-3.5 h-3.5 shrink-0 text-amber-300" />}
                <span className="truncate">All {activeCategoryObj?.name || 'Items'}</span>
              </div>
              <span className={`font-mono text-[11px] ${selectedSubCategory === null ? 'text-white/80' : 'text-slate-500'}`}>
                ({PRODUCTS.filter((p) => p.category === selectedCategory).length})
              </span>
            </button>

            {/* Mapped Sub-Categories List */}
            {activeCategoryObj?.subCategories.map((sub) => {
              const subCount = PRODUCTS.filter(
                (p) => p.category === selectedCategory && p.subCategory === sub.id
              ).length;
              const isSelected = selectedSubCategory === sub.id;

              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubCategory(sub.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-all pl-5 ${
                    isSelected
                      ? 'bg-slate-900 text-white font-bold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? 'bg-amber-400' : 'bg-slate-300'}`} />
                    <span className="truncate">{sub.name}</span>
                  </div>
                  <span className={`font-mono text-[11px] ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                    ({subCount})
                  </span>
                </button>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};
