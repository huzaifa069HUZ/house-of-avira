import { create } from 'zustand';

export const useCurrencyStore = create(() => ({
  currency: 'INR',
  locale: 'en',

  setCurrency: () => {},
  setLocale: () => {},
  initSettings: () => {},
  fetchRates: () => {},

  convertPrice: (price) => price,
}));
