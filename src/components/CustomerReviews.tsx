import React from 'react';
import { useStore } from '../context/StoreContext';
import { Star, CheckCircle2, ThumbsUp, MessageSquarePlus, Quote } from 'lucide-react';

export const CustomerReviews: React.FC = () => {
  const { reviewsList, setIsReviewModalOpen } = useStore();

  return (
    <section className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-12 my-6">
      {/* Section Title & Score Overview */}
      <div className="bg-[#0B0E14] text-white rounded-3xl p-8 sm:p-12 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest">
            <Quote className="w-4 h-4 text-[#2B080C]" /> Real Buyer Testimonials
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-slate-100">
            Loved by 50,000+ Customers
          </h2>
          <p className="text-sm text-slate-300 max-w-lg">
            See what verified shoppers say about product quality, shipping speed, and Cash on Delivery service.
          </p>
        </div>

        {/* Rating Score Card */}
        <div className="flex items-center gap-6 bg-[#0D1117] p-6 rounded-2xl border border-slate-800 shrink-0">
          <div className="text-center pr-6 border-r border-slate-800">
            <div className="text-4xl font-extrabold text-white font-mono">4.92</div>
            <div className="text-xs text-slate-400 font-medium mt-1">out of 5 stars</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" /> 99.4% Positive Ratings
            </div>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-4 py-2 bg-[#2B080C] hover:bg-[#380B0F] text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 border border-white/10"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" /> Write a Review
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reviewsList.map((review) => (
          <div
            key={review.id}
            className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              {/* Rating Stars & Date */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < review.rating ? 'fill-current' : 'text-slate-200 fill-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-slate-400 font-medium">{review.date}</span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{review.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed italic">"{review.comment}"</p>
            </div>

            {/* Author details */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={
                    review.avatar ||
                    `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80`
                  }
                  alt={review.author}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block leading-none">
                    {review.author}
                  </span>
                  {review.verified && (
                    <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5 mt-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Verified Buyer
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <ThumbsUp className="w-3 h-3 text-slate-400" />
                <span>{review.likes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
