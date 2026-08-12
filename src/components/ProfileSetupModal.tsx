import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types';

export const ProfileSetupModal: React.FC = () => {
  const { user, profile, setProfile, isProfileSetupRequired, setIsProfileSetupRequired, showToast } = useStore();
  const [loading, setLoading] = useState(false);
  const [isCancellable, setIsCancellable] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    shipping_address: '',
    city_district: '',
    secondary_phone: '',
    delivery_instructions: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone_number: profile.phone_number || '',
        shipping_address: profile.shipping_address || '',
        city_district: profile.city_district || '',
        secondary_phone: profile.secondary_phone || '',
        delivery_instructions: profile.delivery_instructions || ''
      });
      
      // If they already have mandatory fields, they are just editing, so they can cancel
      if (profile.full_name && profile.phone_number && profile.shipping_address && profile.city_district) {
        setIsCancellable(true);
      }
    } else if (user?.user_metadata) {
      setFormData(prev => ({
        ...prev,
        full_name: user.user_metadata.full_name || user.user_metadata.name || prev.full_name,
        phone_number: user.user_metadata.phone_number || prev.phone_number,
        shipping_address: user.user_metadata.shipping_address || prev.shipping_address
      }));
      setIsCancellable(false);
    }
  }, [profile, user]);

  if (!isProfileSetupRequired || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updates = {
        id: user.id,
        ...formData,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);
      
      if (error) {
        if (error.code === 'PGRST205') {
          // profiles table does not exist, fall back to optimistic local state
          console.warn('Profiles table missing, falling back to local state');
        } else {
          throw error;
        }
      }

      setProfile(updates as UserProfile);
      setIsProfileSetupRequired(false);
      showToast('Profile setup complete!', 'success');
    } catch (err: any) {
      showToast('Error saving profile: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl p-6 sm:p-8 relative border border-slate-200 overflow-y-auto max-h-[90vh]">
        <button
          onClick={() => setIsProfileSetupRequired(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-[#2C3539] hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 text-center">
          <h3 className="text-2xl font-bold text-[#2C3539] font-serif">
            Complete Your Profile
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Please fill in your details to continue. Mandatory fields are required for shipping.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Full Name *</label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="John Doe"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Phone Number *</label>
              <input
                type="tel"
                required
                value={formData.phone_number}
                onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="+8801..."
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Secondary Phone (Optional)</label>
              <input
                type="tel"
                value={formData.secondary_phone}
                onChange={(e) => setFormData({...formData, secondary_phone: e.target.value})}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="+8801..."
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Primary Shipping Address *</label>
            <textarea
              required
              rows={2}
              value={formData.shipping_address}
              onChange={(e) => setFormData({...formData, shipping_address: e.target.value})}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="House, Road, Area..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">City / District *</label>
            <input
              type="text"
              required
              value={formData.city_district}
              onChange={(e) => setFormData({...formData, city_district: e.target.value})}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Dhaka"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Special Delivery Instructions (Optional)</label>
            <textarea
              rows={2}
              value={formData.delivery_instructions}
              onChange={(e) => setFormData({...formData, delivery_instructions: e.target.value})}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="Leave at reception, call before delivery..."
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#2B080C] text-white rounded-xl text-sm font-bold hover:bg-[#380B0F] transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? 'Saving Profile...' : 'Save & Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
