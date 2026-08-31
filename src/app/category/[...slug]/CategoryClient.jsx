'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Loader2, SlidersHorizontal, ChevronDown, Check } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

const COLOR_MAP = {
  black: '#000000',
  white: '#ffffff',
  red: '#ff0000',
  blue: '#0000ff',
  green: '#008000',
  yellow: '#ffff00',
  purple: '#800080',
  orange: '#ffa500',
  pink: '#ffc0cb',
  brown: '#a52a2a',
  grey: '#808080',
  gray: '#808080',
  silver: '#c0c0c0',
  gold: '#ffd700',
  navy: '#000080',
  beige: '#f5f5dc',
  maroon: '#800000',
  olive: '#808000',
  teal: '#008080',
  cyan: '#00ffff',
  magenta: '#ff00ff',
  cream: '#fffdd0',
  mustard: '#ffdb58',
  burgundy: '#800020',
  charcoal: '#36454f',
  peach: '#ffdab9',
  lavender: '#e6e6fa',
  mint: '#98ff98',
  coral: '#ff7f50',
  rust: '#b7410e',
};

const getColorHex = (colorName) => {
  if (!colorName) return '#000000';
  if (colorName.startsWith('#')) return colorName.toLowerCase();
  const lower = colorName.toLowerCase();
  return COLOR_MAP[lower] || null;
};

