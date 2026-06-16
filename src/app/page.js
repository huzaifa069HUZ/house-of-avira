'use client';

import ProductCard from '@/components/ProductCard';
import HeroCarousel from '@/components/HeroCarousel';
import HowItWorks from '@/components/HowItWorks';
import WhyHouseOfAvira from '@/components/WhyHouseOfAvira';
import CampaignAndGrid from '@/components/CampaignAndGrid';
import PinterestFeed from '@/components/PinterestFeed';
import { ScrollReelTestimonials } from '@/components/ui/scroll-reel-testimonials';
import Link from 'next/link';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useCurrencyStore } from '@/store/currencyStore';
import PriceDisplay from '@/components/PriceDisplay';

const categories = [
  { title: "Dresses", img: "/images/categories/dress.png", link: "/category/women/dresses" },
  { title: "Tops", img: "/top.png", link: "/category/women/tops" },
  { title: "Bottoms", img: "/images/categories/bottoms.png", link: "/category/women/pants-jeans" },
  { title: "Denim", img: "/images/categories/denim.png", link: "/category/women/pants-jeans" },
  { title: "Activewear", img: "/images/categories/gymwear.png", link: "/category/women/beach-wear" },
  { title: "T-shirts", img: "/images/categories/tshirts.png", link: "/category/women/tops" },
  { title: "Co-ords", img: "/images/categories/co-ords.png", link: "/category/women/tops" },
  { title: "Homewear", img: "/images/categories/homewear.png", link: "/category/women/tops" },
  { title: "Bags", img: "/images/categories/bags.jfif", link: "/category/bags" },
  { title: "Jewellery", img: "/images/categories/jewellery.png", link: "/category/accessories/jewellery" },
  { title: "Accessories", img: "/images/categories/accessories.jfif", link: "/category/accessories" },
  { title: "Beauty", img: "/images/categories/beauty.png", link: "/category/accessories/nails" }
];

const aestheticsCards = [
  { title: "babydoll / coquette", img: "/babydoll.png" },
  { title: "dark feminine", img: "/opium.png" },
  { title: "office siren", img: "/officesiren.png" },
  { title: "y2k", img: "/elegant-chic.png" },
  { title: "streetwear", img: "/streetwear.png" },
  { title: "elegant chic", img: "/y2k.png" },
  { title: "opiúm", img: "/dark-feminine.png" },
  { title: "Summer vacation", img: "/summer-vacation.png" }
];

