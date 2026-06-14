'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { useCurrencyStore } from '@/store/currencyStore';

export default function AuthProvider({ children }) {
  const initializeAuth = useAuthStore((state) => state.initialize);
  const initializeWishlist = useWishlistStore((state) => state.initialize);
  const initializeCart = useCartStore((state) => state.initialize);
  const { setCurrency, fetchRates, currency } = useCurrencyStore();

  useEffect(() => {
    const unsubscribeAuth = initializeAuth();
    const unsubscribeWishlist = initializeWishlist();
    const unsubscribeCart = initializeCart();
    
    // Auto-detect Region and Currency
    const initializeRegion = async () => {
      // First fetch the exchange rates
      await fetchRates();
      
      // Check if user has already set a currency preference
      const hasCurrencyCookie = document.cookie.includes('USER_CURRENCY');
      
      if (!hasCurrencyCookie) {
        try {
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();
          if (data && data.currency) {
            setCurrency(data.currency);
          }
        } catch (error) {
          console.error("Failed to auto-detect region from IP:", error);
        }
      }
    };
    
    initializeRegion();

    return () => {
      if (typeof unsubscribeAuth === 'function') unsubscribeAuth();
      if (typeof unsubscribeWishlist === 'function') unsubscribeWishlist();
      if (typeof unsubscribeCart === 'function') unsubscribeCart();
    };
  }, [initializeAuth, initializeWishlist, initializeCart, setCurrency, fetchRates]);

  return <>{children}</>;
}
