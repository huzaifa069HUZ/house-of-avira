import { create } from 'zustand';

export const useCurrencyStore = create((set, get) => ({
  currency: 'INR', // Default fallback
  locale: 'en',
  rates: { INR: 1, USD: 0.012, GBP: 0.0094, PHP: 0.70 }, // Default fallback rates
  loading: false,

  initSettings: (initialCurrency, initialLocale) => {
    if (initialCurrency) set({ currency: initialCurrency });
    if (initialLocale) set({ locale: initialLocale });
  },

  setCurrency: (currency) => {
    // Optionally save back to cookie
    document.cookie = `USER_CURRENCY=${currency}; path=/; max-age=${60 * 60 * 24 * 30}`;
    set({ currency });
  },

  setLocale: (locale) => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 30}`;
    set({ locale });
  },

  fetchRates: async () => {
    const state = get();
    if (state.loading) return;
    
    set({ loading: true });
    try {
      const res = await fetch('/api/rates');
      const data = await res.json();
      if (data.rates) {
        set({ rates: data.rates });
      }
    } catch (err) {
      console.error('Failed to fetch rates', err);
    } finally {
      set({ loading: false });
    }
  },

  // Helper to convert INR base price to selected currency
  convertPrice: (basePriceINR) => {
    const { currency, rates } = get();
    const rate = rates[currency] || 1;
    return basePriceINR * rate;
  }
}));