export default function Home() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { wishlist, toggleWishlist } = useWishlistStore();
  const { t } = useTranslation();
  const { initSettings } = useCurrencyStore();

  const aestheticsTabs = [
    'babydoll / coquette',
    'dark feminine',
    'office siren',
    'y2k',
    'streetwear',
    'elegant chic',
    'opiúm'
  ];
  const [activeAesthetic, setActiveAesthetic] = useState(aestheticsTabs[0]);
  const [activeTab, setActiveTab] = useState('new'); // 'new' or 'best'

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split('; ').reduce((prev, current) => {
        const [name, ...value] = current.split('=');
        if (name) prev[name.trim()] = value.join('=');
        return prev;
      }, {});
      if (cookies.USER_CURRENCY || cookies.NEXT_LOCALE) {
        initSettings(cookies.USER_CURRENCY, cookies.NEXT_LOCALE);
      }
    }
  }, [initSettings]);

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
  const bestSellers = products.filter(p => p.bestSeller === true || p.section === 'Best Sellers' || p.badge === 'MOST LOVED' || p.badge === 'MOST LOVED'.toUpperCase());
  const bestSellersList = bestSellers.length > 0 ? bestSellers : products.slice(0, 4);
  const curatedAestheticsRaw = products.filter(p => p.sections?.includes('Shop your aesthetic') || p.section === 'Shop your aesthetic');
  const curatedAesthetics = curatedAestheticsRaw.filter(p => p.aesthetic === activeAesthetic);
  const curatedItems = curatedAesthetics.length > 0 ? curatedAesthetics : dummyProducts.slice(0, 5);
  const topPicksGridItemsRaw = products.filter(p => p.sections?.includes('Top Picks Grid') || p.section === 'Top Picks Grid');
  const topPicksGridItems = topPicksGridItemsRaw.slice(0, 12);

  return (
    <div className="flex flex-col w-full">
      {/* Fullscreen Hero Image Carousel */}
      <HeroCarousel />

      {/* Modern Trust Strip */}
      <div className="w-full bg-[#FAFAFA] border-b border-[#000000]/5 py-3 overflow-hidden flex flex-col md:flex-row justify-center items-center gap-3 md:gap-10">

        {/* First Row (Mobile) / Left Side (Desktop) */}
        <div className="flex justify-center items-center gap-4 md:gap-10 text-[10px] font-perandory font-bold tracking-[0.2em] uppercase text-[#000000]/80 px-4 md:px-0">
          <div className="flex items-center gap-2 shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>
            <span>5000+ Orders</span>
          </div>
          <span className="text-[#000000]/20 shrink-0">•</span>
          <div className="flex items-center gap-2 shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-2-2h-3.5l-7-4-1.5 1 3.5 5H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h6.5l-3.5 5 1.5 1 7-4H19a2 2 0 0 0 2-2z" />
            </svg>
            <span>Imported Directly</span>
          </div>
        </div>

        {/* Separator for Desktop only */}
        <span className="text-[#000000]/20 hidden md:block shrink-0">•</span>

        {/* Second Row (Mobile) / Right Side (Desktop) */}
        <div className="flex justify-center items-center gap-4 md:gap-10 text-[10px] font-perandory font-bold tracking-[0.2em] uppercase text-[#000000]/80 px-4 md:px-0">
          <div className="flex items-center gap-2 shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            <span>4+ Years Trusted</span>
          </div>
        </div>
      </div>

      {/* New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20 w-full border-b border-[#000000]/10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div className="flex items-baseline gap-6 sm:gap-8 flex-wrap">
            <h2 className="text-3xl font-serif tracking-tight text-[#000000] font-semibold italic border-black border-b-2 pb-1">
              {t.hero.newArrivals}
            </h2>
            <a href="/catalogue" className="text-xs font-semibold tracking-widest uppercase text-[#000000]/70 hover:text-[#000000] sm:ml-2">
              {t.hero.shopAll}
            </a>
          </div>
          <div className="flex gap-2 text-[#000000]/40 self-end sm:self-auto">
            <button className="hover:text-[#000000] transition-colors cursor-pointer" aria-label="Previous">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <button className="hover:text-[#000000] transition-colors cursor-pointer" aria-label="Next">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
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

      {/* Best Sellers & Might Interest You Section */}
      <PinterestFeed>
        <div className="w-full bg-[#FAFAFA] pt-12 md:pt-24 pb-8 md:pb-16 relative z-30">
          <div className="text-center max-w-[1400px] mx-auto fade-up px-4">
            <h2 className="font-perandory text-4xl md:text-5xl lg:text-7xl font-bold tracking-widest uppercase text-black mb-6">
              Best Seller
            </h2>
            <p className="font-aston-script text-3xl md:text-4xl lg:text-5xl text-[#8A001A] leading-relaxed max-w-4xl mx-auto">
              Our most loved pieces, curated just for you
            </p>
          </div>
        </div>
      </PinterestFeed>

      {/* Shop Your Look Section */}
      <section className="w-full bg-[#000000] flex flex-col">
        {/* Header */}
        <div className="w-full px-6 md:px-12 py-8 md:py-12 flex items-center">
          <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-sans font-bold tracking-tight uppercase">Shop your look</h2>
        </div>

        {/* Images Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-4 aspect-auto md:aspect-[4/1.5] lg:aspect-[4/1.8]">
          {[
            { img: '/images/looks/casual.jfif', title: 'CASUAL' },
            { img: '/images/looks/summer.png', title: 'SUMMER' },
            { img: '/images/looks/festival-concerts.png', title: 'FESTIVALS / CONCERTS' },
            { img: '/images/looks/trendy.png', title: 'TRENDY' }
          ].map((look, idx) => (
            <Link href={`/catalogue?look=${encodeURIComponent(look.title.toLowerCase())}`} key={idx} className="relative group overflow-hidden block w-full h-[60vh] md:h-full cursor-pointer">
              <img src={look.img} alt={look.title} className="w-full h-full object-cover object-center transition-transform duration-[2000ms] ease-out group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:from-black/60 md:via-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 z-10">
                <span className="text-white text-lg md:text-xl font-bold tracking-widest uppercase">{look.title}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="w-full flex justify-center items-center py-10 md:py-16">
          <Link href="/catalogue" className="border border-white text-white px-8 py-3 text-sm md:text-base font-bold tracking-[0.1em] md:tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-colors duration-300">
            SEE ALL STYLES
          </Link>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section className="w-full bg-[#FFFFFF] pt-16 pb-8 md:pt-24 md:pb-12">
        <div className="w-full text-left max-w-[1600px] mx-auto px-4 md:px-8 mb-6">
          <h2 className="text-4xl md:text-5xl font-perandory font-bold tracking-widest text-[#000000] uppercase">
            CATEGORIES
          </h2>
        </div>

        {/* 12-Card Grid (4 columns on desktop and mobile, minimal gap) */}
        <div className="max-w-[1600px] mx-auto grid grid-cols-4 gap-1 md:gap-2 px-4 md:px-8">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.link}
              className="relative aspect-[3/4] block overflow-hidden bg-gray-200 group cursor-pointer"
            >
              <img
                src={cat.img}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              {/* Dark Overlay Gradient (bottom only) */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 transition-opacity duration-300" />
              
              {/* Bottom Centered Label */}
              <div className="absolute bottom-3 md:bottom-6 left-0 right-0 flex justify-center items-center z-10 px-1">
                <span 
                  className="text-white text-[10px] sm:text-[11px] md:text-3xl font-sans font-black tracking-widest md:tracking-wide text-center whitespace-nowrap overflow-hidden text-ellipsis w-full max-w-full"
                  style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}
                >
                  {cat.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Curated Aesthetics Section */}
      <section className="pt-8 pb-16 md:pt-12 md:pb-24 bg-white w-full">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-sans font-black tracking-tight text-[#000000] mb-4">{t.curated.title}</h2>
          <p className="text-xs md:text-sm text-[#000000]/60 tracking-widest uppercase mb-12">{t.curated.subtitle}</p>

          {/* Aesthetic Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-left">
            {aestheticsCards.map((cat, idx) => (
              <Link
                key={idx}
                href={`/shop-aesthetic?category=${encodeURIComponent(cat.title)}`}
                className="relative aspect-[3/4] block overflow-hidden bg-gray-100 group cursor-pointer rounded-2xl md:rounded-none transition-all hover:ring-2 hover:ring-[#000000]"
              >
                <img
                  src={cat.img}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Dark Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                
                {/* Bottom Label */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white z-10">
                  <span className="text-xs md:text-sm font-bold tracking-widest uppercase">{cat.title}</span>
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
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
                  {t.marquee.line1}
                </span>
              ))}
            </div>
            <div className="flex animate-marquee-full shrink-0" aria-hidden="true">
              {[...Array(4)].map((_, i) => (
                <span key={`mqb1-${i}`} className="text-6xl md:text-8xl lg:text-[7rem] font-sans font-black tracking-tighter uppercase mx-10 whitespace-nowrap scale-y-[1.25] inline-block origin-center pb-2">
                  {t.marquee.line1}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Line: Spaced & Informative */}
          <div className="flex whitespace-nowrap">
            <div className="flex animate-marquee-full-reverse shrink-0">
              {[...Array(6)].map((_, i) => (
                <span key={`mqa2-${i}`} className="text-xl md:text-3xl font-sans font-black tracking-[0.5em] uppercase mx-16 whitespace-nowrap opacity-90 scale-y-[1.15] inline-block origin-center pt-2">
                  {t.marquee.line2}
                </span>
              ))}
            </div>
            <div className="flex animate-marquee-full-reverse shrink-0" aria-hidden="true">
              {[...Array(6)].map((_, i) => (
                <span key={`mqb2-${i}`} className="text-xl md:text-3xl font-sans font-black tracking-[0.5em] uppercase mx-16 whitespace-nowrap opacity-90 scale-y-[1.15] inline-block origin-center pt-2">
                  {t.marquee.line2}
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
            <span className="text-white text-sm md:text-base tracking-widest uppercase font-medium hover:opacity-70 transition-opacity">{t.categories.accessories}</span>
          </div>
        </div>
        <div className="w-full md:w-1/2 relative group overflow-hidden cursor-pointer h-1/2 md:h-full bg-[#D8D0C8]">
          <img src="/fashion.png" alt="Trendy Pinterest Accessories" className="w-full h-full object-cover object-center transition-transform duration-[2000ms] ease-out group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />
          <div className="absolute bottom-12 left-0 w-full text-center z-10 flex justify-center">
            <span className="text-white text-sm md:text-base tracking-widest uppercase font-medium hover:opacity-70 transition-opacity">{t.categories.women}</span>
          </div>
        </div>
      </section>

      {/* Why House of Avira Section */}
      <WhyHouseOfAvira />

      {/* How It Works Educational Section */}
      <div id="how-it-works">
        <HowItWorks />
      </div>


      {/* Testimonials Section */}
      <section className="w-full bg-[#FFFFFF] py-16 md:py-24 border-t-[3px] border-[#000000]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 mb-10 text-center">
          <h2 className="text-3xl md:text-5xl font-perandory font-bold tracking-widest text-[#000000] uppercase">
            What Our Archive Says
          </h2>
        </div>
        <ScrollReelTestimonials testimonials={[
          {
            quote: "Love the fast delivery and the aesthetic. It perfectly matches my style.",
            author: "Sarah M.",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80&auto=format&fit=crop",
            alt: "Portrait of Sarah M.",
          },
          {
            quote: "The prices are amazing for the quality you get. House of Avira is my go-to store now.",
            author: "Emily R.",
            image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80&auto=format&fit=crop",
            alt: "Portrait of Emily R.",
          },
          {
            quote: "International shipping took a bit of time but the quality is unmatched! Totally worth the wait.",
            author: "Jessica T.",
            image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80&auto=format&fit=crop",
            alt: "Portrait of Jessica T.",
          }
        ]} />
      </section>

      {/* Join the Archive Section */}
      <section className="py-32 md:py-48 px-6 bg-[#FFFFFF] flex flex-col items-center justify-center text-center w-full">
        <div className="w-full max-w-xl">
          <h3 className="font-serif text-3xl md:text-5xl mb-6 text-[#000000]">{t.archive.title}</h3>
          <p className="text-sm text-gray-500 mb-12">{t.archive.subtitle}</p>
          <form className="flex flex-col md:flex-row w-full gap-4 border-b border-[#000000]/30 pb-4">
            <input type="email" placeholder={t.archive.placeholder} className="bg-transparent w-full outline-none text-[#000000] placeholder:text-gray-400 text-sm" />
            <button type="button" className="text-xs uppercase tracking-widest text-[#000000] font-medium hover:opacity-60 transition-opacity text-left md:text-right">{t.archive.subscribe}</button>
          </form>
        </div>
      </section>

    </div>
  );
}
