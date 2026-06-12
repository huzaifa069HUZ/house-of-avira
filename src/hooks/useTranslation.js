'use client';

import { useCurrencyStore } from '@/store/currencyStore';
import { dictionaries } from '@/i18n/dictionaries';

export function useTranslation() {
  const { locale } = useCurrencyStore();
  
  // Default to english if the locale dictionary is not found
  const dict = dictionaries[locale] || dictionaries.en;
  
  return { t: dict };
}
