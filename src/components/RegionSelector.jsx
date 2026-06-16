'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, X, Check, Search } from 'lucide-react';
import { useCurrencyStore } from '@/store/currencyStore';
import { Country } from 'country-state-city';
import { usePathname } from 'next/navigation';

export default function RegionSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { currency, setCurrency, setLocale } = useCurrencyStore();
  const pathname = usePathname();
  const isCatalogue = pathname?.startsWith('/catalogue');

  const allCountries = useMemo(() => Country.getAllCountries(), []);

  const filteredCountries = useMemo(() => {
    let list = allCountries;
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      list = allCountries.filter(c => 
        c.name.toLowerCase().includes(lowerQuery) || 
        (c.currency && c.currency.toLowerCase().includes(lowerQuery)) ||
        c.isoCode.toLowerCase().includes(lowerQuery)
      );
    }

    // Prioritize top countries
    const topCodes = ['US', 'IN', 'PH'];
    const sorted = [...list].sort((a, b) => {
      const aIndex = topCodes.indexOf(a.isoCode);
      const bIndex = topCodes.indexOf(b.isoCode);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return 0;
    });

    // Fix US flag
    return sorted.map(c => {
      if (c.isoCode === 'US') {
        return { ...c, flag: '🇺🇸', name: 'United States' };
      }
      return c;
    });
  }, [allCountries, searchQuery]);

  const handleSelect = (country) => {
    if (country.currency) {
      setCurrency(country.currency);
      // Determine locale loosely from country code (en-US, en-GB, etc)
      setLocale(`en-${country.isoCode}`);
    }
    setIsOpen(false);
  };

  const activeRegion = allCountries.find(c => c.currency === currency) || allCountries.find(c => c.isoCode === 'IN');

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed z-[90] flex items-center justify-center bg-white/90 backdrop-blur-md border border-[#000000]/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-white hover:shadow-xl transition-all duration-300 group ${isCatalogue ? 'bottom-6 right-4 w-11 h-11 rounded-full p-0' : 'bottom-6 right-6 gap-2 px-4 py-2.5 rounded-full'}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isCatalogue ? (
          <span className="text-[10px] font-bold tracking-widest text-[#000000] uppercase">
            {currency}
          </span>
        ) : (
          <>
            <Globe className="w-4 h-4 text-[#000000] group-hover:rotate-12 transition-transform" />
            <span className="text-xs font-bold tracking-widest text-[#000000] uppercase">
              {activeRegion?.flag} {currency}
            </span>
          </>
        )}
      </motion.button>

      {/* Glassmorphic Modal overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-6"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-white/95 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-[2rem] overflow-hidden relative flex flex-col max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 pb-4 border-b border-[#000000]/5 flex-shrink-0">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-[#000000] tracking-tight">Select Region</h3>
                    <p className="text-[11px] text-[#000000]/50 uppercase tracking-widest mt-1 font-medium">Choose your location & currency</p>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 rounded-full bg-[#000000]/5 flex items-center justify-center hover:bg-[#000000]/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-[#000000]" />
                  </button>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#000000]/40" />
                  <input
                    type="text"
                    placeholder="Search country or currency..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#FAFAFA] border border-[#000000]/10 text-[#000000] text-sm rounded-xl pl-11 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-[#000000]/20 focus:border-[#000000]/30 transition-all font-medium placeholder:text-[#000000]/30"
                  />
                </div>
              </div>

              <div className="overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {filteredCountries.length === 0 ? (
                  <div className="text-center py-10 text-[#000000]/50 text-sm font-medium">
                    No regions found.
                  </div>
                ) : (
                  filteredCountries.map((country) => {
                    if (!country.currency) return null; // Skip if no currency info
                    const isSelected = currency === country.currency;
                    
                    return (
                      <button
                        key={country.isoCode}
                        onClick={() => handleSelect(country)}
                        className={`w-full flex items-center justify-between p-3 sm:p-4 rounded-2xl transition-all duration-300 group ${
                          isSelected 
                            ? 'bg-[#000000] text-white shadow-lg shadow-black/10' 
                            : 'bg-transparent hover:bg-[#000000]/5 text-[#000000]'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm ${
                            isSelected ? 'bg-white/10' : 'bg-white border border-[#000000]/5'
                          }`}>
                            {country.flag}
                          </div>
                          <div className="flex flex-col items-start text-left">
                            <span className="font-gambetta italic text-base tracking-tight">{country.name}</span>
                            <span className={`text-[10px] tracking-widest uppercase mt-0.5 font-bold ${
                              isSelected ? 'text-white/70' : 'text-[#000000]/40 group-hover:text-[#000000]/60'
                            }`}>
                              {country.currency}
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <Check className="w-5 h-5 text-white" />
                          </motion.div>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

