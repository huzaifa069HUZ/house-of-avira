import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useRecentlyViewedStore = create(
  persist(
    (set) => ({
      recentlyViewed: [],
      addRecentlyViewed: (product) => set((state) => {
        const minimalProduct = {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          images: product.images,
          imageUrl: product.imageUrl,
          category: product.category,
          status: product.status
        };
        const filtered = state.recentlyViewed.filter(p => p.id !== product.id);
        return { recentlyViewed: [minimalProduct, ...filtered].slice(0, 8) };
      }),
      clearRecentlyViewed: () => set({ recentlyViewed: [] })
    }),
    { name: 'recently-viewed-storage' }
  )
);
