import React, { useState } from 'react';
import { X, Mail, Lock, ArrowRight, Chrome } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { supabase } from '../lib/supabase';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, signInWithGoogle, showToast, navigateToAccount } = useStore();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleAutoFill = () => {
    setEmail('test@example.com');
    setPassword('password123');
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) {
          if (error.message.includes('already registered') || error.message.includes('already exists')) {
            throw new Error("An account with this email already exists. Please Sign In instead.");
          }
          throw error;
        }
        
        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: fullName,
            email: email,
            phone_number: phone,
            shipping_address: shippingAddress,
            city_district: 'N/A',
            updated_at: new Date().toISOString()
          });
        }

        showToast('Account created successfully! Logging you in...', 'success');
        setIsAuthModalOpen(false);
        navigateToAccount('overview');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          throw new Error("Invalid email or password. Please try again.");
        }
        showToast('Signed in successfully', 'success');
        setIsAuthModalOpen(false);
        navigateToAccount('overview');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl relative border border-slate-200 max-h-[90vh] flex flex-col">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 overflow-y-auto">
          <div className="mb-6 text-center">
          <h3 className="text-2xl font-bold text-slate-900 font-serif">
            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'signin'
              ? 'Sign in to access your orders and saved items.'
              : 'Join us to track orders, save items, and more.'}
          </p>
        </div>

        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <Chrome className="w-5 h-5 text-blue-500" />
          {mode === 'signin' ? 'Sign In with Google' : 'Sign Up with Google'}
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white text-slate-400 uppercase tracking-wider font-semibold">
              Or continue with email
            </span>
          </div>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Phone Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="+8801..."
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Shipping Address</label>
                <div className="relative">
                  <textarea
                    required
                    rows={2}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    placeholder="House, Road, Area..."
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
          
          <button 
            type="button" 
            onClick={handleAutoFill} 
            className="w-full text-center text-xs text-slate-400 underline hover:text-slate-600 mt-2"
          >
            Auto-fill Test Credentials
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 pb-2">
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin');
              setEmail('');
              setPassword('');
              setFullName('');
              setPhone('');
              setShippingAddress('');
            }}
            className="font-bold text-emerald-600 hover:text-emerald-700 underline"
          >
            {mode === 'signin' ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};
