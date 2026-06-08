'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, ShoppingBag, User, Menu, ChevronRight, Heart } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useState, useEffect } from 'react';

const menuData = [
  { title: "Shop All", href: "/catalogue" },
  { 
    title: "Women", 
    href: "/category/women",
    children: [
      { title: "tops", href: "/category/women/tops" },
      { title: "pants / jeans", href: "/category/women/pants-jeans" },
      { title: "skirts", href: "/category/women/skirts" },
      { title: "dresses", href: "/category/women/dresses" },
      { title: "jackets", href: "/category/women/jackets" },
      { title: "footwear", href: "/category/women/footwear" },
      { title: "beach wear", href: "/category/women/beach-wear" },
    ]
  },
  {
    title: "Men",
    href: "/category/men",
    children: [
      { title: "tops", href: "/category/men/tops" },
      { title: "pants/jeans", href: "/category/men/pants-jeans" },
      { title: "jackets", href: "/category/men/jackets" },
      { title: "footwear", href: "/category/men/footwear" },
    ]
  },
  {
    title: "Unisex",
    href: "/category/unisex",
    children: [
      { title: "tops", href: "/category/unisex/tops" },
      { title: "pants/jeans", href: "/category/unisex/pants-jeans" },
      { title: "jackets", href: "/category/unisex/jackets" },
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
      { title: "Blind Boxes", href: "/category/collectibles/blind-boxes" },
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
  }
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { wishlist } = useWishlistStore();
  const [isScrolled, setIsScrolled] = useState(false);
  
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

  const handleUserClick = () => {
    if (user) {
      router.push('/account');
    } else {
      router.push('/auth/login');
    }
  };

  // Determine styles based on scroll state and page
  // Determine styles based on scroll state and page
  const headerBgClass = isHome && !isScrolled ? 'bg-transparent border-transparent' : 'bg-[#F8F5F1] border-[#1A1A1A]/10 shadow-sm';
  const textClass = isHome && !isScrolled ? 'text-white hover:text-white/80' : 'text-neutral-500 hover:text-[#1A1A1A]';
  const logoClass = isHome && !isScrolled ? 'text-white' : 'text-[#1A1A1A]';
  const topBannerClass = 'bg-[#1A1A1A] text-white';

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col">
      {/* Top Banner */}
      <div className={`w-full py-2 px-4 text-[10px] md:text-xs tracking-widest font-medium relative transition-colors ${topBannerClass}`}>
        
        {/* Desktop: Static Text */}
        <div className="hidden md:block text-center uppercase">
          This is a preorder business. Products are imported. Shipping is charged separately. No cancellations or refunds after ordering.
        </div>

        {/* Mobile: Marquee */}
        <div className="md:hidden overflow-hidden flex whitespace-nowrap w-full">
          <div className="animate-marquee-slow inline-block uppercase">
            <span className="mx-8">This is a preorder business. Products are imported. Shipping is charged separately. No cancellations or refunds after ordering.</span>
            <span className="mx-8">This is a preorder business. Products are imported. Shipping is charged separately. No cancellations or refunds after ordering.</span>
            <span className="mx-8">This is a preorder business. Products are imported. Shipping is charged separately. No cancellations or refunds after ordering.</span>
          </div>
        </div>
      </div>
      
      {/* Main Header */}
      <div className={`border-b transition-all duration-300 ${headerBgClass}`}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 relative">
            {/* Left Area (Desktop: Logo, Mobile: Hamburger) */}
            <div className="flex items-center flex-1 lg:flex-none">
              {/* Mobile Hamburger */}
              <button className={`${textClass} transition-colors lg:hidden mr-4`}>
                <Menu className="w-6 h-6" />
              </button>

              {/* Desktop Logo Image - Increased by ~42% (h-10 to h-[56px]) */}
              <Link href="/" className="hidden lg:block">
                <img src="/LOGO.png" alt="House of Avira Logo" className="h-[56px] w-auto object-contain" />
              </Link>
            </div>

            {/* Center Area (Desktop: Text Title, Mobile: Logo Image) */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
              {/* Desktop Title */}
              <Link href="/" className={`hidden lg:block font-cormorant uppercase text-2xl md:text-4xl tracking-widest transition-colors ${logoClass}`}>
                House of Avira
              </Link>
              {/* Mobile Logo Image - Increased by ~42% (h-12 to h-[68px]) */}
              <Link href="/" className="lg:hidden block mt-1">
                <img src="/LOGO.png" alt="House of Avira Logo" className="h-[68px] w-auto object-contain" />
              </Link>
            </div>

            {/* Right Side: Search, Account, Cart */}
            <div className="flex items-center justify-end gap-4 md:gap-6 flex-1 lg:flex-none">
              {/* Search */}
              <div className="flex items-center">
                {/* Search Pill - Hidden on smallest mobile, icon only on small screens */}
                <div className={`hidden sm:flex items-center border rounded-full px-3 py-1.5 transition-colors ${isHome && !isScrolled ? 'border-white/50 text-white focus-within:border-white' : 'border-[#1A1A1A]/30 text-[#1A1A1A] focus-within:border-[#1A1A1A]'}`}>
                  <Search className="w-4 h-4 mr-2" />
                  <input 
                    type="text" 
                    placeholder="Search" 
                    className="bg-transparent outline-none w-24 md:w-32 lg:w-48 text-sm placeholder:text-current opacity-80"
                  />
                </div>
                <button className={`${textClass} transition-colors sm:hidden`}>
                  <Search className="w-5 h-5" />
                </button>
              </div>

              <button 
                onClick={handleUserClick} 
                className={`${textClass} transition-colors`}
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </button>
              
              <Link href="/account" className={`${textClass} transition-colors relative`} aria-label="Wishlist">
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#1A1A1A] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <Link href="/cart" className={`${textClass} transition-colors relative`}>
                <ShoppingBag className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Navigation Links - Desktop Only */}
          <nav className="hidden lg:flex justify-center gap-8 h-12">
            {menuData.map((item) => (
              <div key={item.title} className="relative group flex items-center h-full">
                <Link 
                  href={item.href} 
                  className={`text-xs font-bold uppercase tracking-widest transition-colors ${textClass}`}
                >
                  {item.title}
                </Link>
                
                {/* Dropdown 1 */}
                {item.children && (
                  <div className="absolute top-full left-0 hidden group-hover:block w-48 bg-[#F8F5F1] shadow-lg border border-[#1A1A1A]/10 pt-2 pb-2">
                    {item.children.map(child => (
                      <div key={child.title} className="relative group/sub">
                        <Link 
                          href={child.href}
                          className="flex justify-between items-center px-4 py-2 text-xs text-[#1A1A1A]/80 hover:bg-[#1A1A1A]/5 hover:text-[#1A1A1A] uppercase tracking-wider"
                        >
                          {child.title}
                          {child.subChildren && <ChevronRight className="w-3 h-3" />}
                        </Link>
                        
                        {/* Dropdown 2 (Sub-children) */}
                        {child.subChildren && (
                          <div className="absolute top-0 left-full hidden group-hover/sub:block w-40 bg-[#F8F5F1] shadow-lg border border-[#1A1A1A]/10 py-2 -ml-1">
                            {child.subChildren.map(subChild => (
                              <Link 
                                key={subChild.title}
                                href={subChild.href}
                                className="block px-4 py-2 text-[10px] text-[#1A1A1A]/80 hover:bg-[#1A1A1A]/5 hover:text-[#1A1A1A] uppercase tracking-wider"
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
    </header>
  );
}
