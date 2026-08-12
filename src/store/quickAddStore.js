import { create } from 'zustand';

export const useQuickAddStore = create((set) => ({
  isOpen: false,
  product: null,
  preselectedColor: null,
  preselectedSize: null,
  
  openQuickAdd: (product, preselectedColor = null, preselectedSize = null) => set({ isOpen: true, product, preselectedColor, preselectedSize }),
  closeQuickAdd: () => set({ isOpen: false, product: null, preselectedColor: null, preselectedSize: null }),
}));
