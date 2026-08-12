import React, { useState } from 'react';
import { FAQS } from '../data/mockData';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-12 my-6">
      <div className="text-center space-y-2 mb-10">
        <div className="inline-flex items-center gap-1.5 text-[#2B080C] font-bold text-xs lg:text-sm uppercase tracking-widest bg-[#2B080C]/10 border border-[#2B080C]/20 px-3 py-1 rounded-full">
          <HelpCircle className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> Frequently Asked Questions
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2C3539] font-serif">
          Got Questions? We Have Answers.
        </h2>
        <p className="text-sm lg:text-base text-[#6B7280]">
          Everything you need to know about ordering, delivery times, and Cash on Delivery.
        </p>
      </div>

      <div className="space-y-3.5">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen ? 'bg-white border-[#2B080C] shadow-md' : 'bg-[#F9FAFB] border-[#E5E7EB] hover:border-slate-300'
              }`}
            >
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full p-4 sm:p-5 lg:p-6 text-left flex items-center justify-between gap-3 sm:gap-4 font-bold text-[#2C3539]"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 min-w-0 flex-1">
                  <span className={`text-[13px] sm:text-base lg:text-lg leading-snug transition-all ${isOpen ? 'whitespace-normal' : 'truncate'}`}>
                    {faq.question}
                  </span>
                  <span className="self-start sm:self-auto inline-block text-[10px] sm:text-xs lg:text-sm font-semibold text-[#2B080C] bg-[#2B080C]/10 px-2 py-0.5 sm:px-2.5 rounded-full shrink-0">
                    {faq.category}
                  </span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 lg:w-6 lg:h-6 text-[#2B080C] shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 lg:w-6 lg:h-6 text-[#6B7280] shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 lg:px-6 pb-4 sm:pb-5 lg:pb-6 pt-3 sm:pt-4 text-[12px] sm:text-sm lg:text-base text-[#6B7280] leading-relaxed border-t border-[#E5E7EB]">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
