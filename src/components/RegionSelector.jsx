'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, X, Check } from 'lucide-react';
import { useCurrencyStore } from '@/store/currencyStore';

const regions = [
  { id: 'IN', currency: 'INR', locale: 'en', label: 'India', symbol: '₹' },
  { id: 'US', currency: 'USD', locale: 'en', label: 'United States', symbol: '$' },
  { id: 'GB', currency: 'GBP', locale: 'en', label: 'United Kingdom', symbol: '£' },
  { id: 'PH', currency: 'PHP', locale: 'tl', label: 'Philippines', symbol: '₱' }
];

export default function RegionSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { currency, setCurrency, setLocale } = useCurrencyStore();

  const handleSelect = (region) => {
    setCurrency(region.currency);
    setLocale(region.locale);
    setIsOpen(false);
  };

  const activeRegion = regions.find(r => r.currency === currency) || regions[0];

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[90] flex items-center gap-2 bg-white/80 backdrop-blur-md border border-[#000000]/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] px-4 py-2.5 rounded-full hover:bg-white hover:shadow-xl transition-all duration-300 group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Globe className="w-4 h-4 text-[#000000] group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-bold tracking-widest text-[#000000] uppercase">
          {activeRegion.currency}
        </span>
      </motion.button>

      {/* Glassmorphic Modal overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-sm bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-[#000000]">Select Region</h3>
                    <p className="text-xs text-[#000000]/60 uppercase tracking-widest mt-1">Language & Currency</p>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full bg-[#000000]/5 flex items-center justify-center hover:bg-[#000000]/10 transition-colors"
                  >
                    <X className="w-4 h-4 text-[#000000]" />
                  </button>
                </div>

                <div className="space-y-2">
                  {regions.map((region) => (
                    <button
                      key={region.id}
                      onClick={() => handleSelect(region)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                        currency === region.currency 
                          ? 'bg-[#000000] text-white shadow-md' 
                          : 'bg-white/50 hover:bg-white text-[#000000] border border-[#000000]/5'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-inner ${
                          currency === region.currency ? 'bg-white text-[#000000]' : 'bg-[#FAFAFA] text-[#000000]/60'
                        }`}>
                          {region.symbol}
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="font-medium text-sm">{region.label}</span>
                          <span className={`text-[10px] tracking-widest uppercase mt-0.5 ${
                            currency === region.currency ? 'text-white/70' : 'text-[#000000]/50'
                          }`}>
                            {region.currency} • {region.locale.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      {currency === region.currency && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <Check className="w-5 h-5 text-white" />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
