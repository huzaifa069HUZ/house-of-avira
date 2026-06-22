"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function GsapImageStack() {
  const containerRef = useRef(null);
  const imagesRef = useRef([]);

  const images = [
    '/shipping/card1.png',
    '/shipping/card2.png',
    '/shipping/card3.png',
    '/shipping/card4.png',
    '/shipping/card5.png',
  ];

  useGSAP(() => {
    // Check if device is mobile to adjust animations
    const isMobile = window.innerWidth < 768;

    // Initial state: all images offscreen to the bottom
    gsap.set(imagesRef.current, { 
      y: window.innerHeight * 1.5, 
      rotation: () => (Math.random() * 6 - 3) 
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=400%", // Scroll distance
        scrub: 1, // Smooth scrubbing
        pin: true,
      }
    });

    // Bring in images sequentially
    imagesRef.current.forEach((img, i) => {
      tl.to(img, {
        y: 0,
        rotation: (Math.random() * 4 - 2), // slight random rotation
        scale: 1 - ((images.length - 1 - i) * 0.015), // depth effect
        duration: 1.5,
        ease: "power2.out",
      }, i * 0.8); // stagger
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="h-[100dvh] w-full bg-[#FFFFFF] flex flex-col items-center justify-center overflow-hidden relative border-y border-[#E5E5E5]/30">
      
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      {/* Header */}
      <div className="absolute top-16 left-0 right-0 text-center z-50 pointer-events-none">
        <span className="text-[11px] tracking-[0.2em] uppercase text-[#8A001A] font-bold">The Journey</span>
        <h2 className="font-perandory text-4xl md:text-5xl text-[#000000] mt-2">International + Domestic Flow</h2>
      </div>

      <div className="relative w-full max-w-5xl h-[70vh] flex items-center justify-center mt-12">
        {images.map((src, idx) => (
          <div
            key={idx}
            ref={(el) => (imagesRef.current[idx] = el)}
            className="absolute w-[90%] md:w-[75%] lg:w-[65%] h-full rounded-[2rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-[#E5E5E5]/50 bg-white"
            style={{ zIndex: idx + 10 }}
          >
            <Image
              src={src}
              alt={`Shipping Flow Step ${idx + 1}`}
              fill
              className="object-contain p-4 md:p-6"
              priority={idx === 0}
            />
          </div>
        ))}
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce text-[#8A001A]/50 pointer-events-none">
        <span className="text-[9px] uppercase tracking-widest font-bold mb-2 font-sans">Keep Scrolling</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
      </div>
    </div>
  );
}
