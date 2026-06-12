import { create } from 'zustand';

export const useQuickAddStore = create((set) => ({
  isOpen: false,
  product: null,
  
  openQuickAdd: (product) => set({ isOpen: true, product }),
  closeQuickAdd: () => set({ isOpen: false, product: null }),
}));
