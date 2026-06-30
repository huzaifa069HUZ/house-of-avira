'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import PriceDisplay from '@/components/PriceDisplay';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const aestheticsTabs = [
  'babydoll / coquette',
  'dark feminine',
  'office siren',
  'y2k',
  'streetwear',
  'elegant chic',
  'opiúm',
  'Summer vacation'
];

function ShopAestheticContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || aestheticsTabs[0];
  
  const [activeAesthetic, setActiveAesthetic] = useState(initialCategory);
  const { user } = useAuthStore();
  const { wishlist, toggleWishlist } = useWishlistStore();
  const { t } = useTranslation();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const dummyProducts = [
    {
      id: "valerie-ruffle-hot-short",
      name: "Valerie Ruffle Hot Short",
      price: 3900.00,
      imageUrl: "/product1.png",
      badge: "MOST LOVED",
    },
    {
      id: "ravenna-mini-dress",
      name: "Ravenna Mini Dress",
      price: 6000.00,
      imageUrl: "/product2.png",
      badge: "MOST LOVED",
    },
    {
      id: "nyomi-mini-dress",
      name: "Nyomi Mini Dress",
      price: 3900.00,
      imageUrl: "/product3.png",
      badge: "NEW",
    },
    {
      id: "ave-bikini-bottom",
      name: "Ave Bikini Bottom",
      price: 3600.00,
      imageUrl: "/product4.png",
      badge: "NEW",
    }
  ];

  useEffect(() => {
    async function fetchProducts() {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

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

  const handleWishlistToggle = async (e, product) => {
    e.preventDefault();
    if (!user) {
      router.push('/auth/login');
      return;
    }
    await toggleWishlist(product);
  };

  const curatedAestheticsRaw = products.filter(p => p.sections?.includes('Shop your aesthetic') || p.section === 'Shop your aesthetic');
  const curatedAesthetics = curatedAestheticsRaw.filter(p => p.aesthetic === activeAesthetic);
  const curatedItems = curatedAesthetics.length > 0 ? curatedAesthetics : dummyProducts.slice(0, 5);

  return (
    <div className="pt-24 min-h-screen bg-white">
      <section className="py-10 bg-white w-full">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-perandory font-bold text-[#000000] mb-4">Shop Your Aesthetic</h1>
          
          {/* Pills / Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full mt-8">
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar w-full md:w-auto pb-2 md:pb-0">
              {aestheticsTabs.map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveAesthetic(tab)}
                  className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors capitalize ${activeAesthetic === tab ? 'bg-[#000000] text-white' : 'border border-[#000000] text-[#000000] hover:bg-[#000000]/5'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button className="border border-[#000000] text-[#000000] px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap hover:bg-[#000000]/5 transition-colors hidden md:block">Shop Best Sellers</button>
          </div>
        </div>

        {/* Seamless Grid */}
        <div className="w-full border-t border-b border-[#000000]/20">
          <div className="grid grid-cols-2 md:grid-cols-5 w-full">
            {curatedItems.map((item, idx) => (
              <Link href={`/product/${item.slug || item.id}`} key={item.id || idx} className="border-r border-[#000000]/20 group cursor-pointer flex flex-col relative bg-white block">
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
                    <p className="text-[10px] font-bold tracking-widest mb-2 uppercase text-[#000000]">Select Size</p>
                    <div className="flex gap-1.5 justify-center flex-wrap">
                      {(item.sizes || [4, 6, 8, 10, 12, 14, 16]).map(s => (
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
                    <p className="text-xs text-[#000000]/60 mt-1.5">
                      {typeof item.price === 'number' ? <PriceDisplay basePrice={item.price} /> : item.price}
                    </p>
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
    </div>
  );
}

export default function ShopAesthetic() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 bg-white">Loading...</div>}>
      <ShopAestheticContent />
    </Suspense>
  );
}
