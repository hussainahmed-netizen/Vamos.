import React from 'react';
import { Home, Grid, Search, Heart, User } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const BottomNav: React.FC = () => {
  const { view, setView, setIsMobileSearchOpen, wishlist, user, setIsAuthModalOpen } = useStore();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      action: () => setView('home'),
      isActive: view === 'home',
    },
    {
      id: 'catalog',
      label: 'Catalog',
      icon: Grid,
      action: () => setView('shop'),
      isActive: view === 'shop',
    },
    {
      id: 'search',
      label: 'Search',
      icon: Search,
      action: () => setIsMobileSearchOpen(true),
      isActive: false,
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: Heart,
      badge: wishlist.length,
      action: () => setView('wishlist'),
      isActive: view === 'wishlist',
    },
    {
      id: 'account',
      label: 'Account',
      icon: User,
      action: () => {
        if (!user || user.is_anonymous) {
          setIsAuthModalOpen(true);
        } else {
          setView('account');
        }
      },
      isActive: view === 'account',
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200/90 py-2 px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-md">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.action}
              className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-all rounded-xl relative ${
                item.isActive
                  ? 'text-[#2B080C] font-extrabold scale-105'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${item.isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#2B080C] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 leading-none tracking-tight">{item.label}</span>
              {item.isActive && (
                <span className="w-1 h-1 bg-[#2B080C] rounded-full mt-1 animate-in zoom-in" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
