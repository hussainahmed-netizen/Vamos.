import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrandConfig, initialBrandConfig } from '../config/brandConfig';

interface BrandContextType {
  brandConfig: BrandConfig;
  updateBrandConfig: (newConfig: Partial<BrandConfig>) => void;
  resetBrandConfig: () => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'vamos_brand_config';

export const BrandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brandConfig, setBrandConfig] = useState<BrandConfig>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return { ...initialBrandConfig, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to parse saved brand config:', e);
    }
    return initialBrandConfig;
  });

  // Keep localStorage in sync
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(brandConfig));
    } catch (e) {
      console.error('Failed to save brand config:', e);
    }
  }, [brandConfig]);

  // Dynamically update document title and favicon when brand changes
  useEffect(() => {
    document.title = `${brandConfig.brandName} - ${brandConfig.brandTagline}`;

    const favicon = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
    if (favicon && brandConfig.logo.markUrl) {
      favicon.href = brandConfig.logo.markUrl;
    }
  }, [brandConfig.brandName, brandConfig.brandTagline, brandConfig.logo.markUrl]);

  const updateBrandConfig = (updated: Partial<BrandConfig>) => {
    setBrandConfig((prev) => ({
      ...prev,
      ...updated,
      logo: updated.logo ? { ...prev.logo, ...updated.logo } : prev.logo,
    }));
  };

  const resetBrandConfig = () => {
    setBrandConfig(initialBrandConfig);
  };

  return (
    <BrandContext.Provider value={{ brandConfig, updateBrandConfig, resetBrandConfig }}>
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
};
