'use client';

import { useEffect, useState } from 'react';
import { useCurrencyStore } from '@/store/currencyStore';

export default function PriceDisplay({ basePrice, className }) {
  const { currency, locale, rates, fetchRates, convertPrice } = useCurrencyStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // If rates haven't been fetched dynamically yet, do it.
    // The default fallback rates object has 4 keys (INR, USD, GBP, PHP).
    // Let's just always fetch on mount once per session if not loading.
    if (rates.INR === 1 && rates.USD === 0.012) {
      fetchRates();
    }
  }, [fetchRates, rates.USD]);

  // To prevent hydration errors, we can return the base INR price 
  // before the component mounts, or just return nothing.
  if (!mounted) {
    return <span className={className}>₹{basePrice.toFixed(2)}</span>;
  }

  const converted = convertPrice(basePrice);

  // Determine standard locale string for Intl
  let intlLocale = 'en-US';
  if (locale === 'tl') intlLocale = 'en-PH';
  if (currency === 'GBP') intlLocale = 'en-GB';
  if (currency === 'INR') intlLocale = 'en-IN';

  let formattedPrice;
  try {
    formattedPrice = new Intl.NumberFormat(intlLocale, {
      style: 'currency',
      currency: currency,
    }).format(converted);
  } catch (e) {
    formattedPrice = `${currency} ${converted.toFixed(2)}`;
  }

  return <span className={className}>{formattedPrice}</span>;
}
