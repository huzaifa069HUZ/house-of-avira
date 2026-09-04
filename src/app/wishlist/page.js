'use client';

import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { LumaSpin } from '@/components/ui/luma-spin';

export default function WishlistPage() {
  const { wishlist, loading } = useWishlistStore();
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <Heart className="w-12 h-12 text-neutral-300 mb-4" />
        <h1 className="text-2xl font-cormorant mb-2 text-center uppercase tracking-widest">Your Wishlist</h1>
        <p className="text-neutral-500 mb-8 text-center text-sm">Please log in to view your saved items.</p>
        <Link 
          href="/auth/login" 
          className="bg-[#000000] text-white px-8 py-3 text-xs font-bold tracking-widest uppercase hover:bg-black/80 transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LumaSpin />
      </div>
    );
  }

  return (
    <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 min-h-screen">
      <div className="flex flex-col items-center mb-12">
        <h1 className="text-center mb-4 flex items-center justify-center gap-1.5 flex-wrap md:flex-nowrap">
          <span className="font-perandory text-[18px] md:text-[24px] uppercase tracking-[0.15em] font-bold translate-y-[3px]">PERSONAL</span>
          <span className="font-aston-script text-[42px] md:text-[56px] lowercase leading-none -translate-y-[2px]">wishlist</span>
        </h1>
        <p className="text-sm text-neutral-500 uppercase tracking-widest">
          {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'} Saved
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-neutral-50/50 rounded-lg border border-neutral-100">
          <Heart className="w-10 h-10 text-neutral-300 mb-4" />
          <p className="text-neutral-500 mb-6 text-sm">You haven't saved any items yet.</p>
          <Link 
            href="/" 
            className="bg-[#000000] text-white px-8 py-3 text-xs font-bold tracking-widest uppercase hover:bg-black/80 transition-colors"
          >
            Discover New Arrivals
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}


