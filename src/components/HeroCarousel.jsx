'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const defaultDesktopSlides = [
  {
    id: 1,
    desktopImage: '/banner.png',
    title: 'Summer',
    subtitle: 'shop new arrivals',
    link: '/category/women'
  },
  {
    id: 2,
    desktopImage: '/banner2.png',
    title: 'The Archive',
    subtitle: 'explore the curation',
    link: '/catalogue'
  }
];

export default function HeroCarousel() {
  const [currentDesktopSlide, setCurrentDesktopSlide] = useState(0);
  const [currentMobileSlide, setCurrentMobileSlide] = useState(0);
  const [mobileSlides, setMobileSlides] = useState([]);

  useEffect(() => {
    async function fetchMobileBanners() {
      try {
        const q = query(collection(db, 'mobile_banners'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedBanners = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        const fixedBanner = {
          id: 'fixed_banner_1',
          mobileImage: '/banner-mob.png',
          link: '/catalogue'
        };
        
        setMobileSlides([fixedBanner, ...fetchedBanners]);
      } catch (error) {
        console.error("Error fetching mobile banners:", error);
      }
    }
    fetchMobileBanners();
  }, []);

  useEffect(() => {
    const desktopTimer = setInterval(() => {
      setCurrentDesktopSlide((prev) => (prev === defaultDesktopSlides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(desktopTimer);
  }, []);

  useEffect(() => {
    const mobileTimer = setInterval(() => {
      setCurrentMobileSlide((prev) => (prev === mobileSlides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(mobileTimer);
  }, [mobileSlides]);

  return (
    <section className="relative w-full h-[100dvh] md:h-[calc(100vh-32px)] -mt-[128px] overflow-hidden bg-black">
      {/* DESKTOP CAROUSEL */}
      <div className="hidden md:block w-full h-full">
        {defaultDesktopSlides.map((slide, index) => {
          const isActive = index === currentDesktopSlide;
          return (
            <div 
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('${slide.desktopImage}')` }}
              />
              <div className="absolute inset-0 bg-black/10"></div>
              
              <div className="absolute inset-0 flex flex-col justify-end items-end p-20 pb-20">
                <div className="text-right flex flex-col items-end w-full max-w-2xl">
                  <h1 className="text-8xl font-serif tracking-tight text-white mb-2 shadow-sm mix-blend-overlay">
                    {slide.title}
                  </h1>
                  <p className="text-3xl text-white italic underline mb-2 font-light drop-shadow-md mix-blend-overlay">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        
      </div>

      {/* MOBILE CAROUSEL */}
      <div className="block md:hidden w-full h-full bg-black">
        {mobileSlides.map((slide, index) => {
          const isActive = index === currentMobileSlide;
          return (
            <div 
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('${slide.mobileImage || slide.imageUrl}')` }}
              />
              <div className="absolute inset-0 bg-black/20"></div>
              
              <div className="absolute inset-0 flex flex-col justify-end items-center p-8 pb-16">
                <div className="text-center flex flex-col items-center w-full mt-auto">
                  <h1 className="text-[2.75rem] leading-[1.1] sm:text-5xl tracking-tight text-white mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                    <span className="font-sans font-black uppercase tracking-tight">HOUSE OF</span> <span className="font-serif">AVIRA</span>
                  </h1>
                  <p className="text-[11px] text-white/95 font-medium tracking-[0.2em] uppercase mb-8 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] text-center leading-relaxed">
                    ✨ IMPORTED PINTEREST FINDS ✨
                  </p>
                  <Link 
                    href={slide.link || '/catalogue'}
                    className="inline-block bg-white text-black font-bold tracking-widest uppercase text-xs px-8 py-3.5 w-full text-center shadow-lg transition-transform active:scale-95"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
        
      </div>
    </section>
  );
}
