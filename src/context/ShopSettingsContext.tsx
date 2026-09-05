'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ShopSettingsContextType {
  isShopMode: boolean;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const ShopSettingsContext = createContext<ShopSettingsContextType>({
  isShopMode: true,
  loading: true,
  refreshSettings: async () => {},
});

export function ShopSettingsProvider({ children }: { children: React.ReactNode }) {
  const [isShopMode, setIsShopMode] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/shop-settings', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (typeof data.isShopMode === 'boolean') {
          setIsShopMode(data.isShopMode);
        }
      }
    } catch (err) {
      console.error('Error fetching shop settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <ShopSettingsContext.Provider value={{ isShopMode, loading, refreshSettings: fetchSettings }}>
      {children}
    </ShopSettingsContext.Provider>
  );
}

export function useShopSettings() {
  return useContext(ShopSettingsContext);
}
