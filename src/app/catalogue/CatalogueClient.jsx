'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore';
import { Loader2, Layers, Heart, X, SlidersHorizontal, ChevronDown, Check } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useQuickAddStore } from '@/store/quickAddStore';
import PriceDisplay from '@/components/PriceDisplay';
import './catalogue.css';

const CATEGORIES = [
  'ALL',
  'JACKETS',
  'TOPS',
  'TROUSERS',
  'DRESSES',
  'JEWELLERY',
  'BAGS',
  'FOOTWEAR',
  'ACCESSORIES',
  'COLLECTIBLES',
  'PETS'
];

export default function CatalogueClient() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Filter & Sort States
  const [activeSort, setActiveSort] = useState('newest'); // newest, price_asc, price_desc
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  
  // Mobile UI States
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'sort', 'size', 'color'

  const { user } = useAuthStore();
  const { wishlist, toggleWishlist } = useWishlistStore();
  const { openQuickAdd } = useQuickAddStore();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(100));
        const querySnapshot = await getDocs(q);
        const productsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsList);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Filter strictly by the category pill selected
  const categoryFilteredProducts = useMemo(() => {
    return activeCategory === 'ALL' 
      ? products 
      : products.filter(p => {
          const term = activeCategory.toLowerCase();
          return (
            p.category?.toLowerCase().includes(term) ||
            p.subcategory?.toLowerCase().includes(term) ||
            p.badge?.toLowerCase().includes(term) ||
            p.section?.toLowerCase().includes(term) ||
            p.name?.toLowerCase().includes(term) ||
            p.description?.toLowerCase().includes(term)
          );
        });
  }, [products, activeCategory]);

  // Extract available unique sizes and colors dynamically from the category-filtered items
  const availableSizes = useMemo(() => {
    const sizes = new Set();
    categoryFilteredProducts.forEach(p => {
      if (p.sizes) p.sizes.forEach(s => sizes.add(s));
    });
    return Array.from(sizes).sort();
  }, [categoryFilteredProducts]);

  const availableColors = useMemo(() => {
    const colors = new Set();
    categoryFilteredProducts.forEach(p => {
      if (p.swatches) p.swatches.forEach(s => colors.add(s.name || s.color));
    });
    return Array.from(colors);
  }, [categoryFilteredProducts]);

  // Apply user filters and sort
  const displayProducts = useMemo(() => {
    let result = [...categoryFilteredProducts];

    // Filter Size
    if (selectedSizes.length > 0) {
      result = result.filter(p => p.sizes && p.sizes.some(s => selectedSizes.includes(s)));
    }

    // Filter Color (Match by swatch name or hex code loosely)
    if (selectedColors.length > 0) {
      result = result.filter(p => p.swatches && p.swatches.some(s => selectedColors.includes(s.name || s.color)));
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
  }, [categoryFilteredProducts, selectedSizes, selectedColors, activeSort]);

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

  const handleHeartClick = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      setShowLoginModal(true);
    } else {
      toggleWishlist(product);
    }
  };

  return (
    <div className="avira-catalogue-container relative pb-32 md:pb-0">
      {/* Header */}
      <header className="avira-catalogue-header">
        <h1 className="avira-catalogue-title">GET THE LOOK</h1>
        <p className="avira-catalogue-subtitle">
          Share your looks on socials by mentioning @houseofavira and #AviraStyle.
        </p>
      </header>

      {/* Categories Scroll */}
      <nav className="avira-cat-scroller-container">
        <div className="avira-cat-scroller">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`avira-cat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory(cat);
                setSelectedSizes([]); // reset filters when category changes
                setSelectedColors([]);
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* DESKTOP FILTER BAR */}
      <div className="hidden md:block sticky top-[72px] z-40 w-full backdrop-blur-2xl bg-white/70 border-y border-black/5 shadow-[0_4px_30px_rgba(0,0,0,0.02)] transition-all duration-300 mb-8">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          
          <div className="flex items-center gap-6">
            {/* Sort Dropdown */}
            <div className="relative">
              <button 
                onClick={() => toggleDropdown('desktop_sort')}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black hover:opacity-70 transition-opacity"
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
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black hover:opacity-70 transition-opacity"
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
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black hover:opacity-70 transition-opacity"
                >
                  Color {selectedColors.length > 0 && <span className="bg-black text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px]">{selectedColors.length}</span>} <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === 'desktop_color' ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === 'desktop_color' && (
                  <div className="absolute top-full left-0 mt-4 w-64 bg-white/95 backdrop-blur-xl border border-black/5 shadow-2xl rounded-2xl overflow-hidden p-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex flex-wrap gap-2">
                      {availableColors.map(color => (
                        <button 
                          key={color}
                          onClick={() => toggleColor(color)}
                          className={`px-3 py-2 text-[11px] font-bold rounded-lg border transition-colors flex items-center gap-2 ${selectedColors.includes(color) ? 'bg-black text-white border-black' : 'bg-transparent text-black border-black/10 hover:border-black/30'}`}
                        >
                          {color.startsWith('#') && (
                            <span className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: color }} />
                          )}
                          {color.startsWith('#') ? 'Color' : color}
                        </button>
                      ))}
                    </div>
                  </div>
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
                  {availableColors.map(color => (
                    <button 
                      key={color}
                      onClick={() => toggleColor(color)}
                      className={`px-4 py-3 text-[11px] font-bold rounded-2xl border transition-colors flex items-center gap-2 ${selectedColors.includes(color) ? 'bg-black text-white border-black' : 'bg-[#FAFAFA] text-black border-transparent'}`}
                    >
                      {color.startsWith('#') && (
                        <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: color }} />
                      )}
                      {color.startsWith('#') ? 'Color' : color}
                    </button>
                  ))}
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
              View {displayProducts.length} Results
            </button>
          </div>
        </div>
      )}

      {/* Masonry Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-8 sm:gap-x-4 sm:gap-y-12 px-2 sm:px-8 mt-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="w-full aspect-[3/4] bg-neutral-200 animate-pulse rounded-md" />
              <div className="w-2/3 h-3 bg-neutral-200 animate-pulse rounded-full mt-2" />
              <div className="w-1/3 h-3 bg-neutral-200 animate-pulse rounded-full" />
            </div>
          ))}
        </div>
      ) : displayProducts.length === 0 ? (
        <div className="avira-empty">
          <h3>No looks available yet</h3>
          <p>Check back soon for curated styles.</p>
          {(selectedSizes.length > 0 || selectedColors.length > 0) && (
            <button 
              onClick={() => { setSelectedSizes([]); setSelectedColors([]); }}
              className="mt-6 px-8 py-3 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-[#8A001A] transition-colors rounded-full"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="avira-masonry-grid">
          {displayProducts.map((product) => {
            const isWishlisted = wishlist.some(item => item.id === product.id);
            return (
              <Link 
                key={product.id} 
                href={`/product/${product.id}`}
                className="avira-masonry-item group"
              >
                <div className="avira-item-img-wrapper">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="avira-item-img"
                    loading="lazy"
                  />
                  
                  <div className="avira-item-overlay">
                    {/* Top Right Layers Icon */}
                    <div 
                      className="avira-icon-top-right cursor-pointer hover:scale-105 transition-transform"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openQuickAdd(product);
                      }}
                    >
                      <Layers className="w-4 h-4 text-black" />
                    </div>
                    
                    {/* Bottom Left Username Tag */}
                    <div className="avira-tag-bottom-left">
                      @HOUSEOFAVIRA
                    </div>

                    {/* Bottom Right Heart Icon */}
                    <div 
                      className="avira-icon-bottom-right cursor-pointer hover:scale-105 transition-transform"
                      onClick={(e) => handleHeartClick(e, product)}
                    >
                      <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-[#8A001A] text-[#8A001A]' : 'text-black hover:text-[#8A001A]'}`} />
                    </div>
                  </div>
                </div>
                {/* Product Info below image */}
                <div className="mt-2 flex flex-col items-start w-full">
                  <span className="text-[10px] font-bold tracking-widest uppercase truncate w-full">{product.name}</span>
                  <span className="text-xs text-neutral-500 font-medium"><PriceDisplay basePrice={product.price || 0} /></span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white p-8 max-w-[400px] w-full flex flex-col items-center text-center relative shadow-2xl">
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-black hover:opacity-70 transition-opacity p-1"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-[15px] font-bold tracking-widest uppercase text-black mb-3 mt-4">
              Log in to save this look
            </h2>
            <p className="text-[13px] text-black/80 mb-8 leading-relaxed px-2">
              Log in or create an account to save your favourite looks and view them at any time.
            </p>
            
            <Link 
              href="/auth/login"
              className="w-full bg-black text-white text-xs font-bold uppercase tracking-[0.15em] py-4 mb-4 hover:bg-[#8A001A] transition-colors"
            >
              Log in or create account
            </Link>
            
            <button 
              onClick={() => setShowLoginModal(false)}
              className="w-full bg-transparent text-black text-[11px] font-bold uppercase tracking-widest py-2 hover:opacity-70 transition-opacity"
            >
              Go back without saving
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
