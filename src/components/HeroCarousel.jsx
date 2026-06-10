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

const defaultMobileSlides = [
  {
    id: 'default_mob_1',
    mobileImage: 'https://res.cloudinary.com/dhmberzlg/image/upload/v1781132052/house-of-avira/banners/w85xcfwbnacwndq6hgss.png',
    link: '/category/women'
  },
  {
    id: 'default_mob_2',
    mobileImage: 'https://res.cloudinary.com/dhmberzlg/image/upload/v1781132054/house-of-avira/banners/f7ijvwyhymyxnhu09bh0.png',
    link: '/catalogue'
  }
];

export default function HeroCarousel() {
  const [currentDesktopSlide, setCurrentDesktopSlide] = useState(0);
  const [currentMobileSlide, setCurrentMobileSlide] = useState(0);
  const [mobileSlides, setMobileSlides] = useState(defaultMobileSlides);

  useEffect(() => {
    async function fetchMobileBanners() {
      try {
        const q = query(collection(db, 'mobile_banners'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedBanners = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        if (fetchedBanners.length > 0) {
          setMobileSlides(fetchedBanners);
        }
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
    <section className="relative w-full h-[calc(100vh-32px)] -mt-[128px] overflow-hidden">
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
        
        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {defaultDesktopSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentDesktopSlide(index)}
              className={`w-12 h-0.5 transition-colors duration-500 ${currentDesktopSlide === index ? 'bg-white' : 'bg-white/40'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* MOBILE CAROUSEL */}
      <div className="block md:hidden w-full h-full">
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
              
              <div className="absolute inset-0 flex flex-col justify-end p-8 pb-24">
                <div className="text-left flex flex-col items-start w-full max-w-2xl mt-auto">
                  <Link 
                    href={slide.link || '/catalogue'}
                    className="inline-block bg-white text-[#000000] font-bold tracking-widest uppercase text-xs px-8 py-3 w-full text-center mt-4"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {mobileSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentMobileSlide(index)}
              className={`w-12 h-0.5 transition-colors duration-500 ${currentMobileSlide === index ? 'bg-white' : 'bg-white/40'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
