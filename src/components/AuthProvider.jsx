'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useWishlistStore } from '@/store/wishlistStore';

export default function AuthProvider({ children }) {
  const initializeAuth = useAuthStore((state) => state.initialize);
  const initializeWishlist = useWishlistStore((state) => state.initialize);

  useEffect(() => {
    const unsubscribeAuth = initializeAuth();
    const unsubscribeWishlist = initializeWishlist();
    
    return () => {
      if (typeof unsubscribeAuth === 'function') unsubscribeAuth();
      if (typeof unsubscribeWishlist === 'function') unsubscribeWishlist();
    };
  }, [initializeAuth, initializeWishlist]);

  return <>{children}</>;
}
