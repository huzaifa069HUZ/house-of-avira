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
    <footer className="bg-[#000000] text-[#FFFFFF] pt-24 pb-0 w-full mt-auto relative flex flex-col">
      <div className="px-6 md:px-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24 max-w-[1400px] mx-auto relative z-10">
          
          {/* Brand & Description (Col Span 5) */}
          <div className="md:col-span-5 pr-4 md:pr-12">
            <div className="mb-6 flex flex-col">
              <span className="font-perandory text-white text-3xl md:text-4xl uppercase tracking-widest leading-none mb-1">House Of</span>
              <span className="font-aston-script text-[#8A001A] text-5xl md:text-6xl -mt-2 leading-none">Avira</span>
            </div>
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed font-lato">
              An exclusive curation of luxury aesthetics. Redefining the modern muse with uncompromising elegance, global sourcing, and precision.
            </p>
          </div>

          {/* Links Grid (Col Span 7) */}
          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h5 className="font-perandory text-[10px] md:text-xs uppercase tracking-[0.2em] mb-6 text-neutral-500">Explore</h5>
              <ul className="space-y-4 text-sm font-lato text-neutral-300">
                <li><Link href="/catalogue" className="hover:text-white transition-colors">The Archive</Link></li>
                <li><Link href="/catalogue" className="hover:text-white transition-colors">New Arrivals</Link></li>
                <li><Link href="/category/women" className="hover:text-white transition-colors">Ready to Wear</Link></li>
                <li><Link href="/category/accessories" className="hover:text-white transition-colors">Accessories</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-perandory text-[10px] md:text-xs uppercase tracking-[0.2em] mb-6 text-neutral-500">Support</h5>
              <ul className="space-y-4 text-sm font-lato text-neutral-300">
                <li><Link href="/track-order" className="hover:text-white transition-colors">Track Order</Link></li>
                <li><Link href="/order-info" className="hover:text-white transition-colors">Ordering Guide</Link></li>
                <li><Link href="/order-info/shipping" className="hover:text-white transition-colors">Shipping & Customs</Link></li>
                <li><Link href="/policy" className="hover:text-white transition-colors">Policies</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Studio</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-perandory text-[10px] md:text-xs uppercase tracking-[0.2em] mb-6 text-neutral-500">Connect</h5>
              <ul className="space-y-4 text-sm font-lato text-neutral-300">
                <li>
                  <a href="https://www.instagram.com/houseof.avira/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2 group">
                    <svg className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                    <span>Instagram</span>
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/919986742779" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2 group">
                    <svg className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                    <span>WhatsApp</span>
                  </a>
                </li>
                <li>
                  <a href="mailto:houseofavira@gmail.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2 group">
                    <svg className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <span>Gmail</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright & Region */}
        <div className="flex flex-col md:flex-row justify-between items-center py-8 border-t border-white/10 text-xs text-neutral-500 font-lato max-w-[1400px] mx-auto gap-4 relative z-10">
          <div className="flex gap-6 order-2 md:order-1">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
          
          <p className="order-3 md:order-2">© {new Date().getFullYear()} House of Avira. All rights reserved.</p>

          {/* Language & Region Selector */}
          <div className="relative order-1 md:order-3" ref={dropdownRef}>
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
              <div className="absolute bottom-full right-0 mb-4 bg-[#0A0A0A] border border-white/10 p-5 rounded-lg shadow-2xl flex gap-6 z-50 w-72 md:w-80 text-left animate-in fade-in slide-in-from-bottom-2 duration-200">
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
        </div>
      </div>

      {/* Big Bold Footer Brand Text */}
      <div className="w-full flex justify-center items-end overflow-hidden pt-4 select-none pointer-events-none relative z-0 bg-[#000000]">
        <h1 className="font-perandory text-[24vw] leading-[0.75] text-[#FFFFFF] tracking-tighter m-0 p-0 text-center uppercase whitespace-nowrap opacity-95">
          AVIRA
        </h1>
      </div>
    </footer>
  );
}
