'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';

export default function AuthProvider({ children }) {
  const initializeAuth = useAuthStore((state) => state.initialize);
  const initializeWishlist = useWishlistStore((state) => state.initialize);
  const initializeCart = useCartStore((state) => state.initialize);

  useEffect(() => {
    const unsubscribeAuth = initializeAuth();
    const unsubscribeWishlist = initializeWishlist();
    const unsubscribeCart = initializeCart();

    return () => {
      if (typeof unsubscribeAuth === 'function') unsubscribeAuth();
      if (typeof unsubscribeWishlist === 'function') unsubscribeWishlist();
      if (typeof unsubscribeCart === 'function') unsubscribeCart();
    };
  }, [initializeAuth, initializeWishlist, initializeCart]);

  return <>{children}</>;
}
