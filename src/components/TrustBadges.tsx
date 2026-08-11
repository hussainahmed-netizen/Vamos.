import React from 'react';
import { TRUST_BADGES } from '../data/mockData';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Truck, RotateCcw, Banknote } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const { setActivePolicyModal } = useStore();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-8 h-8 text-[#2B080C]" />;
      case 'Truck':
        return <Truck className="w-8 h-8 text-[#2B080C]" />;
      case 'RotateCcw':
        return <RotateCcw className="w-8 h-8 text-[#2B080C]" />;
      case 'Banknote':
        return <Banknote className="w-8 h-8 text-[#2B080C]" />;
      default:
        return <ShieldCheck className="w-8 h-8 text-[#2B080C]" />;
    }
  };

  const getPolicyType = (badgeId: string) => {
    if (badgeId === 'b1') return 'privacy';
    if (badgeId === 'b2') return 'shipping';
    if (badgeId === 'b3') return 'returns';
    if (badgeId === 'b4') return 'cod';
    return null;
  };

  return (
    <section className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-10 my-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-[#F9FAFB] border border-[#E5E7EB] p-6 sm:p-8 rounded-3xl shadow-xs">
        {TRUST_BADGES.map((badge) => (
          <div
            key={badge.id}
            onClick={() => setActivePolicyModal(getPolicyType(badge.id))}
            className="flex items-start gap-4 p-4 rounded-2xl bg-white hover:bg-slate-50 transition-colors border border-[#E5E7EB] cursor-pointer group"
          >
            <div className="p-3 bg-[#F9FAFB] rounded-2xl group-hover:scale-110 transition-transform shrink-0">
              {getIcon(badge.icon)}
            </div>
            <div>
              <h4 className="text-base font-bold text-[#111827] group-hover:text-[#2B080C] transition-colors">
                {badge.title}
              </h4>
              <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
                {badge.subtitle}
              </p>
              <span className="text-[11px] font-semibold text-[#2B080C] mt-2 inline-block group-hover:underline">
                Learn policy →
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
