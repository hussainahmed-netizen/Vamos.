import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Mail, Gift, CheckCircle2, ArrowRight } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const { showToast, applyCoupon } = useStore();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    setIsSubscribed(true);
    applyCoupon('WELCOME10');
    showToast('Subscribed! Promo code WELCOME10 applied to your cart.', 'success');
  };

  return (
    <section className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-12 my-6">
      <div className="bg-[#0B0E14] text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-2xl border border-slate-800">
        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
          <div className="w-14 h-14 bg-[#2B080C] text-white border border-white/10 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Gift className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-slate-100">
              Get ৳100 OFF Your First Order
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Subscribe to our VIP newsletter for exclusive flash sales, secret promo drops, and new product launch invites.
            </p>
          </div>

          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your personal email..."
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-[#0D1117] border border-slate-700 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2B080C] transition-all"
                />
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-[#2B080C] hover:bg-[#380B0F] text-white font-bold text-sm rounded-2xl transition-all duration-300 shadow-lg hover:scale-105 flex items-center justify-center gap-2 shrink-0 border border-white/10"
              >
                <span>Claim ৳100 Code</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="p-4 bg-emerald-900/60 border border-emerald-500/40 rounded-2xl text-emerald-300 text-sm font-semibold flex items-center justify-center gap-2 max-w-md mx-auto animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>You're subscribed! Use promo code <strong>WELCOME10</strong> for 10% OFF.</span>
            </div>
          )}

          <p className="text-[11px] text-slate-400">
            🔒 No spam guaranteed. Unsubscribe anytime with one click.
          </p>
        </div>
      </div>
    </section>
  );
};