export default function CategoryClient({ slug = [] }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const mainCategory = slug[0]?.toLowerCase() || '';
  const subCategory = slug[1]?.toLowerCase() || '';

  // Filter & Sort States
  const [activeSort, setActiveSort] = useState('newest'); // newest, price_asc, price_desc
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  
  // Mobile UI States
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'sort', 'size', 'color'

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const productsList = await res.json();
        setProducts(productsList);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Filter strictly by the route URL first
  const routeFilteredProducts = useMemo(() => {
    return products.filter(p => {
      const urlMain = mainCategory.toLowerCase().trim();

      const matchMain = !urlMain || (() => {
        // Check primary category string
        const dbMain = p.category?.toLowerCase().trim() || '';
        if (dbMain === urlMain) return true;
        const cleanUrl = urlMain.replace(/[^a-z0-9]/g, '');
        const cleanDb = dbMain.replace(/[^a-z0-9]/g, '');
        if (cleanDb === cleanUrl) return true;

        // Check multi-category array (new products may have a `categories` array)
        if (Array.isArray(p.categories)) {
          const found = p.categories.some(cat => {
            const catClean = (cat || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');
            return catClean === cleanUrl;
          });
          if (found) return true;
        }

        // Also check secondaryCategory field
        if (p.secondaryCategory) {
          const secClean = p.secondaryCategory.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
          if (secClean === cleanUrl) return true;
        }

        // Custom logic for Shop Your Look
        if (cleanUrl === 'shopyourlook' && p.sections?.includes('Shop Your Look')) return true;

        return false;
      })();

      const isShopYourLook = mainCategory.toLowerCase().replace(/[^a-z0-9]/g, '') === 'shopyourlook';
      const urlMainClean = mainCategory.toLowerCase().trim().replace(/[^a-z0-9]/g, '');

      const allDbSubs = [];
      const dbPrimaryClean = (p.category || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');
      const dbSecondaryClean = (p.secondaryCategory || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');

      // Include primary subcategories if we are in the primary category's route (or Shop Your Look)
      if (isShopYourLook || !urlMainClean || dbPrimaryClean === urlMainClean) {
        if (p.subcategory) allDbSubs.push(p.subcategory.toLowerCase().trim());
        if (Array.isArray(p.subcategories)) p.subcategories.forEach(s => allDbSubs.push((s || '').toLowerCase().trim()));
      }
      
      // Include secondary subcategories if we are in the secondary category's route (or Shop Your Look)
      if (isShopYourLook || !urlMainClean || dbSecondaryClean === urlMainClean) {
        if (Array.isArray(p.secondarySubcategories)) p.secondarySubcategories.forEach(s => allDbSubs.push((s || '').toLowerCase().trim()));
      }

      const urlSub = subCategory.toLowerCase().trim();

      const matchSub = !urlSub || (() => {
        // Custom logic for Shop Your Look
        if (isShopYourLook) {
            const cleanAesthetic = (p.aesthetic || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const cleanUrl = urlSub.replace(/[^a-z0-9]/g, '');
            if (cleanAesthetic === cleanUrl) return true;
        }
        
        const cleanUrl = urlSub.replace(/[^a-z0-9]/g, '');

        return allDbSubs.some(dbSub => {
          if (dbSub === urlSub) return true;
          
          // Normalize spaces/dashes/slashes
          const cleanDb = dbSub.replace(/[^a-z0-9]/g, '');
          if (cleanDb === cleanUrl) return true;
          
          // Custom mappings for common subcategory name mismatches
          if (urlSub === 'bottoms' && (dbSub === 'pants / jeans' || dbSub === 'pants/jeans' || dbSub === 'pants' || dbSub === 'jeans' || dbSub === 'skirts' || dbSub === 'shorts')) return true;
          if (urlSub === 'pants-jeans' && (dbSub === 'pants / jeans' || dbSub === 'pants/jeans' || dbSub === 'pants' || dbSub === 'jeans')) return true;
          if (urlSub === 'beach-wear' && dbSub === 'beach wear') return true;
          if (urlSub === 'hair' && dbSub === 'hair accessories') return true;
          if (urlSub === 'nails' && dbSub === 'nails and nail art supplies') return true;
          if (urlSub === 'mini-bags' && dbSub === 'mini bags') return true;
          if (urlSub === 'shoulder-bags' && (dbSub === 'shoulder bags' || dbSub === 'sholder bags' || dbSub === 'shoulder bags' || dbSub === 'sholder bags')) return true;
          if (urlSub === 'phone-cases' && dbSub === 'phone cases') return true;
          if (urlSub === 'room-decor' && dbSub === 'room decor') return true;
          if (urlSub === 'keychains' && (dbSub === 'keychains' || dbSub === 'keychains / bag charms')) return true;
          
          return false;
        });
      })();

      return matchMain && matchSub;
    });
  }, [products, mainCategory, subCategory]);

  // Extract available unique sizes and colors dynamically from the route-filtered items
  const availableSizes = useMemo(() => {
    const sizes = new Set();
    routeFilteredProducts.forEach(p => {
      if (p.sizes) p.sizes.forEach(s => sizes.add(s));
    });
    return Array.from(sizes).sort();
  }, [routeFilteredProducts]);

  const availableColors = useMemo(() => {
    const colorMap = new Map();
    routeFilteredProducts.forEach(p => {
      if (p.swatches) {
        p.swatches.forEach(s => {
          let name = (s.colorName || s.name || '').trim();
          let hex = (s.color || '').trim();
          
          if (!name && hex) name = hex;
          if (!name) return;
          
          const formatted = name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
          
          let computedHex = getColorHex(formatted);
          if (!computedHex && hex.startsWith('#')) computedHex = hex.toLowerCase();
          if (!computedHex) computedHex = formatted.toLowerCase(); // fallback
          
          let finalBgHex = hex.startsWith('#') ? hex : (getColorHex(formatted) || '#FAFAFA');

          if (!colorMap.has(computedHex) || colorMap.get(computedHex).name.startsWith('#')) {
             colorMap.set(computedHex, { name: formatted, bgHex: finalBgHex });
          }
        });
      }
    });
    return Array.from(colorMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [routeFilteredProducts]);

  // Apply user filters and sort
  const finalProducts = useMemo(() => {
    let result = [...routeFilteredProducts];

    // Filter Size
    if (selectedSizes.length > 0) {
      result = result.filter(p => p.sizes && p.sizes.some(s => selectedSizes.includes(s)));
    }

    // Filter Color (Match by mapping to the same deduplicated computed hex/name as availableColors)
    if (selectedColors.length > 0) {
      result = result.filter(p => p.swatches && p.swatches.some(s => {
        let name = (s.colorName || s.name || '').trim();
        let hex = (s.color || '').trim();
        if (!name && hex) name = hex;
        if (!name) return false;
        
        const formatted = name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        let computedHex = getColorHex(formatted);
        if (!computedHex && hex.startsWith('#')) computedHex = hex.toLowerCase();
        if (!computedHex) computedHex = formatted.toLowerCase();

        return selectedColors.some(selectedColor => {
          let selHex = getColorHex(selectedColor);
          if (!selHex && selectedColor.startsWith('#')) selHex = selectedColor.toLowerCase();
          if (!selHex) selHex = selectedColor.toLowerCase();
          return computedHex === selHex;
        });
      }));
    }

    // Sort
    if (activeSort === 'price_asc') {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (activeSort === 'price_desc') {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else {
      // Newest
      result.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });
    }

    return result;
  }, [routeFilteredProducts, selectedSizes, selectedColors, activeSort]);

  const toggleSize = (size) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  const toggleColor = (color) => {
    setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  };

  const toggleDropdown = (dropdown) => {
    if (activeDropdown === dropdown) setActiveDropdown(null);
    else setActiveDropdown(dropdown);
  };

  // Title formatting
  const displayTitle = subCategory ? `${mainCategory} - ${subCategory}` : (mainCategory || 'All Categories');

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-6 h-6 animate-spin text-black" />
        <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-black/60">Curating Collection</span>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] relative pb-32 md:pb-0" style={{ fontFamily: 'var(--font-dm-sans, "DM Sans", sans-serif)' }}>
      
      {/* Page Header */}
      <div className="w-full pt-32 pb-8 px-4 md:px-8 text-center max-w-[1600px] mx-auto">
        <h1 className="text-3xl md:text-5xl font-perandory tracking-widest uppercase text-black mb-2">
          {displayTitle}
        </h1>
        <p className="text-sm md:text-base text-neutral-500 font-medium">
          {finalProducts.length} {finalProducts.length === 1 ? 'Product' : 'Products'} Found
        </p>
      </div>

      {/* DESKTOP FILTER BAR (Sticky below header) */}
      <div className="hidden md:block sticky top-[72px] z-40 w-full backdrop-blur-2xl bg-white/70 border-y border-black/5 shadow-[0_4px_30px_rgba(0,0,0,0.02)] transition-all duration-300">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          
          <div className="flex items-center gap-6">
            {/* Sort Dropdown */}
            <div className="relative">
              <button 
                onClick={() => toggleDropdown('desktop_sort')}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black hover:opacity-70 transition-opacity"
              >
                Sort By <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'desktop_sort' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'desktop_sort' && (
                <div className="absolute top-full left-0 mt-4 w-48 bg-white/95 backdrop-blur-xl border border-black/5 shadow-2xl rounded-2xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
                  <button onClick={() => { setActiveSort('newest'); setActiveDropdown(null); }} className="w-full text-left px-5 py-3 text-xs font-medium hover:bg-black/5 flex items-center justify-between">
                    Newest {activeSort === 'newest' && <Check className="w-3 h-3" />}
                  </button>
                  <button onClick={() => { setActiveSort('price_asc'); setActiveDropdown(null); }} className="w-full text-left px-5 py-3 text-xs font-medium hover:bg-black/5 flex items-center justify-between">
                    Price: Low to High {activeSort === 'price_asc' && <Check className="w-3 h-3" />}
                  </button>
                  <button onClick={() => { setActiveSort('price_desc'); setActiveDropdown(null); }} className="w-full text-left px-5 py-3 text-xs font-medium hover:bg-black/5 flex items-center justify-between">
                    Price: High to Low {activeSort === 'price_desc' && <Check className="w-3 h-3" />}
                  </button>
                </div>
              )}
            </div>

            {/* Size Dropdown */}
            {availableSizes.length > 0 && (
              <div className="relative">
                <button 
                  onClick={() => toggleDropdown('desktop_size')}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black hover:opacity-70 transition-opacity"
                >
                  Size {selectedSizes.length > 0 && <span className="bg-black text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px]">{selectedSizes.length}</span>} <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'desktop_size' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'desktop_size' && (
                  <div className="absolute top-full left-0 mt-4 w-64 bg-white/95 backdrop-blur-xl border border-black/5 shadow-2xl rounded-2xl overflow-hidden p-4 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-3 gap-2">
                      {availableSizes.map(size => (
                        <button 
                          key={size}
                          onClick={() => toggleSize(size)}
                          className={`py-2 text-[11px] font-bold rounded-lg border transition-colors ${selectedSizes.includes(size) ? 'bg-black text-white border-black' : 'bg-transparent text-black border-black/10 hover:border-black/30'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Color Dropdown */}
            {availableColors.length > 0 && (
              <div className="relative">
                <button 
                  onClick={() => toggleDropdown('desktop_color')}
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black hover:opacity-70 transition-opacity"
                >
                  Color {selectedColors.length > 0 && <span className="bg-black text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px]">{selectedColors.length}</span>} <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'desktop_color' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'desktop_color' && (
                  <div className="absolute top-full left-0 mt-4 w-64 bg-white/95 backdrop-blur-xl border border-black/5 shadow-2xl rounded-2xl overflow-hidden p-4 animate-in fade-in slide-in-from-top-2">
                      <div className="flex flex-wrap gap-2">
                        {availableColors.map(colorObj => {
                          const { name: color, bgHex: hex } = colorObj;
                          return (
                            <button 
                              key={color}
                              onClick={() => toggleColor(color)}
                              className={`px-3 py-2 text-[11px] font-bold rounded-lg border transition-colors flex items-center gap-2 ${selectedColors.includes(color) ? 'bg-black text-white border-black' : 'bg-transparent text-black border-black/10 hover:border-black/30'}`}
                            >
                              <span className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: hex || '#FAFAFA' }} />
                              <span className="capitalize">{color.startsWith('#') ? 'Color' : color}</span>
                            </button>
                          );
                        })}
                      </div></div>
                )}
              </div>
            )}
          </div>

          {/* Active Filters Clear Button */}
          {(selectedSizes.length > 0 || selectedColors.length > 0 || activeSort !== 'newest') && (
            <button 
              onClick={() => { setSelectedSizes([]); setSelectedColors([]); setActiveSort('newest'); }}
              className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 hover:text-black transition-colors"
            >
              Clear All
            </button>
          )}

        </div>
      </div>

      {/* MOBILE FLUID PILL FILTER BAR (Fixed at bottom) */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 z-50 flex justify-center pointer-events-none">
        <div className="bg-white/80 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/40 rounded-full px-6 py-3.5 flex justify-between items-center gap-8 pointer-events-auto relative">
          
          {/* Sort Trigger */}
          <button 
            onClick={() => toggleDropdown('mobile_sort')}
            className="flex flex-col items-center gap-0.5 text-black hover:opacity-70 transition-opacity"
          >
            <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-500">Sort By</span>
            <span className="text-[11px] font-bold">{activeSort === 'newest' ? 'Newest' : activeSort === 'price_asc' ? 'Lowest' : 'Highest'}</span>
          </button>

          {/* Divider */}
          <div className="w-[1px] h-6 bg-black/10"></div>

          {/* Filters Trigger */}
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 text-black hover:opacity-70 transition-opacity"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-widest">Filters {(selectedSizes.length + selectedColors.length) > 0 && `(${selectedSizes.length + selectedColors.length})`}</span>
          </button>

          {/* Mobile Sort Dropdown Popover */}
          {activeDropdown === 'mobile_sort' && (
            <div className="absolute bottom-[calc(100%+16px)] left-0 w-48 bg-white/90 backdrop-blur-3xl border border-white/40 shadow-2xl rounded-3xl overflow-hidden py-2 animate-in slide-in-from-bottom-4 fade-in">
              <button onClick={() => { setActiveSort('newest'); setActiveDropdown(null); }} className={`w-full text-left px-5 py-3 text-xs font-bold ${activeSort === 'newest' ? 'text-black' : 'text-neutral-500'}`}>
                Newest Arrivals
              </button>
              <button onClick={() => { setActiveSort('price_asc'); setActiveDropdown(null); }} className={`w-full text-left px-5 py-3 text-xs font-bold ${activeSort === 'price_asc' ? 'text-black' : 'text-neutral-500'}`}>
                Price: Low to High
              </button>
              <button onClick={() => { setActiveSort('price_desc'); setActiveDropdown(null); }} className={`w-full text-left px-5 py-3 text-xs font-bold ${activeSort === 'price_desc' ? 'text-black' : 'text-neutral-500'}`}>
                Price: High to Low
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FULLSCREEN FILTERS MODAL */}
      {showMobileFilters && (
        <div className="md:hidden fixed inset-0 z-[100] bg-white animate-in slide-in-from-bottom flex flex-col">
          <div className="px-6 py-6 border-b border-black/5 flex justify-between items-center bg-white/80 backdrop-blur-xl sticky top-0 z-10">
            <h2 className="text-lg font-bold tracking-widest uppercase">Filters</h2>
            <button onClick={() => setShowMobileFilters(false)} className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-black">Done</button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10 pb-32">
            
            {/* Sizes */}
            {availableSizes.length > 0 && (
              <div>
                <h3 className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4">Size</h3>
                <div className="grid grid-cols-4 gap-3">
                  {availableSizes.map(size => (
                    <button 
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`py-3 text-[11px] font-bold rounded-2xl border transition-colors ${selectedSizes.includes(size) ? 'bg-black text-white border-black' : 'bg-[#FAFAFA] text-black border-transparent'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {availableColors.length > 0 && (
              <div>
                <h3 className="text-xs font-bold tracking-widest uppercase text-neutral-500 mb-4">Color</h3>
                  <div className="flex flex-wrap gap-3">
                    {availableColors.map(colorObj => {
                      const { name: color, bgHex: hex } = colorObj;
                      return (
                        <button 
                          key={color}
                          onClick={() => toggleColor(color)}
                          className={`px-4 py-3 text-[11px] font-bold rounded-2xl border transition-colors flex items-center gap-2 ${selectedColors.includes(color) ? 'bg-black text-white border-black' : 'bg-[#FAFAFA] text-black border-transparent'}`}
                        >
                          <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: hex || '#FAFAFA' }} />
                          <span className="capitalize">{color.startsWith('#') ? 'Color' : color}</span>
                        </button>
                      );
                    })}
                  </div>
              </div>
            )}

          </div>

          <div className="p-6 bg-white border-t border-black/5 mt-auto">
            <button 
              onClick={() => { setSelectedSizes([]); setSelectedColors([]); setActiveSort('newest'); setShowMobileFilters(false); }}
              className="w-full py-4 text-xs font-bold tracking-widest uppercase text-black bg-[#FAFAFA] rounded-2xl mb-3"
            >
              Clear All
            </button>
            <button 
              onClick={() => setShowMobileFilters(false)}
              className="w-full py-4 text-xs font-bold tracking-widest uppercase text-white bg-black rounded-2xl"
            >
              View {finalProducts.length} Results
            </button>
          </div>
        </div>
      )}

      {/* PRODUCT GRID */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {finalProducts.length === 0 ? (
          <div className="w-full py-32 flex flex-col items-center text-center">
            <h3 className="text-2xl md:text-3xl font-perandory tracking-widest uppercase mb-4">No results found</h3>
            <p className="text-neutral-500 text-sm md:text-base max-w-md">Try adjusting your filters or search for something else to find what you're looking for.</p>
            <button 
              onClick={() => { setSelectedSizes([]); setSelectedColors([]); }}
              className="mt-8 px-8 py-3 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-[#8A001A] transition-colors rounded-full"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-16">
            {finalProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
