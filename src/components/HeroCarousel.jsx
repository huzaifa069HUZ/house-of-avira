'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const slides = [
  {
    id: 1,
    desktopImage: '/banner.png',
    // We encode the space in 'mobile banner.png' as '%20'
    mobileImage: '/mobile%20banner.png', 
    title: 'Summer',
    subtitle: 'shop new arrivals',
    link: '/category/women'
  },
  {
    id: 2,
    desktopImage: '/banner2.png',
    mobileImage: '/mobile%20banner2.png',
    title: 'The Archive',
    subtitle: 'explore the curation',
    link: '/catalogue'
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); // rotate every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[calc(100vh-32px)] -mt-[128px] overflow-hidden">
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {/* Desktop Background */}
            <div 
              className="hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url('${slide.desktopImage}')` }}
            />
            {/* Mobile Background */}
            <div 
              className="md:hidden absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url('${slide.mobileImage}')` }}
            />
            
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/20 md:bg-black/10"></div>
            
            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col justify-end md:justify-end md:items-end p-8 md:p-20 pb-24 md:pb-20">
              <div className="text-left md:text-right flex flex-col items-start md:items-end w-full max-w-2xl">
                <h1 className="text-6xl md:text-8xl font-serif tracking-tight text-white mb-2 shadow-sm mix-blend-overlay">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-3xl text-white italic md:underline mb-8 md:mb-2 font-light drop-shadow-md md:mix-blend-overlay">
                  {slide.subtitle}
                </p>
                {/* Mobile CTA Button - Hidden on Desktop (since desktop uses text as link) */}
                <Link 
                  href={slide.link}
                  className="md:hidden inline-block bg-white text-[#1A1A1A] font-bold tracking-widest uppercase text-xs px-8 py-3 w-full text-center"
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
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-12 h-0.5 transition-colors duration-500 ${currentSlide === index ? 'bg-white' : 'bg-white/40'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
