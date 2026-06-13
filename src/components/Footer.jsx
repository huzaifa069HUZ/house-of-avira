'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useCurrencyStore } from '@/store/currencyStore';

const languages = [
  { code: 'en', label: 'ENGLISH' },
  { code: 'es', label: 'ESPAÑOL' },
  { code: 'fr', label: 'FRANÇAIS' },
  { code: 'de', label: 'DEUTSCH' }
];

const regions = [
  { id: 'IN', currency: 'INR', label: 'INDIA', symbol: '₹' },
  { id: 'US', currency: 'USD', label: 'UNITED STATES', symbol: '$' },
  { id: 'GB', currency: 'GBP', label: 'UNITED KINGDOM', symbol: '£' },
  { id: 'PH', currency: 'PHP', label: 'PHILIPPINES', symbol: '₱' }
];

export default function Footer() {
  const [isOpen, setIsOpen] = useState(false);
  const { currency, locale, setCurrency, setLocale } = useCurrencyStore();
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeLanguage = mounted 
    ? languages.find(l => l.code === locale) || languages[0]
    : languages[0];

  const activeRegion = mounted
    ? regions.find(r => r.currency === currency) || regions[0]
    : regions[0];

  return (
    <footer className="bg-[#000000] text-[#FFFFFF] pt-24 pb-12 px-6 md:px-12 w-full mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-24 max-w-7xl mx-auto">
        <div className="md:col-span-1">
          <h4 className="font-serif text-2xl tracking-widest uppercase mb-6">Avira</h4>
          <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
            A luxury curation for the modern muse. Expensive minimalism and refined aesthetics.
          </p>
        </div>
        <div>
          <h5 className="text-xs uppercase tracking-widest mb-6 opacity-60">Shop</h5>
          <ul className="space-y-4 text-sm font-light">
            <li><Link href="/catalogue" className="hover:opacity-70 transition-opacity">New In</Link></li>
            <li><Link href="/catalogue" className="hover:opacity-70 transition-opacity">Bestsellers</Link></li>
            <li><Link href="/category/women" className="hover:opacity-70 transition-opacity">Clothing</Link></li>
            <li><Link href="/category/accessories" className="hover:opacity-70 transition-opacity">Accessories</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-xs uppercase tracking-widest mb-6 opacity-60">Assistance</h5>
          <ul className="space-y-4 text-sm font-light">
            <li><Link href="/order-info" className="hover:opacity-70 transition-opacity">Read Before Ordering</Link></li>
            <li><Link href="/order-info/order-process" className="hover:opacity-70 transition-opacity">Order Process</Link></li>
            <li><Link href="/order-info/shipping" className="hover:opacity-70 transition-opacity">Shipping & Delivery</Link></li>
            <li><Link href="/order-info/policies" className="hover:opacity-70 transition-opacity">Policies & Guidelines</Link></li>
            <li><Link href="/contact" className="hover:opacity-70 transition-opacity">Contact Us</Link></li>
            <li><Link href="/faq" className="hover:opacity-70 transition-opacity">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-xs uppercase tracking-widest mb-6 opacity-60">Social</h5>
          <ul className="space-y-4 text-sm font-light">
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity flex items-center gap-2">Instagram</a></li>
            <li><a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity flex items-center gap-2">Pinterest</a></li>
            <li><a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity flex items-center gap-2">TikTok</a></li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#FFFFFF]/10 text-xs text-gray-500 font-light max-w-7xl mx-auto gap-4">
        <p>© {new Date().getFullYear()} House of Avira. All rights reserved.</p>
        
        {/* Language & Region Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 hover:text-[#FFFFFF] text-gray-400 transition-colors uppercase tracking-widest text-[10px] py-1 cursor-pointer"
            aria-label="Select Language and Region"
          >
            <span>{activeLanguage.label}</span>
            <svg
              className={`w-3 h-3 transition-transform duration-300 opacity-60 ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-[#0A0A0A] border border-white/10 p-5 rounded-lg shadow-2xl flex gap-6 z-50 w-72 md:w-80 text-left animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex-1">
                <span className="block text-[9px] tracking-widest uppercase text-gray-500 mb-3 font-semibold">Language</span>
                <ul className="space-y-1">
                  {languages.map((lang) => (
                    <li key={lang.code}>
                      <button
                        onClick={() => {
                          setLocale(lang.code);
                          setIsOpen(false);
                        }}
                        className={`w-full text-left text-[11px] hover:text-[#FFFFFF] transition-colors py-1 flex items-center justify-between group cursor-pointer ${
                          activeLanguage.code === lang.code ? 'text-[#FFFFFF] font-medium' : 'text-gray-400'
                        }`}
                      >
                        <span>{lang.label}</span>
                        {activeLanguage.code === lang.code && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="w-[1px] bg-white/10 self-stretch my-1" />
              
              <div className="flex-1">
                <span className="block text-[9px] tracking-widest uppercase text-gray-500 mb-3 font-semibold">Region</span>
                <ul className="space-y-1">
                  {regions.map((reg) => (
                    <li key={reg.id}>
                      <button
                        onClick={() => {
                          setCurrency(reg.currency);
                          const matchRegion = regions.find(r => r.id === reg.id);
                          if (matchRegion) {
                            const mapping = {
                              'IN': 'en',
                              'US': 'en',
                              'GB': 'en',
                              'PH': 'tl'
                            };
                            setLocale(mapping[reg.id] || 'en');
                          }
                          setIsOpen(false);
                        }}
                        className={`w-full text-left text-[11px] hover:text-[#FFFFFF] transition-colors py-1 flex items-center justify-between group cursor-pointer ${
                          activeRegion.currency === reg.currency ? 'text-[#FFFFFF] font-medium' : 'text-gray-400'
                        }`}
                      >
                        <span>{reg.label}</span>
                        {activeRegion.currency === reg.currency && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
