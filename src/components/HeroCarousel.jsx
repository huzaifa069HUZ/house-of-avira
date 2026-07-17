'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const defaultDesktopSlides = [
  {
    id: 1,
    desktopImage: '/newpchero.png',
    title: 'UNAPOLOGETIC.',
    subtitle: 'THE NEW STANDARD',
    link: '/category/women',
    textPosition: 'left'
  },
  {
    id: 2,
    desktopImage: '/banner2.png',
    title: '',
    subtitle: '',
    link: '/catalogue',
    textPosition: 'right'
  }
];

export default function HeroCarousel() {
  const [currentDesktopSlide, setCurrentDesktopSlide] = useState(0);
  const [currentMobileSlide, setCurrentMobileSlide] = useState(0);
  const [mobileSlides, setMobileSlides] = useState([{
    id: 'fixed_banner_1',
    mobileImage: '/banner-mob.png',
    link: '/catalogue'
  }]);

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
    }, 2000);

    return () => clearInterval(mobileTimer);
  }, [mobileSlides]);

  return (
    <section className="relative w-full h-[100dvh] md:h-[calc(100vh-32px)] -mt-[140px] overflow-hidden bg-black">
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
              <div className="absolute inset-0 bg-black/20"></div>
              
              {(slide.title || slide.subtitle) && (
                <div className={`absolute inset-0 flex flex-col justify-center ${slide.textPosition === 'left' ? 'items-start pl-24' : 'items-end pr-24'} p-20`}>
                  <div className={`flex flex-col ${slide.textPosition === 'left' ? 'items-start text-left' : 'items-end text-right'} w-full max-w-4xl`}>
                    {slide.title && (
                      <h1 className="text-[120px] leading-[0.9] font-perandory font-black tracking-tighter text-white mb-6 uppercase drop-shadow-lg">
                        {slide.title}
                      </h1>
                    )}
                    {slide.subtitle && (
                      <p className="text-2xl text-white font-sans font-medium tracking-[0.4em] uppercase drop-shadow-md">
                        {slide.subtitle}
                      </p>
                    )}
                    
                    <Link 
                      href={slide.link || '/catalogue'}
                      className="mt-12 inline-flex items-center justify-center border-2 border-white text-white px-12 py-4 hover:bg-white hover:text-black transition-colors duration-300 font-bold tracking-[0.2em] uppercase text-sm"
                    >
                      EXPLORE NOW
                    </Link>
                  </div>
                </div>
              )}
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
                  <h1 className="flex flex-col items-center justify-center mb-8 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] text-center text-white/95">
                    <span className="font-perandory text-[14px] font-bold tracking-[0.15em] mb-1">Imported</span>
                    <span className="font-aston-script text-[48px] text-white leading-none px-1.5 drop-shadow-md">Pinterest</span>
                    <span className="font-perandory text-[14px] font-bold tracking-[0.15em] mt-2">Find</span>
                  </h1>
                  <Link 
                    href={slide.link || '/catalogue'}
                    className="inline-flex items-center justify-center gap-2.5 bg-white/95 backdrop-blur-sm text-black px-10 py-4 w-full sm:w-auto text-center border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] active:scale-[0.98]"
                  >
                    <span className="font-perandory text-[16px] tracking-[0.1em] font-bold">Shop Now</span>
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
