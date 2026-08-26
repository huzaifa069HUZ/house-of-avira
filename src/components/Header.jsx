'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, ShoppingBag, User, Menu, ChevronRight, Heart, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCurrencyStore } from '@/store/currencyStore';
import { useCartStore } from '@/store/cartStore';
import CartSlideOver from '@/components/ui/CartSlideOver';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import PriceDisplay from '@/components/PriceDisplay';
import { createSearchIndex, getTopSuggestions, getDidYouMean, logSearchAnalytics } from '@/lib/search';

const menuData = [
  { title: "Shop All", href: "/catalogue" },
  { 
    title: "Women", 
    href: "/category/women",
    children: [
      { title: "Tops", href: "/category/women/tops" },
      { title: "Pants", href: "/category/women/pants-jeans" },
      { title: "Skirts", href: "/category/women/skirts" },
      { title: "Dresses", href: "/category/women/dresses" },
      { title: "Jackets", href: "/category/women/jackets" },
      { title: "Beachwear", href: "/category/women/beach-wear" },
    ]
  },
  {
    title: "Men",
    href: "/category/men",
    children: [
      { title: "tops", href: "/category/men/tops" },
      { title: "pants/jeans", href: "/category/men/pants-jeans" },
      { title: "jackets", href: "/category/men/jackets" },
    ]
  },
  {
    title: "Footwear",
    href: "/category/footwear",
    children: [
      { title: "heels", href: "/category/footwear/heels" },
      { title: "boots", href: "/category/footwear/boots" },
      { title: "shoes", href: "/category/footwear/shoes" },
      { title: "flats", href: "/category/footwear/flats" },
    ]
  },
  {
    title: "Bags",
    href: "/category/bags",
    children: [
      { title: "Handbags", href: "/category/bags/handbags" },
      { title: "mini bags", href: "/category/bags/mini-bags" },
      { title: "sholder Bags", href: "/category/bags/shoulder-bags" },
    ]
  },
  {
    title: "Accessories",
    href: "/category/accessories",
    children: [
      { 
        title: "phone cases", 
        href: "/category/accessories/phone-cases",
        subChildren: [
          { title: "iphone", href: "/category/accessories/phone-cases/iphone" },
          { title: "Android", href: "/category/accessories/phone-cases/android" },
        ]
      },
      { title: "hair accessories", href: "/category/accessories/hair" },
      { title: "belts", href: "/category/accessories/belts" },
      { 
        title: "jewellery", 
        href: "/category/accessories/jewellery",
        subChildren: [
          { title: "necklace", href: "/category/accessories/jewellery/necklace" },
          { title: "rings", href: "/category/accessories/jewellery/rings" },
          { title: "bracelets", href: "/category/accessories/jewellery/bracelets" },
          { title: "earings", href: "/category/accessories/jewellery/earings" },
        ]
      },
      { title: "nails and nail art supplies", href: "/category/accessories/nails" },
      { title: "keychains / bag charms", href: "/category/accessories/keychains" },
      { title: "room decor", href: "/category/accessories/room-decor" },
    ]
  },
  {
    title: "Collectibles",
    href: "/category/collectibles",
    children: [
      { title: "Sanrio", href: "/category/collectibles/sanrio" },
      { title: "Nagano Characters", href: "/category/collectibles/nagano" },
      { title: "Miffy", href: "/category/collectibles/miffy" },
      { title: "Other Characters", href: "/category/collectibles/other" },
    ]
  },
  {
    title: "Pets",
    href: "/category/pets",
    children: [
      { 
        title: "cats", 
        href: "/category/pets/cats",
        subChildren: [
          { title: "clothes", href: "/category/pets/cats/clothes" },
          { title: "toys", href: "/category/pets/cats/toys" },
          { title: "accessories", href: "/category/pets/cats/accessories" },
        ]
      },
      { 
        title: "dogs", 
        href: "/category/pets/dogs",
        subChildren: [
          { title: "clothes", href: "/category/pets/dogs/clothes" },
          { title: "toys", href: "/category/pets/dogs/toys" },
        ]
      },
    ]
  },
  {
    title: "Shipping",
    href: "/shipping",
    customClass: "text-[#8A001A] font-symphony text-[22px] md:text-2xl capitalize tracking-normal leading-none pt-1"
  },
  {
    title: "Read Before Ordering",
    href: "/order-info",
    customClass: "text-[#8A001A] font-symphony text-[22px] md:text-2xl capitalize tracking-normal leading-none pt-1"
  },
  {
    title: "Policies",
    href: "/policy",
    hideOnDesktop: true
  },
  {
    title: "Track Order",
    href: "/track-order",
    hideOnDesktop: true
  }
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { wishlist } = useWishlistStore();
  const { cart, openCart } = useCartStore();
  const { currency } = useCurrencyStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchFocus = async () => {
    setShowSearchDropdown(true);
    if (allProducts.length === 0 && !isSearching) {
      setIsSearching(true);
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const productsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAllProducts(productsList);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const searchIndex = useMemo(() => {
    if (allProducts.length === 0) return null;
    return createSearchIndex(allProducts);
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery || !searchIndex) return [];
    return getTopSuggestions(searchIndex, searchQuery, 5);
  }, [searchQuery, searchIndex]);

  const didYouMean = useMemo(() => {
    if (!searchQuery || filteredProducts.length > 0) return null;
    return getDidYouMean(allProducts, searchQuery);
  }, [searchQuery, filteredProducts.length, allProducts]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchQuery]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      logSearchAnalytics(searchQuery, filteredProducts.length, 'header', user?.uid);
      if (selectedIndex >= 0 && selectedIndex < filteredProducts.length) {
        const selected = filteredProducts[selectedIndex];
        router.push(`/product/${selected.slug || selected.id}`);
      } else if (searchQuery) {
        router.push(`/catalogue?search=${encodeURIComponent(searchQuery)}`);
      }
      setShowSearchDropdown(false);
      setSearchQuery('');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filteredProducts.length > 0) {
        setSelectedIndex(prev => (prev < filteredProducts.length - 1 ? prev + 1 : prev));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filteredProducts.length > 0) {
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
      }
    }
  };

  const handleSearchSubmit = () => {
    logSearchAnalytics(searchQuery, filteredProducts.length, 'header', user?.uid);
    setShowSearchDropdown(false);
    setSearchQuery('');
  };

  const handleUserClick = () => {
    if (user) {
      router.push('/account');
    } else {
      router.push('/auth/login');
    }
  };

  // Determine styles based on scroll state and page
  // Determine styles based on scroll state and page
  const headerBgClass = isHome && !isScrolled ? 'bg-transparent border-transparent' : 'bg-[#FFFFFF] border-[#000000]/10 shadow-sm';
  const textClass = isHome && !isScrolled ? 'text-white hover:text-white/80' : 'text-[#000000] hover:text-[#000000]/80';
  const logoClass = isHome && !isScrolled ? 'text-white' : 'text-[#000000]';
  const topBannerClass = 'bg-[#8A001A] text-white';

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col">
      {/* Top Banner */}
      <div className={`w-full py-2 px-4 text-[10px] md:text-xs tracking-widest font-[family-name:var(--font-playfair)] relative transition-colors ${topBannerClass}`}>
        
        {/* Desktop: Static Text */}
        <div className="hidden md:block text-center uppercase">
          • ✈️ Pre - orders only &nbsp;&nbsp; • imported Pinterest Finds
        </div>

        {/* Mobile: Marquee */}
        <div className="md:hidden overflow-hidden flex whitespace-nowrap w-full">
          <div className="animate-marquee-slow inline-block uppercase">
            <span className="mx-8">• ✈️ Pre - orders only &nbsp;&nbsp; • imported Pinterest Finds</span>
            <span className="mx-8">• ✈️ Pre - orders only &nbsp;&nbsp; • imported Pinterest Finds</span>
            <span className="mx-8">• ✈️ Pre - orders only &nbsp;&nbsp; • imported Pinterest Finds</span>
          </div>
        </div>
      </div>
      
      {/* Main Header */}
      <div className={`border-b transition-all duration-300 ${headerBgClass}`}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24 relative">
            {/* Left Area (Desktop: Logo, Mobile: Hamburger & Wishlist) */}
            <div className="flex items-center flex-1 lg:flex-none">
              {/* Mobile Hamburger */}
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className={`${textClass} transition-colors lg:hidden mr-4`}
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Mobile Wishlist */}
              <Link href="/wishlist" className={`${textClass} transition-colors relative lg:hidden mr-4`} aria-label="Wishlist">
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#8A001A] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Desktop Logo Image - Increased */}
              <Link href="/" className="hidden lg:block">
                <img src="/LOGO.png" alt="House of Avira Logo" className="h-[160px] w-auto object-contain scale-125 origin-left" />
              </Link>
            </div>

            {/* Center Area (Desktop: Text Title, Mobile: Logo Image) */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
              {/* Desktop Title */}
              <Link href="/" className={`hidden lg:flex items-center gap-2 text-2xl md:text-4xl tracking-widest transition-colors ${logoClass}`}>
                <span className="font-perandory uppercase">House of</span> <span className="font-aston-script capitalize text-3xl md:text-5xl translate-y-1">Avira</span>
              </Link>
              {/* Mobile Logo Image - Increased by 80% */}
              <Link href="/" className="lg:hidden block mt-1">
                <img src="/LOGO.png" alt="House of Avira Logo" className="h-[162px] w-auto object-contain" />
              </Link>
            </div>

            {/* Right Side: Search, Account, Cart */}
            <div className="flex items-center justify-end gap-4 md:gap-6 flex-1 lg:flex-none">
              {/* Search */}
              <div className="flex items-center relative" ref={searchRef}>
                {/* Search Pill - Hidden on smallest mobile, icon only on small screens */}
                <div className={`hidden sm:flex items-center border rounded-full px-3 py-1.5 transition-colors ${isHome && !isScrolled ? 'border-white/50 text-white focus-within:border-white' : 'border-[#000000]/30 text-[#000000] focus-within:border-[#000000]'}`}>
                  <Search className="w-4 h-4 mr-2" />
                  <input 
                    type="text" 
                    placeholder="Search" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={handleSearchFocus}
                    onKeyDown={handleKeyDown}
                    className="bg-transparent outline-none w-24 md:w-32 lg:w-48 text-sm placeholder:text-current opacity-80 font-dm-sans"
                  />
                </div>
                <button 
                  className={`${textClass} transition-colors sm:hidden`}
                  onClick={() => {
                    setShowSearchDropdown(true);
                    handleSearchFocus();
                  }}
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Search Dropdown / Fullscreen Mobile Search */}
                {showSearchDropdown && (
                  <div className="fixed inset-0 sm:absolute sm:inset-auto sm:top-[120%] sm:right-0 w-[100vw] h-[100vh] sm:h-auto sm:w-[400px] sm:max-h-[70vh] overflow-y-auto bg-white sm:border border-black/10 sm:shadow-2xl sm:rounded-2xl p-4 sm:p-4 z-[100] animate-in fade-in sm:slide-in-from-top-2 flex flex-col gap-4 text-black cursor-default font-dm-sans">
                    {/* Mobile Close Header */}
                    <div className="sm:hidden flex items-center justify-between pb-2 border-b border-black/5 mb-2">
                      <span className="font-dm-sans font-bold text-xl tracking-widest uppercase">Search</span>
                      <button onClick={() => setShowSearchDropdown(false)} className="p-2 hover:bg-black/5 rounded-full">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Mobile Search Input visible only on small screens inside the dropdown */}
                    <div className="sm:hidden flex items-center border border-black/20 rounded-xl px-4 py-3 bg-[#FAFAFA]">
                      <Search className="w-5 h-5 mr-3 text-neutral-500" />
                      <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="bg-transparent outline-none flex-1 text-base placeholder:text-neutral-500 font-dm-sans"
                        autoFocus
                      />
                    </div>

                    <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1 border-b border-black/5 pb-2">
                      {searchQuery ? 'Search Results' : 'Suggested Products'}
                    </div>

                    {isSearching ? (
                      <div className="flex justify-center items-center py-8">
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : searchQuery && filteredProducts.length === 0 ? (
                      <div className="text-center py-8 text-neutral-500 text-xs uppercase tracking-widest">
                        No products found for "{searchQuery}"
                        {didYouMean && (
                          <div className="mt-2 text-black cursor-pointer" onClick={() => setSearchQuery(didYouMean)}>
                            Did you mean <strong>{didYouMean}</strong>?
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {(searchQuery ? filteredProducts : allProducts.slice(0, 4)).map((product, idx) => (
                          <Link 
                            href={`/product/${product.slug || product.id}`} 
                            key={product.id}
                            onClick={handleSearchSubmit}
                            className={`flex items-center gap-4 p-2 rounded-xl transition-colors group border ${selectedIndex === idx ? 'bg-[#FAFAFA] border-black/10' : 'hover:bg-[#FAFAFA] border-transparent hover:border-black/5'}`}
                          >
                            <div className="w-14 h-16 bg-neutral-100 rounded-md overflow-hidden flex-shrink-0 relative">
                              {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                  <ShoppingBag className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col flex-1 overflow-hidden">
                              <span className="text-[11px] font-bold uppercase tracking-widest truncate">{product.name}</span>
                              <span className="text-[10px] text-neutral-500 capitalize truncate">{product.category}</span>
                              <span className="text-xs font-medium mt-1 text-[#8A001A]"><PriceDisplay basePrice={product.price || 0} /></span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                    
                    {searchQuery && filteredProducts.length > 0 && (
                      <Link 
                        href={`/catalogue?search=${encodeURIComponent(searchQuery)}`}
                        onClick={handleSearchSubmit}
                        className="mt-2 text-center text-[10px] uppercase tracking-widest font-bold py-3 border border-black rounded-xl hover:bg-black hover:text-white transition-colors"
                      >
                        View All Results
                      </Link>
                    )}
                  </div>
                )}
              </div>

              <button 
                onClick={handleUserClick} 
                className={`${textClass} transition-colors`}
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </button>
              
              <Link href="/wishlist" className={`${textClass} transition-colors relative hidden lg:block`} aria-label="Wishlist">
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#8A001A] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <button onClick={openCart} className={`${textClass} transition-colors relative`} aria-label="Cart">
                <ShoppingBag className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#8A001A] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Navigation Links - Desktop Only */}
          <nav className="hidden lg:flex justify-center gap-8 h-12">
            {menuData.filter(item => !item.hideOnDesktop).map((item) => (
              <div key={item.title} className="relative group flex items-center h-full">
                <Link 
                  href={item.href} 
                  className={item.customClass ? `${item.customClass} transition-colors hover:opacity-80` : `text-[14px] leading-[14px] font-dm-sans font-normal transition-colors ${textClass}`}
                >
                  {item.title}
                </Link>
                
                {/* Dropdown 1 */}
                {item.children && (
                  <div className="absolute top-full left-0 hidden group-hover:block w-48 bg-[#FFFFFF] shadow-lg border border-[#000000]/10 pt-2 pb-2">
                    {item.children.map(child => (
                      <div key={child.title} className="relative group/sub">
                        <Link 
                          href={child.href}
                          className="flex justify-between items-center px-4 py-2 text-[14px] leading-[14px] font-dm-sans font-normal text-[#000000]/80 hover:bg-[#000000]/5 hover:text-[#000000] capitalize"
                        >
                          {child.title}
                          {child.subChildren && <ChevronRight className="w-3 h-3" />}
                        </Link>
                        
                        {/* Dropdown 2 (Sub-children) */}
                        {child.subChildren && (
                          <div className="absolute top-0 left-full hidden group-hover/sub:block w-40 bg-[#FFFFFF] shadow-lg border border-[#000000]/10 py-2 -ml-1">
                            {child.subChildren.map(subChild => (
                              <Link 
                                key={subChild.title}
                                href={subChild.href}
                                className="block px-4 py-2 text-[14px] leading-[14px] font-dm-sans font-normal text-[#000000]/80 hover:bg-[#000000]/5 hover:text-[#000000] capitalize"
                              >
                                {subChild.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Menu Sidebar */}
      <div 
        className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div 
          className={`fixed top-0 left-0 w-[85%] max-w-sm h-full bg-[#FFFFFF] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-y-auto ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 flex justify-between items-center border-b border-[#000000]/10 sticky top-0 bg-white z-10">
            <span className="font-aston-script capitalize text-3xl md:text-4xl tracking-normal text-[#8A001A]">Menu</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-black/60 hover:text-black p-2 bg-black/5 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex flex-col">
            {/* Auth / Account Links */}
            <div className="px-6 py-8 flex gap-6 border-b border-[#000000]/10 mb-2">
              <button onClick={() => { setIsMobileMenuOpen(false); handleUserClick(); }} className="flex flex-col items-center gap-2 text-[#000000]/70 hover:text-[#000000] flex-1 py-3 bg-[#FAFAFA] border border-[#000000]/5 rounded-xl transition-colors">
                <User className="w-5 h-5" />
                <span className="text-[10px] font-dm-sans uppercase tracking-[0.15em] font-bold">Account</span>
              </button>
              <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col items-center gap-2 text-[#000000]/70 hover:text-[#000000] flex-1 py-3 bg-[#FAFAFA] border border-[#000000]/5 rounded-xl relative transition-colors">
                <Heart className="w-5 h-5" />
                <span className="text-[10px] font-dm-sans uppercase tracking-[0.15em] font-bold">Wishlist</span>
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-3 bg-[#8A001A] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <button onClick={() => { setIsMobileMenuOpen(false); openCart(); }} className="flex flex-col items-center gap-2 text-[#000000]/70 hover:text-[#000000] flex-1 py-3 bg-[#FAFAFA] border border-[#000000]/5 rounded-xl relative transition-colors">
                <ShoppingBag className="w-5 h-5" />
                <span className="text-[10px] font-dm-sans uppercase tracking-[0.15em] font-bold">Cart</span>
                {cart.length > 0 && (
                  <span className="absolute top-1 right-3 bg-[#8A001A] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
            

            {menuData.map((item, idx) => (
              <div key={idx} className="border-b border-[#000000]/5">
                {item.children ? (
                  <details className="group [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex justify-between items-center px-6 py-4 text-[14px] leading-[14px] font-dm-sans font-normal text-[#000000] cursor-pointer list-none">
                      {item.title}
                      <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90 text-[#000000]/40" />
                    </summary>
                    <div className="bg-[#000000]/5 px-6 py-2 flex flex-col gap-1 shadow-inner">
                      {item.children.map(child => (
                        <div key={child.title}>
                          {child.subChildren ? (
                            <details className="group/sub [&_summary::-webkit-details-marker]:hidden">
                              <summary className="flex justify-between items-center py-3 text-[14px] leading-[14px] font-dm-sans font-normal text-[#000000]/80 cursor-pointer list-none capitalize">
                                {child.title}
                                <ChevronRight className="w-3 h-3 transition-transform group-open/sub:rotate-90 text-[#000000]/40" />
                              </summary>
                              <div className="pl-4 pb-2 flex flex-col gap-2 border-l border-[#000000]/10 ml-1">
                                {child.subChildren.map(subChild => (
                                    <Link key={subChild.title} href={subChild.href} onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-[14px] leading-[14px] font-dm-sans font-normal text-[#000000]/60 block hover:text-[#000000] capitalize">
                                    {subChild.title}
                                  </Link>
                                ))}
                              </div>
                            </details>
                          ) : (
                            <Link href={child.href} onClick={() => setIsMobileMenuOpen(false)} className="py-3 text-[14px] leading-[14px] font-dm-sans font-normal text-[#000000]/80 block hover:text-[#000000] capitalize">
                              {child.title}
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </details>
                ) : (
                  <Link href={item.href} onClick={() => setIsMobileMenuOpen(false)} className={item.customClass ? `block px-6 py-4 ${item.customClass}` : `block px-6 py-4 text-[14px] leading-[14px] font-dm-sans font-normal text-[#000000]`}>
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <CartSlideOver />
    </header>
  );
}
