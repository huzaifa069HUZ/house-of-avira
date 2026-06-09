'use client';

import ProductCard from '@/components/ProductCard';
import HeroCarousel from '@/components/HeroCarousel';
import HowItWorks from '@/components/HowItWorks';
import CampaignAndGrid from '@/components/CampaignAndGrid';
import Link from 'next/link';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useState, useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { wishlist, toggleWishlist } = useWishlistStore();

  const handleWishlistToggle = async (e, product) => {
    e.preventDefault();
    if (!user) {
      router.push('/auth/login');
      return;
    }
    await toggleWishlist(product);
  };
  const dummyProducts = [
    {
      id: "valerie-ruffle-hot-short",
      name: "Valerie Ruffle Hot Short",
      price: 3900.00,
      imageUrl: "/product1.png",
      badge: "MOST LOVED",
      swatches: [
        { color: "#8cb4d6", active: true },
        { color: "#000000", active: false }
      ],
      extraColors: 0
    },
    {
      id: "ravenna-mini-dress",
      name: "Ravenna Mini Dress",
      price: 6000.00,
      imageUrl: "/product2.png",
      badge: "MOST LOVED",
      swatches: [
        { color: "#8fe3ff", active: true },
        { color: "#f7f5db", active: false },
        { color: "#000000", active: false }
      ],
      extraColors: 1
    },
    {
      id: "nyomi-mini-dress",
      name: "Nyomi Mini Dress",
      price: 5500.00,
      imageUrl: "/product3.png",
      badge: "NEW",
      swatches: [
        { color: "#4a3525", active: true },
        { color: "#000000", active: false },
        { color: "#ffffff", active: false }
      ],
      extraColors: 1
    },
    {
      id: "ave-bikini-bottom",
      name: "Ave Bikini Bottom",
      price: 3600.00,
      imageUrl: "/product4.png",
      badge: "NEW",
      swatches: [
        { color: "#b5878d", active: true },
        { color: "#d9ba96", active: false },
        { color: "#1f4a66", active: false }
      ],
      extraColors: 2
    }
  ];

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // If empty, fall back to dummy data so layout isn't broken
        if (fetchedProducts.length > 0) {
          setProducts(fetchedProducts);
        } else {
          setProducts(dummyProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts(dummyProducts);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, []);

  const newArrivals = products.filter(p => p.section === 'New Arrivals' || !p.section);
  const curatedAesthetics = products.filter(p => p.section === 'Curated Aesthetics');
  const curatedItems = curatedAesthetics.length > 0 ? curatedAesthetics : dummyProducts;

  return (
    <div className="flex flex-col w-full">
      {/* Fullscreen Hero Image Carousel */}
      <HeroCarousel />

      {/* How It Works Educational Section */}
      <HowItWorks />

      {/* New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        {/* Section Header */}
        <div className="flex justify-between items-end mb-8 border-b border-[#000000]/10 pb-4">
          <div className="flex items-baseline gap-6">
            <h2 className="text-3xl font-serif tracking-tight text-[#000000] italic">NEW ARRIVALS</h2>
            <a href="/catalogue" className="text-xs font-semibold tracking-widest uppercase text-[#000000]/70 hover:text-[#000000]">
              Shop All
            </a>
          </div>
          <div className="flex gap-2 text-[#000000]/40">
            <button className="hover:text-[#000000] transition-colors" aria-label="Previous">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button className="hover:text-[#000000] transition-colors" aria-label="Next">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>

        {/* Horizontally Scrollable Product List */}
        <div className="flex overflow-x-auto gap-4 hide-scrollbar snap-x snap-mandatory pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          {newArrivals.map((product, idx) => (
            <div key={product.id || idx} className="w-[calc(50%-8px)] md:w-[calc(25%-12px)] snap-start flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Pinterest Collection Section */}
      <section className="w-full flex flex-col items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-end mb-10 border-b border-[#000000]/10 pb-6">
            <div className="flex items-baseline gap-6 w-full justify-center">
              <h2 className="text-5xl md:text-7xl font-serif tracking-tight text-[#000000] italic">PINTEREST COLLECTION</h2>
            </div>
          </div>
        </div>
        
        {/* Fullscreen Image Link */}
        <Link 
          href="/category/women/jackets" 
          className="relative w-full h-screen block overflow-hidden group cursor-pointer"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url('/arvia%203%20guy.png')` }}
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-500"></div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-lg tracking-[0.2em] font-medium uppercase border border-white px-8 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-sm bg-black/10">
              Shop Women's Jackets
            </span>
          </div>
        </Link>
      </section>

      {/* Shop By Category Section (from legacy Vite app) */}
      <section className="py-24 bg-[#000000] text-[#FFFFFF] overflow-hidden w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs tracking-widest uppercase mb-16 opacity-60">Shop by Category</p>
          <div className="flex flex-col w-full">
            {['Co-Ords', 'Dresses', 'Knitwear', 'Accessories'].map((category, idx) => (
              <div 
                key={idx}
                className="border-b border-[#FFFFFF]/20 py-8 md:py-12 group cursor-pointer flex justify-between items-center"
              >
                <h2 className="font-serif text-5xl md:text-8xl tracking-tight transition-transform duration-700 ease-out group-hover:translate-x-4 md:group-hover:translate-x-8">
                  {category}
                </h2>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden md:block">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/>
                    <path d="m12 5 7 7-7 7"/>
                  </svg>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories (Edgy 3-Grid) */}
      <section className="w-full bg-white p-2 md:p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 w-full h-[150vh] md:h-[90vh]">
          {[
            { img: '/dress.png', title: 'DRESS', link: '/category/women/dresses' },
            { img: '/swim.png', title: 'SWIM', link: '/category/women/beach-wear' },
            { img: '/sets.png', title: 'SETS', link: '/category/women/tops' }
          ].map((item, idx) => (
            <Link 
              key={idx} 
              href={item.link}
              className="relative w-full h-full overflow-hidden group cursor-pointer bg-[#FFFFFF] rounded-2xl md:rounded-3xl"
            >
              <img 
                src={item.img} 
                alt={item.title} 
                className="w-full h-full object-cover object-center transition-transform duration-[2s] ease-out group-hover:scale-105" 
              />
              {/* Subtle dark gradient at bottom for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
              
              {/* Edgy typography bottom left */}
              <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-10 overflow-hidden">
                <h3 className="text-white text-4xl md:text-5xl font-serif italic tracking-wide capitalize translate-y-2 group-hover:translate-y-0 transition-transform duration-500 font-light drop-shadow-md">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Curated Aesthetics Section */}
      <section className="py-20 bg-white w-full">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-sans font-bold tracking-tight text-[#000000] mb-2">Curated Aesthetics</h2>
          <p className="text-xs md:text-sm text-[#000000]/60 tracking-widest uppercase mb-8">OUR CUTEST PICKS,JUST FOR YOU 💕</p>
          
          {/* Pills / Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar w-full md:w-auto pb-2 md:pb-0">
              <button className="bg-[#000000] text-white px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap">Best Sellers</button>
              <button className="border border-[#000000] text-[#000000] px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap hover:bg-[#000000]/5 transition-colors">New Arrivals</button>
              <button className="border border-[#000000] text-[#000000] px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap hover:bg-[#000000]/5 transition-colors">Sets</button>
              <button className="border border-[#000000] text-[#000000] px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap hover:bg-[#000000]/5 transition-colors">Dresses</button>
              <button className="border border-[#000000] text-[#000000] px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap hover:bg-[#000000]/5 transition-colors">Tops</button>
              <button className="border border-[#000000] text-[#000000] px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap hover:bg-[#000000]/5 transition-colors">Outerwear</button>
            </div>
            <button className="border border-[#000000] text-[#000000] px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap hover:bg-[#000000]/5 transition-colors hidden md:block">Shop Best Sellers</button>
          </div>
        </div>

        {/* Seamless Grid */}
        <div className="w-full border-t border-b border-[#000000]/20">
          <div className="grid grid-cols-2 md:grid-cols-5 w-full">
            {curatedItems.map((item, idx) => (
              <Link href={`/product/${item.id}`} key={item.id || idx} className="border-r border-[#000000]/20 group cursor-pointer flex flex-col relative bg-white block">
                {/* Image Block */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#FFFFFF]">
                  <img src={item.imageUrl || item.img} alt={item.name || item.title} className="w-full h-full object-cover" />
                  
                  {idx < 2 && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-semibold text-[#000000]">
                      Selling Fast
                    </div>
                  )}
                  
                  {/* Hover Size Selector */}
                  <div className="absolute bottom-0 left-0 w-full bg-white/80 backdrop-blur-md p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex flex-col items-center">
                    <p className="text-[10px] font-bold tracking-widest mb-2 uppercase text-[#000000]">Select a Size</p>
                    <div className="flex gap-1.5 justify-center flex-wrap">
                      {(item.sizes || [4,6,8,10,12,14,16]).map(s => (
                        <button key={s} className="w-6 h-6 border border-[#000000]/20 bg-white text-[10px] font-medium flex items-center justify-center hover:border-[#000000] transition-colors text-[#000000]">
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Text Block */}
                <div className="p-4 flex justify-between items-start bg-white h-24">
                  <div className="flex flex-col pr-2">
                    <h3 className="text-xs font-medium text-[#000000] line-clamp-2 leading-tight">{item.name || item.title}</h3>
                    <p className="text-xs text-[#000000]/60 mt-1.5">{typeof item.price === 'number' ? `₹${item.price.toFixed(2)}` : item.price}</p>
                  </div>
                  <button 
                    onClick={(e) => handleWishlistToggle(e, item)}
                    className={`transition-colors shrink-0 ${wishlist.some(w => w.id === item.id) ? 'text-[#000000]' : 'text-[#000000]/40 hover:text-[#000000]'}`}
                    aria-label="Toggle wishlist"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlist.some(w => w.id === item.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="w-full bg-[#FFFFFF] text-[#000000] py-16 md:py-24 overflow-hidden border-y-[3px] border-[#000000] relative">
        <div className="flex flex-col gap-20 relative z-10">
          {/* Top Line: Bold, Tall & Big */}
          <div className="flex whitespace-nowrap">
            <div className="flex animate-marquee-full shrink-0">
              {[...Array(4)].map((_, i) => (
                <span key={`mqa1-${i}`} className="text-6xl md:text-8xl lg:text-[7rem] font-sans font-black tracking-tighter uppercase mx-10 whitespace-nowrap scale-y-[1.25] inline-block origin-center pb-2">
                  EVERYTHING IS INTERNATIONALLY SHIPPED AND EVERYTHING IS PREMIUM <span className="mx-16 opacity-30">✦</span>
                </span>
              ))}
            </div>
            <div className="flex animate-marquee-full shrink-0" aria-hidden="true">
              {[...Array(4)].map((_, i) => (
                <span key={`mqb1-${i}`} className="text-6xl md:text-8xl lg:text-[7rem] font-sans font-black tracking-tighter uppercase mx-10 whitespace-nowrap scale-y-[1.25] inline-block origin-center pb-2">
                  EVERYTHING IS INTERNATIONALLY SHIPPED AND EVERYTHING IS PREMIUM <span className="mx-16 opacity-30">✦</span>
                </span>
              ))}
            </div>
          </div>
          
          {/* Bottom Line: Spaced & Informative */}
          <div className="flex whitespace-nowrap">
            <div className="flex animate-marquee-full-reverse shrink-0">
              {[...Array(6)].map((_, i) => (
                <span key={`mqa2-${i}`} className="text-xl md:text-3xl font-sans font-black tracking-[0.5em] uppercase mx-16 whitespace-nowrap opacity-90 scale-y-[1.15] inline-block origin-center pt-2">
                  IMPORTED PREMIUM GOODS <span className="mx-16 text-[#8A001A]">/</span> INTERNATIONAL SHIPPING CHARGES SEPERATE <span className="mx-16 text-[#8A001A]">/</span>
                </span>
              ))}
            </div>
            <div className="flex animate-marquee-full-reverse shrink-0" aria-hidden="true">
              {[...Array(6)].map((_, i) => (
                <span key={`mqb2-${i}`} className="text-xl md:text-3xl font-sans font-black tracking-[0.5em] uppercase mx-16 whitespace-nowrap opacity-90 scale-y-[1.15] inline-block origin-center pt-2">
                  IMPORTED PREMIUM GOODS <span className="mx-16 text-[#8A001A]">/</span> INTERNATIONAL SHIPPING CHARGES SEPERATE <span className="mx-16 text-[#8A001A]">/</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Soft Silhouettes Campaign & 4-Grid GSAP Section */}
      <CampaignAndGrid />

      {/* Split Categories Section */}
      <section className="w-full flex flex-col md:flex-row h-[120vh] md:h-screen relative z-20 bg-white">
        <div className="w-full md:w-1/2 relative group overflow-hidden cursor-pointer h-1/2 md:h-full bg-[#E5E0DA]">
          <img src="/accesories.png" alt="Pinterest Modern Dress" className="w-full h-full object-cover object-center transition-transform duration-[2000ms] ease-out group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />
          <div className="absolute bottom-12 left-0 w-full text-center z-10 flex justify-center">
            <span className="text-white text-sm md:text-base tracking-widest uppercase font-medium hover:opacity-70 transition-opacity">Go To Accesories</span>
          </div>
        </div>
        <div className="w-full md:w-1/2 relative group overflow-hidden cursor-pointer h-1/2 md:h-full bg-[#D8D0C8]">
          <img src="/fashion.png" alt="Trendy Pinterest Accessories" className="w-full h-full object-cover object-center transition-transform duration-[2000ms] ease-out group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />
          <div className="absolute bottom-12 left-0 w-full text-center z-10 flex justify-center">
            <span className="text-white text-sm md:text-base tracking-widest uppercase font-medium hover:opacity-70 transition-opacity">Go To Fashion</span>
          </div>
        </div>
      </section>

      {/* Join the Archive Section */}
      <section className="py-32 md:py-48 px-6 bg-[#FFFFFF] flex flex-col items-center justify-center text-center w-full">
        <div className="w-full max-w-xl">
          <h3 className="font-serif text-3xl md:text-5xl mb-6 text-[#000000]">Join the Archive</h3>
          <p className="text-sm text-gray-500 mb-12">Sign up to receive early access to new collections, exclusive events, and editorial features.</p>
          <form className="flex flex-col md:flex-row w-full gap-4 border-b border-[#000000]/30 pb-4">
            <input type="email" placeholder="Email Address" className="bg-transparent w-full outline-none text-[#000000] placeholder:text-gray-400 text-sm" />
            <button type="button" className="text-xs uppercase tracking-widest text-[#000000] font-medium hover:opacity-60 transition-opacity text-left md:text-right">Subscribe</button>
          </form>
        </div>
      </section>

    </div>
  );
}
